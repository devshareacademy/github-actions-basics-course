import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_user_gists():
    user = "octocat"
    response = client.get(f"/{user}")
    data = response.json()
    assert response.status_code == 200
    assert len(data["gists"]) > 0

def test_pagination():
    user = "octocat"
    page = 2
    per_page = 5
    response = client.get(f"/{user}?page={page}&per_page={per_page}")
    data = response.json()
    assert response.status_code == 200
    assert len(data["gists"]) <= per_page

def test_gists_invalid_user():
    user = "invalid_user"
    response = client.get(f"/{user}")
    data = response.json()
    assert data["error"] == f"User {user} does not exist"
