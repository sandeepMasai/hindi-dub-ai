# Razorpay Payment Integration Guide

## Overview
This guide explains how to integrate and use Razorpay payment gateway in the Hindi Dub AI application.

## Configuration

### Backend Setup

1. **Environment Variables**
   - Add the following to your backend `.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_3Lxr4QmUc9qlvY
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   npm install razorpay
   ```

### Frontend Setup

1. **Environment Variables**
   - Add the following to your frontend `.env` file:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_3Lxr4QmUc9qlvY
   ```

2. **Razorpay Checkout Script**
   - The Razorpay checkout script needs to be loaded in your HTML:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

## API Endpoints

### 1. Create Razorpay Order
**Endpoint:** `POST /api/payments/create-order`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "amount": 999,
  "planName": "Basic"
}
```

**Response:**
```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 117882,
  "currency": "INR",
  "keyId": "rzp_test_3Lxr4QmUc9qlvY"
}
```

### 2. Verify Razorpay Payment
**Endpoint:** `POST /api/payments/verify`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "signature_string",
  "planName": "Basic",
  "amount": 999,
  "personalDetails": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210"
  }
}
```

**Response:**
```json
{
  "message": "Payment verified successfully",
  "payment": {
    "transactionId": "pay_xxxxxxxxxxxxx",
    "amount": 1178.82,
    "status": "completed",
    "planName": "Basic"
  }
}
```

## Frontend Integration Example

### Step 1: Create Order
```javascript
const createRazorpayOrder = async (planDetails) => {
  const token = localStorage.getItem("token");
  
  const response = await fetch("http://localhost:6000/api/payments/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: planDetails.price,
      planName: planDetails.name,
    }),
  });
  
  return await response.json();
};
```

### Step 2: Open Razorpay Checkout
```javascript
const handleRazorpayPayment = async (orderData, planDetails, personalDetails) => {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Hindi Dub AI",
    description: `${planDetails.name} Plan Subscription`,
    order_id: orderData.orderId,
    handler: async (response) => {
      // Payment successful, verify on backend
      await verifyPayment(response, planDetails, personalDetails);
    },
    prefill: {
      name: personalDetails.fullName,
      email: personalDetails.email,
      contact: personalDetails.phone,
    },
    theme: {
      color: "#8B5CF6",
    },
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

### Step 3: Verify Payment
```javascript
const verifyPayment = async (razorpayResponse, planDetails, personalDetails) => {
  const token = localStorage.getItem("token");
  
  const response = await fetch("http://localhost:6000/api/payments/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
      planName: planDetails.name,
      amount: planDetails.price,
      personalDetails,
    }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Payment verified successfully
    console.log("Payment successful:", data);
  }
};
```

## Testing

### Test Cards
Razorpay provides test cards for testing in test mode:

- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

### Test UPI
- **UPI ID:** success@razorpay

### Test Netbanking
- Select any bank and use the credentials provided on the test page

## Important Notes

1. **Security:**
   - Never expose your `RAZORPAY_KEY_SECRET` in frontend code
   - Always verify payments on the backend
   - Store only the last 4 digits of card numbers

2. **Amount Format:**
   - Razorpay expects amounts in paise (smallest currency unit)
   - Multiply rupee amount by 100 before sending to Razorpay

3. **Tax Calculation:**
   - The system automatically adds 18% GST to all payments
   - Total amount = Base amount + (Base amount × 0.18)

4. **Production Setup:**
   - Replace test keys with live keys from Razorpay Dashboard
   - Enable webhook notifications for payment status updates
   - Implement proper error handling and logging

## Webhook Setup (Optional)

To receive real-time payment updates:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Implement webhook handler in backend

## Support

For issues or questions:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/

## Current API Key

**Test Key ID:** `rzp_test_3Lxr4QmUc9qlvY`

⚠️ **Note:** This is a test key. Replace with production keys before going live.
