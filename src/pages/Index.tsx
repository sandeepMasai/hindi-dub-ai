import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UploadSection from "@/components/UploadSection";
import Pricing from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <UploadSection />
      <Pricing />
      
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2024 DubAI. AI-Powered Video Dubbing Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
