from django.db import models
from django.conf import settings

class ActivityLog(models.Model):
    log_id = models.AutoField(primary_key=True, db_column='id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id', related_name='activity_logs')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True, db_column='timestamp')

    class Meta:
        db_table = 'activity_log'
        ordering = ['-timestamp']
