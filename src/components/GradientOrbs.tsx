const GradientOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-blue-500/25 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-violet-500/20 rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />
    </div>
  );
};

export default GradientOrbs;
