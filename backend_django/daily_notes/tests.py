import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Note
from users.models import CustomUser

@pytest.mark.django_db
class TestDailyNotes:
    client = APIClient()

    @pytest.fixture
    def authenticated_user(self):
        user = CustomUser.objects.create_user(
            username="testuser", email="testuser@example.com", password="StrongPassword123!"
        )
        self.client.force_authenticate(user=user)
        return user

    def test_create_note_authenticated(self, authenticated_user):
        audio_file = SimpleUploadedFile(
            "test_audio.webm", b"fake audio file content", content_type="audio/webm"
        )
        response = self.client.post('/api/notes/', {
            "title": "Test Note",
            "description": "This is a test note.",
            "audio": audio_file
        }, format='multipart')  

        assert response.status_code == 201
        assert response.data["title"] == "Test Note"
        assert response.data["user"] == authenticated_user.id
        assert "audio" in response.data

    def test_create_note_unauthenticated(self):
        self.client.force_authenticate(user=None)  # No user
        audio_file = SimpleUploadedFile(
            "test_audio.webm", b"fake audio file content", content_type="audio/webm"
        )
        response = self.client.post('/api/notes/', {
            "title": "Test Note",
            "description": "This is a test note.",
            "audio": audio_file
        }, format='multipart')
        assert response.status_code == 401
        
    

    def test_get_notes(self, authenticated_user):
        Note.objects.create(
            title="Test Note 1", description="Note 1 description", user=authenticated_user
        )
        Note.objects.create(
            title="Test Note 2", description="Note 2 description", user=authenticated_user
        )
        response = self.client.get('/api/notes/')
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_get_other_user_notes(self, authenticated_user):
        other_user = CustomUser.objects.create_user(
            username="otheruser", email="other@example.com", password="Password123"
        )
        Note.objects.create(
            title="Other User's Note", description="This shouldn't be visible", user=other_user
        )
        response = self.client.get('/api/notes/')
        assert response.status_code == 200
        assert len(response.data) == 0

    def test_update_note_authenticated(self, authenticated_user):
        note = Note.objects.create(
            title="Old Title", description="Old Description", user=authenticated_user
        )
        audio_file = SimpleUploadedFile(
            "updated_audio.webm", b"new fake audio file content", content_type="audio/webm"
        )
        response = self.client.put(f'/api/notes/{note.id}/', {
            "title": "Updated Title",
            "description": "Updated Description",
            "audio": audio_file
        }, format='multipart')
        assert response.status_code == 200
        assert response.data["title"] == "Updated Title"
        assert "audio" in response.data

    def test_delete_note_authenticated(self, authenticated_user):
        note = Note.objects.create(
            title="Test Note", description="To be deleted", user=authenticated_user
        )
        response = self.client.delete(f'/api/notes/{note.id}/')
        assert response.status_code == 204
        assert Note.objects.filter(id=note.id).count() == 0
