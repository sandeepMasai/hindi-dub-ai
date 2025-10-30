import { Brain, Languages, Mic, Video, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Translation",
    description: "Advanced neural networks understand context and emotions to deliver accurate translations",
  },
  {
    icon: Mic,
    title: "Natural Voice Cloning",
    description: "Convert to Hindi while preserving the original actors' voice quality and tone",
  },
  {
    icon: Video,
    title: "Perfect Lip-Sync",
    description: "Advanced AI technology for perfectly synchronized lip movements with video",
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "Support for dubbing in multiple Indian languages beyond English to Hindi",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Complete movie dubbing in minutes - 10x faster than traditional methods",
  },
  {
    icon: Shield,
    title: "Studio Quality",
    description: "Professional-grade audio processing and quality control for theatrical releases",
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
            Complete dubbing solution powered by industry-leading AI technology
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
