from django.db import models
from django.conf import settings
from apps.categories.models import MasterCategory

class CategoryBudget(models.Model):
    budget_id = models.AutoField(primary_key=True, db_column='id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id', related_name='category_budgets')
    category = models.ForeignKey(MasterCategory, on_delete=models.CASCADE, db_column='category_id', related_name='category_budgets')
    budget_amount = models.DecimalField(max_digits=12, decimal_places=2, db_column='limit_amount')
    year = models.IntegerField(db_column='budget_year')
    month = models.IntegerField(db_column='budget_month')

    class Meta:
        db_table = 'category_budgets'
        unique_together = ('user', 'category', 'year', 'month')
