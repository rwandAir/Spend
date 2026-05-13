<?php
session_start();
// If already logged in, redirect based on role
if (isset($_SESSION['user_id']) && isset($_SESSION['user_role'])) {
    if ($_SESSION['user_role'] === 'admin') {
        header('Location: admin/admin_dashboard.php');
    } else {
        header('Location: dashboard.html');
    }
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spend Wisely - Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 450px;
            padding: 40px;
        }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #667eea; font-size: 28px; }
        .logo span { color: #764ba2; }
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            background: #f0f0f0;
            padding: 5px;
            border-radius: 10px;
        }
        .tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s;
        }
        .tab.active { background: #667eea; color: white; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
        input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        }
        input:focus { outline: none; border-color: #667eea; }
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }
        .alert { padding: 12px; border-radius: 8px; margin-bottom: 20px; display: none; }
        .alert.error { background: #fee; color: #c33; border: 1px solid #fcc; display: block; }
        .alert.success { background: #efe; color: #3c3; border: 1px solid #cfc; display: block; }
        .form-panel { display: none; }
        .form-panel.active { display: block; }
        .info-text { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .info-text a { color: #667eea; text-decoration: none; }
    </style>
</head>
<body>
<div class="container">
    <div class="logo">
        <h1>Spend <span>Wisely</span></h1>
        <p>Smart Financial Management</p>
    </div>

    <div class="tabs">
        <div class="tab active" data-tab="login">Login</div>
        <div class="tab" data-tab="register">Register</div>
    </div>

    <div id="loginAlert" class="alert"></div>
    <div id="registerAlert" class="alert"></div>

    <!-- Login Form -->
    <div id="loginPanel" class="form-panel active">
        <form id="loginForm">
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="loginEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="loginPassword" placeholder="Enter your password" required>
            </div>
            <button type="submit">Sign In</button>
        </form>
    </div>

    <!-- Register Form -->
    <div id="registerPanel" class="form-panel">
        <form id="registerForm">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="regName" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="regEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="regPassword" placeholder="Create a password (min 4 characters)" required>
            </div>
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="regConfirmPassword" placeholder="Confirm your password" required>
            </div>
            <button type="submit">Create Account</button>
        </form>
    </div>

    <div class="info-text">
        <p>Demo Admin: <strong>admin@spendwisely.com</strong> / <strong>admin123</strong></p>
        <p>Demo User: <strong>user@spendwisely.com</strong> / <strong>user123</strong></p>
    </div>
</div>

<script>
    const AUTH_URL = 'http://localhost/spend_wisely/api/auth.php';

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('loginPanel').classList.toggle('active', tabName === 'login');
            document.getElementById('registerPanel').classList.toggle('active', tabName === 'register');
            document.getElementById('loginAlert').style.display = 'none';
            document.getElementById('registerAlert').style.display = 'none';
        });
    });

    // Login handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const alertDiv = document.getElementById('loginAlert');

        if (!email || !password) {
            alertDiv.className = 'alert error';
            alertDiv.textContent = 'Please enter email and password';
            return;
        }

        alertDiv.style.display = 'none';
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('sw_user_id', data.user_id);
                localStorage.setItem('sw_user_name', data.name);
                localStorage.setItem('sw_user_role', data.role);
                localStorage.setItem('sw_balance', data.balance);

                alertDiv.className = 'alert success';
                alertDiv.textContent = `Welcome back, ${data.name}! Redirecting...`;
                alertDiv.style.display = 'block';

                setTimeout(() => {
                    if (data.role === 'admin') {
                        window.location.href = 'admin/admin_dashboard.php';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                alertDiv.className = 'alert error';
                alertDiv.textContent = data.error || 'Login failed';
                alertDiv.style.display = 'block';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            alertDiv.className = 'alert error';
            alertDiv.textContent = 'Cannot connect to server. Make sure WAMP is running.';
            alertDiv.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Register handler
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const alertDiv = document.getElementById('registerAlert');

        if (!name || !email || !password) {
            alertDiv.className = 'alert error';
            alertDiv.textContent = 'Please fill in all fields';
            return;
        }

        if (password !== confirmPassword) {
            alertDiv.className = 'alert error';
            alertDiv.textContent = 'Passwords do not match';
            return;
        }

        if (password.length < 4) {
            alertDiv.className = 'alert error';
            alertDiv.textContent = 'Password must be at least 4 characters';
            return;
        }

        alertDiv.style.display = 'none';
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'register', name, email, password })
            });
            const data = await response.json();

            if (data.success) {
                alertDiv.className = 'alert success';
                alertDiv.textContent = `Account created! Welcome, ${data.name}! Redirecting...`;
                alertDiv.style.display = 'block';

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                alertDiv.className = 'alert error';
                alertDiv.textContent = data.error || 'Registration failed';
                alertDiv.style.display = 'block';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            alertDiv.className = 'alert error';
            alertDiv.textContent = 'Cannot connect to server. Make sure WAMP is running.';
            alertDiv.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
</script>
</body>
</html>