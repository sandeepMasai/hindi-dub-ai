import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/GradientOrbs";
import AnimatedBackground from "@/components/AnimatedBackground";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get plan details from navigation state
  const plan = location.state?.plan || {
    name: "Free",
    price: 0,
    duration: "month"
  };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    
    // Card Details
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    
    // UPI Details
    upiId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const validateForm = () => {
    // Personal details validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required personal details",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    // Payment method specific validation
    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        toast({
          title: "Missing Card Details",
          description: "Please fill in all card information",
          variant: "destructive",
        });
        return false;
      }

      // Card number validation (should be 16 digits)
      const cardDigits = formData.cardNumber.replace(/\s/g, "");
      if (cardDigits.length !== 16) {
        toast({
          title: "Invalid Card Number",
          description: "Card number must be 16 digits",
          variant: "destructive",
        });
        return false;
      }

      // CVV validation
      if (formData.cvv.length !== 3 && formData.cvv.length !== 4) {
        toast({
          title: "Invalid CVV",
          description: "CVV must be 3 or 4 digits",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (!formData.upiId) {
        toast({
          title: "Missing UPI ID",
          description: "Please enter your UPI ID",
          variant: "destructive",
        });
        return false;
      }

      // Basic UPI ID validation
      if (!formData.upiId.includes("@")) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., username@upi)",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: plan.name,
          amount: plan.price,
          paymentMethod,
          personalDetails: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentDetails: paymentMethod === "card" ? {
            cardNumber: formData.cardNumber.replace(/\s/g, ""),
            cardName: formData.cardName,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
          } : {
            upiId: formData.upiId,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Payment Successful!",
          description: `Your ${plan.name} plan has been activated`,
        });
        
        // Navigate to dashboard after successful payment
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error(data.message || "Payment failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GradientOrbs />
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <Card className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Payment Details</CardTitle>
                    <CardDescription>
                      Complete your purchase securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Personal Information
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+91 98765 43210"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              placeholder="India"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street address"
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Mumbai"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="Maharashtra"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              placeholder="400001"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payment Method</h3>
                        
                        <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="card" className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Card
                            </TabsTrigger>
                            <TabsTrigger value="upi" className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              UPI
                            </TabsTrigger>
                          </TabsList>

                          {/* Card Payment */}
                          <TabsContent value="card" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number *</Label>
                              <Input
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                required={paymentMethod === "card"}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cardName">Cardholder Name *</Label>
                              <Input
                                id="cardName"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                placeholder="JOHN DOE"
                                required={paymentMethod === "card"}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date *</Label>
                                <Input
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleExpiryChange}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  required={paymentMethod === "card"}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV *</Label>
                                <Input
                                  id="cvv"
                                  name="cvv"
                                  type="password"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  placeholder="123"
                                  maxLength={4}
                                  required={paymentMethod === "card"}
                                />
                              </div>
                            </div>
                          </TabsContent>

                          {/* UPI Payment */}
                          <TabsContent value="upi" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="upiId">UPI ID *</Label>
                              <Input
                                id="upiId"
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleInputChange}
                                placeholder="username@upi"
                                required={paymentMethod === "upi"}
                              />
                              <p className="text-sm text-muted-foreground">
                                Enter your UPI ID (e.g., 9876543210@paytm, username@okaxis)
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-hero hover:shadow-glow-purple"
                        size="lg"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          "Processing..."
                        ) : (
                          `Pay ₹${plan.price.toLocaleString()}`
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-card/50 backdrop-blur-sm border-border sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-semibold">{plan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing</span>
                        <span className="capitalize">{plan.duration}ly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{plan.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (18%)</span>
                        <span>₹{(plan.price * 0.18).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          ₹{(plan.price * 1.18).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-muted-foreground">
                          Secure payment processing
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-muted-foreground">
                          Instant plan activation
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-muted-foreground">
                          Cancel anytime
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Payment;
