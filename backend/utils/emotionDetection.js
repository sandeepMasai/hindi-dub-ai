const axios = require('axios');

/**
 * Detect emotions from text using sentiment analysis
 * This can be enhanced with more sophisticated emotion detection APIs
 */
const detectEmotionsFromText = async (text, timestamps = []) => {
  try {
    const emotions = [];
    
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const emotion = analyzeEmotionFromSentence(sentence);
      
      emotions.push({
        timestamp: timestamps[i] || i * 3, // Approximate 3 seconds per sentence
        emotion: emotion.type,
        confidence: emotion.confidence,
        text: sentence,
      });
    }
    
    return emotions;
  } catch (error) {
    console.error('Emotion detection error:', error.message);
    return [];
  }
};

/**
 * Simple rule-based emotion detection
 * Can be replaced with ML models or APIs like:
 * - Hugging Face Emotion Detection
 * - IBM Watson Tone Analyzer
 * - Google Cloud Natural Language API
 */
const analyzeEmotionFromSentence = (sentence) => {
  const lowerSentence = sentence.toLowerCase();
  
  // Emotion keywords
  const emotionPatterns = {
    happy: ['happy', 'joy', 'excited', 'wonderful', 'great', 'amazing', 'love', 'fantastic', '!', '😊', '😄'],
    sad: ['sad', 'sorry', 'unfortunately', 'tragic', 'terrible', 'awful', 'cry', 'tears', '😢', '😭'],
    angry: ['angry', 'furious', 'mad', 'hate', 'damn', 'stupid', 'idiot', '😠', '😡'],
    fearful: ['afraid', 'scared', 'fear', 'terrified', 'worried', 'anxious', '😨', '😰'],
    surprised: ['wow', 'amazing', 'incredible', 'unbelievable', 'shocked', '!', '😲', '😮'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'quiet', 'gentle'],
  };
  
  let maxScore = 0;
  let detectedEmotion = 'neutral';
  
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerSentence.includes(keyword)) {
        score++;
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion;
    }
  }
  
  // Check for questions (curious emotion)
  if (lowerSentence.includes('?')) {
    detectedEmotion = 'curious';
    maxScore = Math.max(maxScore, 1);
  }
  
  // Calculate confidence (0-1)
  const confidence = Math.min(maxScore / 3, 1);
  
  return {
    type: detectedEmotion,
    confidence: confidence > 0 ? confidence : 0.5, // Default neutral confidence
  };
};

/**
 * Map emotions to voice settings for ElevenLabs
 */
const getVoiceSettingsForEmotion = (emotion, baseMode = 'natural') => {
  const emotionSettings = {
    happy: {
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.6,
      use_speaker_boost: true,
    },
    sad: {
      stability: 0.7,
      similarity_boost: 0.6,
      style: 0.3,
      use_speaker_boost: false,
    },
    angry: {
      stability: 0.3,
      similarity_boost: 0.9,
      style: 0.8,
      use_speaker_boost: true,
    },
    fearful: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.4,
      use_speaker_boost: true,
    },
    surprised: {
      stability: 0.35,
      similarity_boost: 0.85,
      style: 0.7,
      use_speaker_boost: true,
    },
    calm: {
      stability: 0.75,
      similarity_boost: 0.65,
      style: 0.1,
      use_speaker_boost: false,
    },
    curious: {
      stability: 0.45,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true,
    },
    neutral: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    },
  };
  
  return emotionSettings[emotion] || emotionSettings.neutral;
};

/**
 * Detect emotions using Hugging Face API (optional)
 */
const detectEmotionsWithHuggingFace = async (text) => {
  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (!HF_API_KEY || HF_API_KEY === 'your_huggingface_key_here') {
      throw new Error('Hugging Face API key not configured');
    }
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
      }
    );
    
    // Response format: [{ label: 'joy', score: 0.95 }, ...]
    const emotions = response.data[0];
    const topEmotion = emotions.reduce((max, curr) => 
      curr.score > max.score ? curr : max
    );
    
    return {
      type: topEmotion.label,
      confidence: topEmotion.score,
      allEmotions: emotions,
    };
  } catch (error) {
    console.error('Hugging Face emotion detection failed:', error.message);
    return null;
  }
};

module.exports = {
  detectEmotionsFromText,
  analyzeEmotionFromSentence,
  getVoiceSettingsForEmotion,
  detectEmotionsWithHuggingFace,
};
