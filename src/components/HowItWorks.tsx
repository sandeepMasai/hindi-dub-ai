import { Upload, Settings, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Video",
    description: "Upload your English movie or video file - all popular formats are supported",
    step: "01",
  },
  {
    icon: Settings,
    title: "Select Settings",
    description: "Customize voice type, emotion level, and lip-sync preferences",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "AI Processing",
    description: "Our AI analyzes the audio and converts it to Hindi with perfect lip-sync",
    step: "03",
  },
  {
    icon: Download,
    title: "Download",
    description: "Download your professional quality dubbed video - ready for distribution",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How It Works?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional dubbing ready in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent -translate-x-1/2" />
                )}
                
                <div className="relative space-y-4 text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-hero blur-xl opacity-50" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-card border-2 border-primary flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
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

export default HowItWorks;
