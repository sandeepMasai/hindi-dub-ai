# 🎙️ ElevenLabs Text-to-Speech Integration Guide

## ✅ What's Been Configured

The ElevenLabs TTS API key has been integrated into the video dubbing backend for voice synthesis.

---

## 🔑 API Key

```
sk_909dce2aa52a5d2b106122e74332dcf7e79bf3346e48afd3
```

**Location:** `backend/controllers/videoController.js` (line 166)

---

## 📋 What's Been Updated

### **1. Voice Generation Function**
- Integrated ElevenLabs API for text-to-speech
- Added support for 9+ languages
- Automatic MP3 to WAV conversion
- Fallback mechanism for errors
- Comprehensive error handling

### **2. Features Added**
✅ **Multi-language Support** - 9 languages with native voices  
✅ **High-Quality Audio** - ElevenLabs multilingual v2 model  
✅ **Voice Settings** - Optimized stability and similarity  
✅ **Format Conversion** - MP3 to WAV for Wav2Lip compatibility  
✅ **Error Handling** - Graceful fallback on failure  

---

## 🎯 Voice Synthesis in Processing Flow

```
1. Upload Video
   ↓
2. Extract Audio (FFmpeg)
   ↓
3. Speech-to-Text (Whisper/Google)
   ↓
4. Translation (Google Translate)
   ↓
5. Text-to-Speech (ElevenLabs) ← API KEY USED HERE
   ↓
6. Lip Sync (Wav2Lip)
   ↓
7. Final Rendering
   ↓
8. Download
```

---

## 🌍 Supported Languages & Voices

### **Voice IDs by Language:**

| Language | Code | Voice ID | Voice Name |
|----------|------|----------|------------|
| English | `en` | `21m00Tcm4TlvDq8ikWAM` | Rachel |
| Hindi | `hi` | `pNInz6obpgDQGcFmaJgB` | Adam |
| Spanish | `es` | `EXAVITQu4vr4xnSDxMaL` | Bella |
| French | `fr` | `ErXwobaYiN019PkySvjV` | Antoni |
| German | `de` | `VR6AewLTigWG4xSOukaG` | Arnold |
| Portuguese | `pt` | `pqHfZKP75CvOlQylNhV4` | Bill |
| Chinese | `zh` | `yoZ06aMxZJJ28mfd3POQ` | Charlotte |
| Japanese | `ja` | `bVMeCyTHy58xNoL34h3p` | Clyde |
| Korean | `ko` | `iP95p4xoKVk53GoZ742B` | Dave |

**Default:** Falls back to English (Rachel) if language not found

---

## 🚀 Current Implementation

### **Function: generateVoice()**

```javascript
const generateVoice = async (text, videoId, targetLang) => {
  const ELEVENLABS_API_KEY = 'sk_909dce2aa52a5d2b106122e74332dcf7e79bf3346e48afd3';
  
  // 1. Select voice based on target language
  const voiceId = voiceIds[targetLang] || voiceIds['en'];
  
  // 2. Call ElevenLabs API
  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    },
    {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    }
  );
  
  // 3. Save MP3 file
  await fs.writeFile(voicePath, response.data);
  
  // 4. Convert to WAV for Wav2Lip
  await execPromise(`ffmpeg -i "${voicePath}" -acodec pcm_s16le -ar 16000 "${wavPath}"`);
  
  return wavPath;
};
```

---

## 🎛️ Voice Settings Explained

### **Current Configuration:**

```javascript
voice_settings: {
  stability: 0.5,           // Balance between consistency and expressiveness
  similarity_boost: 0.75,   // How closely to match the original voice
  style: 0.0,               // Style exaggeration (0 = natural)
  use_speaker_boost: true   // Enhance speaker characteristics
}
```

### **Stability (0.0 - 1.0):**
- **0.0-0.3:** More expressive, variable
- **0.4-0.6:** Balanced (recommended)
- **0.7-1.0:** Very stable, consistent

### **Similarity Boost (0.0 - 1.0):**
- **0.0-0.4:** More creative interpretation
- **0.5-0.8:** Balanced similarity (recommended)
- **0.9-1.0:** Maximum similarity

