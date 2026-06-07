from django.db import models
from django.conf import settings
from apps.categories.models import MasterCategory

class Expense(models.Model):
    expense_id = models.AutoField(primary_key=True, db_column='id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id', related_name='expenses')
    category = models.ForeignKey(MasterCategory, on_delete=models.CASCADE, db_column='category_id', related_name='expenses')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=500, blank=True, null=True)
    expense_date = models.DateField()
    payment_method = models.CharField(max_length=100, default='Cash')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'expenses'
        ordering = ['-expense_date', '-expense_id']
