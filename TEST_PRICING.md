# 🧪 Test Dynamic Pricing System

## ✅ Step-by-Step Testing Guide

### **Step 1: Ensure Backend is Running**

Open a terminal and run:
```bash
cd /Users/sandeep/Desktop/moves\ conveter/hindi-dub-ai/backend
npm run dev
```

**Expected output:**
```
Server running in development mode on port 5000
MongoDB Connected: cluster0.47hztun.mongodb.net
```

---

### **Step 2: Initialize Plans in Database**

In a **NEW terminal**, run this command **ONCE**:

```bash
curl -X POST http://localhost:5000/api/plans/init
```

**Expected response:**
```json
{
  "message": "Plans initialized successfully",
  "plans": [
    {
      "_id": "...",
      "name": "Free",
      "price": 0,
      ...
    },
    {
      "_id": "...",
      "name": "Pro",
      "price": 999,
      ...
    },
    {
      "_id": "...",
      "name": "Enterprise",
      "price": 4999,
      ...
    }
  ]
}
```

**If you see:** `"Plans already initialized"` - That's OK! Plans are already in the database.

---

### **Step 3: Verify Plans API**

Test the GET endpoint:

```bash
curl http://localhost:5000/api/plans
```

**You should see:**
```json
[
  {
    "_id": "67200abc123...",
    "name": "Free",
    "price": 0,
    "currency": "₹",
    "duration": "month",
    "features": [
      "5 minutes dubbing per month",
      "Basic voice quality",
      "Standard processing speed",
      "Watermark on output",
      "Email support"
    ],
    "isPopular": false,
    "isActive": true,
    "order": 1,
    "createdAt": "2025-10-28T..."
  },
  ...
]
```

---

### **Step 4: Start Frontend**

In another terminal:

```bash
cd /Users/sandeep/Desktop/moves\ conveter/hindi-dub-ai
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

---

### **Step 5: View Pricing in Browser**

1. Open your browser
2. Go to: `http://localhost:8080`
3. Scroll down to the **Pricing** section

**What you should see:**

✅ **3 Pricing Cards:**
- **Free** - ₹0/month
- **Pro** - ₹999/month (with "Most Popular" badge)
- **Enterprise** - ₹4999/month

✅ **Each card shows:**
- Plan name
- Price with currency
- Duration (per month)
- List of features with checkmarks
- "Get Started" or "Start Free Trial" button

✅ **Loading behavior:**
- Brief loading spinner when page loads
- Then pricing cards appear

---

### **Step 6: Check Browser Console**

1. Open DevTools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Should see **NO errors**

**Good signs:**
- No red errors
- No CORS errors
- No 404 errors

---

### **Step 7: Check Network Tab**

1. In DevTools, go to **Network** tab
2. Refresh the page
3. Look for request to: `plans`

**Click on it and verify:**
- **Status:** 200 OK ✅
- **Response:** Array of 3 plans
- **Type:** fetch/xhr

---

## 🎯 Visual Verification

Your pricing section should look like this:

```
┌─────────────────────────────────────────────┐
│        Simple Pricing                       │
│   हर budget के लिए perfect plan            │
└─────────────────────────────────────────────┘

┌──────────┐  ┌──────────────┐  ┌──────────┐
│  Free    │  │  Pro ⭐      │  │Enterprise│
│  ₹0      │  │  ₹999/month  │  │₹4999/mo  │
│          │  │ Most Popular │  │          │
│ Features │  │  Features    │  │ Features │
│ ✓ ...    │  │  ✓ ...       │  │ ✓ ...    │
│ [Button] │  │  [Button]    │  │ [Button] │
└──────────┘  └──────────────┘  └──────────┘
```

---

## 🐛 Troubleshooting

### Issue 1: Plans Not Loading (Shows Default Plans)

**Symptoms:**
- Pricing shows but with fallback data
- Console shows fetch error

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api

# Check plans endpoint
curl http://localhost:5000/api/plans

# If empty, initialize:
curl -X POST http://localhost:5000/api/plans/init
```

---

### Issue 2: CORS Error

**Symptoms:**
```
Access to fetch at 'http://localhost:5000/api/plans' from origin 
'http://localhost:8080' has been blocked by CORS policy
```

**Solution:**
Backend `server.js` should have:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
}));
```

Restart backend after fixing.

---

### Issue 3: 404 Not Found

**Symptoms:**
```
GET http://localhost:5000/api/plans 404 (Not Found)
```

**Solution:**
- Verify backend has `planRoutes` imported
- Check `server.js` has: `app.use('/api/plans', planRoutes);`
- Restart backend

---

### Issue 4: Empty Response []

**Symptoms:**
- API returns `[]` (empty array)
- No plans in database

**Solution:**
```bash
# Initialize plans
curl -X POST http://localhost:5000/api/plans/init
```

---

### Issue 5: Loading Forever

**Symptoms:**
- Spinner keeps spinning
- Plans never appear

**Solution:**
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify backend is running
4. Check API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

---

## ✨ Testing Dynamic Updates

### Test 1: Add New Plan

```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Starter",
    "price": 499,
    "currency": "₹",
    "duration": "month",
    "features": [
      "30 minutes dubbing per month",
      "Good voice quality",
      "Email support"
    ],
    "isPopular": false,
    "order": 2
  }'
```

**Refresh browser** - Should see 4 plans now!

---

### Test 2: Update Plan Price

```bash
# First, get plan ID from: curl http://localhost:5000/api/plans
# Then update:

curl -X PUT http://localhost:5000/api/plans/PLAN_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"price": 1299}'
```

**Refresh browser** - Price should be updated!

---

### Test 3: Mark Plan as Popular

```bash
curl -X PUT http://localhost:5000/api/plans/PLAN_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"isPopular": true}'
```

**Refresh browser** - Should see "Most Popular" badge!

---

## 📸 Screenshot Checklist

Take screenshots to verify:

- [ ] Pricing section loads without errors
- [ ] 3 pricing cards are visible
- [ ] "Most Popular" badge on Pro plan
- [ ] All features show with checkmarks
- [ ] Prices display correctly (₹0, ₹999, ₹4999)
- [ ] Buttons are clickable
- [ ] Responsive on mobile (check with DevTools)
- [ ] No console errors
- [ ] Network request shows 200 status

---

## 🎉 Success Criteria

✅ **Backend:**
- Server running on port 5000
- MongoDB connected
- Plans initialized in database
- `/api/plans` returns 3 plans

✅ **Frontend:**
- Pricing section visible
- Plans loaded from API
- No errors in console
- Responsive design works
- Loading state shows briefly

✅ **Integration:**
- Frontend fetches from backend
- CORS configured correctly
- Data displays properly
- Updates reflect immediately

---

## 📞 Quick Debug Commands

```bash
# Check backend health
curl http://localhost:5000/api

# Check plans
curl http://localhost:5000/api/plans

# Count plans
curl http://localhost:5000/api/plans | jq length

# Get specific plan
curl http://localhost:5000/api/plans/PLAN_ID

# Re-initialize (if needed)
curl -X POST http://localhost:5000/api/plans/init

# Delete all plans (careful!)
# Then re-initialize
```

---

## 🚀 Next Steps After Verification

Once everything works:

1. ✅ Add payment integration (Razorpay/Stripe)
2. ✅ Create admin dashboard to manage plans
3. ✅ Add user subscription tracking
4. ✅ Implement plan selection flow
5. ✅ Add checkout process

---

**Your dynamic pricing system is ready to test!** Follow the steps above to verify everything works correctly. 🎊
