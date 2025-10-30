const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs').promises;

const execPromise = util.promisify(exec);

/**
 * Generate lip sync data using Rhubarb Lip Sync
 * Download from: https://github.com/DanielSWolf/rhubarb-lip-sync
 */
const generateRhubarbLipSync = async (audioPath, videoId, uploadsDir) => {
  try {
    console.log('👄 Generating lip sync data with Rhubarb...');
    
    const outputPath = path.join(uploadsDir, 'lipsync', `${videoId}_rhubarb.json`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Rhubarb command
    // Download Rhubarb from: https://github.com/DanielSWolf/rhubarb-lip-sync/releases
    const rhubarbPath = process.env.RHUBARB_PATH || 'rhubarb';
    const command = `"${rhubarbPath}" -f json -o "${outputPath}" "${audioPath}"`;
    
    await execPromise(command);
    
    console.log('✅ Rhubarb lip sync data generated');
    
    // Read and parse the output
    const lipSyncData = JSON.parse(await fs.readFile(outputPath, 'utf-8'));
    
    return {
      dataPath: outputPath,
      data: lipSyncData,
    };
  } catch (error) {
    console.error('❌ Rhubarb lip sync failed:', error.message);
    console.log('⚠️ Make sure Rhubarb is installed and RHUBARB_PATH is set');
    return null;
  }
};

/**
 * Parse Rhubarb lip sync data
 * Rhubarb outputs phoneme timing data
 */
const parseRhubarbData = (rhubarbData) => {
  if (!rhubarbData || !rhubarbData.mouthCues) {
    return [];
  }
  
  return rhubarbData.mouthCues.map(cue => ({
    start: cue.start,
    end: cue.end,
    value: cue.value, // Phoneme: A, B, C, D, E, F, G, H, X
  }));
};

/**
 * Map Rhubarb phonemes to mouth shapes
 * Preston Blair mouth shapes: A-H, X (rest)
 */
const getPhonemeDescription = (phoneme) => {
  const phonemeMap = {
    'A': 'Closed mouth (M, B, P)',
    'B': 'Slightly open (K, S, T)',
    'C': 'Open mouth (E, I)',
    'D': 'Wide open (A, Ah)',
    'E': 'Rounded (O, U)',
    'F': 'Wide rounded (OO)',
    'G': 'F, V shape',
    'H': 'L shape',
    'X': 'Rest position',
  };
  
  return phonemeMap[phoneme] || 'Unknown';
};

/**
 * Apply Rhubarb lip sync to video using FFmpeg
 * This is a simplified version - full implementation would need
 * face detection and mouth shape overlay
 */
const applyRhubarbLipSyncToVideo = async (videoPath, lipSyncData, outputPath) => {
  try {
    console.log('🎬 Applying Rhubarb lip sync to video...');
    
    // For now, just copy the video
    // Full implementation would require:
    // 1. Face detection (dlib, OpenCV)
    // 2. Mouth region extraction
    // 3. Mouth shape overlay based on phonemes
    // 4. Frame-by-frame processing
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Simple copy for now
    await execPromise(`ffmpeg -i "${videoPath}" -c copy "${outputPath}" -y`);
    
    console.log('✅ Video processed (Rhubarb data available for custom rendering)');
    
    return {
      videoPath: outputPath,
      lipSyncData: lipSyncData,
    };
  } catch (error) {
    console.error('❌ Rhubarb lip sync application failed:', error.message);
    throw error;
  }
};

/**
 * Generate lip sync visualization overlay
 */
const generateLipSyncVisualization = async (videoPath, lipSyncDataPath, outputPath) => {
  try {
    console.log('📊 Generating lip sync visualization...');
    
    const lipSyncData = JSON.parse(await fs.readFile(lipSyncDataPath, 'utf-8'));
    const cues = parseRhubarbData(lipSyncData);
    
    // Create drawtext filter for visualization
    let drawtextFilter = '';
    cues.forEach((cue, index) => {
      const phoneme = cue.value;
      const description = getPhonemeDescription(phoneme);
      
      drawtextFilter += `drawtext=text='${phoneme} - ${description}':x=10:y=10:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:enable='between(t,${cue.start},${cue.end})'`;
      
      if (index < cues.length - 1) {
        drawtextFilter += ',';
      }
    });
    
    const command = `ffmpeg -i "${videoPath}" -vf "${drawtextFilter}" -c:a copy "${outputPath}" -y`;
    
    await execPromise(command);
    
    console.log('✅ Lip sync visualization generated');
    return outputPath;
  } catch (error) {
    console.error('❌ Visualization generation failed:', error.message);
    return videoPath;
  }
};

/**
 * Compare Wav2Lip vs Rhubarb approaches
 */
const getLipSyncMethodInfo = () => {
  return {
    wav2lip: {
      name: 'Wav2Lip',
      description: 'Deep learning model that generates realistic lip movements',
      pros: ['Very accurate', 'Natural looking', 'Works with any face'],
      cons: ['Requires GPU', 'Slower processing', 'Large model size'],
      useCase: 'Best for realistic movie dubbing',
    },
    rhubarb: {
      name: 'Rhubarb Lip Sync',
      description: 'Phoneme-based lip sync for 2D animation',
      pros: ['Fast', 'Lightweight', 'Good for animation'],
      cons: ['Not for real faces', 'Requires manual mouth shapes', 'Less realistic'],
      useCase: 'Best for 2D animated characters',
    },
  };
};

module.exports = {
  generateRhubarbLipSync,
  parseRhubarbData,
  getPhonemeDescription,
  applyRhubarbLipSyncToVideo,
  generateLipSyncVisualization,
  getLipSyncMethodInfo,
};
