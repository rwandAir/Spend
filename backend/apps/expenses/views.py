from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum
from decimal import Decimal
from apps.expenses.models import Expense
from apps.expenses.serializers import ExpenseSerializer
from apps.categories.models import UserCategory
from common.services import add_expense_service
from common.responses import success_response, error_response
import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_expense_view(request):
    data = request.data
    category_id = int(data.get('category_id', 0))
    amount = float(data.get('amount', 0))
    
    # Optional fields
    expense_date_str = data.get('expense_date') or data.get('date')
    if expense_date_str:
        try:
            expense_date = datetime.datetime.strptime(expense_date_str, '%Y-%m-%d').date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD.")
    else:
        expense_date = timezone.now().date()

    payment_method = data.get('payment_method', 'Cash')
    description = data.get('description', '')

    if category_id <= 0:
        return error_response("Invalid category selected. Please select a category.")

    if amount <= 0:
        return error_response("Please enter a valid amount greater than 0.")

    try:
        expense, new_balance = add_expense_service(
            user=request.user,
            category_id=category_id,
            amount=amount,
            expense_date=expense_date,
            payment_method=payment_method,
            description=description
        )

        # Calculate monthly budget & spent for this category
        now = timezone.now()
        start_date = now.replace(day=1).date()
        if now.month == 12:
            end_date = now.replace(year=now.year + 1, month=1, day=1).date() - datetime.timedelta(days=1)
        else:
            end_date = now.replace(month=now.month + 1, day=1).date() - datetime.timedelta(days=1)

        category_spent = Expense.objects.filter(
            user=request.user,
            category_id=category_id,
            expense_date__range=(start_date, end_date)
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Get budget limit from user_categories
        try:
            user_cat = UserCategory.objects.get(user=request.user, category_id=category_id)
            budget = user_cat.budget_limit
        except UserCategory.DoesNotExist:
            budget = Decimal('0.00')

        remaining_budget = budget - category_spent
        percentage_used = int(round((category_spent / budget) * 100)) if budget > 0 else 0

        return success_response(
            message="Expense added successfully",
            balance=float(new_balance),
            category_id=category_id,
            category_spent=float(category_spent),
            category_budget=float(budget),
            remaining_budget=float(remaining_budget),
            percentage_used=percentage_used
        )

    except ValueError as e:
        return error_response(str(e))
    except Exception as e:
        return error_response(f"Error saving expense: {str(e)}")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses_view(request):
    expenses = Expense.objects.filter(user=request.user)
    serializer = ExpenseSerializer(expenses, many=True)
    return success_response(
        expenses=serializer.data,
        balance=float(request.user.balance)
    )
