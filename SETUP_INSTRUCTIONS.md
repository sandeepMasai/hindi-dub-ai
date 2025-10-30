# 🚀 Complete Setup Instructions - Hindi Dub AI

## ✅ Your System Status

Based on your recent actions:
- ✅ **Backend Server** - Running on port 6000
- ✅ **MongoDB** - Connected successfully
- ✅ **FFmpeg** - Installed (version 8.0)
- ✅ **Node.js** - Working
- ✅ **Dependencies** - Installed

---

## 🔧 Final Setup Steps

### **Step 1: Create .env File** (2 minutes)

Create a file named `.env` in the `backend/` directory:

```bash
cd backend
touch .env
```

Copy this content into `backend/.env`:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your_actual_connection_string_here

# JWT Configuration
JWT_SECRET=hindi_dub_ai_super_secret_key_2024_change_this_in_production

# Server Configuration
PORT=6000
NODE_ENV=development

# AI API Keys
ELEVENLABS_API_KEY=sk_909dce2aa52a5d2b106122e74332dcf7e79bf3346e48afd3
WAV2LIP_API_KEY=sk-Kc5-RxKFRtqJ8krsHMIPKw.Qoqz4SbQRSze-3gjsN8X_FPtlRbboEaw

# Optional: For full functionality
OPENAI_API_KEY=your_openai_key_here
GOOGLE_TRANSLATE_API_KEY=your_google_key_here

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

**Replace** `MONGODB_URI` with your actual MongoDB connection string from the server startup logs.

---

### **Step 2: Start Backend Server** (1 minute)

```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 6000
MongoDB Connected: [your-cluster-name]
```

✅ **Backend is ready!**

---

### **Step 3: Start Frontend** (1 minute)

Open a **new terminal** window:

```bash
cd hindi-dub-ai
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:8080/
```

✅ **Frontend is ready!**

---

## 🧪 Test the Complete Flow

### **1. Open the App**
- Go to: http://localhost:8080
- You should see the landing page

### **2. Sign Up / Login**
- Click "Get Started" or "Login"
- Create a new account:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123456

### **3. Upload a Video**
- On the home page, scroll to "Try It Now"
- Click "Browse Files" or drag & drop a video
- **Recommended:** Use a short video (10-30 seconds) for testing
- Select languages:
  - Source: English
  - Target: Hindi (हिंदी)
- Click "Start Dubbing"

### **4. Watch Processing**
- You'll be redirected to `/dubbing` page
- Watch real-time progress through 6 steps:
  1. ✅ Uploading Video
  2. 🔄 Extracting Audio
  3. 🔄 Translation
  4. 🔄 Voice Synthesis
  5. 🔄 Lip Sync
  6. 🔄 Final Rendering
- Progress bar updates every 2 seconds
- Estimated time: 5-8 minutes

### **5. Download Result**
- When progress reaches 100%
- Click "Download Video" button
- File downloads as `dubbed_[filename].mp4`

---

## 🎯 Current Functionality

### **✅ Fully Working:**
- User authentication (signup/login)
- Video file upload (drag & drop)
- Language selection (15+ languages)
- Payment page (UI ready)
- Real-time progress tracking
- Download functionality
- Responsive design
- Protected routes

### **🔄 Simulated (for testing):**
- Audio extraction (simulated 2s)
- Speech-to-text (simulated 3s)
- Translation (simulated 3s)
- Voice synthesis (ElevenLabs API ready)
- Lip sync (Wav2Lip API ready)
- Final rendering (simulated 2s)

### **🔑 Needs API Keys for Full Functionality:**
- OpenAI Whisper (speech-to-text)
- Google Translate (translation)
- Wav2Lip endpoint configuration

---

## 📊 API Endpoints

### **Authentication:**
```
POST   /api/auth/signup     - Create account
POST   /api/auth/login      - Login
GET    /api/auth/me         - Get current user
```

### **Videos:**
```
POST   /api/videos/upload   - Upload video
GET    /api/videos/:id      - Get video status
GET    /api/videos          - Get user videos
GET    /api/videos/:id/download - Download video
DELETE /api/videos/:id      - Delete video
```

### **Plans:**
```
GET    /api/plans           - Get all plans
POST   /api/plans           - Create plan (admin)
```

### **Payments:**
```
POST   /api/payments/process - Process payment
GET    /api/payments/history - Payment history
```

---

## 🔍 Testing with Postman

### **1. Sign Up:**
```http
POST http://localhost:6000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123456"
}
```

### **2. Login:**
```http
POST http://localhost:6000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123456"
}
```

Response will include `token` - copy it!

### **3. Upload Video:**
```http
POST http://localhost:6000/api/videos/upload
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

file: [select video file]
sourceLanguage: en
targetLanguage: hi
```

