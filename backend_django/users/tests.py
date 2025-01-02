import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

@pytest.mark.django_db
class TestUserEndpoints:
    client = APIClient()

    def test_register_user(self):
        response = self.client.post('/api/users/register/', {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "StrongPassword123",
            "password2": "StrongPassword123"
        })
        assert response.status_code == 201
        assert response.data["message"] == "User registered successfully"

    def test_register_user_password_mismatch(self):
        response = self.client.post('/api/users/register/', {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "StrongPassword123",
            "password2": "WrongPassword123"
        })
        assert response.status_code == 400

    def test_login_user(self, django_user_model):
        user = django_user_model.objects.create_user(
            username="testuser", email="testuser@example.com", password="StrongPassword123"
        )
        response = self.client.post('/api/users/login/', {
            "email": user.email,
            "password": "StrongPassword123"
        })
        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data

    def test_logout_user(self, django_user_model):
        user = django_user_model.objects.create_user(
            username="testuser", email="testuser@example.com", password="StrongPassword123"
        )
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = self.client.post('/api/users/logout/', {
            "refresh_token": str(refresh)
        })
        assert response.status_code == 200
        assert response.data["message"] == "Successfully logged out."
