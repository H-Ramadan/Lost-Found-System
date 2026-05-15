import pytest
from lostfound_backend.app import create_app
from lostfound_backend.database import db

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # قاعدة بيانات في الذاكرة سريعة للتست
    
    with app.app_context():
        db.create_all() # بننشئ الجداول هنا
        yield app.test_client() # هنا التست بيبدأ يشتغل
        db.drop_all() 
        def test_server_is_running(client):
    response = client.get('/')
    assert response.status_code in [200, 404]
