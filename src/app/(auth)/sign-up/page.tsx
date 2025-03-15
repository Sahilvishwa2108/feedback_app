'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Loader2, UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

// Better mysterious particles effect
const MysteriousParticles = () => {
  // Using client-side rendering to avoid hydration issues
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 1, 
            height: Math.random() * 2 + 1,
            background: `rgba(168, 85, 247, ${Math.random() * 0.3 + 0.1})`
          }}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: 0
          }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Enhanced animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.1,
      duration: 0.6
    } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Ref to store the cancel token of the current API request
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  // Use a ref to store the debounced function
  const debouncedCheckUsername = useRef(
    useDebounceCallback(async (username: string) => {
      if (username.length > 3) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset previous message

        // Cancel any previous pending request
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel('New request initiated');
        }
        cancelTokenRef.current = axios.CancelToken.source();

        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${encodeURIComponent(username)}`,
            { cancelToken: cancelTokenRef.current.token }
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          if (axios.isCancel(error)) {
            // Request was canceled—no action needed.
            console.log('Previous request canceled');
          } else {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
              axiosError.response?.data.message ?? 'Error checking username'
            );
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }, 500)
  ).current;

  useEffect(() => {
    if (username.length > 3) {
      debouncedCheckUsername(username);
    } else if (username.length > 0 && username.length <= 3) {
      setUsernameMessage('Username must be longer than 3 characters');
    } else {
      setUsernameMessage('');
    }
  }, [username, debouncedCheckUsername]);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900">
      {/* Background effects */}
      <MysteriousParticles />
      
      {/* Subtle radial gradient in center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Subtle gradient lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
            style={{
              top: `${15 + i * 20}%`,
              left: 0,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{
              duration: 8 + i * 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <motion.div
        className="flex justify-center items-center min-h-screen px-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="w-full max-w-md"
          variants={itemVariants}
        >
          <motion.div 
            className="p-8 rounded-xl backdrop-blur-md bg-gray-900/70 border border-purple-500/20 shadow-2xl shadow-purple-950/20"
            whileHover={{ boxShadow: "0 8px 32px rgba(124, 58, 237, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <div className="relative">
                  <UserPlus className="h-12 w-12 text-purple-400" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent"
                variants={titleVariants}
              >
                Join the Mystery
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                >
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Create your anonymous feedback account
              </motion.p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <motion.div variants={itemVariants}>
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-purple-400" />
                          <span>Username</span>
                        </FormLabel>
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              {...field}
                              className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all"
                              onChange={(e) => {
                                field.onChange(e);
                                setUsername(e.target.value);
                              }}
                            />
                          </motion.div>
                          <AnimatePresence>
                            {isCheckingUsername && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute right-3 top-2.5"
                              >
                                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence>
                          {!isCheckingUsername && usernameMessage && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center space-x-1 mt-1"
                            >
                              {usernameMessage === 'Username is unique' ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                              <p
                                className={`text-sm ${
                                  usernameMessage === 'Username is unique'
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }`}
                              >
                                {usernameMessage}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-purple-400" />
                          <span>Email</span>
                        </FormLabel>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field}
                            className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all"
                          />
                        </motion.div>
                        <p className="text-gray-400 text-xs mt-1">
                          We'll send a verification code to this email
                        </p>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-purple-400" />
                          <span>Password</span>
                        </FormLabel>
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                              className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all pr-10" 
                              placeholder="Create a secure password"
                            />
                          </motion.div>
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-purple-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </motion.button>
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-900/30"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <span>Sign Up</span>
                      )}
                    </Button>
                    
                    {/* Subtle glow effect on button */}
                    <motion.div
                      className="absolute -inset-1 rounded-md bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-md z-[-1]"
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </motion.div>
              </form>
            </Form>

            <motion.div 
              className="text-center mt-8 text-sm"
              variants={itemVariants}
            >
              <p className="text-gray-400">
                Already a member?{' '}
                <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  <motion.span whileHover={{ 
                    textShadow: "0 0 8px rgba(168, 85, 247, 0.6)",
                   }}>
                    Sign in
                  </motion.span>
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;