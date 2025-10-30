# 🔧 Fix Login & Register Issues

## Problem
Login and Register are not working. This is usually due to:
1. Missing backend `.env` file
2. Backend not running
3. MongoDB connection issues
4. CORS issues

---

## ✅ Step-by-Step Fix

### Step 1: Create Backend `.env` File

The backend needs a `.env` file (not `.env.example`).

**Run this command:**
```bash
cd backend
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://sk245444_db_user:swxYrCkPNE0OTZyg@cluster0.47hztun.mongodb.net/dubai?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF
```

**Or manually create the file:**
1. Go to `backend/` folder
2. Create a new file named `.env` (with the dot)
3. Copy this content:

```env
MONGODB_URI=mongodb+srv://sk245444_db_user:swxYrCkPNE0OTZyg@cluster0.47hztun.mongodb.net/dubai?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345_change_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

### Step 2: Verify Backend Dependencies

```bash
cd backend
npm install
```

---

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running in development mode on port 5000
MongoDB Connected: cluster0.47hztun.mongodb.net
```

**If you see errors:**
- ❌ `uri parameter must be a string` → `.env` file missing or not loaded
- ❌ `MongoServerError` → Check MongoDB Atlas credentials
- ❌ `EADDRINUSE` → Port 5000 is already in use

---

### Step 4: Test Backend API

Open a new terminal and run:

```bash
curl http://localhost:5000/api
```

**Expected response:**
```json
{"status":"OK","message":"DubAI Backend API is running"}
```

---

### Step 5: Verify Frontend `.env`

Check if `/Users/sandeep/Desktop/moves conveter/hindi-dub-ai/.env` exists and contains:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 6: Start Frontend

```bash
# From project root
npm run dev
```

---

### Step 7: Test Login/Signup

1. Open `http://localhost:5173`
2. Click **"Sign Up"**
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
4. Click **"Create account"**

**What should happen:**
- ✅ Success toast notification
- ✅ Redirect to `/dashboard`
- ✅ Navbar shows your name

---

## 🐛 Debugging Steps

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for errors

**Common errors:**

#### Error: "Failed to fetch"
**Cause:** Backend not running  
**Fix:** Start backend with `npm run dev`

#### Error: "CORS policy"
**Cause:** CORS misconfiguration  
**Fix:** Check `FRONTEND_URL` in backend `.env`

#### Error: "Network request failed"
**Cause:** Wrong API URL  
**Fix:** Check `VITE_API_URL` in frontend `.env`

---

### Check Network Tab

1. Open DevTools → **Network** tab
2. Try to signup/login
3. Look for the request to `/api/auth/signup` or `/api/auth/login`

**Check:**
- ✅ Status Code: Should be `201` (signup) or `200` (login)
- ❌ Status Code: `404` → Backend route not found
- ❌ Status Code: `400` → Validation error
- ❌ Status Code: `500` → Server error

**Click on the request and check:**
- **Request URL:** Should be `http://localhost:5000/api/auth/signup`
- **Request Headers:** Should include `Content-Type: application/json`
- **Request Payload:** Should show your form data
- **Response:** Check the error message

---

### Check Backend Logs

Look at the terminal where backend is running. You should see:
- Incoming requests
- Any errors
- MongoDB queries

---

## 🔍 Common Issues & Solutions

### Issue 1: "uri parameter must be a string"
**Solution:** Create `.env` file in `backend/` folder

### Issue 2: "MongoServerError: bad auth"
**Solution:** Check MongoDB Atlas username/password in `MONGODB_URI`

### Issue 3: "User already exists"
**Solution:** Try a different email or use login instead

### Issue 4: "Invalid email or password"
**Solution:** Check credentials or signup first

### Issue 5: Backend crashes immediately
**Solution:** 
1. Check if `.env` file exists
2. Verify all environment variables are set
3. Check MongoDB connection string

### Issue 6: CORS error in browser
**Solution:** 
1. Ensure backend is running
2. Check `FRONTEND_URL` in backend `.env`
3. Restart backend server

---

## ✅ Verification Checklist

- [ ] Backend `.env` file exists with correct values
- [ ] Backend running on port 5000
- [ ] MongoDB connected successfully
- [ ] `curl http://localhost:5000/api` returns OK
- [ ] Frontend `.env` has correct API URL
- [ ] Frontend running on port 5173
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

---

## 🎯 Quick Test Script

Run this to test everything:

```bash
# Test backend health
curl http://localhost:5000/api

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📞 Still Not Working?

1. **Stop both servers** (Ctrl+C)
2. **Delete `node_modules` in backend:**
   ```bash
   cd backend
   rm -rf node_modules
   npm install
   ```
3. **Restart backend:**
   ```bash
   npm run dev
   ```
4. **Clear browser cache and localStorage:**
   - Open DevTools → Application → Local Storage → Clear
5. **Try again**

---

## 🎉 Success Indicators

When everything works, you should see:

**Backend Terminal:**
```
Server running in development mode on port 5000
MongoDB Connected: cluster0.47hztun.mongodb.net
POST /api/auth/signup 201 - 234ms
```

**Browser:**
- ✅ Success toast: "Your account has been created successfully"
- ✅ Redirected to `/dashboard`
- ✅ Navbar shows your name with dropdown
- ✅ Dashboard displays your information

**Browser Console:**
- ✅ No errors
- ✅ API calls successful (200/201 status codes)
