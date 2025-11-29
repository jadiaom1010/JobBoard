from flask import Blueprint, request, current_app
from bson.objectid import ObjectId
from datetime import datetime
from functools import wraps
import jwt

jobs_bp = Blueprint('jobs', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except:
                return {'message': 'Invalid token'}, 401
        
        if not token:
            return {'message': 'Token missing'}, 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user = current_app.extensions['pymongo'].db.users.find_one({'_id': ObjectId(data['user_id'])})
        except:
            return {'message': 'Invalid token'}, 401
        
        return f(user, *args, **kwargs)
    return decorated

def employer_required(f):
    @wraps(f)
    def decorated(user, *args, **kwargs):
        if user.get('role') != 'employer':
            return {'message': 'Only employers allowed'}, 403
        return f(user, *args, **kwargs)
    return decorated

@jobs_bp.route('', methods=['POST'])
@token_required
@employer_required
def create_job(user):
    data = request.get_json()
    required = ['title', 'description', 'location', 'salary_min', 'salary_max', 'job_type', 'deadline']
    
    if not all(k in data for k in required):
        return {'message': 'Missing fields'}, 400
    
    db = current_app.extensions['pymongo'].db
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
    db = current_app.extensions['pymongo'].db
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
    db = current_app.extensions['pymongo'].db
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
    db = current_app.extensions['pymongo'].db
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
    db = current_app.extensions['pymongo'].db
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
    db = current_app.extensions['pymongo'].db
    jobs = list(db.jobs.find({'employer_id': ObjectId(user['_id'])}).sort('created_at', -1))
    
    for job in jobs:
        job['_id'] = str(job['_id'])
        job['employer_id'] = str(job['employer_id'])
    
    return {'jobs': jobs}, 200