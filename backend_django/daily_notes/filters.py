from django_filters import rest_framework as filters
from .models import Note
from django.db import models

class NoteFilter(filters.FilterSet):
    search = filters.CharFilter(method='search_fields')
    created_at = filters.DateTimeFromToRangeFilter()
    
    def search_fields(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(description__icontains=value)
        )
    class Meta:
        model = Note
        fields = ['search', 'created_at']
    
