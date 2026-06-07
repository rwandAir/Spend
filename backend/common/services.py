from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from apps.expenses.models import Expense
from apps.transactions.models import Transaction
from apps.activity_logs.models import ActivityLog
from apps.categories.models import MasterCategory

@transaction.atomic
def add_expense_service(user, category_id, amount, expense_date, payment_method, description=None):
    # Retrieve category
    try:
        category = MasterCategory.objects.get(pk=category_id)
    except MasterCategory.DoesNotExist:
        raise ValueError("Invalid category selected. Please select a category.")

    if amount <= 0:
        raise ValueError("Please enter a valid amount greater than 0.")

    # Convert amount to Decimal
    amount_dec = Decimal(str(amount))

    # 1. Create expense record
    expense = Expense.objects.create(
        user=user,
        category=category,
        amount=amount_dec,
        description=description,
        expense_date=expense_date,
        payment_method=payment_method
    )

    # 2. Update user balance (subtract)
    user.balance -= amount_dec
    user.save()

    # 3. Create transaction record
    # Note: transaction_date / created_at is stored with time. We combine expense_date with current time.
    current_time = timezone.now().time()
    dt = timezone.datetime.combine(expense_date, current_time)
    dt = timezone.make_aware(dt, timezone.get_current_timezone())

    tx = Transaction.objects.create(
        user=user,
        amount=amount_dec,
        transaction_type='expense',
        category=category.category_name,
        payment_method=payment_method,
        created_at=dt
    )

    # 4. Create activity log
    ActivityLog.objects.create(
        user=user,
        action=f"Added expense: RWF {amount_dec:,.0f} for {category.category_name}"
    )

    return expense, user.balance

@transaction.atomic
def add_income_service(user, amount, description, income_date, payment_method):
    if amount <= 0:
        raise ValueError("Please enter a valid amount greater than 0.")

    amount_dec = Decimal(str(amount))

    # 1. Update user balance (add)
    user.balance += amount_dec
    user.save()

    # 2. Create transaction record (income)
    current_time = timezone.now().time()
    dt = timezone.datetime.combine(income_date, current_time)
    dt = timezone.make_aware(dt, timezone.get_current_timezone())

    tx = Transaction.objects.create(
        user=user,
        amount=amount_dec,
        transaction_type='income',
        category=description or 'Income',
        payment_method=payment_method,
        created_at=dt
    )

    # 3. Create activity log
    ActivityLog.objects.create(
        user=user,
        action=f"Added income: RWF {amount_dec:,.0f} - {description or 'Income'}"
    )

    return tx, user.balance
