# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/dubai

# Start backend server
npm run dev
```

✅ Backend running on `http://localhost:5000`
---

## 🔧 Installation

### **1. Install Dependencies**

## 📝 MongoDB Atlas Setup (If Needed)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a **FREE M0 Cluster**
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Paste into `backend/.env` as `MONGODB_URI`

---

## 🔑 Key Files to Know

### Backend
- `backend/server.js` - Main server file
- `backend/.env` - Configuration (MongoDB, JWT secret)
- `backend/controllers/authController.js` - Login/Signup logic

### Frontend
- `src/contexts/AuthContext.tsx` - Global auth state
- `src/pages/Login.tsx` - Login page
- `src/pages/Signup.tsx` - Signup page
- `src/pages/Dashboard.tsx` - Protected dashboard
- `src/components/Navbar.tsx` - Navigation with auth

---

## 💻 Common Commands

```bash
# Start backend (from backend/)
npm run dev

# Start frontend (from root)
npm run dev

# Install new package (backend)
cd backend && npm install package-name

# Install new package (frontend)
npm install package-name
```

---

## 🎯 Using Auth in Your Components

```tsx
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};
```

---

## 🛡️ Creating Protected Routes

```tsx
// In App.tsx
import ProtectedRoute from "./components/ProtectedRoute";

<Route 
  path="/my-protected-page" 
  element={
    <ProtectedRoute>
      <MyProtectedPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check MongoDB connection string in `.env`
- ✅ Ensure MongoDB Atlas IP whitelist includes your IP
- ✅ Verify port 5000 is not in use

### Frontend can't connect to backend
- ✅ Ensure backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Clear browser cache and restart dev server

### Login/Signup not working
- ✅ Open browser console for errors
- ✅ Check Network tab for API responses
- ✅ Verify MongoDB is connected (check backend logs)

---

## 📚 Full Documentation

- **Complete Setup**: `SETUP_GUIDE.md`
- **Auth System Details**: `AUTHENTICATION_SUMMARY.md`
- **Context API Usage**: `src/contexts/README.md`
- **Backend API**: `backend/README.md`

---

## 🎉 You're Ready!

Your full-stack authentication system is up and running. Start building amazing features! 🚀

**Need help?** Check the documentation files above or review the code comments.
