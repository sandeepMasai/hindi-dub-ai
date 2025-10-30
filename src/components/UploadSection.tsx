import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, Loader2, Languages, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "it", name: "Italian (Italiano)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
];

const UploadSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const { toast } = useToast();

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

  const handleProcess = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to upload and process videos",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

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

    console.log("Starting dubbing process:", { 
      fileName: file.name, 
      sourceLanguage, 
      targetLanguage 
    });
    
    navigate("/dubbing", {
      state: {
        file,
        sourceLanguage,
        targetLanguage,
        sourceLangName: languages.find(l => l.code === sourceLanguage)?.name,
        targetLangName: languages.find(l => l.code === targetLanguage)?.name,
      },
    });
  };

  return (
    <section id="upload" className="py-24 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            Try It Now
          </h2>
          <p className="text-xl text-muted-foreground">
            Upload your video and see the magic
          </p>
        </div>

        <div
          className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5"
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
            className="hidden"
            id="video-upload-section"
          />

          <div className="text-center space-y-6">
            {!file ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xl font-semibold">
                    Drop your video here or click to browse
                  </p>
                  <p className="text-muted-foreground">
                    MP4, MOV, AVI supported • Max 2GB
                  </p>
                </div>

                <Button 
                  className="bg-gradient-hero hover:shadow-glow-purple" 
                  size="lg"
                  onClick={() => document.getElementById('video-upload-section')?.click()}
                  type="button"
                >
                  Browse Files
                </Button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <FileVideo className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="space-y-3">
                    <Label htmlFor="source-lang" className="flex items-center gap-2 text-base">
                      <Languages className="w-4 h-4 text-primary" />
                      Source Language
                    </Label>
                    <Select value={sourceLanguage} onValueChange={setSourceLanguage} disabled={isProcessing}>
                      <SelectTrigger id="source-lang" className="bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target-lang" className="flex items-center gap-2 text-base">
                      <Languages className="w-4 h-4 text-primary" />
                      Target Language
                    </Label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage} disabled={isProcessing}>
                      <SelectTrigger id="target-lang" className="bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="bg-gradient-hero hover:shadow-glow-purple"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Start Dubbing"
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setFile(null)}
                    variant="outline"
                    size="lg"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
