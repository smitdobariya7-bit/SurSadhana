import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'Forever',
      features: [
        'Basic Riyaz Guide',
        'Raag Library Access',
        'AI Guru (5 questions/day)',
        'Tabla Sadhana',
        'Community Forums'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Monthly',
      price: '₹299',
      period: 'per month',
      features: [
        'Everything in Free',
        'Unlimited AI Guru Access',
        'Advanced Practice Tools',
        'Audio Recording & Analysis',
        'Progress Tracking',
        'Tabla Loops Library',
        'Exclusive Learning Content',
        'Priority Support'
      ],
      cta: 'Subscribe Monthly',
      popular: true
    },
    {
      name: 'Annual',
      price: '₹2,999',
      period: 'per year',
      features: [
        'Everything in Monthly',
        'Save ₹589 (17% off)',
        'Offline Content Access',
        'Personalized Learning Path',
        '1-on-1 Guru Sessions (2/month)',
        'Lifetime Resource Updates',
        'Certificate of Completion',
        'VIP Community Access'
      ],
      cta: 'Subscribe Annually',
      popular: false
    }
  ];

  const handleSubscribe = (planName) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to subscribe to a plan.',
      });
      navigate('/login');
      return;
    }

    toast({
      title: '🚧 Feature Coming Soon',
      description: 'Payment integration with Stripe is being set up. You can request this feature in your next prompt! 🚀',
    });
  };

  return (
    <>
      <Helmet>
        <title>Pricing - SurSadhana</title>
        <meta name="description" content="Choose the perfect plan for your musical journey. Flexible pricing with weekly, monthly, and annual options." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-white">Choose Your Plan</h1>
            <p className="text-xl text-gray-400">
              Unlock your musical potential with the right plan for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glassmorphism rounded-2xl p-8 ${
                  plan.popular ? 'ring-2 ring-amber-500 scale-105' : ''
                } hover:scale-110 transition-transform relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="gradient-saffron px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <Check className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-6 ${
                    plan.popular
                      ? 'gradient-saffron'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 max-w-3xl mx-auto glassmorphism p-8 rounded-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gradient">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-400">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-400">The Free plan is available forever with no credit card required. You can upgrade anytime.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400">We accept all major credit/debit cards, UPI, and net banking through our secure payment partner Stripe.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;