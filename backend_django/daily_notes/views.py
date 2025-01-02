from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Note
from .serializers import NoteSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.files.base import ContentFile
from django_filters.rest_framework import DjangoFilterBackend
from .filters import NoteFilter
from .utils import encrypt_audio, generate_signed_url

# Create your views here.

class NoteViewSet(ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = NoteFilter
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        audio_file = serializer.validated_data.get('audio', None)
        if audio_file:
            original_data = audio_file.read()
            audio_file.seek(0) 
            encrypted_audio = encrypt_audio(original_data)
            serializer.validated_data['audio'] = ContentFile(encrypted_audio, name=audio_file.name)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.instance
        audio_file = serializer.validated_data.get('audio', None)

        if audio_file:
            original_data = audio_file.read()
            encrypted_audio = encrypt_audio(original_data)
            instance.audio.delete(save=False)
            serializer.validated_data['audio'] = ContentFile(encrypted_audio, name=audio_file.name)
        serializer.save()