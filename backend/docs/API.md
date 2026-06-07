# Spend Wisely - API Documentation

The Spend Wisely backend has been migrated from a PHP/MySQL implementation to a Django REST Framework API, communicating with a Supabase PostgreSQL database. This document details the key endpoints, request models, response payloads, and integration details.

---

## Authentication

All endpoints except registration and login require an authenticated session. Authentication is handled using Django Session Authentication.

### Register
`POST /api/auth/register` (also supported via `POST /api/auth.php` with `action="register"`)

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response Payload:**
```json
{
  "success": true,
  "message": "Account created! Welcome, John Doe!",
  "user_id": 5,
  "name": "John Doe",
  "role": "user",
  "user_balance": 0.0,
  "balance": 0.0
}
```

---

### Login
`POST /api/auth/login` (also supported via `POST /api/auth.php` with `action="login"`)

**Request Payload:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response Payload:**
```json
{
  "success": true,
  "message": "Welcome back, John Doe!",
  "user_id": 5,
  "user_name": "John Doe",
  "name": "John Doe",
  "user_role": "user",
  "role": "user",
  "user_balance": 1000.00,
  "balance": 1000.00
}
```

---

### Logout
`POST /api/auth/logout` (also supported via `POST /api/auth.php` with `action="logout"`)

**Response Payload:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Dashboard

### Get Dashboard Data
`GET /api/dashboard` (also supported via `GET /api/get_dashboard.php`)

**Response Payload:**
```json
{
  "success": true,
  "user_name": "John Doe",
  "balance": 15000.0,
  "current_balance": 15000.0,
  "total_income": 50000.0,
  "total_expenses": 35000.0,
  "total_budget": 40000.0,
  "budget_remaining": 5000.0,
  "budget_percentage": 88,
  "monthly_spent": 35000.0,
  "recent_transactions": [ ... ]
}
```

---

## Expenses

### Add Expense
`POST /api/expenses/add` (also supported via `POST /api/add_expenses.php`)

**Request Payload:**
```json
{
  "category_id": 3,
  "amount": 450.50,
  "description": "Grocery shopping",
  "expense_date": "2026-05-06",
  "payment_method": "Cash"
}
```

**Response Payload:**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "balance": 14549.5,
  "category_id": 3,
  "category_spent": 450.5,
  "category_budget": 5000.0,
  "remaining_budget": 4549.5,
  "percentage_used": 9
}
```

---

### Get Expenses List
`GET /api/expenses` (also supported via `GET /api/get_expenses.php`)

**Response Payload:**
```json
{
  "success": true,
  "expenses": [
    {
      "expense_id": 1,
      "expense_date": "2026-05-06",
      "category_name": "Food",
      "category_id": 3,
      "amount": 450.5,
      "payment_method": "Cash",
      "description": "Grocery shopping"
    }
  ],
  "balance": 14549.5
}
```

---

## Income

### Add Income
`POST /api/income/add` (also supported via `POST /api/add_income.php`)

**Request Payload:**
```json
{
  "amount": 50000,
  "description": "Salary",
  "income_date": "2026-05-01",
  "payment_method": "Bank Transfer"
}
```

**Response Payload:**
```json
{
  "success": true,
  "message": "Income added successfully!",
  "balance": 64549.5,
  "amount": 50000.0
}
```

---

## Transactions

### Get Transactions List
`GET /api/transactions` (also supported via `GET /api/get_transactions.php`)

**Response Payload:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "transaction_id": 1,
      "transaction_date": "2026-05-06",
      "created_at": "2026-05-06",
      "category": "Food",
      "description": "Food",
      "amount": 450.5,
      "transaction_type": "expense",
      "type": "expense",
      "payment_method": "Cash"
    }
  ],
  "balance": 64549.5
}
```

---

## Budgets

### Save Budget Limit
`POST /api/budgets` (also supported via `POST /api/get_budget_data.php`)

**Request Payload:**
```json
{
  "category_id": 3,
  "limit_amount": 8000,
  "month": 5,
  "year": 2026
}
```

**Response Payload:**
```json
{
  "success": true,
  "message": "Budget updated successfully",
  "category_id": 3,
  "limit_amount": 8000.0,
  "month": 5,
  "year": 2026
}
```

---

### Get Budget Progress
`GET /api/budgets` (also supported via `GET /api/get_budget_data.php`)

**Response Payload:**
```json
{
  "success": true,
  "remaining_balance": 64549.5,
  "total_budget": 25000.0,
  "total_spent": 15000.0,
  "total_income": 50000.0,
  "remaining": 10000.0,
  "selected_month": 5,
  "selected_year": 2026,
  "month_name": "May",
  "categories": [
    {
      "id": 3,
      "name": "Food",
      "icon": "fa-utensils",
      "budget": 8000.0,
      "spent": 450.5
    }
  ]
}
```

---

## Reports

### Get Report
`GET /api/reports` (also supported via `GET /api/get_report.php`)

**Parameters:**
- `period` (weekly / monthly / yearly / custom)
- `start_date` (YYYY-MM-DD, optional)
- `end_date` (YYYY-MM-DD, optional)
- `month` (YYYY-MM, optional)

**Response Payload:**
```json
{
  "success": true,
  "user_name": "John Doe",
  "period": {
    "start": "2026-05-01",
    "end": "2026-05-31"
  },
  "total_income": 50000.0,
  "total_expenses": 15000.0,
  "net": 35000.0,
  "total_budget": 25000.0,
  "budget_remaining": 10000.0,
  "real_balance": 64549.5,
  "transaction_count": 1,
  "breakdown": [
    {
      "category": "Food",
      "icon": "fa-utensils",
      "amount": 450.5,
      "percentage": 3.0,
      "transaction_count": 1
    }
  ],
  "categories": [
    {
      "category": "Food",
      "icon": "fa-utensils",
      "amount": 450.5,
      "transaction_count": 1
    }
  ],
  "amounts": [450.5],
  "colors": ["#2563eb"]
}
```

---

## Admin Endpoints

All admin endpoints require user to have `'admin'` role.

- `GET /api/admin/dashboard`: Stats and system-wide recent transactions.
- `GET /api/admin/users`: Searchable and paginated user management list.
- `GET /api/admin/transactions`: All transactions across all users with user ID filter.
- `POST /api/admin/users/<id>/activate`: Activate user account.
- `POST /api/admin/users/<id>/deactivate`: Deactivate user account.
- `DELETE /api/admin/users/<id>/delete`: Hard delete user and all cascading data.
