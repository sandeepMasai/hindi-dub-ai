const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  originalFilePath: {
    type: String,
    required: true,
  },
  processedFilePath: {
    type: String,
  },
  sourceLanguage: {
    type: String,
    required: true,
    default: 'en',
  },
  targetLanguage: {
    type: String,
    required: true,
    default: 'hi',
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  duration: {
    type: Number, // in seconds
  },
  fileSize: {
    type: Number, // in bytes
  },
  videoType: {
    type: String,
    enum: ['movie', 'short'],
    default: 'movie',
  },
  voiceMode: {
    type: String,
    enum: ['natural', 'expressive', 'calm', 'energetic'],
    default: 'natural',
  },
  audioSource: {
    type: String,
    enum: ['video', 'upload', 'record'],
    default: 'video',
  },
  separateAudioPath: {
    type: String, // Path to uploaded/recorded audio
  },
  emotions: [{
    timestamp: Number,
    emotion: String,
    confidence: Number,
  }],
  subtitles: {
    srt: String, // Path to SRT file
    vtt: String, // Path to VTT file
    json: String, // Path to JSON subtitle data
  },
  backgroundMusic: {
    extracted: { type: Boolean, default: false },
    path: String,
  },
  lipSyncData: {
    method: { type: String, enum: ['wav2lip', 'rhubarb'], default: 'wav2lip' },
    dataPath: String, // Path to lip sync data file
  },
  cloudStorage: {
    provider: String, // 's3', 'cloudinary', etc.
    originalUrl: String,
    processedUrl: String,
    thumbnailUrl: String,
  },
  projectName: {
    type: String,
  },
  tags: [String],
  errorMessage: {
    type: String,
  },
  processingSteps: {
    upload: { type: Boolean, default: false },
    audioExtraction: { type: Boolean, default: false },
    emotionDetection: { type: Boolean, default: false },
    translation: { type: Boolean, default: false },
    voiceSynthesis: { type: Boolean, default: false },
    backgroundMusicExtraction: { type: Boolean, default: false },
    lipSync: { type: Boolean, default: false },
    subtitleGeneration: { type: Boolean, default: false },
    rendering: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

// Index for faster queries
videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ status: 1 });

module.exports = mongoose.model('Video', videoSchema);
