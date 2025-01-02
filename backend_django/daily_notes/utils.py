from cryptography.fernet import Fernet
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from django.http import JsonResponse
from django.conf import settings
from django.utils.timezone import now
from base64 import b64encode
import os

#######################
#####  Encrypt/Decrypt
#######################

# key = Fernet.generate_key()
key = b'dUhqiyHzY825HsD6DccX0tEj8gz3nS8qzLzivvIj5LA='

cipher_suite = Fernet(key)

def encrypt_audio(audio_bytes):
    return cipher_suite.encrypt(audio_bytes)

def decrypt_audio(encrypted_audio_bytes):
    return cipher_suite.decrypt(encrypted_audio_bytes)

######################
###   Signed URL
######################
SECRET_KEY = settings.SECRET_KEY
serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_signed_url(file_path: str, user_id: int, expires_in: int = 3600) -> str:
    token = serializer.dumps({'file_path': file_path, 'user_id': user_id, 'expires_at': now().timestamp() + expires_in})
    return f"/media_access/?token={token}"


def media_access(request):
    token = request.GET.get('token')
    try:
        data = serializer.loads(token, max_age=300) # (unit 1s): 5 min expire for media access
        file_path = data['file_path']
        user_id = data['user_id']
        file_full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        # if request.user.id != user_id:
        #     return JsonResponse({'error': 'Unauthorized access'}, status=403)
        
        with open(file_full_path, 'rb') as audio_file:
            encrypted_audio = audio_file.read()
            decrypted_audio = decrypt_audio(encrypted_audio)
            base64_audio = b64encode(decrypted_audio).decode('utf-8')
        return JsonResponse({'base64_audio': base64_audio}, status=200)  
    
    except SignatureExpired:
        return JsonResponse({'error': 'URL expired'}, status=403)
    
    except BadSignature:
        return JsonResponse({'error': 'Invalid signature'}, status=403)

