'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCard } from '@/components/MessageCards';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Link as LinkIcon, MessageSquare, Bell, BellOff, Shield } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Card, CardContent } from '@/components/ui/card';

// Mysterious Nebula Background
const MysteriousNebula = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Nebula clouds */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: `${Math.random() * 60 + 40}%`,
            height: `${Math.random() * 60 + 40}%`,
            background: `radial-gradient(circle at center, 
              rgba(${Math.random() * 100 + 100}, ${Math.random() * 50}, ${Math.random() * 100 + 150}, 0.5), 
              rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 100 + 150}, 0.2))`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08],
            rotate: [`${Math.random() * 360}deg`, `${Math.random() * 360 + 20}deg`],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Particles
const MysteriousParticles = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1, 
            height: Math.random() * 3 + 1,
            background: `rgba(${Math.random() > 0.7 ? '168, 85, 247' : '139, 92, 246'}, ${Math.random() * 0.5 + 0.2})`,
            filter: `blur(${Math.random() > 0.8 ? '1px' : '0px'})`,
          }}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: 0
          }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 20}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100 + (Math.random() > 0.5 ? 10 : -10)}%`],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Cosmic Grid Lines
const CosmicGrid = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
          style={{
            top: `${(i+1) * 7}%`,
            left: 0,
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            backgroundPosition: ['0% 0%', '100% 0%'],
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Vertical lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent"
          style={{
            left: `${(i+1) * 12}%`,
            top: 0,
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            backgroundPosition: ['0% 0%', '0% 100%'],
          }}
          transition={{
            duration: 25 + i * 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Distant Stars
const DistantStars = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 80 }).map((_, i) => {
        const size = Math.random() * 1.5 + 0.5;
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              boxShadow: `0 0 ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.5)`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 24
    } 
  }
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    } 
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 30
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    transition: { 
      duration: 0.2
    } 
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to fetch message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success('Messages refreshed');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to fetch messages'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId));
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to update message settings'
      );
    }
  };

  const startAutoplay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (messages.length === 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 2000);
  }, [messages.length]);

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [messages, startAutoplay]);

  if (!session || !session.user) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-purple-500/20 shadow-xl text-center">
          <CardContent>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
            <p className="text-gray-300">Please sign in to view your dashboard</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Copied to clipboard');
    setCopied(true);
    setShowToast(true);
    
    // Reset copy button state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen py-8 px-4 overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Mysterious background effects */}
      <MysteriousNebula />
      <MysteriousParticles />
      <CosmicGrid />
      <DistantStars />
      
      {/* Improved dark overlay/vignette to ensure no white shows through */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent_70%)] pointer-events-none"
        animate={{ 
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      />
      
      {/* Rest of your code remains the same */}
      <motion.div
        className="max-w-5xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <motion.header 
          className="mb-8 text-center"
          variants={itemVariants}
        >
          <motion.h1
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 mb-2"
            animate={{ 
              textShadow: [
                "0 0 8px rgba(168, 85, 247, 0.4)",
                "0 0 16px rgba(168, 85, 247, 0.6)",
                "0 0 8px rgba(168, 85, 247, 0.4)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Your Mystery Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Manage your anonymous messages and profile settings
          </motion.p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Left sidebar with profile settings */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-purple-500/20 shadow-xl overflow-hidden mb-6">
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="mb-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h2 className="text-xl font-bold text-purple-200 mb-1 flex items-center">
                    <LinkIcon className="mr-2 h-5 w-5 text-purple-400" />
                    Your Unique Link
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Share this link to receive anonymous feedback
                  </p>
                  
                  {/* Link input & copy button */}
                  <div className="relative">
                    <input
                      type="text"
                      value={profileUrl}
                      disabled
                      className="w-full bg-gray-800/50 border border-purple-500/20 rounded-md p-3 text-gray-200 pr-12"
                    />
                    <motion.button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-400 hover:text-purple-300"
                      onClick={copyToClipboard}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={copied ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      <Copy size={18} />
                    </motion.button>
                  </div>
                  
                  {/* Copy toast notification */}
                  <AnimatePresence>
                    {showToast && (
                      <motion.div
                        className="absolute right-8 mt-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        Copied!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <Separator className="my-6 bg-purple-500/20" />
                
                <motion.div 
                  className="mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-purple-200 mb-1 flex items-center">
                    <motion.div 
                      animate={{ 
                        rotate: acceptMessages ? [0, 5, -5, 5, 0] : 0 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: acceptMessages ? Infinity : 0, 
                        repeatDelay: 3
                      }}
                    >
                      {acceptMessages ? (
                        <Bell className="mr-2 h-5 w-5 text-purple-400" />
                      ) : (
                        <BellOff className="mr-2 h-5 w-5 text-gray-400" />
                      )}
                    </motion.div>
                    Message Settings
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Control whether you want to receive new messages
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      {...register('acceptMessages')}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                      className={`${acceptMessages ? 'bg-purple-600' : 'bg-gray-700'} relative`}
                    />
                    <motion.span 
                      className="text-gray-300"
                      animate={{ 
                        color: acceptMessages 
                          ? ['rgb(203, 213, 225)', 'rgb(216, 180, 254)', 'rgb(203, 213, 225)'] 
                          : 'rgb(203, 213, 225)'
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: acceptMessages ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      {isSwitchLoading ? (
                        <span className="flex items-center">
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          Updating...
                        </span>
                      ) : (
                        `Accept Messages: ${acceptMessages ? 'On' : 'Off'}`
                      )}
                    </motion.span>
                  </div>
                </motion.div>
                
                <Separator className="my-6 bg-purple-500/20" />
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-600 hover:to-indigo-600 text-white border-none"
                    onClick={(e) => {
                      e.preventDefault();
                      fetchMessages(true);
                    }}
                    disabled={isLoading}
                  >
                    <motion.div 
                      className="flex items-center gap-2"
                      animate={isLoading ? { rotate: 360 } : {}}
                      transition={{ repeat: isLoading ? Infinity : 0, duration: 1, ease: "linear" }}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="h-4 w-4" />
                      )}
                      {isLoading ? 'Refreshing...' : 'Refresh Messages'}
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
          
          {/* Right section with messages */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-2"
          >
            <Card className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-purple-500/20 shadow-xl overflow-hidden">
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div 
                  className="flex justify-between items-center mb-6"
                  variants={itemVariants}
                >
                  <h2 className="text-xl font-bold text-purple-200 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-purple-400" />
                    Your Messages
                  </h2>
                  <motion.span 
                    className="text-sm px-2 py-1 rounded-full bg-purple-500/20 text-purple-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {messages.length} total
                  </motion.span>
                </motion.div>
                
                <AnimatePresence>
                  {messages.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 gap-4"
                      variants={cardContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {messages.map((message, index) => (
                        <motion.div
                          key={message._id as string}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          layoutId={message._id as string}
                          custom={index}
                        >
                          <MessageCard
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="bg-gray-800/30 border border-purple-500/10 rounded-lg p-8 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate="pulse" // Keep only this one animation
                      exit={{ opacity: 0, y: -10 }}
                      variants={pulseVariants}
                    >
                      <motion.div 
                        className="inline-block mb-4 bg-purple-900/30 p-4 rounded-full"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <MessageSquare className="h-8 w-8 text-purple-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">No Messages Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Share your unique link to start receiving anonymous feedback
                      </p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          className="bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 text-white border-none"
                          onClick={copyToClipboard}
                        >
                          <Copy size={16} className="mr-2" /> Copy Your Link
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UserDashboard;