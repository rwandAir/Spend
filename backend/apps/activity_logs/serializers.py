from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = ActivityLog
        fields = ['log_id', 'user_name', 'action', 'timestamp']
        read_only_fields = ['log_id', 'timestamp']
