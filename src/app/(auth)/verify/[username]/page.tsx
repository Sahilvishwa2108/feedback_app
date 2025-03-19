'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, Loader2, Sparkles, RefreshCw, Timer } from 'lucide-react';

// Mysterious particles effect
const MysteriousParticles = () => {
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

// Animation variants
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

// Format time in minutes and seconds
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes in seconds
   
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  });

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);
  
  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    
    const cooldownTimer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params?.username ?? '',
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to verify account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/resend-code`, {
        username: params?.username ?? '',
      });
      
      toast.success(response.data.message || 'Verification code resent successfully');
      // Reset the timeout timer to 10 minutes
      setTimeRemaining(10 * 60);
      // Set a 60-second cooldown for the resend button
      setResendCooldown(60);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to resend verification code');
    } finally {
      setIsResending(false);
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
                  <Shield className="h-12 w-12 text-purple-400" />
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
                Verify Your Account
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
                Enter the verification code sent to your email
              </motion.p>
              
              {/* OTP Timer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-2"
              >
                <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${timeRemaining > 60 ? 'bg-green-950/30 text-green-400' : 'bg-red-950/30 text-red-400'}`}>
                  <Timer className="h-3.5 w-3.5" />
                  <span>
                    {timeRemaining > 0 
                      ? `Expires in ${formatTime(timeRemaining)}` 
                      : "Code expired"
                    }
                  </span>
                </div>
              </motion.div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-400" />
                          <span>Verification Code</span>
                        </FormLabel>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field} 
                            className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all text-center tracking-wider text-lg"
                            placeholder="Enter your code" 
                          />
                        </motion.div>
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
                      disabled={isSubmitting || timeRemaining === 0}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : timeRemaining === 0 ? (
                        <span>Code Expired</span>
                      ) : (
                        <span>Verify Account</span>
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

            {/* Resend Code Button */}
            <motion.div 
              variants={itemVariants}
              className="mt-4"
            >
              <Button
                type="button"
                variant="ghost"
                className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 border border-purple-500/20"
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Resending code...</span>
                  </div>
                ) : resendCooldown > 0 ? (
                  <div className="flex items-center justify-center">
                    <Timer className="mr-2 h-4 w-4" />
                    <span>Resend in {resendCooldown}s</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Resend verification code</span>
                  </div>
                )}
              </Button>
            </motion.div>

            <motion.div 
              className="text-center mt-8 text-sm"
              variants={itemVariants}
            >
              <p className="text-gray-400">
                Check your email inbox for the verification code.
              </p>
              <p className="text-gray-400 mt-1">
                The code will expire in 10 minutes.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-3 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20"
              >
                <p className="text-yellow-300 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Don't see it? Check your spam folder too!</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}