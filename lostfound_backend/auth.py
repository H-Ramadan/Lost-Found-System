from flask import Blueprint, request, jsonify
from database import db
from models import User
from flask_jwt_extended import create_access_token
from datetime import timedelta

bp = Blueprint("auth", __name__)

@bp.route("/signup", methods=["POST"])
def signup():
    try:
        d = request.get_json() or {}
        u = d.get("username", "").strip()
        e = d.get("email", "").strip().lower()
        p = d.get("password", "")
        
        if not(u and e and p): 
            return jsonify({"msg": "missing fields"}), 400
        
        if len(p) < 6:
            return jsonify({"msg": "password must be at least 6 characters"}), 400
        
        if User.query.filter((User.username==u) | (User.email==e)).first(): 
            return jsonify({"msg": "username or email already exists"}), 400
        
        user = User(username=u, email=e, is_verified=True, is_admin=False) 
        user.set_password(p)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Registration failed: {str(e)}"}), 500

@bp.route("/login", methods=["POST"])
def login():
    d = request.get_json() or {}
    idf = d.get("identifier", "")
    p = d.get("password", "")
    
    u = User.query.filter((User.username==idf) | (User.email==idf)).first()
    
    if not u or not u.check_password(p): 
        return jsonify({"msg": "Invalid credentials"}), 401
    
    # INCREASED TO 30 DAYS TO PREVENT VERIFICATION ERRORS DURING DEV
    t = create_access_token(identity=str(u.id), expires_delta=timedelta(days=30))
    
    return jsonify({
        "access_token": t,
        "user": {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_admin": u.is_admin  
        }
    })