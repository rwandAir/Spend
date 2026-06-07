# Spend Wisely - Frontend Application

A modern financial management application built with React, TypeScript, and Supabase. Track expenses, manage budgets, and visualize your spending patterns.

## 🚀 Features

- **User Authentication**: Secure sign-up, sign-in, password reset via Supabase Auth
- **Dashboard**: Real-time overview of income, expenses, and balance
- **Expense Tracking**: Log expenses with categories and payment methods
- **Budget Management**: Set and monitor budget limits per category
- **Transaction History**: View all income and expense transactions
- **Reports**: Visual spending analysis with charts
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Row-Level Security**: Enterprise-grade data protection

## 📋 Prerequisites

- Node.js 16+ and npm/yarn installed
- A Supabase account (free tier available at https://supabase.com)
- Supabase Project URL and Anon Key

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Spend/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project's **Settings > API** page.

## 📚 Setup Supabase

Before running the application, you need to set up the Supabase database.

**See [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) for detailed database schema and RLS policy setup.**

Quick steps:
1. Create a Supabase project at https://supabase.com
2. Copy your Project URL and Anon Key
3. Run the SQL scripts from SUPABASE_SETUP.md in your Supabase SQL Editor
4. Update your `.env` file with the credentials

## 🏃 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

## 🧪 Code Quality

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint -- --fix
```

### Type Checking

TypeScript is configured to check types during build:

```bash
npm run build  # Includes tsc type checking
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Sidebar.tsx        # Sidebar navigation
│   │   ├── Modal.tsx          # Modal component
│   │   ├── StatsCard.tsx      # Statistics card
│   │   ├── TransactionList.tsx # Transaction list
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── pages/                # Page components
│   │   ├── LandingPage.tsx    # Home page
│   │   ├── AuthPage.tsx       # Login/Register
│   │   ├── DashboardPage.tsx  # Dashboard
│   │   ├── ExpensesPage.tsx   # Expenses page
│   │   ├── BudgetPage.tsx     # Budget page
│   │   ├── TransactionsPage.tsx # Transactions
│   │   └── ReportsPage.tsx    # Reports page
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useAuthSession.ts # Session management
│   │   └── useData.ts        # Data operations
│   ├── services/             # Service layer
│   │   ├── supabaseClient.ts # Supabase configuration
│   │   └── api.ts            # API services (auth & data)
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # App entry point
│   ├── schema.ts             # TypeScript types
│   ├── App.css               # Global styles
│   └── index.css             # Base styles
├── public/                   # Static assets
├── .env                      # Environment variables (Git ignored)
├── .env.example              # Environment template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── eslint.config.js          # ESLint configuration
```

## 🔐 Authentication

### Sign Up

1. Navigate to `/auth?tab=register`
2. Enter name, email, and password
3. Click "Create Account"
4. Profile is automatically created in Supabase

### Sign In

1. Navigate to `/auth?tab=login` or `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to dashboard on success

### Password Reset

1. From login page, click "Forgot password?"
2. Enter your email
3. Check your email for reset link
4. Follow link to set new password

### Session Persistence

- Sessions automatically persist using httpOnly cookies
- Refresh tokens are automatically managed by Supabase
- Users remain logged in after browser refresh
- Session expires after 7 days of inactivity (default)

## 🔒 Security Features

### Environment Variables

- All sensitive credentials are stored in `.env`
- `.env` is never committed to version control
- Public API key (Anon Key) is safe to expose
- All data protection is enforced via RLS policies

### Row Level Security (RLS)

- Users can only access their own data
- Expenses, transactions, and budgets are user-scoped
- Database enforces permissions at the row level
- No cross-user data leakage is possible

### Protected Routes

- Unauthenticated users are redirected to login
- Route components check for valid session
- Admin routes can require specific roles
- Protected pages load with loading state

## 🎨 Styling

The application uses:
- **CSS**: Custom CSS with variables for theming
- **Tailwind-like utilities**: Utility classes for responsive design
- **Responsive**: Mobile-first approach with breakpoints
- **Dark theme**: Professional dark UI with accent colors

## 📦 Dependencies

### Core
- `react`: UI library
- `react-dom`: React DOM utilities
- `react-router-dom`: Client-side routing
- `typescript`: Type safety

### Supabase
- `@supabase/supabase-js`: Supabase SDK

### UI & Charts
- `lucide-react`: Icon library
- `chart.js`: Chart library
- `react-chartjs-2`: React wrapper for Chart.js

### HTTP
- `axios`: HTTP client (optional, can use Supabase queries instead)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel automatically deploys on push

### Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify settings
6. Deploy

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t spend-wisely .
docker run -p 3000:3000 spend-wisely
```

## 🐛 Troubleshooting

### "Supabase credentials missing" error

**Solution:**
- Verify `.env` file exists in `frontend/` directory
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart development server (`npm run dev`)

### Login/Register not working

**Solution:**
- Verify Supabase project is running
- Check network tab for API errors
- Ensure database tables exist (run SQL from SUPABASE_SETUP.md)
- Verify RLS policies are enabled

### Data not displaying

**Solution:**
- Check browser console for errors
- Verify user is logged in
- Check RLS policies in Supabase
- Ensure profile record exists for user

### CORS errors

**Solution:**
- This shouldn't happen with Supabase (handles CORS)
- If using custom API, configure CORS headers
- Check network tab for actual error

### Build errors

**Solution:**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist

# Rebuild
npm run build
```

## 📖 API Documentation

### Authentication Service

```typescript
import { authService } from '../services/api';

// Sign up
await authService.register(name, email, password);

// Sign in
await authService.login(email, password);

// Sign out
await authService.logout();

// Password reset
await authService.requestPasswordReset(email);

// Update password
await authService.updatePassword(newPassword);

// Get profile
await authService.getCurrentUserProfile();

// Update profile
await authService.updateProfile({ name, email });
```

### Data Service

```typescript
import { dataService } from '../services/api';

// Dashboard
await dataService.getDashboard();

// Expenses
await dataService.getExpenses();
await dataService.addExpense(expenseData);

// Income
await dataService.addIncome(incomeData);

// Transactions
await dataService.getTransactions();

// Categories
await dataService.getCategories();
await dataService.addCategory(name, budgetLimit);

// Budgets
await dataService.getBudgetData();

// Reports
await dataService.getReportData(month);
```

### Custom Hooks

```typescript
import { useAuth, useAuthSession, useData } from '../hooks';

// Authentication
const { login, register, logout, error, loading } = useAuth();

// Session
const { user, isAuthenticated, userRole, loading } = useAuthSession();

// Data
const { getDashboard, getExpenses, addExpense, error, loading } = useData();
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For issues or questions:
- Check [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) for setup issues
- Review code comments for implementation details
- Check browser console for errors
- Verify Supabase project configuration

## 🎯 Roadmap

- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Transaction tags
- [ ] Custom reports
- [ ] Data export (CSV, PDF)
- [ ] Mobile app (React Native)
- [ ] Collaborative budgets
- [ ] Spending alerts
- [ ] AI-powered insights
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
