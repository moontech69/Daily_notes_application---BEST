from rest_framework import serializers
from .models import Note
from base64 import b64encode
from .utils import decrypt_audio, generate_signed_url

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'description', 'audio', 'created_at', 'user']
        read_only_fields = ['user', 'created_at']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.audio: 
            signed_url =  generate_signed_url(instance.audio.name, 1800)
            full_url = request.build_absolute_uri(signed_url)
            data['audio'] = full_url # 30 min 
        return data