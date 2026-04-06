import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SubscriptionManagementPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: '🚧 Feature Coming Soon',
      description: `${action} functionality will be available once Stripe integration is complete! 🚀`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Subscription Management - SurSadhana</title>
        <meta name="description" content="Manage your SurSadhana subscription, view billing history, and update payment methods." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">Subscription Management</h1>
            <p className="text-xl text-gray-400">
              Manage your plan and billing settings
            </p>
          </motion.div>

          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glassmorphism p-8 rounded-2xl mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Current Plan</h2>
                <p className="text-3xl font-bold text-gradient">{user?.subscription || 'Free'}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-amber-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white font-semibold">Active</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Next Renewal</p>
                <p className="text-white font-semibold">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            {user?.subscription === 'free' ? (
              <Button onClick={() => handleAction('Upgrade')} className="gradient-saffron w-full">
                Upgrade to Premium
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={() => handleAction('Change Plan')} variant="outline" className="flex-1 border-amber-500 text-amber-500">
                  Change Plan
                </Button>
                <Button onClick={() => handleAction('Cancel')} variant="outline" className="flex-1 border-red-500 text-red-500">
                  Cancel Subscription
                </Button>
              </div>
            )}
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism p-8 rounded-2xl mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Method</h2>
                <p className="text-gray-400">Manage your payment information</p>
              </div>
              <CreditCard className="h-12 w-12 text-amber-500" />
            </div>

            <div className="p-4 bg-white/5 rounded-lg mb-4">
              <p className="text-gray-400 text-sm mb-2">No payment method on file</p>
              <p className="text-white">Add a payment method to subscribe to premium plans</p>
            </div>

            <Button onClick={() => handleAction('Add Payment Method')} className="gradient-saffron w-full">
              Add Payment Method
            </Button>
          </motion.div>

          {/* Billing History */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glassmorphism p-8 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Billing History</h2>
                <p className="text-gray-400">View your past invoices and payments</p>
              </div>
              <Calendar className="h-12 w-12 text-amber-500" />
            </div>

            <div className="text-center py-8">
              <p className="text-gray-400">No billing history available</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionManagementPage;