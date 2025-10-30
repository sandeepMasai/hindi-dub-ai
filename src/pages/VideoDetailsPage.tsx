import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  ArrowLeft,
  FileVideo,
  Languages,
  Clock,
  Film,
  Mic,
  CheckCircle,
  XCircle,
} from "lucide-react";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";
import EmotionVisualization from "@/components/EmotionVisualization";
import SubtitleDownload from "@/components/SubtitleDownload";
import ProcessingSteps from "@/components/ProcessingSteps";
import AudioWaveform from "@/components/AudioWaveform";
import VideoPlayer from "@/components/VideoPlayer";

interface Video {
  _id: string;
  originalFileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  progress: number;
  duration?: number;
  fileSize?: number;
  videoType?: string;
  voiceMode?: string;
  audioSource?: string;
  emotions?: Array<{ timestamp: number; emotion: string; confidence: number; text?: string }>;
  subtitles?: { srt?: string; vtt?: string; json?: string };
  backgroundMusic?: { extracted: boolean; path?: string };
  lipSyncData?: { method?: string; dataPath?: string };
  processingSteps?: {
    upload?: boolean;
    audioExtraction?: boolean;
    emotionDetection?: boolean;
    translation?: boolean;
    voiceSynthesis?: boolean;
    backgroundMusicExtraction?: boolean;
    lipSync?: boolean;
    subtitleGeneration?: boolean;
    rendering?: boolean;
  };
  createdAt: string;
  processedFilePath?: string;
  errorMessage?: string;
}

const VideoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVideoDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideo(data.video);
      }
    } catch (error) {
      console.error("Failed to fetch video details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (id) {
      fetchVideoDetails();
      const interval = setInterval(fetchVideoDetails, 3000);
      return () => clearInterval(interval);
    }
  }, [id, isAuthenticated, navigate, fetchVideoDetails]);

  const handleDownload = async () => {
    if (!video) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dubbed_${video.originalFileName}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Download Started",
          description: "Your dubbed video is downloading",
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the video",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading video details...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
          <Button onClick={() => navigate("/projects")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrbs />
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FileVideo className="w-8 h-8 text-primary" />
                {video.originalFileName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Created {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            {video.status === "completed" && (
              <Button onClick={handleDownload} size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
            )}
          </div>

          {/* Video Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Video Information</CardTitle>
              <CardDescription>Details about your dubbing project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm">Languages</span>
                  </div>
                  <p className="font-semibold">
                    {video.sourceLanguage.toUpperCase()} → {video.targetLanguage.toUpperCase()}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-semibold">{formatDuration(video.duration)}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Film className="w-4 h-4" />
                    <span className="text-sm">Type</span>
                  </div>
                  <p className="font-semibold capitalize">{video.videoType || "Movie"}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Voice Mode</span>
                  </div>
                  <p className="font-semibold capitalize">{video.voiceMode || "Natural"}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {video.emotions && video.emotions.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    🎭 Emotion-aware
                  </Badge>
                )}
                {video.subtitles && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    📝 Subtitles
                  </Badge>
                )}
                {video.backgroundMusic?.extracted && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    🎵 Background Music
                  </Badge>
                )}
                {video.lipSyncData?.method && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    👄 {video.lipSyncData.method === 'wav2lip' ? 'Wav2Lip' : 'Rhubarb'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Video Player - Full Width */}
          {video.status === "completed" && video.processedFilePath && (
            <div className="mb-8">
              <VideoPlayer
                videoUrl={`http://localhost:5000/api/videos/${video._id}/download`}
                title="Dubbed Video Preview"
                description="Watch your Hindi dubbed video with all features applied"
                poster={`http://localhost:5000/api/videos/${video._id}/thumbnail`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Processing Steps */}
            <ProcessingSteps
              steps={video.processingSteps || {}}
              status={video.status}
              progress={video.progress}
            />

            {/* Emotion Visualization */}
            {video.emotions && video.emotions.length > 0 && (
              <EmotionVisualization
                emotions={video.emotions}
                duration={video.duration}
              />
            )}

            {/* Subtitle Download */}
            {video.subtitles && (
              <SubtitleDownload
                videoId={video._id}
                subtitles={video.subtitles}
              />
            )}

            {/* Audio Preview */}
            {video.status === "completed" && (
              <AudioWaveform
                audioUrl={`http://localhost:5000/api/videos/${video._id}/audio`}
                title="Dubbed Audio Preview"
                description="Listen to the Hindi dubbed audio"
              />
            )}
          </div>

          {/* Error Message */}
          {video.status === "failed" && video.errorMessage && (
            <Card className="mt-8 border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  Processing Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{video.errorMessage}</p>
                <Button className="mt-4" variant="outline">
                  Retry Processing
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default VideoDetailsPage;
