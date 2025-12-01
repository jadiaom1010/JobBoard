from flask import Blueprint, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from utils.auth import token_required

auth_bp = Blueprint('auth', __name__)

def get_db():
    """Get database instance"""
    if not hasattr(current_app, 'mongo') or current_app.mongo is None:
        raise Exception('Database not connected. Please check MongoDB connection.')
    return current_app.mongo.db

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if not data or not all(k in data for k in ('email', 'password', 'name', 'role')):
            return {'message': 'Missing fields'}, 400

        if data['role'] not in ['employer', 'applicant']:
            return {'message': 'Invalid role'}, 400

        db = get_db()

        if db.users.find_one({'email': data['email']}):
            return {'message': 'Email exists'}, 409

        user = {
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'name': data['name'],
            'role': data['role'],
            'created_at': datetime.utcnow(),
            'company': data.get('company', ''),
            'phone': data.get('phone', ''),
            'location': data.get('location', '')
        }

        result = db.users.insert_one(user)
        return {'message': 'Registered', 'user_id': str(result.inserted_id)}, 201
    except Exception as e:
        return {'message': f'Database error: {str(e)}'}, 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('email', 'password')):
        return {'message': 'Missing credentials'}, 400

    db = get_db()
    user = db.users.find_one({'email': data['email']})
    
    if not user or not check_password_hash(user['password'], data['password']):
        return {'message': 'Invalid credentials'}, 401
    
    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    
    return {
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'role': user['role'],
            'company': user.get('company', '')
        }
    }, 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(user):
    return {
        'user': {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'role': user['role'],
            'company': user.get('company', '')
        }
    }, 200