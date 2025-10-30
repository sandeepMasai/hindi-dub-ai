# 🎥 Video Upload & Dubbing API Guide

## ✅ What's Been Created

A complete backend API for video upload and English to Hindi dubbing conversion.

---

## 📋 Files Created

### **1. Video Model** (`backend/models/Video.js`)
- MongoDB schema for video records
- Tracks upload, processing, and completion
- Stores file paths, languages, progress

### **2. Video Controller** (`backend/controllers/videoController.js`)
- Upload handling
- Background processing
- Status tracking
- Download functionality

### **3. Video Routes** (`backend/routes/videos.js`)
- API endpoints
- Multer configuration
- File validation
- Authentication middleware

### **4. Updated Server** (`backend/server.js`)
- Added video routes
- Configured for file uploads

---

## 🚀 API Endpoints

### **1. Upload Video**
```
POST /api/videos/upload
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```javascript
{
  video: File,              // Video file
  sourceLanguage: "en",     // Source language code
  targetLanguage: "hi"      // Target language code
}
```

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "video": {
    "id": "video_id",
    "originalFileName": "movie.mp4",
    "sourceLanguage": "en",
    "targetLanguage": "hi",
    "status": "processing",
    "progress": 10
  }
}
```

---

### **2. Get Video Status**
```
GET /api/videos/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "video_id",
  "originalFileName": "movie.mp4",
  "sourceLanguage": "en",
  "targetLanguage": "hi",
  "status": "processing",
  "progress": 45,
  "processingSteps": {
    "upload": true,
    "audioExtraction": true,
    "translation": false,
    "voiceSynthesis": false,
    "lipSync": false,
    "rendering": false
  },
  "createdAt": "2025-10-29T04:00:00.000Z",
  "updatedAt": "2025-10-29T04:05:00.000Z"
}
```

---

### **3. Get All User Videos**
```
GET /api/videos
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "video_id_1",
    "originalFileName": "movie1.mp4",
    "sourceLanguage": "en",
    "targetLanguage": "hi",
    "status": "completed",
    "progress": 100,
    "createdAt": "2025-10-29T04:00:00.000Z"
  },
  {
    "id": "video_id_2",
    "originalFileName": "movie2.mp4",
    "sourceLanguage": "en",
    "targetLanguage": "hi",
    "status": "processing",
    "progress": 60,
    "createdAt": "2025-10-29T05:00:00.000Z"
  }
]
```

---

### **4. Download Processed Video**
```
GET /api/videos/:id/download
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- File download (video file)

---

### **5. Delete Video**
```
DELETE /api/videos/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

---

## 🎯 Processing Pipeline

### **Step-by-Step Process:**

```
1. Upload (10% progress)
   ├─ Receive video file
   ├─ Validate format
   └─ Save to disk

2. Audio Extraction (20% progress)
   ├─ Extract audio from video
   ├─ Convert to WAV format
   └─ Save audio file

3. Translation (40% progress)
   ├─ Speech-to-text (transcription)
   ├─ Translate text to target language
   └─ Save translated text

4. Voice Synthesis (60% progress)
   ├─ Generate voice from translated text
   ├─ Match original voice characteristics
   └─ Save synthesized audio

5. Lip Sync (80% progress)
   ├─ Analyze lip movements
   ├─ Sync with new audio
   └─ Generate lip-synced video

6. Rendering (90% progress)
   ├─ Combine video + new audio
   ├─ Apply final processing
   └─ Save final video

7. Complete (100% progress)
   └─ Ready for download
```

---

## 📊 Video Status States

### **Status Values:**
- `uploading` - File is being uploaded
- `processing` - Video is being processed
- `completed` - Processing finished successfully
- `failed` - Processing encountered an error

### **Progress Values:**
- `0-10%` - Upload
- `10-20%` - Audio extraction
- `20-40%` - Translation
- `40-60%` - Voice synthesis
- `60-80%` - Lip sync
- `80-90%` - Rendering
- `90-100%` - Finalizing
- `100%` - Complete

---

## 🗄️ Database Schema

