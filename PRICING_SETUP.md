# 💰 Dynamic Pricing System Setup

## ✅ What's Been Added

### Backend
- ✅ **Plan Model** (`backend/models/Plan.js`) - MongoDB schema for pricing plans
- ✅ **Plan Controller** (`backend/controllers/planController.js`) - CRUD operations
- ✅ **Plan Routes** (`backend/routes/planRoutes.js`) - API endpoints
- ✅ **Server Integration** - Routes added to main server

### Frontend
- ✅ **Dynamic Pricing Component** - Fetches plans from API
- ✅ **Loading State** - Shows spinner while loading
- ✅ **Error Handling** - Falls back to default plans if API fails
- ✅ **TypeScript Types** - Full type safety

---

## 🚀 Setup Instructions

### Step 1: Restart Backend Server

```bash
cd backend
npm run dev
```

### Step 2: Initialize Default Plans

Run this command **ONCE** to create default plans in MongoDB:

```bash
curl -X POST http://localhost:5000/api/plans/init
```

**Expected Response:**
```json
{
  "message": "Plans initialized successfully",
  "plans": [...]
}
```

### Step 3: Verify Plans

```bash
curl http://localhost:5000/api/plans
```

**You should see 3 plans:**
- Free (₹0/month)
- Pro (₹999/month)
- Enterprise (₹4999/month)

### Step 4: Check Frontend

1. Open `http://localhost:8080`
2. Scroll to **Pricing** section
3. Plans should load from the API ✅

---

## 📡 API Endpoints

### Get All Plans
```
GET /api/plans
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Free",
    "price": 0,
    "currency": "₹",
    "duration": "month",
    "features": [...],
    "isPopular": false,
    "order": 1
  }
]
```

### Get Single Plan
```
GET /api/plans/:id
```

### Create Plan (Admin)
```
POST /api/plans
Content-Type: application/json

{
  "name": "Custom Plan",
  "price": 1999,
  "currency": "₹",
  "duration": "month",
  "features": [
    "Feature 1",
    "Feature 2"
  ],
  "isPopular": false,
  "order": 4
}
```

### Update Plan (Admin)
```
PUT /api/plans/:id
Content-Type: application/json

{
  "price": 2999,
  "isPopular": true
}
```

### Delete Plan (Admin)
```
DELETE /api/plans/:id
```

---

## 🎨 Frontend Features

### Dynamic Loading
- Fetches plans from API on component mount
- Shows loading spinner during fetch
- Falls back to default plans if API fails

### Responsive Design
- 3-column grid on desktop
- Single column on mobile
- Hover effects and animations

### Popular Badge
- Shows "Most Popular" badge on popular plans
- Different styling for popular plans

---

## 🔧 Customization

### Add New Plan via API

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
      "Standard processing",
      "No watermark",
      "Email support"
    ],
    "isPopular": false,
    "order": 2
  }'
```

### Update Existing Plan

```bash
curl -X PUT http://localhost:5000/api/plans/PLAN_ID \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899,
    "isPopular": true
  }'
```

### Delete Plan

```bash
curl -X DELETE http://localhost:5000/api/plans/PLAN_ID
```

---

## 🎯 Plan Schema

```typescript
{
  name: string;           // Plan name (e.g., "Pro")
  price: number;          // Price in currency units
  currency: string;       // Currency symbol (default: "₹")
  duration: string;       // Billing period (default: "month")
  features: string[];     // Array of feature descriptions
  isPopular: boolean;     // Show "Most Popular" badge
  isActive: boolean;      // Show/hide plan (default: true)
  order: number;          // Display order (lower = first)
}
```

---

## 💡 Usage Examples

### Get Plans in Your Component

```tsx
import { useState, useEffect } from 'react';

const MyComponent = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  return (
    <div>
      {plans.map(plan => (
        <div key={plan._id}>
          <h3>{plan.name}</h3>
          <p>{plan.currency}{plan.price}/{plan.duration}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 🐛 Troubleshooting

### Plans Not Loading

**Check:**
1. Backend is running on port 5000
2. Plans are initialized in MongoDB
3. No CORS errors in browser console

**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000/api

# Check if plans exist
curl http://localhost:5000/api/plans

# Re-initialize plans if empty
curl -X POST http://localhost:5000/api/plans/init
```

### "Plans already initialized" Error

This is normal if you've already run the init endpoint. Your plans are already in the database.

### Frontend Shows Default Plans

This means the API call failed. Check:
- Backend is running
- CORS is configured correctly
- Network tab in browser DevTools for errors

---

## 🎉 Success Indicators

When everything works:

1. **Backend logs:**
   ```
   GET /api/plans 200 - 45ms
   ```

2. **Frontend:**
   - Shows loading spinner briefly
   - Displays 3 plans from database
   - No errors in console

3. **Browser Network Tab:**
   - Request to `/api/plans` returns 200
   - Response contains plan data

---

## 📝 Next Steps

1. ✅ Add authentication to admin routes
2. ✅ Create admin dashboard to manage plans
3. ✅ Add payment integration (Razorpay/Stripe)
4. ✅ Add subscription management
5. ✅ Track user plan selections

---

## 🚀 Quick Test

```bash
# 1. Start backend
cd backend && npm run dev

# 2. Initialize plans (run once)
curl -X POST http://localhost:5000/api/plans/init

# 3. Get plans
curl http://localhost:5000/api/plans

# 4. Open frontend
# Visit http://localhost:8080 and check Pricing section
```

**Done!** Your dynamic pricing system is ready! 🎊
