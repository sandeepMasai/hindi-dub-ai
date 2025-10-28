# DubAI - AI-Powered Video Dubbing Platform 🎬

एक professional video dubbing platform जो English movies/videos को Hindi में convert करता है AI technology के साथ।

## 🌟 Features

- **AI-Powered Translation**: Advanced neural networks से accurate context-aware translation
- **Voice Cloning**: Original voice quality और tone को preserve करते हुए dubbing
- **Lip-Sync Technology**: Video के साथ perfectly synchronized lip movements
- **Emotion Preservation**: Original performance का emotional depth maintain करना
- **Multi-Language Support**: Hindi के अलावा multiple Indian languages
- **Studio Quality**: Professional-grade audio processing

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **shadcn/ui** - Beautiful component library

### Backend (To be implemented)
- **Node.js** - Server-side runtime
- **Express** - Web framework
- **Supabase** - Database & authentication
- **Edge Functions** - Serverless computing

### AI Services (To be integrated)
- **OpenAI Whisper** - Speech-to-text transcription
- **GPT-4** - Context-aware translation
- **ElevenLabs** - Natural voice synthesis
- **Wav2Lip** - Lip-sync generation

## 📋 Prerequisites

- Node.js 18+ और npm installed
- Git for version control
- OpenAI API key
- ElevenLabs API key (optional)

## 🛠️ Installation & Development

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd dubai-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file:

```env
# Supabase (Will be auto-configured with Lovable Cloud)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# OpenAI (For transcription & translation)
OPENAI_API_KEY=your-openai-key

# ElevenLabs (For voice synthesis)
ELEVENLABS_API_KEY=your-elevenlabs-key
```

### Step 4: Start Development Server

```bash
npm run dev
```

App will run at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Hero.tsx              # Landing page hero section
│   ├── Features.tsx          # Features showcase
│   ├── HowItWorks.tsx        # Process explanation
│   ├── UploadSection.tsx     # Video upload interface
│   ├── Pricing.tsx           # Pricing plans
│   └── ui/                   # shadcn components
├── pages/
│   ├── Index.tsx             # Main landing page
│   └── NotFound.tsx          # 404 page
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
└── index.css                 # Design system & styles
```

## 🔧 Backend Implementation Guide

### Phase 1: Database Setup

Create Supabase tables:

```sql
-- Users table (auto-created with auth)

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  duration INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dubbing jobs table
CREATE TABLE dubbing_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id),
  source_language TEXT DEFAULT 'en',
  target_language TEXT DEFAULT 'hi',
  status TEXT DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  result_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### Phase 2: Edge Functions

Create edge functions in `supabase/functions/`:

#### 1. `transcribe-audio` - Speech to Text

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import OpenAI from 'openai'

serve(async (req) => {
  const { audioUrl } = await req.json()
  
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY')
  })

  // Download audio
  const audioResponse = await fetch(audioUrl)
  const audioBlob = await audioResponse.blob()

  // Transcribe with Whisper
  const transcription = await openai.audio.transcriptions.create({
    file: audioBlob,
    model: "whisper-1",
    language: "en"
  })

  return new Response(JSON.stringify({
    text: transcription.text
  }))
})
```

#### 2. `translate-text` - Translation

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { text, targetLanguage } = await req.json()
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLanguage} while preserving emotions and context.`
        },
        {
          role: 'user',
          content: text
        }
      ]
    })
  })

  const data = await response.json()
  return new Response(JSON.stringify({
    translation: data.choices[0].message.content
  }))
})
```

#### 3. `generate-voice` - Text to Speech

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { text, voiceId } = await req.json()
  
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    method: 'POST',
    headers: {
      'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2'
    })
  })

  const audioBuffer = await response.arrayBuffer()
  return new Response(audioBuffer, {
    headers: { 'Content-Type': 'audio/mpeg' }
  })
})
```

### Phase 3: Frontend Integration

Update `UploadSection.tsx` to use backend:

```typescript
const handleProcess = async () => {
  if (!file) return;
  
  setIsProcessing(true);
  
  try {
    // 1. Upload video to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(`${userId}/${file.name}`, file);

    // 2. Create video record
    const { data: video } = await supabase
      .from('videos')
      .insert({ 
        original_filename: file.name,
        storage_path: uploadData.path 
      })
      .select()
      .single();

    // 3. Start dubbing job
    await supabase.functions.invoke('process-dubbing', {
      body: { videoId: video.id }
    });

    toast({ title: "Processing started!" });
  } catch (error) {
    toast({ 
      title: "Error", 
      description: error.message,
      variant: "destructive" 
    });
  } finally {
    setIsProcessing(false);
  }
};
```

## 🎯 Business Model Implementation

### Pricing Tiers

1. **Starter** - ₹999/month
   - 10 videos/month
   - Basic features
   
2. **Professional** - ₹2,999/month
   - 50 videos/month
   - Advanced features
   - Priority support

3. **Enterprise** - Custom pricing
   - Unlimited videos
   - API access
   - White-label option

### Stripe Integration

```typescript
// Create checkout session
const { data } = await supabase.functions.invoke('create-checkout', {
  body: { 
    priceId: 'price_xxx',
    userId: user.id 
  }
});

// Redirect to Stripe
window.location.href = data.url;
```

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Test Edge Functions Locally

```bash
supabase functions serve
```

### E2E Testing

```bash
npm run test:e2e
```

## 📦 Deployment

### Frontend Deployment (Automatic with Lovable)

Lovable automatically deploys your app on every commit.

### Backend Deployment

Edge functions auto-deploy with Lovable Cloud.

### Custom Domain

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records

## 🔐 Security Best Practices

1. Never expose API keys in frontend
2. Use Row Level Security (RLS) on Supabase
3. Implement rate limiting
4. Validate file uploads
5. Sanitize user inputs

## 📊 Monitoring & Analytics

- Track conversion rates
- Monitor processing times
- Error tracking with Sentry
- Usage analytics

## 🚀 Scaling Considerations

1. **Video Processing**: Use queue system for large files
2. **Storage**: CDN for faster delivery
3. **API Rate Limits**: Implement caching
4. **Cost Optimization**: Batch processing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📝 License

MIT License - feel free to use for commercial projects

## 📧 Support

For issues or questions:
- Email: support@dubai.com
- Discord: Join our community
- Docs: docs.dubai.com

## 🎓 Learning Resources

- [OpenAI Whisper Docs](https://platform.openai.com/docs/guides/speech-to-text)
- [ElevenLabs API](https://docs.elevenlabs.io/)
- [Supabase Docs](https://supabase.com/docs)
- [React Best Practices](https://react.dev/)

---

Made with ❤️ using Lovable, React, and AI
