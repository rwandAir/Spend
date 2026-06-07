from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from apps.expenses.models import Expense
from apps.transactions.models import Transaction
from apps.categories.models import UserCategory
from apps.budgets.models import CategoryBudget
from common.responses import success_response, error_response
from decimal import Decimal
import datetime
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reports_view(request):
    user = request.user
    period = request.query_params.get('period', 'monthly')
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')

    # Also support date range sent as query param month (e.g. from react client)
    # in api.ts: `getReportData: async (month?: string) => api.get('get_report.php', { params: { month } })`
    # Let's inspect: if 'month' is supplied as YYYY-MM
    month_param = request.query_params.get('month')
    
    today = datetime.date.today()

    if month_param:
        try:
            parts = month_param.split('-')
            year = int(parts[0])
            month = int(parts[1])
            start_date = datetime.date(year, month, 1)
            if month == 12:
                end_date = datetime.date(year + 1, 1, 1) - datetime.timedelta(days=1)
            else:
                end_date = datetime.date(year, month + 1, 1) - datetime.timedelta(days=1)
        except (ValueError, IndexError):
            start_date = today.replace(day=1)
            end_date = today
    elif period == 'weekly':
        # Monday to Sunday of current week
        start_date = today - datetime.timedelta(days=today.weekday())
        end_date = start_date + datetime.timedelta(days=6)
    elif period == 'monthly':
        start_date = today.replace(day=1)
        # Last day of current month
        if today.month == 12:
            end_date = datetime.date(today.year + 1, 1, 1) - datetime.timedelta(days=1)
        else:
            end_date = datetime.date(today.year, today.month + 1, 1) - datetime.timedelta(days=1)
    elif period == 'yearly':
        start_date = datetime.date(today.year, 1, 1)
        end_date = datetime.date(today.year, 12, 31)
    elif period == 'custom' and start_date_str and end_date_str:
        try:
            start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD.")
    else:
        # Default to monthly
        start_date = today.replace(day=1)
        if today.month == 12:
            end_date = datetime.date(today.year + 1, 1, 1) - datetime.timedelta(days=1)
        else:
            end_date = datetime.date(today.year, today.month + 1, 1) - datetime.timedelta(days=1)

    try:
        # Convert to datetime for timezone filtering on transactions table
        start_datetime = datetime.datetime.combine(start_date, datetime.time.min)
        start_datetime = timezone.make_aware(start_datetime, timezone.get_current_timezone())
        
        end_datetime = datetime.datetime.combine(end_date, datetime.time.max)
        end_datetime = timezone.make_aware(end_datetime, timezone.get_current_timezone())

        # Total income from transactions in date range
        total_income = Transaction.objects.filter(
            user=user,
            transaction_type='income',
            created_at__range=(start_datetime, end_datetime)
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Total expenses in date range
        total_expenses = Expense.objects.filter(
            user=user,
            expense_date__range=(start_date, end_date)
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Category breakdown
        # Find all user category connections, left join expenses in date range
        user_cats = UserCategory.objects.filter(user=user).select_related('category')
        
        breakdown = []
        categories_data = []

        for uc in user_cats:
            cat_id = uc.category.category_id
            
            # Aggregate expenses for this category in date range
            agg = Expense.objects.filter(
                user=user,
                category_id=cat_id,
                expense_date__range=(start_date, end_date)
            ).aggregate(amount=Sum('amount'), count=Count('expense_id'))

            amount = agg['amount'] or Decimal('0.00')
            count = agg['count'] or 0

            if amount > 0:
                percentage = float(round((amount / total_expenses) * 100, 1)) if total_expenses > 0 else 0.0
                item = {
                    'category': uc.category.category_name,
                    'icon': uc.category.icon,
                    'amount': float(amount),
                    'percentage': percentage,
                    'transaction_count': count
                }
                breakdown.append(item)
                # Categories output matches breakdown list but contains the DB structure expected
                categories_data.append({
                    'category': uc.category.category_name,
                    'icon': uc.category.icon,
                    'amount': float(amount),
                    'transaction_count': count
                })

        # Sort breakdown by amount DESC
        breakdown = sorted(breakdown, key=lambda x: x['amount'], reverse=True)
        categories_data = sorted(categories_data, key=lambda x: x['amount'], reverse=True)

        # Get total budget
        total_budget = UserCategory.objects.filter(user=user).aggregate(total=Sum('budget_limit'))['total'] or Decimal('0.00')

        # Check for monthly budget total
        current_year = start_date.year
        current_month = start_date.month
        monthly_total_budget = CategoryBudget.objects.filter(
            user=user,
            year=current_year,
            month=current_month
        ).aggregate(total=Sum('budget_amount'))['total'] or Decimal('0.00')

        if monthly_total_budget > 0:
            total_budget = monthly_total_budget

        budget_remaining = total_budget - total_expenses
        if budget_remaining < 0:
            budget_remaining = Decimal('0.00')

        # Format for React chart format too
        chart_categories = [item['category'] for item in breakdown]
        chart_amounts = [item['amount'] for item in breakdown]
        # Sleek color list for React reports chart
        chart_colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

        return success_response(
            user_name=user.name,
            period={
                'start': start_date.strftime('%Y-%m-%d'),
                'end': end_date.strftime('%Y-%m-%d')
            },
            total_income=float(total_income),
            total_expenses=float(total_expenses),
            net=float(total_income - total_expenses),
            total_budget=float(total_budget),
            budget_remaining=float(budget_remaining),
            real_balance=float(user.balance),
            transaction_count=len(breakdown),
            breakdown=breakdown,
            categories=categories_data,
            # React components charting needs:
            amounts=chart_amounts,
            colors=chart_colors[:len(chart_amounts)]
        )

    except Exception as e:
        return error_response(f"Database error: {str(e)}")
