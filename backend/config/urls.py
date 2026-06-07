from django.contrib import admin
from django.urls import path
from apps.accounts.views import register_view, login_view, logout_view, auth_php_bridge
from apps.dashboard.views import dashboard_view
from apps.expenses.views import add_expense_view, get_expenses_view
from apps.income.views import add_income_view
from apps.transactions.views import get_transactions_view
from apps.categories.views import get_categories_view, get_available_categories_view, add_category_view, delete_category_view
from apps.budgets.views import budget_view
from apps.reports.views import reports_view
from apps.adminpanel.views import (
    admin_dashboard_view,
    admin_users_view,
    admin_transactions_view,
    admin_activate_user,
    admin_deactivate_user,
    admin_delete_user
)

urlpatterns = [
    path("django-admin/", admin.site.urls),

    # Authentication
    path("api/auth/register", register_view),
    path("api/auth/login", login_view),
    path("api/auth/logout", logout_view),

    # Dashboard
    path("api/dashboard", dashboard_view),

    # Expenses
    path("api/expenses", get_expenses_view),
    path("api/expenses/add", add_expense_view),

    # Income
    path("api/income/add", add_income_view),

    # Transactions
    path("api/transactions", get_transactions_view),

    # Categories
    path("api/categories", get_categories_view),
    path("api/categories/available", get_available_categories_view),
    path("api/categories/add", add_category_view),
    path("api/categories/delete", delete_category_view),

    # Budgets
    path("api/budgets", budget_view),

    # Reports
    path("api/reports", reports_view),

    # Admin Module
    path("api/admin/dashboard", admin_dashboard_view),
    path("api/admin/users", admin_users_view),
    path("api/admin/transactions", admin_transactions_view),
    path("api/admin/users/<int:pk>/activate", admin_activate_user),
    path("api/admin/users/<int:pk>/deactivate", admin_deactivate_user),
    path("api/admin/users/<int:pk>/delete", admin_delete_user),

    # --- PHP API COMPATIBILITY BRIDGE PATHS ---
    # These match the axios endpoints in services/api.ts directly!
    path("spend_wisely/api/auth.php", auth_php_bridge),
    path("api/auth.php", auth_php_bridge),

    path("spend_wisely/api/get_dashboard.php", dashboard_view),
    path("api/get_dashboard.php", dashboard_view),

    path("spend_wisely/api/add_expenses.php", add_expense_view),
    path("api/add_expenses.php", add_expense_view),

    path("spend_wisely/api/get_expenses.php", get_expenses_view),
    path("api/get_expenses.php", get_expenses_view),

    path("spend_wisely/api/add_income.php", add_income_view),
    path("api/add_income.php", add_income_view),

    path("spend_wisely/api/get_transactions.php", get_transactions_view),
    path("api/get_transactions.php", get_transactions_view),

    path("spend_wisely/api/get_categories.php", get_categories_view),
    path("api/get_categories.php", get_categories_view),

    path("spend_wisely/api/add_category.php", add_category_view),
    path("api/add_category.php", add_category_view),

    path("spend_wisely/api/delete_category.php", delete_category_view),
    path("api/delete_category.php", delete_category_view),

    path("spend_wisely/api/get_budget_data.php", budget_view),
    path("api/get_budget_data.php", budget_view),

    path("spend_wisely/api/get_report.php", reports_view),
    path("api/get_report.php", reports_view),
]
