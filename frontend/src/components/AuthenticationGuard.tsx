import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BookOpen } from 'lucide-react';
import LoginButton from './LoginButton';
import LoadingSpinner from './LoadingSpinner';

interface AuthenticationGuardProps {
  children: React.ReactNode;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }) => {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-semibold">Authentication Error</h2>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <BookOpen className="text-primary-600 mx-auto mb-6" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Vocab Tracker
          </h1>
          <p className="text-gray-600 mb-8">
            Track your vocabulary learning progress with spaced repetition. 
            Sign in to start building your personal word collection.
          </p>
          <LoginButton />
          
          <div className="mt-8 text-sm text-gray-500">
            <p>✨ Features included:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Real-time translations in 10+ languages</li>
              <li>Spaced repetition learning system</li>
              <li>Personal vocabulary history</li>
              <li>Progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthenticationGuard;