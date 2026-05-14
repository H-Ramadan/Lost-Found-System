import pytest
from lostfound_backend.app import create_app
from lostfound_backend.database import db
@pytest.fixture
def client():

    app = create_app()

    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:

        with app.app_context():
            db.create_all()

        yield client

        with app.app_context():
            db.drop_all()


# ==================================
# TEST 1 -> Server Running
# ==================================

def test_server(client):

    response = client.get("/")

    assert response.status_code in [200, 404]


# ==================================
# TEST 2 -> Register
# ==================================

def test_register(client):

    response = client.post(
        "/api/auth/register",
        json={
            "username": "yasser",
            "email": "yasser@test.com",
            "password": "123456"
        }
    )

    assert response.status_code in [200, 201]


# ==================================
# TEST 3 -> Login
# ==================================

def test_login(client):

    client.post(
        "/api/auth/register",
        json={
            "username": "yasser",
            "email": "yasser@test.com",
            "password": "123456"
        }
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "yasser@test.com",
            "password": "123456"
        }
    )

    assert response.status_code == 200