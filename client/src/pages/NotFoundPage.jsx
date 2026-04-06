import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | SurSadhana</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-9xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-400 mb-8">
            The musical note you're looking for seems to have wandered off the scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gradient-saffron">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.history.back()} className="border-amber-500 text-amber-500">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-12">
            <p className="text-gray-500 italic">
              "संगीत में खोये हुए को रास्ता मिल ही जाता है"
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Those lost in music always find their way
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
