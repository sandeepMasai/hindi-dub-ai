import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000/api';

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  description?: string;
  features: string[];
  isPopular: boolean;
  cta?: string;
  order: number;
}

const Pricing = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/plans`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }

      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load pricing plans');
      // Fallback to default plans if API fails
      setPlans([
        {
          _id: '1',
          name: 'Free',
          price: 0,
          currency: '₹',
          duration: 'month',
          features: [
            '5 minutes dubbing per month',
            'Basic voice quality',
            'Standard processing speed',
            'Watermark on output',
            'Email support',
          ],
          isPopular: false,
          order: 1,
        },
        {
          _id: '2',
          name: 'Pro',
          price: 999,
          currency: '₹',
          duration: 'month',
          features: [
            '60 minutes dubbing per month',
            'High-quality voice cloning',
            'Fast processing',
            'No watermark',
            'Priority support',
            'Multiple languages',
          ],
          isPopular: true,
          order: 2,
        },
        {
          _id: '3',
          name: 'Enterprise',
          price: 4999,
          currency: '₹',
          duration: 'month',
          features: [
            'Unlimited dubbing',
            'Premium voice quality',
            'Fastest processing',
            'No watermark',
            '24/7 priority support',
            'All languages',
            'API access',
            'Custom voice training',
          ],
          isPopular: false,
          order: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             perfect plan 
          </p>
          {error && (
            <p className="text-sm text-yellow-600">Using default plans (API unavailable)</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan._id}
              className={`relative p-8 rounded-2xl border ${
                plan.isPopular
                  ? "border-primary bg-gradient-card shadow-glow-purple"
                  : "border-border bg-card"
              } transition-all duration-300 hover:border-primary/50`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-hero text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">
                    {plan.price === 0 ? 'Free' : `${plan.currency}${plan.price}`}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.price > 0 && `/${plan.duration}`}
                  </span>
                </div>

                <Button 
                  className={`w-full  ${
                    plan.isPopular 
                      ? "bg-gradient-hero hover:shadow-glow-purple" 
                      : "bg-secondary hover:shadow-glow-purple"
                  }`}
                  size="lg"
                  onClick={() => navigate('/payment', { state: { plan } })}
                >
                  {plan.cta || (plan.price === 0 ? 'Get Started' : 'Start Free Trial')}
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
