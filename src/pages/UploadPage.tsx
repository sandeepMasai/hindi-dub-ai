import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileVideo, 
  Languages, 
  X, 
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Film,
  Mic
} from "lucide-react";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi (हिंदी)", flag: "🇮🇳" },
  { code: "es", name: "Spanish (Español)", flag: "🇪🇸" },
  { code: "fr", name: "French (Français)", flag: "🇫🇷" },
  { code: "de", name: "German (Deutsch)", flag: "🇩🇪" },
  { code: "it", name: "Italian (Italiano)", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese (Português)", flag: "🇵🇹" },
  { code: "ru", name: "Russian (Русский)", flag: "🇷🇺" },
  { code: "ja", name: "Japanese (日本語)", flag: "🇯🇵" },
  { code: "ko", name: "Korean (한국어)", flag: "🇰🇷" },
  { code: "zh", name: "Chinese (中文)", flag: "🇨🇳" },
  { code: "ar", name: "Arabic (العربية)", flag: "🇸🇦" },
  { code: "bn", name: "Bengali (বাংলা)", flag: "🇧🇩" },
  { code: "ta", name: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "te", name: "Telugu (తెలుగు)", flag: "🇮🇳" },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // New options
  const [duration, setDuration] = useState("5"); // 5, 10, custom
  const [customDuration, setCustomDuration] = useState("");
  const [videoType, setVideoType] = useState("movie"); // movie, short
  const [voiceMode, setVoiceMode] = useState("natural"); // natural, expressive, calm

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      toast({
        title: "File Selected",
        description: `${droppedFile.name} ready for processing`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a video file",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: `${selectedFile.name} ready for processing`,
      });
    } else if (selectedFile) {
      toast({
        title: "Invalid File",
        description: "Please upload a video file",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleStartDubbing = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a video file first",
        variant: "destructive",
      });
      return;
    }
    
    if (sourceLanguage === targetLanguage) {
      toast({
        title: "Invalid Selection",
        description: "Source and target languages must be different",
        variant: "destructive",
      });
      return;
    }

    // Navigate to dubbing page with file data
    navigate("/dubbing", {
      state: {
        file,
        sourceLanguage,
        targetLanguage,
        sourceLangName: languages.find(l => l.code === sourceLanguage)?.name,
        targetLangName: languages.find(l => l.code === targetLanguage)?.name,
        duration: duration === "custom" ? customDuration : duration,
        videoType,
        voiceMode,
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <GradientOrbs />
      
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Upload Your Video
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your video into any language with AI-powered dubbing
            </p>
          </div>

          {/* Main Upload Card */}
          <Card className="border-border bg-gradient-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Video Upload
              </CardTitle>
              <CardDescription>
                Upload your video file and select languages for dubbing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
                  id="video-upload-input"
                  style={{ display: 'none' }}
                />

                {!file ? (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xl font-semibold">
                        Drop your video here or click to browse
                      </p>
                      <p className="text-muted-foreground">
                        Supported formats: MP4, MOV, AVI, MKV • Max 100MB
                      </p>
                    </div>

                    <Button 
                      className="bg-gradient-hero hover:shadow-glow-purple" 
                      size="lg"
                      onClick={() => document.getElementById('video-upload-input')?.click()}
                      type="button"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                      <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center flex-shrink-0">
                        <FileVideo className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="mt-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Uploading... {uploadProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>File ready for processing</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="source-lang" className="flex items-center gap-2 text-base">
                    <Languages className="w-4 h-4 text-primary" />
                    Source Language
                  </Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger id="source-lang" className="bg-card border-border h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The language of your original video
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="target-lang" className="flex items-center gap-2 text-base">
                    <Languages className="w-4 h-4 text-primary" />
                    Target Language
                  </Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger id="target-lang" className="bg-card border-border h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    The language you want to dub into
                  </p>
                </div>
              </div>

              {/* Video Duration */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-primary" />
                  Video Duration (minutes)
                </Label>
                <RadioGroup value={duration} onValueChange={setDuration} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="duration-5" />
                    <Label htmlFor="duration-5" className="cursor-pointer font-normal">
                      5 minutes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10" id="duration-10" />
                    <Label htmlFor="duration-10" className="cursor-pointer font-normal">
                      10 minutes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="duration-custom" />
                    <Label htmlFor="duration-custom" className="cursor-pointer font-normal">
                      Custom
                    </Label>
                  </div>
                </RadioGroup>
                {duration === "custom" && (
                  <Input
                    type="number"
                    placeholder="Enter duration in minutes"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="mt-2 bg-card border-border"
                    min="1"
                    max="180"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  Select the approximate duration of your video
                </p>
              </div>

              {/* Video Type */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base">
                  <Film className="w-4 h-4 text-primary" />
                  Video Type
                </Label>
                <RadioGroup value={videoType} onValueChange={setVideoType} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="movie" id="type-movie" />
                    <Label htmlFor="type-movie" className="cursor-pointer font-normal">
                      🎬 Movie/Long Form
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="type-short" />
                    <Label htmlFor="type-short" className="cursor-pointer font-normal">
                      📱 Short/Reel
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Choose the type of content for optimized processing
                </p>
              </div>

              {/* Voice Mode */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base">
                  <Mic className="w-4 h-4 text-primary" />
                  Voice Mode
                </Label>
                <Select value={voiceMode} onValueChange={setVoiceMode}>
                  <SelectTrigger className="bg-card border-border h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Natural</span>
                        <span className="text-xs text-muted-foreground">Balanced and realistic</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="expressive">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Expressive</span>
                        <span className="text-xs text-muted-foreground">Emotional and dynamic</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="calm">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Calm</span>
                        <span className="text-xs text-muted-foreground">Smooth and soothing</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="energetic">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Energetic</span>
                        <span className="text-xs text-muted-foreground">Lively and enthusiastic</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the voice style for dubbing
                </p>
              </div>

              {/* Info Box */}
              <div className="flex gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-500">Processing Time</p>
                  <p className="text-muted-foreground">
                    Typical processing time is 5-8 minutes for a 1-minute video. 
                    You'll be able to track progress in real-time.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleStartDubbing}
                  disabled={!file}
                  className="flex-1 bg-gradient-hero hover:shadow-glow-purple transition-all duration-300 h-12"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start Dubbing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="sm:w-auto h-12"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Info */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="border-border bg-gradient-card backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Languages className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">15+ Languages</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for major world languages
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-card backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Natural voice synthesis & lip sync
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-card backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Real-time Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Track every step of the process
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadPage;
