# Quick Start Guide - Spend Wisely + Supabase

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Environment (1 min)
```bash
cd frontend
cat .env
```
Should show your Supabase credentials. ✓

### Step 2: Install Dependencies (2 min)
```bash
npm install
```

### Step 3: Set Up Supabase Database (1 min)
1. Log in to [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy all SQL from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. Paste into SQL editor and execute
5. All tables created ✓

### Step 4: Start Development (1 min)
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

## ✅ Test It Works

### Create Account
1. Click "Create Account"
2. Enter name, email, password
3. Should redirect to dashboard ✓

### Add Expense
1. Go to Expenses
2. Add an expense with amount and category
3. Balance should update ✓

### View Data
1. Go to Dashboard - see updated balance
2. Go to Transactions - see transaction list
3. Go to Budget - see budget allocation ✓

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | Your Supabase credentials |
| `src/services/api.ts` | All auth & data operations |
| `src/hooks/*.ts` | Custom hooks for easy usage |
| `SUPABASE_SETUP.md` | Complete database setup |
| `frontend/README.md` | Full documentation |

## 🔧 Common Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for linting issues
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 🆘 Quick Troubleshooting

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Can't log in
- Check Supabase tables exist
- Check email is correct
- Check browser console for errors

### Balance not updating
- Check RLS policies are enabled
- Check user_id matches in database

## 📚 Full Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Database schema & RLS policies
- **[frontend/README.md](./frontend/README.md)** - Build, deploy, API reference
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Implementation details

## 🎯 What's Included

✅ Complete Supabase authentication
✅ Full CRUD operations
✅ Session persistence
✅ Protected routes
✅ Custom hooks
✅ TypeScript types
✅ Error handling
✅ Loading states
✅ RLS security
✅ Activity logging

## 🚀 Ready?

```bash
cd frontend
npm install
npm run dev
```

That's it! Your Spend Wisely app is ready with Supabase! 🎉
