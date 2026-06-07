from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from apps.transactions.models import Transaction
from apps.transactions.serializers import TransactionSerializer
from common.responses import success_response, error_response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions_view(request):
    try:
        # Get all transactions (both income and expense) for user
        transactions = Transaction.objects.filter(user=request.user).order_by('-created_at', '-transaction_id')
        serializer = TransactionSerializer(transactions, many=True)
        return success_response(
            transactions=serializer.data,
            balance=float(request.user.balance)
        )
    except Exception as e:
        return error_response(str(e))
