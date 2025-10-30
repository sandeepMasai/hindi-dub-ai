import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Music,
  Languages,
  Sparkles,
  Video,
  FileVideo,
  Download,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";
import { getApiUrl, API_ENDPOINTS, getAuthHeaders } from "@/config/api";

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "pending" | "processing" | "completed" | "error";
}

const DubbingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get file and language data from navigation state
  const {
    file,
    sourceLanguage,
    targetLanguage,
    sourceLangName,
    targetLangName,
  } = location.state || {};

  const [videoId, setVideoId] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState("5-8 minutes");

  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: "upload",
      title: "Uploading Video",
      description: "Securely uploading your video file",
      icon: Upload,
      status: "pending",
    },
    {
      id: "audio",
      title: "Extracting Audio",
      description: "Separating audio from video",
      icon: Music,
      status: "pending",
    },
    {
      id: "translation",
      title: "Translation",
      description: `Translating from ${sourceLangName || "English"} to ${targetLangName || "Hindi"}`,
      icon: Languages,
      status: "pending",
    },
    {
      id: "voice",
      title: "Voice Synthesis",
      description: "Generating natural voice in target language",
      icon: Sparkles,
      status: "pending",
    },
    {
      id: "lipsync",
      title: "Lip Sync",
      description: "Synchronizing lip movements with new audio",
      icon: Video,
      status: "pending",
    },
    {
      id: "rendering",
      title: "Final Rendering",
      description: "Creating your dubbed video",
      icon: FileVideo,
      status: "pending",
    },
  ]);

  useEffect(() => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a video first",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Start processing automatically
    startProcessing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startProcessing = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Upload video
      updateStepStatus(0, "processing");
      const uploadedVideoId = await uploadVideo();
      setVideoId(uploadedVideoId);
      updateStepStatus(0, "completed");
      setOverallProgress(15);
      setCurrentStep(1);

      // Step 2: Poll for status updates
      await pollVideoStatus(uploadedVideoId);
    } catch (error) {
      console.error("Processing error:", error);
      updateStepStatus(currentStep, "error");
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An error occurred during processing",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const uploadVideo = async (): Promise<string> => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("sourceLanguage", sourceLanguage || "en");
    formData.append("targetLanguage", targetLanguage || "hi");

    const response = await fetch(getApiUrl(API_ENDPOINTS.UPLOAD_VIDEO), {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    const data = await response.json();
    return data.video.id;
  };

  const pollVideoStatus = async (videoId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.GET_VIDEO(videoId)), {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to get video status");
        }

        const data = await response.json();
        
        // Update progress
        setOverallProgress(data.progress);

        // Update steps based on processing steps
        if (data.processingSteps.audioExtraction) {
          updateStepStatus(1, "completed");
          setCurrentStep(2);
        }
        if (data.processingSteps.translation) {
          updateStepStatus(2, "completed");
          setCurrentStep(3);
        }
        if (data.processingSteps.voiceSynthesis) {
          updateStepStatus(3, "completed");
          setCurrentStep(4);
        }
        if (data.processingSteps.lipSync) {
          updateStepStatus(4, "completed");
          setCurrentStep(5);
        }
        if (data.processingSteps.rendering) {
          updateStepStatus(5, "completed");
        }

        // Update current processing step
        if (data.progress < 20) {
          updateStepStatus(1, "processing");
        } else if (data.progress < 40) {
          updateStepStatus(2, "processing");
        } else if (data.progress < 60) {
          updateStepStatus(3, "processing");
        } else if (data.progress < 80) {
          updateStepStatus(4, "processing");
        } else if (data.progress < 100) {
          updateStepStatus(5, "processing");
        }

        // Check if completed
        if (data.status === "completed") {
          clearInterval(pollInterval);
          setIsCompleted(true);
          setIsProcessing(false);
          updateStepStatus(5, "completed");
          toast({
            title: "Processing Complete!",
            description: "Your dubbed video is ready for download",
          });
        }

        // Check if failed
        if (data.status === "failed") {
          clearInterval(pollInterval);
          setIsProcessing(false);
          updateStepStatus(currentStep, "error");
          toast({
            title: "Processing Failed",
            description: data.errorMessage || "An error occurred",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(pollInterval);
        setIsProcessing(false);
      }
    }, 2000); // Poll every 2 seconds
  };

  const updateStepStatus = (stepIndex: number, status: ProcessingStep["status"]) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === stepIndex ? { ...step, status } : step
      )
    );
  };

  const handleDownload = async () => {
    if (!videoId) return;

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.DOWNLOAD_VIDEO(videoId)), {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dubbed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your dubbed video is downloading",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStepIcon = (step: ProcessingStep) => {
    const Icon = step.icon;
    
    if (step.status === "completed") {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (step.status === "processing") {
      return <Loader2 className="w-6 h-6 text-primary animate-spin" />;
    } else if (step.status === "error") {
      return <Icon className="w-6 h-6 text-red-500" />;
    } else {
      return <Icon className="w-6 h-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GradientOrbs />
      <AnimatedBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="pt-24 pb-12 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Header */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {isCompleted ? "Video Ready!" : "Processing Your Video"}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {isCompleted
                  ? "Your dubbed video has been created successfully"
                  : "Please wait while we dub your video"}
              </p>
            </div>

            {/* Video Info Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileVideo className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{file?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {sourceLangName || "English"} → {targetLangName || "Hindi"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>
                  {isCompleted ? "Processing completed" : `${overallProgress}% complete`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={overallProgress} className="h-3" />
              </CardContent>
            </Card>

            {/* Processing Steps */}
            <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
              <CardHeader>
                <CardTitle>Processing Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        step.status === "completed"
                          ? "bg-green-500/5 border-green-500/20"
                          : step.status === "processing"
                          ? "bg-primary/5 border-primary/20"
                          : step.status === "error"
                          ? "bg-red-500/5 border-red-500/20"
                          : "bg-card border-border"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {step.status === "completed" && (
                          <span className="text-xs text-green-500 font-medium">
                            Completed
                          </span>
                        )}
                        {step.status === "processing" && (
                          <span className="text-xs text-primary font-medium">
                            Processing...
                          </span>
                        )}
                        {step.status === "error" && (
                          <span className="text-xs text-red-500 font-medium">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isCompleted && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-hero hover:shadow-glow-purple"
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Video
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {isProcessing && (
              <div className="text-center">
                <p className="text-muted-foreground">
                  Processing in progress... Please don't close this page.
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default DubbingPage;
