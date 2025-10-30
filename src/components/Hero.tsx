import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI-Powered Video Dubbing</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            Transform English Movies
          </span>
          <br />
          <span className="text-foreground">Into Hindi Instantly</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Create professional quality dubbing with advanced AI technology that preserves lip-sync and emotions perfectly
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link to="/upload">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-hero hover:shadow-glow-purple transition-all duration-300 text-lg px-8 py-6"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Dubbing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          
          <Link to="/how-it-works">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 hover:bg-primary/10 hover:border-primary text-lg px-8 py-6"
            >
              See How It Works
            </Button>
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-accent">10x</div>
            <div className="text-sm text-muted-foreground">Faster</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">AI</div>
            <div className="text-sm text-muted-foreground">Powered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
