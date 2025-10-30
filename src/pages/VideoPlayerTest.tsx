import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";

const VideoPlayerTest = () => {
  // Sample video URL - you can replace this with your own test video
  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrbs />
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl mt-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Video Player Test
            </h1>
            <p className="text-muted-foreground">
              Test the custom video player with sample content
            </p>
          </div>

          {/* Video Player */}
          <div className="mb-8">
            <VideoPlayer
              videoUrl={sampleVideoUrl}
              title="Sample Video - Big Buck Bunny"
              description="Test video with custom player controls"
            />
          </div>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle>Video Player Features</CardTitle>
              <CardDescription>
                Custom video player with advanced controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Playback Controls:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>▶️ Play / Pause</li>
                    <li>⏪ Skip backward (10s)</li>
                    <li>⏩ Skip forward (10s)</li>
                    <li>🔊 Volume control</li>
                    <li>🔇 Mute / Unmute</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Display Features:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>⛶ Fullscreen mode</li>
                    <li>📊 Progress bar with seek</li>
                    <li>⏱️ Time display (current / total)</li>
                    <li>🎬 Click to play/pause</li>
                    <li>👆 Auto-hide controls</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold mb-2">How to Use:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Click the play button or anywhere on the video to start</li>
                  <li>Use the progress bar to seek to any point in the video</li>
                  <li>Adjust volume with the slider or click mute icon</li>
                  <li>Click fullscreen icon for immersive viewing</li>
                  <li>Controls auto-hide during playback (hover to show)</li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                  ✅ Ready for Your Dubbed Videos
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Once your video is processed, you'll be able to watch it with this player.
                  All your dubbed videos will include:
                </p>
                <ul className="text-sm text-green-600 dark:text-green-400 mt-2 space-y-1 list-disc list-inside">
                  <li>Hindi voice dubbing with emotions</li>
                  <li>Perfect lip synchronization</li>
                  <li>Original background music preserved</li>
                  <li>Subtitles (downloadable separately)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default VideoPlayerTest;
