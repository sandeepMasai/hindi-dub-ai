import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Volume2 } from "lucide-react";

interface AudioWaveformProps {
  audioUrl?: string;
  title?: string;
  description?: string;
}

const AudioWaveform = ({ audioUrl, title = "Audio Preview", description = "Listen to the dubbed audio" }: AudioWaveformProps) => {
  if (!audioUrl) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Audio Player */}
          <audio
            controls
            className="w-full"
            src={audioUrl}
          >
            Your browser does not support the audio element.
          </audio>

          {/* Waveform Visualization (Placeholder) */}
          <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="flex items-end gap-1 h-full py-4">
              {Array.from({ length: 50 }).map((_, i) => {
                const height = Math.random() * 60 + 20;
                return (
                  <div
                    key={i}
                    className="bg-primary/40 rounded-t transition-all hover:bg-primary/60"
                    style={{
                      width: '2%',
                      height: `${height}%`,
                      animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Music className="w-4 h-4" />
            <span>Hindi dubbed audio with emotion-aware voice</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioWaveform;
