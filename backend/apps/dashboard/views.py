from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum
from decimal import Decimal
from apps.expenses.models import Expense
from apps.transactions.models import Transaction
from apps.categories.models import UserCategory
from apps.transactions.serializers import TransactionSerializer
from common.responses import success_response, error_response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    user = request.user
    
    # Calculate monthly bounds
    now = timezone.now()
    start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    # Get last day of month
    if now.month == 12:
        end_date = now.replace(year=now.year + 1, month=1, day=1) - timezone.timedelta(seconds=1)
    else:
        end_date = now.replace(month=now.month + 1, day=1) - timezone.timedelta(seconds=1)

    try:
        # 1. Total expenses for current month
        expenses_sum = Expense.objects.filter(
            user=user,
            expense_date__range=(start_date.date(), end_date.date())
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # 2. Total income (all time) from transactions table
        income_sum = Transaction.objects.filter(
            user=user,
            transaction_type='income'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # 3. Total budget from user_categories (sum of budget_limit)
        budget_sum = UserCategory.objects.filter(
            user=user
        ).aggregate(total=Sum('budget_limit'))['total'] or Decimal('0.00')

        balance = Decimal(str(user.balance))
        total_expenses = Decimal(str(expenses_sum))
        total_income = Decimal(str(income_sum))
        total_budget = Decimal(str(budget_sum))

        budget_remaining = total_budget - total_expenses
        budget_percentage = int(round((total_expenses / total_budget) * 100)) if total_budget > 0 else 0

        # Fetch recent transactions (top 5) for React client
        recent_txs = Transaction.objects.filter(user=user).order_by('-created_at', '-transaction_id')[:5]
        recent_serializer = TransactionSerializer(recent_txs, many=True)

        return success_response(
            user_name=user.name,
            balance=float(balance),
            current_balance=float(balance),
            total_income=float(total_income),
            total_expenses=float(total_expenses),
            total_budget=float(total_budget),
            budget_remaining=float(budget_remaining),
            budget_percentage=budget_percentage,
            monthly_spent=float(total_expenses),
            recent_transactions=recent_serializer.data
        )

    except Exception as e:
        return error_response(f"Dashboard calculation error: {str(e)}")
