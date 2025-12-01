from flask import request, current_app
from functools import wraps
import jwt
from bson.objectid import ObjectId


def get_db():
    """Get database instance"""
    return current_app.mongo.db


def token_required(f):
    """Decorator to validate JWT token and extract user information"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except:
                return {'message': 'Invalid token format'}, 401

        if not token:
            return {'message': 'Token missing'}, 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            db = get_db()
            user = db.users.find_one({'_id': ObjectId(data['user_id'])})

            if not user:
                return {'message': 'User not found'}, 401

        except jwt.ExpiredSignatureError:
            return {'message': 'Token expired'}, 401
        except jwt.InvalidTokenError:
            return {'message': 'Invalid token'}, 401
        except Exception as e:
            return {'message': f'Token validation failed: {str(e)}'}, 401

        return f(user, *args, **kwargs)
    return decorated


def employer_required(f):
    """Decorator to ensure the user is an employer"""
    @wraps(f)
    def decorated(user, *args, **kwargs):
        if user.get('role') != 'employer':
            return {'message': 'Only employers are allowed to perform this action'}, 403
        return f(user, *args, **kwargs)
    return decorated


def applicant_required(f):
    """Decorator to ensure the user is an applicant"""
    @wraps(f)
    def decorated(user, *args, **kwargs):
        if user.get('role') != 'applicant':
            return {'message': 'Only applicants are allowed to perform this action'}, 403
        return f(user, *args, **kwargs)
    return decorated