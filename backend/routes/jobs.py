from flask import Blueprint, request, current_app
from bson.objectid import ObjectId
from datetime import datetime
from utils.auth import token_required, employer_required

jobs_bp = Blueprint('jobs', __name__)

def get_db():
    """Get database instance"""
    return current_app.mongo.db

@jobs_bp.route('', methods=['POST'])
@token_required
@employer_required
def create_job(user):
    data = request.get_json()
    required = ['title', 'description', 'location', 'salary_min', 'salary_max', 'job_type', 'deadline']
    
    if not all(k in data for k in required):
        return {'message': 'Missing fields'}, 400

    db = get_db()
    job = {
        'title': data['title'],
        'description': data['description'],
        'requirements': data.get('requirements', ''),
        'location': data['location'],
        'salary_min': float(data['salary_min']),
        'salary_max': float(data['salary_max']),
        'job_type': data['job_type'],
        'deadline': data['deadline'],
        'employer_id': ObjectId(user['_id']),
        'company_name': user.get('company', ''),
        'created_at': datetime.utcnow(),
        'applications_count': 0
    }
    
    result = db.jobs.insert_one(job)
    return {'message': 'Job posted', 'job_id': str(result.inserted_id)}, 201

@jobs_bp.route('', methods=['GET'])
def get_all_jobs():
    db = get_db()
    search = request.args.get('search', '')
    location = request.args.get('location', '')
    job_type = request.args.get('job_type', '')
    
    query = {}
    if search:
        query['$or'] = [
            {'title': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    if location:
        query['location'] = {'$regex': location, '$options': 'i'}
    if job_type:
        query['job_type'] = job_type
    
    jobs = list(db.jobs.find(query).sort('created_at', -1))
    for job in jobs:
        job['_id'] = str(job['_id'])
        job['employer_id'] = str(job['employer_id'])
    
    return {'jobs': jobs}, 200

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    db = get_db()
    try:
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
    except:
        return {'message': 'Invalid ID'}, 400
    
    if not job:
        return {'message': 'Not found'}, 404
    
    job['_id'] = str(job['_id'])
    job['employer_id'] = str(job['employer_id'])
    return {'job': job}, 200

@jobs_bp.route('/<job_id>', methods=['PUT'])
@token_required
@employer_required
def update_job(user, job_id):
    db = get_db()
    try:
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
    except:
        return {'message': 'Invalid ID'}, 400
    
    if not job or str(job['employer_id']) != str(user['_id']):
        return {'message': 'Unauthorized'}, 403
    
    data = request.get_json()
    update_data = {k: v for k, v in data.items() 
                   if k in ['title', 'description', 'requirements', 'location', 
                           'salary_min', 'salary_max', 'job_type', 'deadline']}
    
    db.jobs.update_one({'_id': ObjectId(job_id)}, {'$set': update_data})
    return {'message': 'Updated'}, 200

@jobs_bp.route('/<job_id>', methods=['DELETE'])
@token_required
@employer_required
def delete_job(user, job_id):
    db = get_db()
    try:
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
    except:
        return {'message': 'Invalid ID'}, 400
    
    if not job or str(job['employer_id']) != str(user['_id']):
        return {'message': 'Unauthorized'}, 403
    
    db.jobs.delete_one({'_id': ObjectId(job_id)})
    db.applications.delete_many({'job_id': ObjectId(job_id)})
    return {'message': 'Deleted'}, 200

@jobs_bp.route('/employer/my-jobs', methods=['GET'])
@token_required
@employer_required
def get_employer_jobs(user):
    db = get_db()
    jobs = list(db.jobs.find({'employer_id': ObjectId(user['_id'])}).sort('created_at', -1))
    
    for job in jobs:
        job['_id'] = str(job['_id'])
        job['employer_id'] = str(job['employer_id'])
    
    return {'jobs': jobs}, 200