import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: `${selectedFile.name} ready for processing`,
      });
    }
  };

  const handleProcess = () => {
    if (!file) return;
    
    setIsProcessing(true);
    // Simulating processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing Complete!",
        description: "Your dubbed video is ready for download",
      });
    }, 3000);
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            अभी Try करें
          </h2>
          <p className="text-xl text-muted-foreground">
            अपनी video upload करें और magic देखें
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
            id="video-upload"
          />

          <div className="text-center space-y-6">
            {!file ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xl font-semibold">
                    Drop your video here या click करें
                  </p>
                  <p className="text-muted-foreground">
                    MP4, MOV, AVI supported • Max 2GB
                  </p>
                </div>

                <label htmlFor="video-upload">
                  <Button className="bg-gradient-hero hover:shadow-glow-purple" size="lg">
                    Browse Files
                  </Button>
                </label>
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
