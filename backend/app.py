from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

load_dotenv()

# Create Flask app
app = Flask(__name__)
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/jobboard')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Debug: Print MongoDB URI (mask password)
mongo_uri = app.config['MONGO_URI']
print(f"\n{'='*50}")
print(f"Connecting to MongoDB...")
print(f"MongoDB URI: {mongo_uri.split('@')[0].split('//')[0]}//*****@{mongo_uri.split('@')[1] if '@' in mongo_uri else 'localhost'}")
print(f"{'='*50}\n")

# Initialize PyMongo
try:
    mongo = PyMongo(app)
    # Store mongo in app extensions for easy access
    app.mongo = mongo

    # Test the connection
    mongo.db.command('ping')

    print(f"✓ MongoDB connected successfully!")
    print(f"✓ Database name: {mongo.db.name}")
    print(f"✓ Collections: {mongo.db.list_collection_names()}")
    print(f"{'='*50}\n")
except Exception as e:
    print(f"✗ Error connecting to MongoDB: {e}")
    print(f"  Please check your MongoDB URI and network connection")
    print(f"{'='*50}\n")
    mongo = None
    app.mongo = None

CORS(app)

# Import blueprints
try:
    from routes.auth import auth_bp
    from routes.jobs import jobs_bp
    from routes.applications import applications_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(applications_bp, url_prefix='/api/applications')
except ImportError as e:
    print(f"Warning: Could not import blueprints: {e}")

@app.route('/api/health', methods=['GET'])
def health():
    return {'status': 'Backend is running!'}, 200

@app.errorhandler(404)
def not_found(error):
    return {'message': 'Resource not found'}, 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)