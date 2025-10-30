# 📝 Add Custom Pricing Plans

## ✅ Updated Plan Format

The pricing system now supports:
- ✅ `description` - Plan description text
- ✅ `cta` - Custom button text (Call-to-Action)

---

## 🚀 Add New Plan with Full Details

### Example: Add "Starter" Plan

```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Starter",
    "price": 999,
    "currency": "₹",
    "duration": "month",
    "description": "Individual creators और small projects के लिए perfect",
    "features": [
      "10 videos per month",
      "Up to 30 minutes each",
      "HD quality output",
      "Basic lip-sync",
      "Email support",
      "Standard processing"
    ],
    "cta": "Start Free Trial",
    "isPopular": false,
    "order": 2
  }'
```

---

## 📋 Complete Plan Schema

```json
{
  "name": "Plan Name",           // Required: Plan title
  "price": 999,                  // Required: Price (use 0 for free)
  "currency": "₹",               // Optional: Default "₹"
  "duration": "month",           // Optional: Default "month"
  "description": "Description",  // Optional: Shown below plan name
  "features": [                  // Required: Array of features
    "Feature 1",
    "Feature 2"
  ],
  "cta": "Button Text",          // Optional: Custom button text
  "isPopular": true,             // Optional: Show "Most Popular" badge
  "order": 1                     // Optional: Display order (lower = first)
}
```

---

## 🎯 Examples

### 1. Free Plan
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Free",
    "price": 0,
    "description": "Perfect for trying out our service",
    "features": [
      "5 minutes dubbing per month",
      "Basic voice quality",
      "Watermark on output"
    ],
    "cta": "Get Started",
    "isPopular": false,
    "order": 1
  }'
```

### 2. Pro Plan (Popular)
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pro",
    "price": 999,
    "currency": "₹",
    "duration": "month",
    "description": "Individual creators और small projects के लिए perfect",
    "features": [
      "60 minutes dubbing per month",
      "High-quality voice cloning",
      "Fast processing",
      "No watermark",
      "Priority support"
    ],
    "cta": "Start Free Trial",
    "isPopular": true,
    "order": 2
  }'
```

### 3. Enterprise Plan
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise",
    "price": 4999,
    "description": "Studios और large-scale operations के लिए",
    "features": [
      "Unlimited dubbing",
      "Premium voice quality",
      "24/7 priority support",
      "API access",
      "Custom voice training"
    ],
    "cta": "Contact Sales",
    "isPopular": false,
    "order": 3
  }'
```

### 4. Annual Plan
```bash
curl -X POST http://localhost:5000/api/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pro Annual",
    "price": 9999,
    "currency": "₹",
    "duration": "year",
    "description": "Save 20% with annual billing",
    "features": [
      "All Pro features",
      "720 minutes per year",
      "Priority support",
      "2 months free"
    ],
    "cta": "Save 20% Now",
    "isPopular": true,
    "order": 3
  }'
```

---

## 🔄 Update Existing Plan

### Update Description and CTA

```bash
# First, get the plan ID
curl http://localhost:5000/api/plans

# Then update with the ID
curl -X PUT http://localhost:5000/api/plans/PLAN_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "description": "New description here",
    "cta": "New Button Text"
  }'
```

### Update Price and Make Popular

```bash
curl -X PUT http://localhost:5000/api/plans/PLAN_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1299,
    "isPopular": true
  }'
```

---

## 🎨 How It Looks on Frontend

### With Description:
```
┌─────────────────────────────────┐
│         Pro                     │
│  Individual creators और small  │
│  projects के लिए perfect       │
│                                 │
│      ₹999/month                 │
│                                 │
│  [Start Free Trial]             │
│                                 │
│  ✓ 60 minutes dubbing/month     │
│  ✓ High-quality voice cloning   │
│  ...                            │
└─────────────────────────────────┘
```

### Without Description:
```
┌─────────────────────────────────┐
│         Pro                     │
│                                 │
│      ₹999/month                 │
│                                 │
│  [Start Free Trial]             │
│                                 │
│  ✓ Features...                  │
└─────────────────────────────────┘
```

---

## 🔧 Field Details

### `description` (Optional)
- Shown below plan name
- Use for explaining who the plan is for
- Supports Hindi/English mix
- Keep it short (1-2 lines)

### `cta` (Optional)
- Custom button text
- If not provided, defaults to:
  - "Get Started" (for free plans)
  - "Start Free Trial" (for paid plans)
- Examples:
  - "Get Started"
  - "Start Free Trial"
  - "Contact Sales"
  - "Buy Now"
  - "Subscribe"

### `isPopular` (Optional)
- `true` = Shows "Most Popular" badge
- `false` = No badge (default)
- Only one plan should be popular

### `order` (Optional)
- Controls display order
- Lower number = appears first
- Example: 1, 2, 3, 4

---

## 📊 View All Plans

```bash
curl http://localhost:5000/api/plans
```

**Response includes:**
```json
[
  {
    "_id": "67200abc...",
    "name": "Pro",
    "price": 999,
    "currency": "₹",
    "duration": "month",
    "description": "Individual creators और small projects के लिए perfect",
    "features": [...],
    "cta": "Start Free Trial",
    "isPopular": true,
    "order": 2,
    "isActive": true,
    "createdAt": "2025-10-28T..."
  }
]
```

---

## 🗑️ Delete Plan

```bash
curl -X DELETE http://localhost:5000/api/plans/PLAN_ID_HERE
```

---

## ✅ Restart Backend

After making changes to the model, restart your backend:

```bash
cd backend
npm run dev
```

---

## 🎉 Test It

1. **Add a new plan** using the examples above
2. **Refresh browser** at `http://localhost:8080`
3. **Scroll to Pricing** section
4. **See your new plan** with description and custom button!

---

## 💡 Tips

- Keep descriptions short and clear
- Use Hindi/English mix for Indian audience
- Make only one plan "popular"
- Order plans logically (Free → Pro → Enterprise)
- Test button text for clarity
- Use descriptive CTAs ("Start Free Trial" > "Click Here")

---

**Your pricing system now supports rich, customizable plans!** 🚀
