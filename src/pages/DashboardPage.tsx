import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  FileVideo,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Film,
  Languages,
  Subtitles,
  Music,
  Smile,
} from "lucide-react";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";

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
  emotions?: Array<{ emotion: string; confidence: number }>;
  subtitles?: { srt?: string; vtt?: string; json?: string };
  createdAt: string;
  processedFilePath?: string;
  errorMessage?: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchVideos();
    const interval = setInterval(fetchVideos, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const videosList = data.videos || data || [];
        setVideos(videosList);
        
        // Calculate stats - safely handle empty or undefined arrays
        const total = Array.isArray(videosList) ? videosList.length : 0;
        const completed = Array.isArray(videosList) ? videosList.filter((v: Video) => v.status === "completed").length : 0;
        const processing = Array.isArray(videosList) ? videosList.filter((v: Video) => v.status === "processing").length : 0;
        const failed = Array.isArray(videosList) ? videosList.filter((v: Video) => v.status === "failed").length : 0;
        
        setStats({ total, completed, processing, failed });
      } else {
        // Handle non-OK responses
        setVideos([]);
        setStats({ total: 0, completed: 0, processing: 0, failed: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setVideos([]);
      setStats({ total: 0, completed: 0, processing: 0, failed: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (videoId: string, fileName: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dubbed_${fileName}`;
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

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Project Deleted",
          description: "Video project has been deleted",
        });
        fetchVideos();
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete the project",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrbs />
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                My Projects
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your video dubbing projects
              </p>
            </div>
            <Button onClick={() => navigate("/upload")} size="lg">
              <Upload className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">{stats.processing}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats.failed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : videos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileVideo className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by uploading your first video for dubbing
                </p>
                <Button onClick={() => navigate("/upload")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <FileVideo className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">{video.originalFileName}</h3>
                          {getStatusBadge(video.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Languages className="w-4 h-4" />
                              Languages
                            </p>
                            <p className="font-medium">
                              {video.sourceLanguage.toUpperCase()} → {video.targetLanguage.toUpperCase()}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Duration
                            </p>
                            <p className="font-medium">{formatDuration(video.duration)}</p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Film className="w-4 h-4" />
                              Type
                            </p>
                            <p className="font-medium capitalize">{video.videoType || "Movie"}</p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Size</p>
                            <p className="font-medium">{formatFileSize(video.fileSize)}</p>
                          </div>
                        </div>

                        {/* Additional Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {video.voiceMode && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Music className="w-3 h-3" />
                              {video.voiceMode}
                            </Badge>
                          )}
                          {video.emotions && video.emotions.length > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Smile className="w-3 h-3" />
                              Emotion-aware
                            </Badge>
                          )}
                          {video.subtitles && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Subtitles className="w-3 h-3" />
                              Subtitles
                            </Badge>
                          )}
                        </div>
                        
                        {video.status === "processing" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{video.progress}%</span>
                            </div>
                            <Progress value={video.progress} className="h-2" />
                          </div>
                        )}
                        
                        {video.status === "failed" && video.errorMessage && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                            <p className="font-medium">Error:</p>
                            <p>{video.errorMessage}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => navigate(`/video/${video._id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {video.status === "completed" && (
                          <Button
                            onClick={() => handleDownload(video._id, video.originalFileName)}
                            size="sm"
                            variant="default"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => handleDelete(video._id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
