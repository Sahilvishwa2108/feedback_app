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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { MysteriousParticles } from '@/app/(auth)/sign-in/page';

// Reuse MysteriousParticles component from sign-in page
// ...

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

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

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/forgot-password', data);
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to process request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900">
      {/* Background effects here, same as sign-in */}
      <MysteriousParticles />
      
      {/* Subtle radial gradient in center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_70%)] pointer-events-none"></div>
      
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
              <Link href="/sign-in" className="inline-block mb-6">
                <motion.div 
                  className="flex items-center text-purple-400 hover:text-purple-300"
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm">Back to Sign In</span>
                </motion.div>
              </Link>
              
              <motion.h1 
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Reset Password
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                >
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {emailSent 
                  ? "Check your email for password reset instructions" 
                  : "Enter your email to receive a password reset link"}
              </motion.p>
            </div>

            {!emailSent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-purple-400" />
                            <span>Email Address</span>
                          </FormLabel>
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input 
                              {...field} 
                              className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all"
                              placeholder="Enter your email address"
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <span>Send Reset Link</span>
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
            ) : (
              <motion.div 
                className="text-center py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Check your inbox</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  We've sent a password reset link to your email address.
                </p>
                <Button
                  variant="ghost"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 border border-purple-500/20"
                  onClick={() => router.push('/sign-in')}
                >
                  Return to Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}