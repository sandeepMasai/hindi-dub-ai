const fs = require('fs').promises;
const path = require('path');

/**
 * Generate SRT subtitle file from transcription data
 */
const generateSRT = (subtitleData, outputPath) => {
  let srtContent = '';
  
  subtitleData.forEach((item, index) => {
    const startTime = formatSRTTime(item.start);
    const endTime = formatSRTTime(item.end);
    
    srtContent += `${index + 1}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${item.text}\n\n`;
  });
  
  return fs.writeFile(outputPath, srtContent, 'utf-8');
};

/**
 * Generate VTT subtitle file (WebVTT format)
 */
const generateVTT = (subtitleData, outputPath) => {
  let vttContent = 'WEBVTT\n\n';
  
  subtitleData.forEach((item, index) => {
    const startTime = formatVTTTime(item.start);
    const endTime = formatVTTTime(item.end);
    
    vttContent += `${index + 1}\n`;
    vttContent += `${startTime} --> ${endTime}\n`;
    vttContent += `${item.text}\n\n`;
  });
  
  return fs.writeFile(outputPath, vttContent, 'utf-8');
};

/**
 * Generate JSON subtitle data
 */
const generateJSON = (subtitleData, outputPath) => {
  const jsonData = {
    version: '1.0',
    subtitles: subtitleData.map((item, index) => ({
      id: index + 1,
      start: item.start,
      end: item.end,
      text: item.text,
      translatedText: item.translatedText || '',
    })),
  };
  
  return fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
};

/**
 * Format time for SRT (HH:MM:SS,mmm)
 */
const formatSRTTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(milliseconds, 3)}`;
};

/**
 * Format time for VTT (HH:MM:SS.mmm)
 */
const formatVTTTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}.${pad(milliseconds, 3)}`;
};

/**
 * Pad number with zeros
 */
const pad = (num, size) => {
  let s = num.toString();
  while (s.length < size) s = '0' + s;
  return s;
};

/**
 * Parse Whisper transcription with timestamps
 */
const parseWhisperTranscription = (transcriptionData) => {
  // Whisper API returns segments with timestamps
  if (transcriptionData.segments) {
    return transcriptionData.segments.map(segment => ({
      start: segment.start,
      end: segment.end,
      text: segment.text.trim(),
    }));
  }
  
  // Fallback: split text into sentences with estimated timing
  const text = transcriptionData.text || transcriptionData;
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const avgDuration = 3; // seconds per sentence
  
  return sentences.map((sentence, index) => ({
    start: index * avgDuration,
    end: (index + 1) * avgDuration,
    text: sentence.trim(),
  }));
};

/**
 * Generate all subtitle formats
 */
const generateSubtitles = async (transcriptionData, translatedText, videoId, uploadsDir) => {
  try {
    console.log('📝 Generating subtitles...');
    
    // Parse transcription data
    const subtitleData = parseWhisperTranscription(transcriptionData);
    
    // Add translated text if available
    if (translatedText) {
      const translatedSentences = translatedText.match(/[^.!?]+[.!?]+/g) || [translatedText];
      subtitleData.forEach((item, index) => {
        if (translatedSentences[index]) {
          item.translatedText = translatedSentences[index].trim();
        }
      });
    }
    
    // Generate subtitle files
    const subtitlesDir = path.join(uploadsDir, 'subtitles');
    await fs.mkdir(subtitlesDir, { recursive: true });
    
    const srtPath = path.join(subtitlesDir, `${videoId}.srt`);
    const vttPath = path.join(subtitlesDir, `${videoId}.vtt`);
    const jsonPath = path.join(subtitlesDir, `${videoId}.json`);
    
    await Promise.all([
      generateSRT(subtitleData, srtPath),
      generateVTT(subtitleData, vttPath),
      generateJSON(subtitleData, jsonPath),
    ]);
    
    console.log('✅ Subtitles generated successfully');
    console.log(`   SRT: ${srtPath}`);
    console.log(`   VTT: ${vttPath}`);
    console.log(`   JSON: ${jsonPath}`);
    
    return {
      srt: srtPath,
      vtt: vttPath,
      json: jsonPath,
      data: subtitleData,
    };
  } catch (error) {
    console.error('❌ Subtitle generation failed:', error.message);
    return null;
  }
};

/**
 * Burn subtitles into video
 */
const burnSubtitlesIntoVideo = async (videoPath, srtPath, outputPath) => {
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    console.log('🔥 Burning subtitles into video...');
    
    // Escape path for FFmpeg
    const escapedSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    
    const command = `ffmpeg -i "${videoPath}" -vf "subtitles='${escapedSrtPath}':force_style='FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3'" -c:a copy "${outputPath}" -y`;
    
    await execPromise(command);
    
    console.log('✅ Subtitles burned into video');
    return outputPath;
  } catch (error) {
    console.error('❌ Subtitle burning failed:', error.message);
    throw error;
  }
};

module.exports = {
  generateSRT,
  generateVTT,
  generateJSON,
  parseWhisperTranscription,
  generateSubtitles,
  burnSubtitlesIntoVideo,
};
