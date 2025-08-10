
import React from 'react';
import Logo from './Logo';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <Logo size="lg" />
        <div className="mt-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute top-0 w-20 h-20 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
