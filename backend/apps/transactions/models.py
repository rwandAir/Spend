from django.db import models
from django.conf import settings

class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )

    transaction_id = models.AutoField(primary_key=True, db_column='id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id', related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    category = models.CharField(max_length=255, db_column='category')  # acts as category for expense and description for income
    payment_method = models.CharField(max_length=100, default='Cash')
    created_at = models.DateTimeField(db_column='created_at')

    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at', '-transaction_id']
