import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Individual creators और small projects के लिए perfect",
    features: [
      "10 videos per month",
      "Up to 30 minutes each",
      "HD quality output",
      "Basic lip-sync",
      "Email support",
      "Standard processing",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹2,999",
    period: "/month",
    description: "Production houses और content creators के लिए",
    features: [
      "50 videos per month",
      "Up to 2 hours each",
      "4K quality output",
      "Advanced lip-sync",
      "Emotion preservation",
      "Priority processing",
      "24/7 support",
      "Custom voice cloning",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Studios और large-scale operations के लिए",
    features: [
      "Unlimited videos",
      "Unlimited duration",
      "8K quality output",
      "Perfect lip-sync",
      "Full emotion control",
      "Instant processing",
      "Dedicated support",
      "API access",
      "White-label option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Simple Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            हर budget के लिए perfect plan - पैसा कमाना शुरू करें
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "border-primary bg-gradient-card shadow-glow-purple"
                  : "border-border bg-card"
              } transition-all duration-300 hover:border-primary/50`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-hero text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-gradient-hero hover:shadow-glow-purple" 
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 pt-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
