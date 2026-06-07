# Supabase Setup & Integration Guide

This guide explains how to set up and run the Spend Wisely application with Supabase as the backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema & Tables](#database-schema--tables)
4. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Authentication Flow](#authentication-flow)
8. [API Integration](#api-integration)

## Prerequisites

- Node.js 16+ and npm installed
- A Supabase project (free tier available at https://supabase.com)
- Git installed on your machine

## Supabase Project Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the project to be initialized (takes a few minutes)
4. Navigate to **Settings > API** to get your credentials:
   - **Project URL**: Your `VITE_SUPABASE_URL`
   - **Anon Key**: Your `VITE_SUPABASE_ANON_KEY` (public key for client-side access)

### 2. Copy Your Credentials

Copy the Project URL and Anon Key and update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Schema & Tables

Run the following SQL in the Supabase SQL Editor (**SQL Editor** > **New Query**) to create all required tables:

### 1. Create Profiles Table (extends Supabase Auth users)

```sql
-- profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text unique,
  role text default 'user',
  balance numeric default 0.00,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index for email lookup
create index if not exists idx_profiles_email on public.profiles(email);

-- Enable RLS
alter table public.profiles enable row level security;
```

### 2. Create Master Categories Table

```sql
-- master_categories table (system-wide categories)
create table if not exists public.master_categories (
  id bigserial primary key,
  name text unique not null,
  icon text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Sample categories
insert into public.master_categories (name, icon, is_default) values
  ('Food & Dining', 'fa-utensils', true),
  ('Transportation', 'fa-car', true),
  ('Utilities', 'fa-lightbulb', true),
  ('Entertainment', 'fa-film', true),
  ('Shopping', 'fa-shopping-bag', true),
  ('Healthcare', 'fa-hospital', true),
  ('Education', 'fa-book', true),
  ('Other', 'fa-tag', true)
on conflict do nothing;

alter table public.master_categories enable row level security;
```

### 3. Create User Categories Table

```sql
-- user_categories table (user-specific category settings)
create table if not exists public.user_categories (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id bigint not null references public.master_categories(id) on delete cascade,
  is_custom boolean default false,
  budget_limit numeric default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, category_id)
);

create index if not exists idx_user_categories_user on public.user_categories(user_id);
alter table public.user_categories enable row level security;
```

### 4. Create Expenses Table

```sql
-- expenses table
create table if not exists public.expenses (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id bigint not null references public.master_categories(id),
  amount numeric not null,
  expense_date date,
  payment_method text default 'Cash',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_expenses_user on public.expenses(user_id);
create index if not exists idx_expenses_category on public.expenses(category_id);
create index if not exists idx_expenses_date on public.expenses(expense_date);
alter table public.expenses enable row level security;
```

### 5. Create Transactions Table

```sql
-- transactions table (unified ledger)
create table if not exists public.transactions (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  transaction_type text not null, -- 'income' or 'expense'
  category text,
  payment_method text default 'Cash',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_transactions_user on public.transactions(user_id);
create index if not exists idx_transactions_type on public.transactions(transaction_type);
create index if not exists idx_transactions_created on public.transactions(created_at);
alter table public.transactions enable row level security;
```

### 6. Create Category Budgets Table

```sql
-- category_budgets table (monthly budget per category)
create table if not exists public.category_budgets (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id bigint not null references public.master_categories(id),
  limit_amount numeric not null,
  budget_month int not null, -- 1-12
  budget_year int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, category_id, budget_month, budget_year)
);

create index if not exists idx_category_budgets_user on public.category_budgets(user_id);
alter table public.category_budgets enable row level security;
```

### 7. Create Activity Logs Table

```sql
-- activity_logs table
create table if not exists public.activity_logs (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_activity_logs_user on public.activity_logs(user_id);
alter table public.activity_logs enable row level security;
```

## Row Level Security (RLS) Policies

RLS ensures users can only access their own data. Apply these policies:

### Profiles Policies

```sql
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow insert during signup (handled via trigger)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
```

### User Categories Policies

```sql
-- Users can view their own categories
create policy "Users can view own categories"
  on public.user_categories for select
  using (auth.uid() = user_id);

-- Users can modify their own categories
create policy "Users can insert own categories"
  on public.user_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.user_categories for update
  using (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.user_categories for delete
  using (auth.uid() = user_id);
```

### Expenses Policies

```sql
-- Users can view their own expenses
create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

-- Users can insert their own expenses
create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

-- Users can update their own expenses
create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

-- Users can delete their own expenses
create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
```

### Transactions Policies

```sql
-- Users can view their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Users can insert their own transactions
create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Users can update their own transactions
create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

-- Users can delete their own transactions
create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);
```

### Category Budgets Policies

```sql
-- Users can view their own budgets
create policy "Users can view own budgets"
  on public.category_budgets for select
  using (auth.uid() = user_id);

-- Users can insert their own budgets
create policy "Users can insert own budgets"
  on public.category_budgets for insert
  with check (auth.uid() = user_id);

-- Users can update their own budgets
create policy "Users can update own budgets"
  on public.category_budgets for update
  using (auth.uid() = user_id);

-- Users can delete their own budgets
create policy "Users can delete own budgets"
  on public.category_budgets for delete
  using (auth.uid() = user_id);
```

### Activity Logs Policies

```sql
-- Users can view their own activity logs
create policy "Users can view own activity logs"
  on public.activity_logs for select
  using (auth.uid() = user_id);

-- Users can insert their own activity logs
create policy "Users can insert own activity logs"
  on public.activity_logs for insert
  with check (auth.uid() = user_id);
```

### Master Categories Policies (Public Read)

```sql
-- Everyone can view master categories
create policy "Everyone can view master categories"
  on public.master_categories for select
  using (true);
```

## Triggers (Optional but Recommended)

### Create Profile on Auth Signup

```sql
-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, balance, status)
  values (new.id, new.raw_user_meta_data->>'name', new.email, 'user', 0.00, 'active');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to call function on new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Environment Configuration

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Backend API URL (if using Django backend)
VITE_API_BASE_URL=http://localhost:8000
```

### Important Security Notes

⚠️ **Never commit `.env` to version control**

- Add `.env` to `.gitignore`
- The `VITE_SUPABASE_ANON_KEY` is intentionally public (client-side key)
- RLS policies protect your data, not the key
- Use environment variables from Supabase settings page only

## Running the Application

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create `.env` file with your Supabase credentials (see above).

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Authentication Flow

### Sign Up Process

1. User submits email, password, and name on the register form
2. Supabase Auth creates a new user account
3. Trigger automatically creates a profile record
4. User is logged in automatically
5. App redirects to dashboard

### Sign In Process

1. User submits email and password
2. Supabase Auth verifies credentials
3. App fetches user profile and updates localStorage
4. Session is maintained via Supabase cookie
5. User can browse protected routes

### Sign Out Process

1. User clicks logout button
2. Supabase Auth session is cleared
3. localStorage is cleared
4. User is redirected to home page

### Session Persistence

- Supabase automatically persists sessions using httpOnly cookies
- Refresh token is automatically handled by `@supabase/supabase-js`
- App checks session on mount and subscribes to auth state changes

## API Integration

### Authentication Service

Located in `src/services/api.ts`:

```typescript
import { authService } from '../services/api';

// Sign up
const result = await authService.register(name, email, password);

// Sign in
const result = await authService.login(email, password);

// Sign out
const result = await authService.logout();

// Password reset
const result = await authService.requestPasswordReset(email);

// Update password
const result = await authService.updatePassword(newPassword);

// Get current user profile
const result = await authService.getCurrentUserProfile();

// Update profile
const result = await authService.updateProfile({ name, email });
```

### Data Service

Located in `src/services/api.ts`:

```typescript
import { dataService } from '../services/api';

// Get dashboard summary
const result = await dataService.getDashboard();

// Get expenses
const expenses = await dataService.getExpenses();

// Add expense
const result = await dataService.addExpense({
  category_id: 1,
  amount: 50000,
  expense_date: '2024-01-15',
  payment_method: 'Cash'
});

// Get transactions
const transactions = await dataService.getTransactions();

// Add income
const result = await dataService.addIncome({
  amount: 100000,
  description: 'Salary',
  income_date: '2024-01-01'
});

// Get categories
const categories = await dataService.getCategories();

// Add category
const result = await dataService.addCategory('Custom Category', 50000);

// Get budget data
const budgets = await dataService.getBudgetData();

// Get report data
const report = await dataService.getReportData('2024-01');
```

### Custom Hooks

Use custom hooks for easier integration in components:

```typescript
import { useAuth, useAuthSession, useData } from '../hooks';

// Authentication
const { login, register, logout, error, loading } = useAuth();

// Session management
const { user, isAuthenticated, userRole, loading } = useAuthSession();

// Data operations
const { getDashboard, getExpenses, addExpense, error, loading } = useData();
```

## Protected Routes

Protected routes automatically redirect unauthenticated users to login:

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// With role-based access
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

## Troubleshooting

### "Supabase credentials missing" error

- Check that `.env` file exists in `frontend/` directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after updating `.env`

### "User profile not found" error

- Ensure the profile trigger is set up in Supabase
- Or manually insert profile record in Supabase dashboard

### "Row level security (RLS)" errors

- Check that RLS policies are enabled for the table
- Verify the policy conditions match your user_id
- Test with Supabase's Built-in SQL Editor

### Session not persisting

- Check browser's localStorage is not disabled
- Check that cookies are allowed for supabase.co domain
- Try clearing browser cache and localStorage

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [React Router Documentation](https://reactrouter.com/)

## Support

For issues with:
- **Supabase**: Check Supabase documentation or community forums
- **React/TypeScript**: Check React documentation
- **This App**: Review code comments and the API documentation in `backend/docs/API.md`
