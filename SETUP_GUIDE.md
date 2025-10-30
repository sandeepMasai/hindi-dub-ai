# DubAI - Complete Setup Guide

## 🎯 Overview

This is a full-stack application with:
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB Atlas
- **Authentication**: JWT + Context API

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

---

## 🚀 Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new cluster (M0 Sandbox - FREE)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string

#### Create Environment File

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/dubai?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `your_username`, `your_password`, and cluster URL with your actual MongoDB Atlas credentials.

#### Start Backend Server

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

---

### 2. Frontend Setup

#### Install Dependencies

```bash
# From project root
npm install
```

#### Create Environment File

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Server

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔐 Authentication Flow

### Context API Implementation

The app uses React Context API for global authentication state management:

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Manages user state globally
   - Provides login, signup, logout functions
   - Persists auth state in localStorage
   - Automatically checks authentication on app load

2. **AuthProvider** wraps the entire app in `App.tsx`

3. **useAuth Hook** - Use in any component:
   ```tsx
   import { useAuth } from "@/contexts/AuthContext";
   
   const MyComponent = () => {
     const { user, login, signup, logout, isAuthenticated } = useAuth();
     
     // Access user data
     console.log(user?.name, user?.email);
     
     // Check if logged in
     if (isAuthenticated) {
       // Show authenticated content
     }
   };
   ```

### Features

✅ **User Registration** (Signup)
- Name, email, password validation
- Password confirmation
- Minimum 6 characters
- Automatic login after signup

✅ **User Login**
- Email and password authentication
- JWT token generation
- Token stored in localStorage

✅ **Persistent Sessions**
- Auth state persists across page refreshes
- Automatic token validation

✅ **User Logout**
- Clears token and user data
- Redirects to home page

✅ **Protected UI**
- Navbar shows user info when logged in
- Dropdown menu with user email
- Logout button

---

## 📡 API Endpoints

### Authentication Routes

#### 1. Sign Up
```
POST /api/auth/signup
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### 3. Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <jwt_token>

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### 4. Health Check
```
GET /api/health

Response:
{
  "status": "OK",
  "message": "DubAI Backend API is running"
}
```

---

## 🏗️ Project Structure

```
hindi-dub-ai/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── authController.js     # Auth logic
│   ├── middleware/
│   │   └── auth.js               # JWT middleware
│   ├── models/
│   │   └── User.js               # User schema
│   ├── routes/
│   │   └── authRoutes.js         # Auth routes
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation with auth
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth Context API
│   ├── lib/
│   │   └── api.ts                # API functions
│   ├── pages/
│   │   ├── Index.tsx             # Home page
│   │   ├── Login.tsx             # Login page
│   │   └── Signup.tsx            # Signup page
│   ├── App.tsx                   # Main app with AuthProvider
│   └── main.tsx
│
├── .env                          # Frontend env vars
├── .env.example
└── package.json
```

---

## 🧪 Testing the Application

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Frontend

1. Open `http://localhost:5173`
2. Click **"Sign Up"** in navbar
3. Fill in the form and submit
4. You'll be redirected to home page
5. Navbar will show your name with a dropdown menu
6. Click dropdown to see email and logout option

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token authentication (30-day expiry)
- ✅ Protected API routes with middleware
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ Email validation
- ✅ Password minimum length (6 characters)
- ✅ Secure token storage in localStorage

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check your connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct

**Port Already in Use**
- Change `PORT` in backend `.env` file
- Kill the process using port 5000: `lsof -ti:5000 | xargs kill`

### Frontend Issues

**API Connection Error**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

**Context API Error**
- Ensure `AuthProvider` wraps your app in `App.tsx`
- Use `useAuth()` only inside components wrapped by `AuthProvider`

---

## 📝 Environment Variables Summary

### Backend (`.env`)
```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<random_secret_key>
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎉 You're All Set!

Your full-stack authentication system is ready. Users can now:
- ✅ Sign up with name, email, and password
- ✅ Login with email and password
- ✅ Stay logged in across page refreshes
- ✅ See their profile in the navbar
- ✅ Logout from the dropdown menu

The authentication state is managed globally using Context API, making it easy to access user data from any component in your app!
