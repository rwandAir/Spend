from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from common.services import add_income_service
from common.responses import success_response, error_response
import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_income_view(request):
    data = request.data
    amount = float(data.get('amount', 0))
    description = data.get('description', 'Income').strip()
    
    # Optional fields
    income_date_str = data.get('income_date') or data.get('date')
    if income_date_str:
        try:
            income_date = datetime.datetime.strptime(income_date_str, '%Y-%m-%d').date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD.")
    else:
        income_date = timezone.now().date()

    payment_method = data.get('payment_method', 'Cash')

    if amount <= 0:
        return error_response("Please enter a valid amount greater than 0")

    try:
        tx, new_balance = add_income_service(
            user=request.user,
            amount=amount,
            description=description,
            income_date=income_date,
            payment_method=payment_method
        )
        return success_response(
            message="Income added successfully!",
            balance=float(new_balance),
            amount=amount
        )
    except ValueError as e:
        return error_response(str(e))
    except Exception as e:
        return error_response(f"Error saving income: {str(e)}")
