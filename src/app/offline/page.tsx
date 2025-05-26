'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, Home, MessageSquare } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Try to fetch a simple resource to check connectivity
      await fetch('/', { method: 'HEAD', cache: 'no-cache' });
      router.push('/');
    } catch (error) {
      console.log('Still offline');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-black/20 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isOnline ? (
              <Wifi className="h-12 w-12 text-green-400" />
            ) : (
              <WifiOff className="h-12 w-12 text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isOnline ? 'Back Online!' : 'You\'re Offline'}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isOnline 
              ? 'Your connection has been restored.' 
              : 'Please check your internet connection and try again.'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-gray-400 text-sm">
            <p>Don't worry! Some features of Mystery Message are still available offline:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• View previously loaded messages</li>
              <li>• Access cached pages</li>
              <li>• Browse your dashboard</li>
            </ul>
          </div>

          <div className="space-y-2">
            {isOnline ? (
              <Button 
                onClick={handleGoHome}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to App
              </Button>
            ) : (
              <Button 
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {isRetrying ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRetrying ? 'Checking...' : 'Retry Connection'}
              </Button>
            )}
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Try Cached Version
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center mt-4">
            <p>This app works best with an internet connection, but you can still access some features offline.</p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
