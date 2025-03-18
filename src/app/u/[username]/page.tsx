'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageSquare, Wand2, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { motion, AnimatePresence } from 'framer-motion';
import suggestedMessages from '@/suggested-messages.json';

const specialChar = '||';

// Parse the message string into an array of messages
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

// Function to get random messages from the JSON file
const getRandomMessages = (count: number = 3): string => {
  // Create a copy of the array to avoid modifying the original
  const messagesCopy = [...suggestedMessages];
  const selectedMessages: string[] = [];
  
  // Select random messages
  for (let i = 0; i < count; i++) {
    if (messagesCopy.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * messagesCopy.length);
    selectedMessages.push(messagesCopy[randomIndex]);
    
    // Remove the selected message to avoid duplicates
    messagesCopy.splice(randomIndex, 1);
  }
  
  // Join messages with the special character
  return selectedMessages.join(specialChar);
};

// Initial message string now uses random messages from the JSON file
const initialMessageString = getRandomMessages(3);

// Enhanced animations with more dramatic effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
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
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 8px 30px rgba(88, 80, 236, 0.25)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

// Deep Space Starfield Background
const DarkStarfield = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Smaller distant stars */}
      {Array.from({ length: 100 }).map((_, i) => {
        const size = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-blue-100"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity,
              boxShadow: `0 0 ${Math.random() * 2 + 1}px rgba(255, 255, 255, ${opacity})`,
            }}
            animate={{
              opacity: [opacity, opacity * 1.5, opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "mirror",
              delay: Math.random() * 5,
            }}
          />
        );
      })}
      
      {/* Distant nebula clouds */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: `${Math.random() * 40 + 30}%`,
            height: `${Math.random() * 40 + 30}%`,
            background: `radial-gradient(circle at center, 
              rgba(30, 27, 75, 0.8), 
              rgba(15, 23, 42, 0.2))`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.11, 0.08],
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

