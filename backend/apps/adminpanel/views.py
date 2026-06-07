from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from django.db import transaction
from apps.accounts.models import User
from apps.expenses.models import Expense
from apps.transactions.models import Transaction
from apps.budgets.models import CategoryBudget
from apps.categories.models import UserCategory
from apps.activity_logs.models import ActivityLog
from apps.accounts.serializers import UserSerializer
from apps.transactions.serializers import TransactionSerializer
from common.permissions import IsAdminRole
from common.responses import success_response, error_response
from decimal import Decimal

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_dashboard_view(request):
    try:
        # Get total users (non-admin)
        total_users = User.objects.filter(role='user').count()

        # Get active users
        active_users = User.objects.filter(role='user', status='active').count()
        inactive_users = total_users - active_users

        # Get total system expenses
        total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Get total transactions count
        total_transactions = Transaction.objects.count()

        # Get recent 10 transactions across the whole system
        recent_txs = Transaction.objects.all().select_related('user').order_by('-created_at', '-transaction_id')[:10]
        
        # Serialize transactions with user names
        serialized_txs = []
        for t in recent_txs:
            serialized_txs.append({
                "id": t.transaction_id,
                "user_id": t.user.user_id,
                "user_name": t.user.name,
                "category": t.category,
                "amount": float(t.amount),
                "transaction_type": t.transaction_type,
                "type": t.transaction_type,
                "created_at": t.created_at.strftime('%Y-%m-%d'),
                "payment_method": t.payment_method
            })

        return success_response(
            total_users=total_users,
            active_users=active_users,
            inactive_users=inactive_users,
            total_expenses=float(total_expenses),
            total_transactions=total_transactions,
            recent_transactions=serialized_txs
        )
    except Exception as e:
        return error_response(str(e))

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_users_view(request):
    search = request.query_params.get('search', '').strip()
    try:
        users = User.objects.all().order_by('-user_id')
        if search:
            users = users.filter(Q(name__icontains=search) | Q(email__icontains=search))
        
        serializer = UserSerializer(users, many=True)
        return success_response(users=serializer.data)
    except Exception as e:
        return error_response(str(e))

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_transactions_view(request):
    filter_user_id = request.query_params.get('user_id')
    try:
        txs = Transaction.objects.all().select_related('user').order_by('-created_at', '-transaction_id')
        if filter_user_id and int(filter_user_id) > 0:
            txs = txs.filter(user_id=int(filter_user_id))

        serialized_txs = []
        for t in txs:
            serialized_txs.append({
                "id": t.transaction_id,
                "user_id": t.user.user_id,
                "user_name": t.user.name,
                "category": t.category,
                "amount": float(t.amount),
                "transaction_type": t.transaction_type,
                "type": t.transaction_type,
                "created_at": t.created_at.strftime('%Y-%m-%d'),
                "payment_method": t.payment_method
            })
        return success_response(transactions=serialized_txs)
    except Exception as e:
        return error_response(str(e))

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_activate_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        if user.role == 'admin':
            return error_response("Cannot modify status of admin users!")
        
        user.status = 'active'
        user.save()
        
        # Log action
        ActivityLog.objects.create(
            user=request.user,
            action=f"Activated user: {user.email}"
        )
        return success_response(message="User status updated successfully.")
    except User.DoesNotExist:
        return error_response("User not found.")
    except Exception as e:
        return error_response(str(e))

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_deactivate_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        if user.role == 'admin':
            return error_response("Cannot modify status of admin users!")
        
        user.status = 'inactive'
        user.save()
        
        # Log action
        ActivityLog.objects.create(
            user=request.user,
            action=f"Deactivated user: {user.email}"
        )
        return success_response(message="User status updated successfully.")
    except User.DoesNotExist:
        return error_response("User not found.")
    except Exception as e:
        return error_response(str(e))

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminRole])
@transaction.atomic
def admin_delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        if user.role == 'admin':
            return error_response("Cannot delete admin users!")
        
        # Delete user's associated data explicitly (or Django will do it on cascade,
        # but let's make sure it's clean and matches the PHP transactional deletes)
        Expense.objects.filter(user=user).delete()
        Transaction.objects.filter(user=user).delete()
        CategoryBudget.objects.filter(user=user).delete()
        ActivityLog.objects.filter(user=user).delete()
        UserCategory.objects.filter(user=user).delete()
        
        email = user.email
        user.delete()

        # Log action under admin account
        ActivityLog.objects.create(
            user=request.user,
            action=f"Deleted user account: {email}"
        )

        return success_response(message="User deleted successfully! All associated data has been removed.")
    except User.DoesNotExist:
        return error_response("User not found.")
    except Exception as e:
        return error_response(str(e))
