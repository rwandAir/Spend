from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from apps.categories.models import MasterCategory, UserCategory
from apps.categories.serializers import UserCategorySerializer, MasterCategorySerializer
from apps.expenses.models import Expense
from common.responses import success_response, error_response
from decimal import Decimal

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_categories_view(request):
    """
    Returns categories for the user (user_categories) and also supports
    fetching available categories that the user can add.
    """
    # If standard categories request
    user_cats = UserCategory.objects.filter(user=request.user).order_by('category__category_name')
    # Format categories list matching original response:
    # [{ "category_id": 1, "name": "Food", "icon": "fas fa-utensils", "budget_limit": 1000 }]
    formatted = []
    for uc in user_cats:
        formatted.append({
            "category_id": uc.category.category_id,
            "id": uc.category.category_id,
            "name": uc.category.category_name,
            "category_name": uc.category.category_name,
            "icon": uc.category.icon,
            "is_custom": uc.is_custom,
            "budget_limit": float(uc.budget_limit)
        })
    return success_response(categories=formatted)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_categories_view(request):
    # Get master categories NOT added by user
    user_cat_ids = UserCategory.objects.filter(user=request.user).values_list('category_id', flat=True)
    available = MasterCategory.objects.exclude(category_id__in=user_cat_ids).order_by('category_name')
    serializer = MasterCategorySerializer(available, many=True)
    
    # PHP key: available_categories
    return success_response(available_categories=serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def add_category_view(request):
    data = request.data
    # Support both 'name' (from React) and 'category_name' (from original php form)
    name = (data.get('category_name') or data.get('name', '')).strip()
    icon = data.get('icon', 'fa-tag')
    budget_limit = Decimal(str(data.get('budget_limit', 0.0)))

    if not name:
        return error_response("Category name is required")

    try:
        # Check if master category exists
        try:
            master_cat = MasterCategory.objects.get(category_name__iexact=name)
        except MasterCategory.DoesNotExist:
            # Create new master category
            master_cat = MasterCategory.objects.create(category_name=name, icon=icon, is_default=False)

        # Check if already added to user categories
        user_cat_exists = UserCategory.objects.filter(user=request.user, category=master_cat).exists()
        if user_cat_exists:
            return error_response("You already have this category")

        # Create user category link
        UserCategory.objects.create(
            user=request.user,
            category=master_cat,
            is_custom=True,
            budget_limit=budget_limit
        )

        return success_response(message="Category added successfully")

    except Exception as e:
        return error_response(f"Database error: {str(e)}")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_category_view(request):
    data = request.data
    category_id = data.get('category_id')

    if not category_id:
        return error_response("Category ID is required")

    try:
        # Check if user category link exists
        try:
            user_cat = UserCategory.objects.get(user=request.user, category_id=category_id)
        except UserCategory.DoesNotExist:
            return error_response("Category not found")

        # Check for expenses
        has_expenses = Expense.objects.filter(user=request.user, category_id=category_id).exists()
        if has_expenses:
            return error_response("Cannot delete category with existing expenses. Please delete or reassign expenses first.")

        is_custom = user_cat.is_custom
        master_cat = user_cat.category

        # Delete link
        user_cat.delete()

        # If custom and not default, remove from MasterCategory
        if is_custom and not master_cat.is_default:
            master_cat.delete()

        return success_response(message="Category deleted successfully")

    except Exception as e:
        return error_response(f"Database error: {str(e)}")
