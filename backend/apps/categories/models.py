from django.db import models
from django.conf import settings

class MasterCategory(models.Model):
    category_id = models.AutoField(primary_key=True, db_column='id')
    category_name = models.CharField(max_length=100, db_column='name')
    icon = models.CharField(max_length=50, default='fa-tag')
    is_default = models.BooleanField(default=False)

    class Meta:
        db_table = 'master_categories'
        verbose_name_plural = 'Master Categories'

    def __str__(self):
        return self.category_name

class UserCategory(models.Model):
    user_category_id = models.AutoField(primary_key=True, db_column='id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id', related_name='user_categories')
    category = models.ForeignKey(MasterCategory, on_delete=models.CASCADE, db_column='category_id', related_name='users_associated')
    is_custom = models.BooleanField(default=True)
    budget_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'user_categories'
        verbose_name_plural = 'User Categories'
        unique_together = ('user', 'category')
