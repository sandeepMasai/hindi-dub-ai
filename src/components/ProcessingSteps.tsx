import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";

interface ProcessingStep {
  name: string;
  label: string;
  icon: string;
  completed: boolean;
}

interface ProcessingStepsProps {
  steps: {
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
  status: string;
  progress: number;
}

const ProcessingSteps = ({ steps, status, progress }: ProcessingStepsProps) => {
  const allSteps: ProcessingStep[] = [
    { name: "upload", label: "Upload", icon: "📤", completed: steps.upload || false },
    { name: "audioExtraction", label: "Audio Extraction", icon: "🎵", completed: steps.audioExtraction || false },
    { name: "emotionDetection", label: "Emotion Detection", icon: "🎭", completed: steps.emotionDetection || false },
    { name: "translation", label: "Translation", icon: "🌐", completed: steps.translation || false },
    { name: "voiceSynthesis", label: "Voice Synthesis", icon: "🎤", completed: steps.voiceSynthesis || false },
    { name: "backgroundMusicExtraction", label: "Background Music", icon: "🎶", completed: steps.backgroundMusicExtraction || false },
    { name: "lipSync", label: "Lip Sync", icon: "👄", completed: steps.lipSync || false },
    { name: "subtitleGeneration", label: "Subtitle Generation", icon: "📝", completed: steps.subtitleGeneration || false },
    { name: "rendering", label: "Final Rendering", icon: "🎬", completed: steps.rendering || false },
  ];

  const getStepIcon = (step: ProcessingStep, index: number) => {
    if (status === "failed") {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }
    
    if (step.completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    // Check if this is the current step based on progress
    const stepProgress = ((index + 1) / allSteps.length) * 100;
    if (progress >= stepProgress - 10 && progress < stepProgress + 10 && status === "processing") {
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
    
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  const getStepStatus = (step: ProcessingStep, index: number) => {
    if (status === "failed") {
      return "error";
    }
    
    if (step.completed) {
      return "completed";
    }
    
    const stepProgress = ((index + 1) / allSteps.length) * 100;
    if (progress >= stepProgress - 10 && progress < stepProgress + 10 && status === "processing") {
      return "processing";
    }
    
    return "pending";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Processing Steps</span>
          <Badge variant={status === "completed" ? "default" : status === "failed" ? "destructive" : "secondary"}>
            {status === "processing" ? `${progress}%` : status}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track the progress of your video dubbing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allSteps.map((step, index) => {
            const stepStatus = getStepStatus(step, index);
            
            return (
              <div
                key={step.name}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  stepStatus === "completed"
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : stepStatus === "processing"
                    ? "bg-primary/5 border-primary/20 animate-pulse"
                    : stepStatus === "error"
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-muted/50 border-muted"
                }`}
              >
                <div className="flex-shrink-0">
                  {getStepIcon(step, index)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.icon}</span>
                    <span className={`font-medium ${
                      stepStatus === "completed" ? "text-green-700 dark:text-green-300" :
                      stepStatus === "processing" ? "text-primary" :
                      stepStatus === "error" ? "text-destructive" :
                      "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {stepStatus === "completed" && (
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      Done
                    </Badge>
                  )}
                  {stepStatus === "processing" && (
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Processing...
                    </Badge>
                  )}
                  {stepStatus === "error" && (
                    <Badge variant="destructive">
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {status === "completed" && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Processing Complete!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Your dubbed video is ready to download
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Processing Failed</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              An error occurred during processing. Please try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingSteps;
