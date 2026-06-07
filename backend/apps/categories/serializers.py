from rest_framework import serializers
from .models import MasterCategory, UserCategory

class MasterCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterCategory
        fields = ['category_id', 'category_name', 'icon', 'is_default']

class UserCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.category_name')
    icon = serializers.ReadOnlyField(source='category.icon')

    class Meta:
        model = UserCategory
        fields = ['user_category_id', 'category_id', 'category_name', 'icon', 'is_custom', 'budget_limit']