### **Video Model:**
```javascript
{
  user: ObjectId,              // Reference to User
  originalFileName: String,    // Original file name
  originalFilePath: String,    // Path to original file
  processedFilePath: String,   // Path to processed file
  sourceLanguage: String,      // e.g., "en"
  targetLanguage: String,      // e.g., "hi"
  status: String,              // uploading|processing|completed|failed
  progress: Number,            // 0-100
  duration: Number,            // Video duration in seconds
  fileSize: Number,            // File size in bytes
  errorMessage: String,        // Error message if failed
  processingSteps: {
    upload: Boolean,
    audioExtraction: Boolean,
    translation: Boolean,
    voiceSynthesis: Boolean,
    lipSync: Boolean,
    rendering: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📁 File Structure

### **Upload Directory:**
```
backend/
├── uploads/
│   ├── video-123456789.mp4      # Original video
│   ├── video_id_audio.wav       # Extracted audio
│   ├── video_id_voice.wav       # Generated voice
│   └── processed/
│       └── video_id_dubbed.mp4  # Final dubbed video
```

---

## 🔧 Installation

### **1. Install Dependencies:**
```bash
cd backend
npm install
```

This will install the new `multer` package for file uploads.

### **2. Create Upload Directories:**
The directories are created automatically, but you can create them manually:
```bash
mkdir -p backend/uploads/processed
```

### **3. Start Server:**
```bash
npm run dev
```

---

## 🎨 Frontend Integration

### **Example: Upload Video**

```typescript
const uploadVideo = async (file: File, sourceLang: string, targetLang: string) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('sourceLanguage', sourceLang);
  formData.append('targetLanguage', targetLang);

  const response = await fetch('http://localhost:5000/api/videos/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.video;
};
```

### **Example: Check Status**

```typescript
const checkStatus = async (videoId: string) => {
  const response = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};
```

### **Example: Download Video**

```typescript
const downloadVideo = async (videoId: string, fileName: string) => {
  const response = await fetch(`http://localhost:5000/api/videos/${videoId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};
```

---

## 🔐 Security Features

✅ **Authentication Required** - All endpoints protected  
✅ **User Authorization** - Users can only access their own videos  
✅ **File Validation** - Only video formats allowed  
✅ **File Size Limit** - 2GB maximum  
✅ **Secure File Storage** - Files stored with unique names  

---

## ⚙️ Configuration

### **File Upload Limits:**
```javascript
// In routes/videos.js
limits: {
  fileSize: 2 * 1024 * 1024 * 1024, // 2GB
}
```

### **Allowed Video Formats:**
- MP4
- MOV
- AVI
- MKV
- FLV
- WMV
- WEBM

---

## 🚧 Current Implementation

### **✅ Implemented:**
- File upload handling
- Video model and database
- Progress tracking
- Status endpoints
- Download functionality
- File deletion

### **🔄 Simulated (Replace with Real AI):**
- Audio extraction (use FFmpeg)
- Speech-to-text (use Whisper, Google Speech-to-Text)
- Translation (use Google Translate, DeepL)
- Voice synthesis (use ElevenLabs, Google TTS)
- Lip sync (use Wav2Lip)
- Video rendering (use FFmpeg)

---

## 🎯 Next Steps to Make It Production-Ready

### **1. Install FFmpeg:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### **2. Integrate AI Services:**

**Speech-to-Text:**
- OpenAI Whisper (free, local)
- Google Cloud Speech-to-Text
- AWS Transcribe

**Translation:**
- Google Cloud Translation API
- DeepL API
- Azure Translator

**Text-to-Speech:**
- ElevenLabs (best quality)
- Google Cloud Text-to-Speech
- Amazon Polly
- Azure Speech Services

**Lip Sync:**
- Wav2Lip (open source)
- Custom ML model
- Commercial API

### **3. Add Environment Variables:**
```env
# .env file
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
```

### **4. Implement Real Processing:**

Uncomment and configure the FFmpeg commands in `videoController.js`:

```javascript
// Audio extraction
const command = `ffmpeg -i "${videoPath}" -vn -acodec pcm_s16le -ar 44100 -ac 2 "${audioPath}"`;
await execPromise(command);

// Video rendering
const command = `ffmpeg -i "${originalPath}" -i "${voicePath}" -c:v copy -map 0:v:0 -map 1:a:0 "${outputPath}"`;
await execPromise(command);
```

---

## 📊 Testing the API

### **Using cURL:**

```bash
# Upload video
curl -X POST http://localhost:5000/api/videos/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "sourceLanguage=en" \
  -F "targetLanguage=hi"

# Check status
curl http://localhost:5000/api/videos/VIDEO_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Download
curl http://localhost:5000/api/videos/VIDEO_ID/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o dubbed_video.mp4
```

---

## 🎉 Summary

Your backend now has:
- ✅ **Video upload API** with file validation
- ✅ **Processing pipeline** with progress tracking
- ✅ **Status monitoring** in real-time
- ✅ **Download functionality** for completed videos
- ✅ **User authentication** and authorization
- ✅ **Database integration** with MongoDB
- ✅ **Error handling** and validation

**Ready to integrate with your frontend!** 🚀
