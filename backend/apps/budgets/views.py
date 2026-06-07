from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from apps.categories.models import UserCategory
from apps.expenses.models import Expense
from apps.transactions.models import Transaction
from apps.budgets.models import CategoryBudget
from common.responses import success_response, error_response
from decimal import Decimal
import datetime

MONTHS = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December'
}

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def budget_view(request):
    user = request.user

    # POST: Save / update a category budget limit for specific month/year
    if request.method == 'POST':
        data = request.data
        category_id = data.get('category_id')
        limit_amount = data.get('limit_amount')

        if category_id is None or limit_amount is None:
            return error_response("Missing category_id or limit_amount")

        try:
            category_id = int(category_id)
            limit_amount = float(limit_amount)
        except ValueError:
            return error_response("Invalid category_id or limit_amount")

        selected_month = int(data.get('month', datetime.date.today().month))
        selected_year = int(data.get('year', datetime.date.today().year))

        try:
            # Check if budget record exists
            budget_obj, created = CategoryBudget.objects.get_or_create(
                user=user,
                category_id=category_id,
                year=selected_year,
                month=selected_month,
                defaults={'budget_amount': Decimal(str(limit_amount))}
            )
            if not created:
                budget_obj.budget_amount = Decimal(str(limit_amount))
                budget_obj.save()

            # Also update user_categories default budget limit so they stay in sync
            UserCategory.objects.filter(user=user, category_id=category_id).update(budget_limit=Decimal(str(limit_amount)))

            return success_response(
                message="Budget updated successfully",
                category_id=category_id,
                limit_amount=limit_amount,
                month=selected_month,
                year=selected_year
            )
        except Exception as e:
            return error_response(f"Database error: {str(e)}")

    # GET: return budget data for selected month/year
    else:
        try:
            selected_month = int(request.query_params.get('month', datetime.date.today().month))
            selected_year = int(request.query_params.get('year', datetime.date.today().year))
        except ValueError:
            selected_month = datetime.date.today().month
            selected_year = datetime.date.today().year

        try:
            # Calculate start and end date for filtering expenses
            start_date = datetime.date(selected_year, selected_month, 1)
            if selected_month == 12:
                end_date = datetime.date(selected_year + 1, 1, 1) - datetime.timedelta(days=1)
            else:
                end_date = datetime.date(selected_year, selected_month + 1, 1) - datetime.timedelta(days=1)

            # Get user categories (default settings)
            user_cats = UserCategory.objects.filter(user=user).select_related('category')

            # Get monthly budgets map
            monthly_budgets = CategoryBudget.objects.filter(
                user=user,
                year=selected_year,
                month=selected_month
            )
            budget_map = {b.category_id: b.budget_amount for b in monthly_budgets}

            # Get expenses sum grouped by category for that month
            expenses = Expense.objects.filter(
                user=user,
                expense_date__range=(start_date, end_date)
            ).values('category_id').annotate(total_spent=Sum('amount'))
            
            spent_map = {e['category_id']: e['total_spent'] for e in expenses}

            formatted_categories = []
            total_budget = Decimal('0.00')

            for uc in user_cats:
                cat_id = uc.category.category_id
                # Use monthly budget if exists, otherwise default from user category limit
                budget_amount = budget_map.get(cat_id, uc.budget_limit)
                total_budget += budget_amount
                
                spent_amount = spent_map.get(cat_id, Decimal('0.00'))

                formatted_categories.append({
                    'id': cat_id,
                    'name': uc.category.category_name,
                    'icon': uc.category.icon,
                    'budget': float(budget_amount),
                    'spent': float(spent_amount)
                })

            # Total spent this month
            total_spent = Expense.objects.filter(
                user=user,
                expense_date__range=(start_date, end_date)
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

            # Total income (all time)
            total_income = Transaction.objects.filter(
                user=user,
                transaction_type='income'
            ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

            remaining = total_budget - total_spent

            return success_response(
                remaining_balance=float(user.balance),
                total_budget=float(total_budget),
                total_spent=float(total_spent),
                total_income=float(total_income),
                remaining=float(remaining),
                selected_month=selected_month,
                selected_year=selected_year,
                month_name=MONTHS.get(selected_month, 'Unknown'),
                categories=formatted_categories
            )

        except Exception as e:
            return error_response(f"Database error: {str(e)}")
