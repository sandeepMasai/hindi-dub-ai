import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UploadSection from "@/components/UploadSection";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import GradientOrbs from "@/components/GradientOrbs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated backgrounds */}
      <GradientOrbs />
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <UploadSection />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
