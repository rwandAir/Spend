# Migration Plan: Spend Wisely

This document outlines the phased migration of the "Spend Wisely" platform from its current PHP/HTML/JS stack to a modern React + TypeScript frontend and eventually a Django REST API backend.

## 🚨 Migration Principles
1. **Visual Fidelity**: Maintain exact layout, colors, and typography.
2. **Behavioral Consistency**: Keep all workflows, validation logic, and features identical.
3. **Contract Preservation**: The React app will initially communicate with existing PHP endpoints.

---

## 1. Project Setup
- [x] Initialize React + TypeScript app using Vite
- [x] Configure `tsconfig.json` for strict type checking
- [x] Setup Folder Structure
- [x] Install Core Dependencies:
    - `react-router-dom` (Routing)
    - `axios` (API requests)
    - `lucide-react` or `font-awesome` (Icons)
    - `chart.js` / `react-chartjs-2` (Reports)
- [x] Setup Global CSS with existing variables (`--blue`, `--ink`, etc.)

---

## 2. TypeScript Types (`types/index.ts`)
- [x] Define `User` interface (id, name, email, role, balance)
- [x] Define `Category` interface (id, name, icon, color, is_default)
- [x] Define `Expense` interface (id, user_id, category_id, amount, date, payment_method)
- [x] Define `Income` interface (id, user_id, amount, description, date, payment_method)
- [x] Define `Transaction` interface (combined view for history)
- [x] Define `Budget` interface (category_id, limit, spent, remaining)
- [x] Define `ReportData` interface for charts

---

## 3. API Integration Layer (`services/api.ts`)
- [x] Configure Axios instance with `withCredentials: true` for session handling
- [x] Implement Auth Services:
    - `login(email, password)`
    - `register(name, email, password)`
    - `logout()`
- [x] Implement Data Services:
    - `getDashboard()`
    - `addExpense(data)`
    - `getExpenses()`
    - `addIncome(data)`
    - `getTransactions()`
    - `getBudgetData()`
    - `addCategory(name, limit)`
    - `getReportData(params)`

---

## 4. Reusable Components
- [x] **Navbar**: Logo, User Info, Balance display
- [x] **Sidebar**: Navigation links with active states
- [x] **StatsCard**: Reusable card for Income, Expense, and Balance
- [x] **Layout**: Wrapper component for authenticated pages
- [x] **TransactionList**: Table/List view for history with icons
- [x] **Modal**: Base modal component for "About Us" and forms
- [x] **FormField**: Styled input wrapper with validation labels
- [x] **ProtectedPath**: Wrapper component for authenticated routes

---

## 5. Page Migration Tasks

### Landing Page (`LandingPage.tsx`)
- [x] Port Hero section and Features grid from `index.html`
- [x] Implement smooth scrolling for internal links

### Auth Page (`AuthPage.tsx`)
- [x] Port Login and Registration forms from `login.html`
- [x] Implement tab switching logic (Login vs Register)
- [x] Handle `?tab=register` query parameter

### Dashboard (`DashboardPage.tsx`)
- [x] Port Welcome card and Stats grid
- [x] Implement "Add Income" form logic
- [x] Fetch and display "Recent Transactions"

### Expenses Page (`ExpensesPage.tsx`)
- [x] Implement Category selection logic
- [x] Port Expense entry form with date/payment method selectors
- [x] Display monthly category usage bars

### Budget Page (`BudgetPage.tsx`)
- [x] Implement Category list with editable budget limits
- [x] Port progress bars and "Remaining Budget" calculations

### Transactions Page (`TransactionsPage.tsx`)
- [x] Implement full transaction history table
- [x] Port filter/search logic if applicable

### Reports Page (`ReportsPage.tsx`)
- [x] Integrate Chart.js for spending breakdowns
- [x] Port date range selection and PDF export placeholder

---

## 6. Routing & Auth State
- [ ] Configure `BrowserRouter` and `Routes`
- [ ] Implement `AuthContext` to manage `user` and `balance` globally
- [ ] Setup Private Routes for all pages except Landing and Auth
- [ ] Port redirection logic (e.g., admin role redirect to PHP admin panel initially)

---

## 7. Form & Error Handling
- [ ] Convert all forms to controlled components (`useState`)
- [ ] Implement client-side validation (matching existing logic)
- [ ] Create global `Toaster` or `Alert` component for API feedback

---

## 8. Security & Optimization
- [ ] Migrate from `localStorage` to `HttpOnly` sessions where possible
- [ ] Sanitize all user inputs before API submission
- [ ] Implement loading skeletons for better UX during data fetching

---

## 9. Future Django Integration Preparation
- [ ] Abstract API endpoints into a `CONFIG.ts` file
- [ ] Plan for JWT migration (Bearer tokens in Axios interceptors)
- [ ] Ensure API response shapes remain consistent during PHP -> Django transition

---

## 10. Testing & Validation
- [ ] Unit test utility functions (currency formatting, date parsing)
- [ ] Component testing for key UI elements
- [ ] Visual regression check: Compare React app vs current PHP app side-by-side