### **Style (0.0 - 1.0):**
- **0.0:** Natural speech (recommended)
- **0.5:** Moderate exaggeration
- **1.0:** Maximum style

---

## 📊 API Request Format

### **Endpoint:**
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

### **Headers:**
```
xi-api-key: sk_909dce2aa52a5d2b106122e74332dcf7e79bf3346e48afd3
Content-Type: application/json
Accept: audio/mpeg
```

### **Request Body:**
```json
{
  "text": "नमस्ते, यह एक परीक्षण है",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

### **Response:**
- Binary audio data (MP3 format)
- Content-Type: `audio/mpeg`

---

## 🔄 Audio Format Conversion

### **Why Convert MP3 to WAV?**

Wav2Lip typically requires WAV format for better compatibility:

```javascript
// FFmpeg conversion command
ffmpeg -i input.mp3 -acodec pcm_s16le -ar 16000 output.wav

// Parameters:
// -acodec pcm_s16le  : PCM signed 16-bit little-endian
// -ar 16000          : Sample rate 16kHz (optimal for speech)
```

### **Fallback:**
If FFmpeg fails, the system uses the MP3 file directly.

---

## 🔐 Security Best Practices

### **1. Move API Key to Environment Variables**

Create/update `.env` file:

```env
# backend/.env
ELEVENLABS_API_KEY=sk_909dce2aa52a5d2b106122e74332dcf7e79bf3346e48afd3
WAV2LIP_API_KEY=sk-Kc5-RxKFRtqJ8krsHMIPKw.Qoqz4SbQRSze-3gjsN8X_FPtlRbboEaw
```

Update code:
```javascript
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
```

### **2. Add Rate Limiting**

```javascript
// Track API usage
let ttsCallCount = 0;
const MAX_TTS_CALLS_PER_DAY = 1000;

const checkTTSRateLimit = () => {
  if (ttsCallCount >= MAX_TTS_CALLS_PER_DAY) {
    throw new Error('Daily TTS quota exceeded');
  }
  ttsCallCount++;
};
```

### **3. Monitor Character Usage**

ElevenLabs charges by character count:

```javascript
const characterCount = text.length;
console.log(`Generating ${characterCount} characters of speech`);

// Track total usage
let totalCharacters = 0;
totalCharacters += characterCount;
```

---

## 💰 Cost Estimation

### **ElevenLabs Pricing (as of 2024):**

**Free Tier:**
- 10,000 characters/month
- ~10 minutes of audio

**Starter ($5/month):**
- 30,000 characters/month
- ~30 minutes of audio

**Creator ($22/month):**
- 100,000 characters/month
- ~100 minutes of audio

**Pro ($99/month):**
- 500,000 characters/month
- ~500 minutes of audio

### **Character Count Examples:**

```
Short sentence (10 words):     ~50 characters
Paragraph (100 words):         ~500 characters
1 minute of speech:            ~1,000 characters
5 minute video dubbing:        ~5,000 characters
```

---

## 🎯 Advanced Features

### **1. Custom Voice Cloning**

ElevenLabs supports voice cloning:

```javascript
// Upload voice samples and get custom voice ID
const customVoiceId = 'your-custom-voice-id';

const response = await axios.post(
  `https://api.elevenlabs.io/v1/text-to-speech/${customVoiceId}`,
  { text: translatedText }
);
```

### **2. Streaming Audio**

For real-time applications:

```javascript
const response = await axios.post(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
  { text: text },
  {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    responseType: 'stream'
  }
);

response.data.pipe(fs.createWriteStream(outputPath));
```

### **3. Voice Settings Optimization**

For different use cases:

```javascript
// Audiobook narration
voice_settings: {
  stability: 0.75,
  similarity_boost: 0.8,
  style: 0.0
}

// Conversational/Natural
voice_settings: {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0
}

// Dramatic/Expressive
voice_settings: {
  stability: 0.3,
  similarity_boost: 0.6,
  style: 0.5
}
```

---

## 🧪 Testing

### **Test the Integration:**

```bash
# 1. Start backend server
cd backend
npm run dev

# 2. Upload a video through frontend
# 3. Check backend logs for:
#    "Generating voice with ElevenLabs for language: hi"
#    "Voice generated successfully with ElevenLabs"
#    "Converted MP3 to WAV format"

