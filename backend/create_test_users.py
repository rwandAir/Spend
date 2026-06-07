#!/usr/bin/env python
"""
Script to create test users in the database
"""
import os
import sys
import django

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from apps.accounts.models import User
from decimal import Decimal

# Test user data
TEST_USERS = [
    {
        'email': 'john.doe@example.com',
        'name': 'John Doe',
        'password': 'TestPass123!',
        'role': 'user',
        'balance': Decimal('50000.00')
    },
    {
        'email': 'jane.smith@example.com',
        'name': 'Jane Smith',
        'password': 'SecurePass456!',
        'role': 'user',
        'balance': Decimal('75000.00')
    },
    {
        'email': 'admin@example.com',
        'name': 'Admin User',
        'password': 'AdminPass789!',
        'role': 'admin',
        'balance': Decimal('100000.00')
    }
]

def create_test_users():
    """Create test users"""
    print("Creating test users...")
    created_users = []
    
    for user_data in TEST_USERS:
        email = user_data['email']
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            print(f"⚠️  User {email} already exists, skipping...")
            continue
        
        # Create user
        user = User.objects.create_user(
            email=email,
            name=user_data['name'],
            password=user_data['password'],
            role=user_data['role']
        )
        
        # Update balance
        user.balance = user_data['balance']
        user.save()
        
        created_users.append({
            'email': email,
            'name': user_data['name'],
            'password': user_data['password'],
            'role': user_data['role'],
            'balance': str(user_data['balance'])
        })
        
        print(f"✅ Created user: {email} ({user_data['role']})")
    
    return created_users

def display_test_credentials(created_users):
    """Display test user credentials"""
    print("\n" + "="*70)
    print("TEST USER CREDENTIALS")
    print("="*70)
    
    for idx, user in enumerate(created_users, 1):
        print(f"\nTest User {idx}:")
        print(f"  Email:    {user['email']}")
        print(f"  Password: {user['password']}")
        print(f"  Name:     {user['name']}")
        print(f"  Role:     {user['role']}")
        print(f"  Balance:  RWF {user['balance']}")
    
    print("\n" + "="*70)

if __name__ == '__main__':
    try:
        print("Starting test user creation...\n")
        created_users = create_test_users()
        
        if created_users:
            display_test_credentials(created_users)
            print(f"\n✅ Successfully created {len(created_users)} test users!")
        else:
            print("ℹ️  All test users already exist")
            
            # Display existing users
            print("\nExisting test users:")
            for user_data in TEST_USERS:
                user = User.objects.filter(email=user_data['email']).first()
                if user:
                    print(f"\n  Email:    {user.email}")
                    print(f"  Name:     {user.name}")
                    print(f"  Role:     {user.role}")
                    print(f"  Balance:  RWF {user.balance}")
                    print(f"  Password: {user_data['password']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
