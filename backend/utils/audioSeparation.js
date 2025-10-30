const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs').promises;

const execPromise = util.promisify(exec);

/**
 * Separate audio into vocals and background music using Spleeter
 * Requires: pip install spleeter
 */
const separateAudioWithSpleeter = async (audioPath, outputDir) => {
  try {
    console.log('🎵 Separating vocals from background music...');
    
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    
    // Use Spleeter to separate audio (2 stems: vocals and accompaniment)
    const command = `spleeter separate -p spleeter:2stems -o "${outputDir}" "${audioPath}"`;
    
    await execPromise(command);
    
    const baseName = path.basename(audioPath, path.extname(audioPath));
    const vocalsPath = path.join(outputDir, baseName, 'vocals.wav');
    const accompanimentPath = path.join(outputDir, baseName, 'accompaniment.wav');
    
    console.log('✅ Audio separation complete');
    console.log(`   Vocals: ${vocalsPath}`);
    console.log(`   Background: ${accompanimentPath}`);
    
    return {
      vocals: vocalsPath,
      background: accompanimentPath,
    };
  } catch (error) {
    console.error('❌ Spleeter separation failed:', error.message);
    throw error;
  }
};

/**
 * Separate audio using FFmpeg filters (simpler but less accurate)
 */
const separateAudioWithFFmpeg = async (audioPath, outputDir) => {
  try {
    console.log('🎵 Separating audio with FFmpeg...');
    
    await fs.mkdir(outputDir, { recursive: true });
    
    const baseName = path.basename(audioPath, path.extname(audioPath));
    const vocalsPath = path.join(outputDir, `${baseName}_vocals.wav`);
    const backgroundPath = path.join(outputDir, `${baseName}_background.wav`);
    
    // Extract center channel (usually vocals)
    const vocalsCommand = `ffmpeg -i "${audioPath}" -af "pan=mono|c0=0.5*c0+0.5*c1" "${vocalsPath}" -y`;
    await execPromise(vocalsCommand);
    
    // Extract side channels (usually instruments)
    const backgroundCommand = `ffmpeg -i "${audioPath}" -af "pan=mono|c0=0.5*c0-0.5*c1" "${backgroundPath}" -y`;
    await execPromise(backgroundCommand);
    
    console.log('✅ FFmpeg audio separation complete');
    
    return {
      vocals: vocalsPath,
      background: backgroundPath,
    };
  } catch (error) {
    console.error('❌ FFmpeg separation failed:', error.message);
    throw error;
  }
};

/**
 * Extract background music and preserve it
 */
const extractBackgroundMusic = async (videoPath, videoId, uploadsDir) => {
  try {
    const audioPath = path.join(uploadsDir, `${videoId}_audio.wav`);
    const separationDir = path.join(uploadsDir, 'separated', videoId);
    
    // Try Spleeter first, fallback to FFmpeg
    let separated;
    try {
      separated = await separateAudioWithSpleeter(audioPath, separationDir);
    } catch (spleeterError) {
      console.warn('⚠️ Spleeter not available, using FFmpeg...');
      separated = await separateAudioWithFFmpeg(audioPath, separationDir);
    }
    
    return separated;
  } catch (error) {
    console.error('❌ Background music extraction failed:', error.message);
    return null;
  }
};

/**
 * Mix dubbed vocals with original background music
 */
const mixAudioTracks = async (vocalsPath, backgroundPath, outputPath, vocalsVolume = 1.0, backgroundVolume = 0.3) => {
  try {
    console.log('🎚️ Mixing dubbed vocals with background music...');
    
    // Mix audio tracks with volume control
    const command = `ffmpeg -i "${vocalsPath}" -i "${backgroundPath}" -filter_complex "[0:a]volume=${vocalsVolume}[a1];[1:a]volume=${backgroundVolume}[a2];[a1][a2]amix=inputs=2:duration=first:dropout_transition=2" "${outputPath}" -y`;
    
    await execPromise(command);
    
    console.log('✅ Audio mixing complete');
    return outputPath;
  } catch (error) {
    console.error('❌ Audio mixing failed:', error.message);
    throw error;
  }
};

/**
 * Normalize audio levels
 */
const normalizeAudio = async (audioPath, outputPath) => {
  try {
    const command = `ffmpeg -i "${audioPath}" -af "loudnorm=I=-16:TP=-1.5:LRA=11" "${outputPath}" -y`;
    await execPromise(command);
    return outputPath;
  } catch (error) {
    console.error('Audio normalization failed:', error.message);
    return audioPath;
  }
};

module.exports = {
  separateAudioWithSpleeter,
  separateAudioWithFFmpeg,
  extractBackgroundMusic,
  mixAudioTracks,
  normalizeAudio,
};