### **4. Check Status:**
```http
GET http://localhost:6000/api/videos/VIDEO_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🐛 Troubleshooting

### **Backend Issues:**

**Port already in use:**
```bash
# Kill process on port 6000
lsof -ti:6000 | xargs kill -9

# Restart
npm run dev
```

**MongoDB connection error:**
- Check your connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Check username/password are correct

**Mongoose duplicate index warning:**
- This is just a warning, not an error
- App will work fine
- To fix: Remove duplicate index in Payment model

### **Frontend Issues:**

**Can't connect to backend:**
- Ensure backend is running on port 6000
- Check browser console for errors
- Verify CORS is enabled

**Upload not working:**
- Check file size (max 100MB)
- Ensure file is a video format
- Check browser console for errors

**Progress not updating:**
- Check backend logs
- Verify video ID is correct
- Check network tab for API calls

---

## 📁 Project Structure

```
hindi-dub-ai/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── videoController.js    # Video processing
│   │   ├── planController.js     # Plans logic
│   │   └── paymentController.js  # Payment logic
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Video.js              # Video schema
│   │   ├── Plan.js               # Plan schema
│   │   └── Payment.js            # Payment schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes
│   │   ├── videos.js             # Video routes
│   │   ├── planRoutes.js         # Plan routes
│   │   └── payments.js           # Payment routes
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── uploads/                  # Uploaded videos
│   │   └── processed/            # Processed videos
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example env file
│   ├── package.json              # Dependencies
│   └── server.js                 # Entry point
│
├── src/
│   ├── pages/
│   │   ├── Index.tsx             # Landing page
│   │   ├── Login.tsx             # Login page
│   │   ├── Signup.tsx            # Signup page
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── Payment.tsx           # Payment page
│   │   ├── DubbingPage.tsx       # Processing page ⭐
│   │   ├── HowItWorksPage.tsx    # How it works
│   │   └── NotFound.tsx          # 404 page
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation
│   │   ├── Hero.tsx              # Hero section
│   │   ├── UploadSection.tsx     # Upload interface ⭐
│   │   ├── HowItWorks.tsx        # Process steps
│   │   ├── Pricing.tsx           # Pricing cards
│   │   ├── Footer.tsx            # Footer
│   │   └── ProtectedRoute.tsx    # Route protection
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth state
│   └── App.tsx                   # Main app
│
└── Documentation/
    ├── PROJECT_STATUS.md
    ├── VIDEO_API_GUIDE.md
    ├── PAYMENT_SYSTEM_GUIDE.md
    ├── DUBBING_PAGE_GUIDE.md
    ├── WAV2LIP_INTEGRATION.md
    └── ELEVENLABS_TTS_INTEGRATION.md
```

---

## 🎬 Video Processing Flow

```
┌─────────────────────────────────────┐
│  1. User uploads video              │
│     - File validation               │
│     - Size check (max 100MB)        │
│     - Format check (video/*)        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  2. Video saved to uploads/         │
│     - Unique filename               │
│     - MongoDB record created        │
│     - Status: "processing"          │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  3. Background processing starts    │
│     - Extract audio (FFmpeg)        │
│     - Speech-to-text (Whisper)      │
│     - Translate (Google)            │
│     - Generate voice (ElevenLabs)   │
│     - Lip sync (Wav2Lip)            │
│     - Render final (FFmpeg)         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  4. Frontend polls status           │
│     - Every 2 seconds               │
│     - Updates progress bar          │
│     - Updates step statuses         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  5. Processing complete             │
│     - Status: "completed"           │
│     - Progress: 100%                │
│     - Download button appears       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  6. User downloads video            │
│     - File: dubbed_[filename].mp4   │
│     - Saved to processed/           │
└─────────────────────────────────────┘
```

---

## 🎉 You're All Set!

Your video dubbing platform is now fully configured and ready to use!

### **What Works Right Now:**
✅ Complete authentication system  
✅ Video upload with drag & drop  
✅ Language selection (15+ languages)  
✅ Real-time progress tracking  
✅ Download functionality  
✅ Payment page (UI)  
✅ User dashboard  
✅ Responsive design  

### **To Make It Production-Ready:**
1. Get OpenAI API key for Whisper
2. Get Google Translate API key
3. Configure Wav2Lip endpoint
4. Set up payment gateway
5. Deploy to production server

---

## 📞 Need Help?

- **Backend logs:** Check terminal running `npm run dev` in backend/
- **Frontend logs:** Check browser console (F12)
- **API testing:** Use Postman or curl
- **Documentation:** Check the guides in the project root

---

**Happy Dubbing!** 🎬✨