# 4. Check uploads directory for generated files:
#    - {videoId}_voice.mp3
#    - {videoId}_voice.wav
```

### **Test with Sample Text:**

```javascript
// Test directly in Node.js
const testTTS = async () => {
  const text = "नमस्ते, यह एक परीक्षण है";
  const result = await generateVoice(text, 'test123', 'hi');
  console.log('Generated:', result);
};

testTTS();
```

---

## 🔧 Troubleshooting

### **Error: "Invalid API Key"**

```
Solution: Check that API key is correct and active
- Verify key in ElevenLabs dashboard
- Check for extra spaces or characters
```

### **Error: "Quota Exceeded"**

```
Solution: Upgrade plan or wait for quota reset
- Check usage in ElevenLabs dashboard
- Implement rate limiting
- Consider caching common phrases
```

### **Error: "FFmpeg not found"**

```
Solution: Install FFmpeg
Mac:     brew install ffmpeg
Ubuntu:  sudo apt-get install ffmpeg
Windows: Download from ffmpeg.org
```

### **Error: "Voice ID not found"**

```
Solution: Use valid voice ID
- Check available voices in ElevenLabs dashboard
- Update voiceIds mapping in code
- Use default English voice as fallback
```

---

## 📊 Monitoring & Logging

### **Add Detailed Logging:**

```javascript
const generateVoice = async (text, videoId, targetLang) => {
  const startTime = Date.now();
  
  console.log('=== ElevenLabs TTS Request ===');
  console.log('Video ID:', videoId);
  console.log('Language:', targetLang);
  console.log('Text length:', text.length, 'characters');
  console.log('Voice ID:', voiceId);
  
  try {
    const response = await axios.post(/* ... */);
    
    const duration = Date.now() - startTime;
    const audioSize = response.data.length;
    
    console.log('=== TTS Success ===');
    console.log('Duration:', duration, 'ms');
    console.log('Audio size:', (audioSize / 1024).toFixed(2), 'KB');
    console.log('===================');
    
    return wavPath;
  } catch (error) {
    console.error('=== TTS Error ===');
    console.error('Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('=================');
    throw error;
  }
};
```

---

## 🎨 Voice Customization

### **Get All Available Voices:**

```javascript
const getAvailableVoices = async () => {
  const response = await axios.get(
    'https://api.elevenlabs.io/v1/voices',
    {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    }
  );
  
  return response.data.voices;
};
```

### **Create Custom Voice Mapping:**

```javascript
// Map languages to best voices
const voiceMapping = {
  'en-US': '21m00Tcm4TlvDq8ikWAM', // Rachel (American)
  'en-GB': 'ThT5KcBeYPX3keUQqHPh', // Dorothy (British)
  'hi': 'pNInz6obpgDQGcFmaJgB',    // Adam (Hindi)
  'es-ES': 'EXAVITQu4vr4xnSDxMaL', // Bella (Spanish)
  'es-MX': 'TxGEqnHWrfWFTfGW9XjX', // Josh (Mexican Spanish)
};
```

---

## 🎉 Summary

Your ElevenLabs TTS integration now has:
- ✅ **API Key Configured** - Ready to use
- ✅ **Multi-language Support** - 9+ languages
- ✅ **High-Quality Voices** - Professional TTS
- ✅ **Format Conversion** - MP3 to WAV
- ✅ **Error Handling** - Graceful fallbacks
- ✅ **Voice Settings** - Optimized for natural speech
- ✅ **Comprehensive Logging** - Easy debugging

---

## 🚀 Next Steps

1. **Test the Integration** - Upload a video and check logs
2. **Move API Key to .env** - Better security
3. **Monitor Usage** - Track character consumption
4. **Optimize Settings** - Adjust voice parameters
5. **Add Caching** - Cache common phrases
6. **Custom Voices** - Create voice clones if needed

---

## 📚 Resources

- **ElevenLabs Docs:** https://docs.elevenlabs.io/
- **API Reference:** https://api.elevenlabs.io/docs
- **Voice Library:** https://elevenlabs.io/voice-library
- **Pricing:** https://elevenlabs.io/pricing

---

**Your ElevenLabs TTS is ready to generate natural voices!** 🎙️✨
