import { Brain, Languages, Mic, Video, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Translation",
    description: "Advanced neural networks context और emotions को समझकर accurate translation देते हैं",
  },
  {
    icon: Mic,
    title: "Natural Voice Cloning",
    description: "Original actors की voice quality और tone को preserve करते हुए Hindi में convert करें",
  },
  {
    icon: Video,
    title: "Perfect Lip-Sync",
    description: "Video के साथ perfectly synchronized lip movements के लिए advanced AI technology",
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "English से Hindi के अलावा multiple Indian languages में dubbing support",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Minutes में complete movie dubbing - traditional methods से 10x faster",
  },
  {
    icon: Shield,
    title: "Studio Quality",
    description: "Professional-grade audio processing और quality control for theatrical releases",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Powerful Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-leading AI technology से powered complete dubbing solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-purple"
              >
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" />
                
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
