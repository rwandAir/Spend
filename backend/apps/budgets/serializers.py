from rest_framework import serializers
from .models import CategoryBudget

class CategoryBudgetSerializer(serializers.ModelSerializer):
    category_id = serializers.ReadOnlyField(source='category.category_id')
    category_name = serializers.ReadOnlyField(source='category.category_name')
    budget_limit = serializers.DecimalField(max_digits=12, decimal_places=2, source='budget_amount')

    class Meta:
        model = CategoryBudget
        fields = ['budget_id', 'category_id', 'category_name', 'budget_limit', 'year', 'month']
        read_only_fields = ['budget_id']
