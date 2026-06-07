from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from apps.accounts.models import User
from apps.categories.models import MasterCategory, UserCategory
from common.responses import success_response, error_response
from common.validators import validate_email_format
from django.db import transaction

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def login_view(request):
    data = request.data
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return error_response("Email and password are required.")

    user = authenticate(request, username=email, password=password)
    if user is not None:
        if user.status != 'active':
            return error_response("Your account has been deactivated. Please contact admin.")
        
        login(request, user)
        
        # PHP response:
        # {
        #   "success": true,
        #   "message": "Login successful" or "Welcome back, {name}!",
        #   "user_id": 5,
        #   "user_name": "John Doe",
        #   "user_role": "user",
        #   "user_balance": 1000
        # }
        return success_response(
            message=f"Welcome back, {user.name}!",
            user_id=user.user_id,
            user_name=user.name,
            name=user.name,
            user_role=user.role,
            role=user.role,
            user_balance=float(user.balance),
            balance=float(user.balance)
        )
    else:
        return error_response("Invalid email or password.")

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def register_view(request):
    data = request.data
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not name or not email or not password:
        return error_response("All fields are required.")

    if not validate_email_format(email):
        return error_response("Invalid email address.")

    if len(password) < 4:
        return error_response("Password must be at least 4 characters.")

    # Check for existing email
    if User.objects.filter(email=email).exists():
        return error_response("An account with this email already exists.")

    try:
        # Create user
        user = User.objects.create_user(email=email, name=name, password=password, role='user')

        # Add default categories if user has none
        default_categories = MasterCategory.objects.filter(is_default=True)
        for cat in default_categories:
            UserCategory.objects.get_or_create(user=user, category=cat, is_custom=False, budget_limit=0.0)

        # Log the user in
        login(request, user)

        # PHP response:
        # {
        #   "success": true,
        #   "message": "Registration successful" or "Account created! Welcome, {name}!",
        #   "user_id": 5,
        #   "user_balance": 0
        # }
        return success_response(
            message=f"Account created! Welcome, {user.name}!",
            user_id=user.user_id,
            name=user.name,
            role=user.role,
            user_balance=0.0,
            balance=0.0
        )
    except Exception as e:
        return error_response(f"Registration failed: {str(e)}")

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return success_response(message="Logged out successfully")

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_php_bridge(request):
    """
    Bridge view to emulate auth.php. Routes based on payload 'action'.
    """
    action = request.data.get('action', '')
    if action == 'login':
        return login_view(request._request)
    elif action == 'register':
        return register_view(request._request)
    elif action == 'logout':
        return logout_view(request._request)
    else:
        return error_response("Unknown action. Please specify 'login' or 'register'.")
