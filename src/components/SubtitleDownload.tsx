import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Subtitles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubtitleDownloadProps {
  videoId: string;
  subtitles?: {
    srt?: string;
    vtt?: string;
    json?: string;
  };
}

const SubtitleDownload = ({ videoId, subtitles }: SubtitleDownloadProps) => {
  const { toast } = useToast();

  const handleDownload = async (format: 'srt' | 'vtt' | 'json') => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/videos/${videoId}/subtitles/${format}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subtitles_${videoId}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Download Started",
          description: `Subtitle file (${format.toUpperCase()}) is downloading`,
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download subtitle file",
        variant: "destructive",
      });
    }
  };

  if (!subtitles || (!subtitles.srt && !subtitles.vtt && !subtitles.json)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Subtitles className="w-5 h-5 text-primary" />
          Subtitles
        </CardTitle>
        <CardDescription>
          Download subtitles in different formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {subtitles.srt && (
          <Button
            onClick={() => handleDownload('srt')}
            variant="outline"
            className="w-full justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            <div className="flex-1 text-left">
              <div className="font-medium">SRT Format</div>
              <div className="text-xs text-muted-foreground">
                SubRip - Compatible with most video players
              </div>
            </div>
            <Download className="w-4 h-4 ml-2" />
          </Button>
        )}

        {subtitles.vtt && (
          <Button
            onClick={() => handleDownload('vtt')}
            variant="outline"
            className="w-full justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            <div className="flex-1 text-left">
              <div className="font-medium">VTT Format</div>
              <div className="text-xs text-muted-foreground">
                WebVTT - Perfect for web players
              </div>
            </div>
            <Download className="w-4 h-4 ml-2" />
          </Button>
        )}

        {subtitles.json && (
          <Button
            onClick={() => handleDownload('json')}
            variant="outline"
            className="w-full justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            <div className="flex-1 text-left">
              <div className="font-medium">JSON Format</div>
              <div className="text-xs text-muted-foreground">
                Structured data with timestamps
              </div>
            </div>
            <Download className="w-4 h-4 ml-2" />
          </Button>
        )}

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Use SRT for most video players, VTT for web, and JSON for custom applications
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubtitleDownload;
