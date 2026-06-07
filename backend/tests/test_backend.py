from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from apps.categories.models import MasterCategory, UserCategory
from apps.expenses.models import Expense
from apps.transactions.models import Transaction
from apps.budgets.models import CategoryBudget
import datetime

User = get_user_model()

class SpendWiselyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Seed default master categories
        self.food_cat = MasterCategory.objects.create(category_name='Food', icon='fa-utensils', is_default=True)
        self.transport_cat = MasterCategory.objects.create(category_name='Transport', icon='fa-bus', is_default=True)
        self.other_cat = MasterCategory.objects.create(category_name='Other', icon='fa-tag', is_default=False)

        # Create user
        self.user = User.objects.create_user(
            email='test@example.com',
            name='Test User',
            password='Password123'
        )

        # Add default categories for test user
        UserCategory.objects.create(user=self.user, category=self.food_cat, is_custom=False, budget_limit=5000.0)
        UserCategory.objects.create(user=self.user, category=self.transport_cat, is_custom=False, budget_limit=3000.0)

        # Create admin user
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            name='Admin User',
            password='AdminPassword123',
            role='admin'
        )

    def test_registration(self):
        payload = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'Password123'
        }
        response = self.client.post('/api/auth/register', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user_balance'], 0.0)
        self.assertTrue(User.objects.filter(email='john@example.com').exists())

    def test_login_and_logout(self):
        payload = {
            'email': 'test@example.com',
            'password': 'Password123'
        }
        # Login
        response = self.client.post('/api/auth/login', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user_role'], 'user')

        # Logout
        self.client.force_authenticate(user=self.user)
        logout_response = self.client.post('/api/auth/logout')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertTrue(logout_response.data['success'])

    def test_add_income_and_balance_update(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'amount': 50000.0,
            'description': 'Salary bonus',
            'payment_method': 'Bank Transfer'
        }
        response = self.client.post('/api/income/add', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['balance'], 50000.0)
        
        # Verify transaction table
        self.assertTrue(Transaction.objects.filter(user=self.user, transaction_type='income', amount=50000.0).exists())

    def test_add_expense_and_balance_update(self):
        self.user.balance = Decimal('10000.00')
        self.user.save()

        self.client.force_authenticate(user=self.user)
        payload = {
            'category_id': self.food_cat.category_id,
            'amount': 1500.00,
            'payment_method': 'Cash',
            'description': 'Lunch'
        }
        response = self.client.post('/api/expenses/add', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['balance'], 8500.00)
        self.assertEqual(response.data['remaining_budget'], 3500.00) # Budget limit is 5000.0

        # Verify expense record
        self.assertTrue(Expense.objects.filter(user=self.user, category=self.food_cat, amount=1500.00).exists())
        # Verify transaction record
        self.assertTrue(Transaction.objects.filter(user=self.user, transaction_type='expense', amount=1500.00).exists())

    def test_save_budget(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'category_id': self.food_cat.category_id,
            'limit_amount': 7500.0,
            'month': 6,
            'year': 2026
        }
        response = self.client.post('/api/budgets', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        # Check CategoryBudget table
        budget_record = CategoryBudget.objects.get(user=self.user, category=self.food_cat, month=6, year=2026)
        self.assertEqual(budget_record.budget_amount, Decimal('7500.0'))

    def test_reports(self):
        self.client.force_authenticate(user=self.user)
        # Add income and expenses
        Transaction.objects.create(
            user=self.user, amount=Decimal('5000.00'), transaction_type='income',
            category='Salary', payment_method='Bank Transfer', created_at=datetime.date.today()
        )
        Expense.objects.create(
            user=self.user, category=self.food_cat, amount=Decimal('1000.00'),
            expense_date=datetime.date.today(), payment_method='Cash'
        )

        response = self.client.get('/api/reports', {'period': 'monthly'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['total_expenses'], 1000.0)

    def test_permissions_user_vs_admin(self):
        # 1. User accessing admin dashboard (should fail)
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/admin/dashboard')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Admin accessing admin dashboard (should pass)
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
