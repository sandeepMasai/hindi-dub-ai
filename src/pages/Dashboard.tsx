import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Film, Clock, CheckCircle, Download, Eye, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, API_ENDPOINTS, getAuthHeaders } from "@/config/api";

interface Video {
  _id: string;
  originalFileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  progress: number;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.GET_VIDEOS), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch videos");

      const data = await response.json();
      setVideos(data);

      // Calculate stats
      const total = data.length;
      const processing = data.filter((v: Video) => v.status === "processing").length;
      const completed = data.filter((v: Video) => v.status === "completed").length;
      setStats({ total, processing, completed });
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (videoId: string, fileName: string) => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.DOWNLOAD_VIDEO(videoId)), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dubbed_${fileName}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your video is downloading...",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the video",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.DELETE_VIDEO(videoId)), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Delete failed");

      toast({
        title: "Video Deleted",
        description: "Video has been removed successfully",
      });

      fetchVideos(); // Refresh list
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete the video",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">{user?.name}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to dub your next video?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-border bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total === 0 ? "No projects yet" : "Total videos"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.processing}</div>
                <p className="text-xs text-muted-foreground">Active dubbing tasks</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Finished projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-border bg-gradient-card mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start dubbing your videos with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/upload")}
                className="w-full md:w-auto bg-gradient-hero hover:shadow-glow-purple transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Video
              </Button>
            </CardContent>
          </Card>

          {/* Videos List */}
          <Card className="border-border bg-gradient-card">
            <CardHeader>
              <CardTitle>My Videos</CardTitle>
              <CardDescription>
                {videos.length === 0 
                  ? "You haven't uploaded any videos yet" 
                  : `${videos.length} video${videos.length > 1 ? 's' : ''} in your library`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12">
                  <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No videos yet. Upload your first video to get started!
                  </p>
                  <Button 
                    onClick={() => navigate("/upload")}
                    className="bg-gradient-hero hover:shadow-glow-purple"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div
                      key={video._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center flex-shrink-0">
                          <Film className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate mb-1">
                            {video.originalFileName}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>{video.sourceLanguage.toUpperCase()} → {video.targetLanguage.toUpperCase()}</span>
                            <span>•</span>
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-2">
                            {getStatusBadge(video.status)}
                            {video.status === "processing" && (
                              <span className="ml-2 text-sm text-muted-foreground">
                                {video.progress}% complete
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {video.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(video._id, video.originalFileName)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                        {video.status === "processing" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/dubbing`, { state: { videoId: video._id } })}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Progress
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(video._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-border bg-gradient-card mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">Free</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
