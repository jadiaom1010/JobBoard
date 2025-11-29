from flask import Blueprint, request, current_app
from bson.objectid import ObjectId
from datetime import datetime
from functools import wraps
import jwt

applications_bp = Blueprint('applications', __name__)

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
            db = current_app.extensions['pymongo'].db
            user = db.users.find_one({'_id': ObjectId(data['user_id'])})
        except:
            return {'message': 'Invalid token'}, 401
        
        return f(user, *args, **kwargs)
    return decorated

@applications_bp.route('', methods=['POST'])
@token_required
def apply_for_job(user):
    if user.get('role') != 'applicant':
        return {'message': 'Only applicants'}, 403
    
    data = request.get_json()
    if 'job_id' not in data or 'resume_url' not in data:
        return {'message': 'Missing fields'}, 400
    
    db = current_app.extensions['pymongo'].db
    
    try:
        job = db.jobs.find_one({'_id': ObjectId(data['job_id'])})
    except:
        return {'message': 'Invalid job'}, 400
    
    if not job:
        return {'message': 'Job not found'}, 404
    
    existing = db.applications.find_one({
        'job_id': ObjectId(data['job_id']),
        'applicant_id': ObjectId(user['_id'])
    })
    
    if existing:
        return {'message': 'Already applied'}, 409
    
    app = {
        'job_id': ObjectId(data['job_id']),
        'applicant_id': ObjectId(user['_id']),
        'applicant_name': user['name'],
        'applicant_email': user['email'],
        'resume_url': data['resume_url'],
        'cover_letter': data.get('cover_letter', ''),
        'status': 'pending',
        'applied_at': datetime.utcnow(),
        'employer_id': job['employer_id']
    }
    
    result = db.applications.insert_one(app)
    db.jobs.update_one({'_id': ObjectId(data['job_id'])}, {'$inc': {'applications_count': 1}})
    
    return {'message': 'Applied', 'application_id': str(result.inserted_id)}, 201

@applications_bp.route('/my-applications', methods=['GET'])
@token_required
def get_my_applications(user):
    if user.get('role') != 'applicant':
        return {'message': 'Only applicants'}, 403
    
    db = current_app.extensions['pymongo'].db
    apps = list(db.applications.find({'applicant_id': ObjectId(user['_id'])}).sort('applied_at', -1))
    
    for app in apps:
        app['_id'] = str(app['_id'])
        app['job_id'] = str(app['job_id'])
        app['applicant_id'] = str(app['applicant_id'])
        app['employer_id'] = str(app['employer_id'])
        
        job = db.jobs.find_one({'_id': ObjectId(app['job_id'])})
        if job:
            app['job_title'] = job.get('title', '')
            app['company_name'] = job.get('company_name', '')
    
    return {'applications': apps}, 200

@applications_bp.route('/job/<job_id>/applications', methods=['GET'])
@token_required
def get_job_applications(user, job_id):
    db = current_app.extensions['pymongo'].db
    
    try:
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
    except:
        return {'message': 'Invalid ID'}, 400
    
    if not job or str(job['employer_id']) != str(user['_id']):
        return {'message': 'Unauthorized'}, 403
    
    apps = list(db.applications.find({'job_id': ObjectId(job_id)}).sort('applied_at', -1))
    
    for app in apps:
        app['_id'] = str(app['_id'])
        app['job_id'] = str(app['job_id'])
        app['applicant_id'] = str(app['applicant_id'])
        app['employer_id'] = str(app['employer_id'])
    
    return {'applications': apps}, 200

@applications_bp.route('/<application_id>/status', methods=['PUT'])
@token_required
def update_application_status(user, application_id):
    if user.get('role') != 'employer':
        return {'message': 'Only employers'}, 403
    
    data = request.get_json()
    if 'status' not in data or data['status'] not in ['pending', 'accepted', 'rejected']:
        return {'message': 'Invalid status'}, 400
    
    db = current_app.extensions['pymongo'].db
    
    try:
        app = db.applications.find_one({'_id': ObjectId(application_id)})
    except:
        return {'message': 'Invalid ID'}, 400
    
    if not app or str(app['employer_id']) != str(user['_id']):
        return {'message': 'Unauthorized'}, 403
    
    db.applications.update_one({'_id': ObjectId(application_id)}, {'$set': {'status': data['status']}})
    return {'message': 'Updated'}, 200