from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.category_name')

    class Meta:
        model = Expense
        fields = ['expense_id', 'expense_date', 'category_name', 'category_id', 'amount', 'payment_method', 'description']
        read_only_fields = ['expense_id']
