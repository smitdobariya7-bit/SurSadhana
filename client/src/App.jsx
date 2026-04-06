import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import HomePage from '@/pages/HomePage';
import RiyazGuidePage from '@/pages/RiyazGuidePage';
import RaagLibraryPage from '@/pages/RaagLibraryPage';
import InstrumentsPage from '@/pages/InstrumentsPage';
// import TablaSadhanaPage from '@/pages/TablaSadhanaPage'; // Removed
import PracticeTasksPage from '@/pages/PracticeTasksPage';
import AIGuruPage from '@/pages/AIGuruPage';
import PricingPage from '@/pages/PricingPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import SubscriptionManagementPage from '@/pages/SubscriptionManagementPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  const router = createBrowserRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'riyaz-guide', element: <RiyazGuidePage /> },
          { path: 'raag-library', element: <RaagLibraryPage /> },
          { path: 'instruments', element: <InstrumentsPage /> },
          {
            path: 'practice',
            element: (
              <ProtectedRoute>
                <PracticeTasksPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'ai-guru',
            element: (
              <ProtectedRoute>
                <AIGuruPage />
              </ProtectedRoute>
            ),
          },
          { path: 'pricing', element: <PricingPage /> },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'subscription-management',
            element: (
              <ProtectedRoute>
                <SubscriptionManagementPage />
              </ProtectedRoute>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      },
    }
  );

  return (
    <AuthProvider>
      <AudioProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;