// Subtle Grid Lines
const SubtleGrid = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-indigo-900/10 to-transparent"
          style={{
            top: `${(i+1) * 12.5}%`,
            left: 0,
          }}
          animate={{
            opacity: [0.03, 0.07, 0.03],
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
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent"
          style={{
            left: `${(i+1) * 12.5}%`,
            top: 0,
          }}
          animate={{
            opacity: [0.03, 0.07, 0.03],
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

// Shooting Stars
const ShootingStars = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const angle = Math.random() * 60 + 30; // 30-90 degrees
        const distance = Math.random() * 30 + 20; // 20-50% of screen
        
        // Calculate end position based on angle and distance
        const radians = (angle * Math.PI) / 180;
        const endX = startX + distance * Math.cos(radians);
        const endY = startY - distance * Math.sin(radians); // Negative because Y increases downwards
        
        return (
          <motion.div
            key={`shooting-star-${i}`}
            className="absolute w-1 h-1 bg-blue-100 rounded-full"
            style={{
              top: `${startY}%`,
              left: `${startX}%`,
              boxShadow: "0 0 4px #fff, 0 0 10px #fff",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              top: [`${startY}%`, `${endY}%`],
              left: [`${startX}%`, `${endX}%`],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              boxShadow: [
                "0 0 4px rgba(255,255,255,0.1), 0 0 10px rgba(255,255,255,0.1)",
                "0 0 8px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)",
                "0 0 4px rgba(255,255,255,0.1), 0 0 10px rgba(255,255,255,0.1)"
              ]
            }}
            transition={{
              duration: Math.random() * 1.5 + 1,
              delay: Math.random() * 5 + (i * 2),
              repeat: Infinity,
              repeatDelay: Math.random() * 15 + 10,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params?.username || 'unknown';

  // Replace useCompletion hook with local state
  const [suggestedMessageString, setSuggestedMessageString] = useState<string>(initialMessageString);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

  const handleMessageClick = (message: string, index: number) => {
    form.setValue('content', message);
    setSelectedMessageIndex(index);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
      setSelectedMessageIndex(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated function to fetch suggested messages locally
  const fetchSuggestedMessages = () => {
    setIsRefreshing(true);
    // Add a slight delay to show the loading state
    setTimeout(() => {
      setSuggestedMessageString(getRandomMessages(3));
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050314] py-16 px-4">
      {/* Background effects - improved with more mysterious elements */}
      <DarkStarfield />
      <SubtleGrid />
      <ShootingStars />
      
      {/* Deep space radial gradient for more depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(49,46,129,0.05),transparent_80%)] pointer-events-none"></div>
      
      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Decorative elements - subtler and more mysterious */}
        <motion.div 
          className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] rounded-full bg-indigo-900/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />

        <motion.div
          className="mb-14 text-center"
          variants={itemVariants}
        >
          <div className="inline-block relative">
            <motion.div
              className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-700/20 to-indigo-700/20 blur-xl"
              animate={{ 
                rotate: [0, 360],
                scale: [0.8, 1, 0.8],
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />
            <motion.div 
              className="relative bg-gradient-to-r from-indigo-600 to-blue-700 p-1.5 rounded-full inline-flex items-center justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          
          <motion.h1
            className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-300 mb-4"
            animate={{ 
              textShadow: [
                "0 0 8px rgba(99, 102, 241, 0.3)",
                "0 0 16px rgba(99, 102, 241, 0.5)",
                "0 0 8px rgba(99, 102, 241, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            @{username}
          </motion.h1>
          
          <motion.p className="text-blue-100/70 max-w-lg mx-auto font-light">
            Share your honest thoughts anonymously. Your identity remains hidden in the shadows, but your message will be heard.
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-gray-900/90 via-[#0c0a20]/80 to-gray-900/90 rounded-xl p-6 sm:p-8 backdrop-blur-md border border-indigo-900/30 shadow-[0_0_25px_rgba(79,70,229,0.15)]"
          variants={itemVariants}
        >
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-indigo-100 flex items-center gap-2 mb-2">
                        <MessageSquare className="h-5 w-5 text-indigo-400" />
                        <span>Send Anonymous Message</span>
                      </FormLabel>
                      <div className="relative group">
                        <motion.div 
                          className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/40 to-blue-600/40 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-700"
                          animate={{
                            background: [
                              "linear-gradient(to right, rgba(79, 70, 229, 0.4), rgba(59, 130, 246, 0.4))",
                              "linear-gradient(to right, rgba(59, 130, 246, 0.4), rgba(79, 70, 229, 0.4))",
                              "linear-gradient(to right, rgba(79, 70, 229, 0.4), rgba(59, 130, 246, 0.4))"
                            ]
                          }}
                          transition={{ duration: 8, repeat: Infinity }}
                        />
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className="relative bg-[#0a0821]/80 min-h-[120px] border-indigo-500/20 text-blue-50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 resize-none placeholder:text-indigo-200/30"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div 
                className="flex justify-center"
                variants={itemVariants}
              >
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={itemVariants}
                >
                  {isLoading ? (
                    <Button disabled className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-none shadow-[0_4px_20px_rgba(79,70,229,0.3)] px-8">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isLoading || !messageContent}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-none shadow-[0_4px_20px_rgba(79,70,229,0.25)] px-8 relative overflow-hidden group"
                    >
                      {/* Animated glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 opacity-0 group-hover:opacity-100"
                        animate={{
                          left: ["-100%", "100%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      />
                      
                      <motion.div
                        className="flex items-center gap-2 relative z-10"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Send className="h-4 w-4" />
                        Send Anonymously
                      </motion.div>
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </motion.form>
          </Form>
        </motion.div>

        <motion.div 
          className="mt-12 mb-8" 
          variants={itemVariants}
        >
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-bold text-indigo-100 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Wand2 className="h-6 w-6 text-indigo-400" />
              Message Suggestions
            </motion.h2>
            
            <motion.div whileHover="hover" whileTap="tap" variants={itemVariants}>
              <Button
                onClick={fetchSuggestedMessages}
                className="bg-[#0a0821]/80 hover:bg-[#0f0c30]/80 text-indigo-200 border border-indigo-500/20 shadow-[0_2px_10px_rgba(79,70,229,0.15)]"
                disabled={isRefreshing}
              >
                <motion.div className="flex items-center gap-2">
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                  )}
                  {isRefreshing ? "Generating..." : "Refresh Suggestions"}
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          <Card className="bg-gradient-to-br from-gray-900/80 via-[#0c0a20]/70 to-gray-900/80 border-indigo-500/20 shadow-[0_5px_30px_rgba(79,70,229,0.15)] overflow-hidden">
            <CardHeader className="border-b border-indigo-900/30 bg-gradient-to-r from-indigo-900/20 to-gray-900/30 pb-4">
              <p className="text-indigo-200/70 text-sm">
                Click on any message below to use it as your feedback
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {false ? (
                  <motion.p 
                    className="text-red-400 p-4 border border-red-900/30 rounded-lg bg-red-950/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Error message placeholder
                  </motion.p>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={suggestedMessageString} // Changed from completion to suggestedMessageString
                  >
                    {parseStringMessages(suggestedMessageString).map((message, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        layout
                      >
                        <motion.div
                          className={`relative overflow-hidden ${selectedMessageIndex === index ? 
                            'bg-gradient-to-r from-indigo-900/40 to-blue-900/40' : 
                            'bg-[#0a0821]/60 hover:bg-[#0f0c30]/60'} 
                            rounded-lg border ${selectedMessageIndex === index ? 
                            'border-indigo-500/40' : 'border-indigo-800/30'} 
                            transition-colors p-4 cursor-pointer`}
                          onClick={() => handleMessageClick(message, index)}
                        >
                          {/* Selected message highlight effect */}
                          {selectedMessageIndex === index && (
                            <motion.div
                              className="absolute inset-0 bg-indigo-500/5"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: [0, 0.2, 0],
                                transition: { 
                                  repeat: Infinity, 
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }
                              }}
                            />
                          )}
                          
                          <div className="flex items-start gap-3">
                            <motion.div
                              animate={selectedMessageIndex === index ? 
                                { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                              transition={{ duration: 0.5 }}
                              className={`rounded-full p-1.5 ${selectedMessageIndex === index ? 
                                'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-900/50 text-indigo-400/80'}`}
                            >
                              <MessageSquare size={16} />
                            </motion.div>
                            <p className={`text-sm ${selectedMessageIndex === index ? 'text-indigo-200' : 'text-indigo-200/80'}`}>
                              {message}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="my-8 bg-indigo-500/20" />
        
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <motion.p className="text-indigo-200/70 mb-6">
            Want to receive anonymous feedback like this too?
          </motion.p>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={itemVariants}
          >
            <Link href="/sign-up">
              <Button
                className="bg-gradient-to-r from-indigo-600/90 to-blue-700/90 hover:from-indigo-600 hover:to-blue-700 text-white border-none shadow-[0_4px_20px_rgba(79,70,229,0.25)] px-8 relative overflow-hidden group"
              >
                {/* Better glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 opacity-0 group-hover:opacity-100"
                  animate={{
                    left: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="flex items-center gap-2 relative z-10"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Your Own Profile
                </motion.div>
              </Button>
            </Link>
          </motion.div>
          
          {/* Improved decorative element */}
          <motion.div 
            className="mt-12 opacity-20"
            animate={{ 
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <div className="h-[1px] w-[80%] mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}