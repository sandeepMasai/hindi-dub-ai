import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Smile, Frown, Angry, Zap, Heart, Wind } from "lucide-react";

interface Emotion {
  timestamp: number;
  emotion: string;
  confidence: number;
  text?: string;
}

interface EmotionVisualizationProps {
  emotions: Emotion[];
  duration?: number;
}

const EmotionVisualization = ({ emotions, duration = 100 }: EmotionVisualizationProps) => {
  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return <Smile className="w-4 h-4 text-yellow-500" />;
      case "sad":
        return <Frown className="w-4 h-4 text-blue-500" />;
      case "angry":
        return <Angry className="w-4 h-4 text-red-500" />;
      case "surprised":
        return <Zap className="w-4 h-4 text-purple-500" />;
      case "fearful":
        return <Wind className="w-4 h-4 text-gray-500" />;
      case "calm":
        return <Heart className="w-4 h-4 text-green-500" />;
      default:
        return <Smile className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return "bg-yellow-500";
      case "sad":
        return "bg-blue-500";
      case "angry":
        return "bg-red-500";
      case "surprised":
        return "bg-purple-500";
      case "fearful":
        return "bg-gray-500";
      case "calm":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getEmotionBadgeVariant = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return "default";
      case "sad":
        return "secondary";
      case "angry":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-primary" />
          Emotion Analysis
        </CardTitle>
        <CardDescription>
          Detected emotions throughout the video
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emotion Timeline */}
        <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
          {emotions.map((emotion, index) => {
            const startPercent = (emotion.timestamp / duration) * 100;
            const nextTimestamp = emotions[index + 1]?.timestamp || duration;
            const widthPercent = ((nextTimestamp - emotion.timestamp) / duration) * 100;
            
            return (
              <div
                key={index}
                className={`absolute h-full ${getEmotionColor(emotion.emotion)} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                }}
                title={`${emotion.emotion} (${Math.round(emotion.confidence * 100)}%)`}
              />
            );
          })}
        </div>

        {/* Emotion List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {emotions.map((emotion, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="mt-1">
                {getEmotionIcon(emotion.emotion)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getEmotionBadgeVariant(emotion.emotion)}>
                      {emotion.emotion}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(emotion.timestamp)}
                    </span>
                  </div>
                  <span className="text-xs font-medium">
                    {Math.round(emotion.confidence * 100)}%
                  </span>
                </div>
                {emotion.text && (
                  <p className="text-sm text-muted-foreground italic">
                    "{emotion.text}"
                  </p>
                )}
                <Progress value={emotion.confidence * 100} className="h-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Emotion Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-4 border-t">
          {Object.entries(
            emotions.reduce((acc, e) => {
              acc[e.emotion] = (acc[e.emotion] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([emotion, count]) => (
            <div
              key={emotion}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted"
            >
              {getEmotionIcon(emotion)}
              <span className="text-sm font-medium capitalize">{emotion}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {count}x
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionVisualization;
