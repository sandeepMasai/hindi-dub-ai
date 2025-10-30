import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";
import { 
  Upload, 
  Settings, 
  Sparkles, 
  Download, 
  Video, 
  Mic, 
  Brain,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Video",
    description: "Start by uploading your English video file. We support all major formats including MP4, MOV, AVI, and more.",
    details: [
      "Drag and drop or browse to select",
      "Maximum file size: 2GB",
      "Supports HD and 4K videos",
      "Secure encrypted upload"
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure Settings",
    description: "Customize your dubbing preferences including voice type, emotion level, and lip-sync accuracy.",
    details: [
      "Choose voice characteristics",
      "Set emotion preservation level",
      "Select lip-sync precision",
      "Pick output quality"
    ],
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI Processing",
    description: "Our advanced AI analyzes the video, extracts audio, translates to Hindi, and generates natural voice with perfect lip-sync.",
    details: [
      "Audio extraction and analysis",
      "Context-aware translation",
      "Voice cloning and synthesis",
      "Lip-sync synchronization"
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    number: "04",
    icon: Download,
    title: "Download Result",
    description: "Preview your dubbed video and download it in your preferred format. Ready for distribution!",
    details: [
      "Preview before download",
      "Multiple format options",
      "High-quality output",
      "Instant availability"
    ],
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Translation",
    description: "Neural networks understand context, idioms, and cultural nuances for accurate translation."
  },
  {
    icon: Mic,
    title: "Voice Cloning",
    description: "Preserve the original actor's voice characteristics, tone, and emotion in Hindi."
  },
  {
    icon: Video,
    title: "Perfect Lip-Sync",
    description: "Advanced algorithms ensure lip movements match the Hindi audio perfectly."
  },
];

const HowItWorksPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated backgrounds */}
      <GradientOrbs />
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Step by Step Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                How It Works
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your English videos into Hindi in just 4 simple steps. 
              Our AI-powered platform makes professional dubbing accessible to everyone.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-24">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={index}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
                  >
                    {/* Icon and Number */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className={`w-32 h-32 rounded-2xl ${step.bgColor} border-2 border-primary/20 flex items-center justify-center backdrop-blur-sm`}>
                          <Icon className={`w-16 h-16 ${step.color}`} />
                        </div>
                        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-gradient-hero flex items-center justify-center text-2xl font-bold shadow-lg">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold">{step.title}</h3>
                        <p className="text-lg text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <div 
                            key={detailIndex}
                            className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                          >
                            <CheckCircle className={`w-5 h-5 ${step.color} flex-shrink-0 mt-0.5`} />
                            <span className="text-sm text-foreground/80">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Powered by Advanced AI
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our cutting-edge technology ensures the highest quality dubbing
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-purple"
                  >
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Visualization */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                Processing Timeline
              </h2>
              <p className="text-xl text-muted-foreground">
                See how fast our AI works
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 -translate-x-1/2" />

              <div className="space-y-12">
                {[
                  { time: "0-30s", title: "Upload & Analysis", desc: "Video uploaded and analyzed" },
                  { time: "30s-2m", title: "Audio Processing", desc: "Audio extracted and processed" },
                  { time: "2-5m", title: "Translation & Voice", desc: "Content translated and voice generated" },
                  { time: "5-8m", title: "Lip-Sync & Render", desc: "Final video rendered with perfect sync" },
                ].map((item, index) => (
                  <div key={index} className="relative flex items-center gap-8">
                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'order-2'}`}>
                      <div className="inline-block p-6 rounded-xl bg-card border border-border">
                        <div className="text-sm text-primary font-semibold mb-2">{item.time}</div>
                        <div className="font-semibold mb-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-gradient-hero border-4 border-background relative z-10" />
                    <div className={`flex-1 ${index % 2 === 0 ? 'order-2' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground">
              Transform your videos with AI-powered dubbing today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-hero hover:shadow-glow-purple text-lg px-8 py-6"
              >
                <span className="flex items-center gap-2">
                  Start Dubbing Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorksPage;
