# Auth Context API - Usage Guide

## 📚 Overview

The `AuthContext` provides global authentication state management using React Context API.

## 🎯 Features

- Global user state management
- Login/Signup/Logout functions
- Persistent authentication (localStorage)
- Automatic token validation
- Easy access from any component

---

## 🚀 Usage

### Import the Hook

```tsx
import { useAuth } from "@/contexts/AuthContext";
```

### Access Auth State and Functions

```tsx
const MyComponent = () => {
  const { user, login, signup, logout, isAuthenticated, loading } = useAuth();
  
  // Your component logic
};
```

---

## 📖 API Reference

### `user`
- **Type**: `User | null`
- **Description**: Current logged-in user object
- **Properties**:
  - `_id`: User ID
  - `name`: User's name
  - `email`: User's email

```tsx
const { user } = useAuth();

if (user) {
  console.log(user.name);   // "John Doe"
  console.log(user.email);  // "john@example.com"
  console.log(user._id);    // "507f1f77bcf86cd799439011"
}
```

### `isAuthenticated`
- **Type**: `boolean`
- **Description**: Whether user is logged in

```tsx
const { isAuthenticated } = useAuth();

if (isAuthenticated) {
  return <DashboardView />;
} else {
  return <LoginPrompt />;
}
```

### `loading`
- **Type**: `boolean`
- **Description**: Loading state during initial auth check

```tsx
const { loading } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}
```

### `login(email, password)`
- **Type**: `(email: string, password: string) => Promise<void>`
- **Description**: Login user with email and password
- **Throws**: Error if login fails

```tsx
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login("user@example.com", "password123");
    // User is now logged in
    navigate("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### `signup(name, email, password)`
- **Type**: `(name: string, email: string, password: string) => Promise<void>`
- **Description**: Register new user
- **Throws**: Error if signup fails

```tsx
const { signup } = useAuth();

const handleSignup = async () => {
  try {
    await signup("John Doe", "john@example.com", "password123");
    // User is now registered and logged in
    navigate("/dashboard");
  } catch (error) {
    console.error("Signup failed:", error);
  }
};
```

### `logout()`
- **Type**: `() => void`
- **Description**: Logout current user and clear auth data

```tsx
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/");
};
```

---

## 💡 Example Components

### Protected Route Component

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
```

### User Profile Component

```tsx
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserProfile;
```

### Conditional Rendering

```tsx
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header>
      <h1>My App</h1>
      {isAuthenticated ? (
        <div>
          <span>Hello, {user?.name}</span>
          <button>Logout</button>
        </div>
      ) : (
        <div>
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      )}
    </header>
  );
};

export default Header;
```

### Login Form Component

```tsx
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

---

## ⚠️ Important Notes

1. **Always use inside AuthProvider**: The `useAuth` hook must be used inside components wrapped by `AuthProvider`.

2. **Error Handling**: Always wrap login/signup calls in try-catch blocks.

3. **Loading State**: Check the `loading` state before rendering auth-dependent content.

4. **Token Storage**: Auth tokens are stored in localStorage and automatically included in API requests.

5. **Automatic Persistence**: User stays logged in across page refreshes.

---

## 🔒 Security Best Practices

- Never log or expose JWT tokens
- Always use HTTPS in production
- Implement token refresh for long sessions
- Clear sensitive data on logout
- Validate user input before API calls

---

## 🐛 Common Issues

### "useAuth must be used within an AuthProvider"
**Solution**: Ensure your component is wrapped by `AuthProvider` in `App.tsx`.

### User state not persisting
**Solution**: Check if localStorage is enabled and not blocked.

### Login/Signup not working
**Solution**: 
- Verify backend is running
- Check API URL in `.env`
- Inspect network tab for errors
- Verify MongoDB connection

---

## 📞 Need Help?

Check the main `SETUP_GUIDE.md` for complete setup instructions and troubleshooting.
