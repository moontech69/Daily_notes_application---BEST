from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet
from .utils import media_access

router = DefaultRouter()
router.register(r'notes', NoteViewSet)  

urlpatterns = [
    path('', include(router.urls)), 
]
