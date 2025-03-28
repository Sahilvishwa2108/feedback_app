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
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { MysteriousParticles } from '@/app/(auth)/sign-in/page';

// Reuse MysteriousParticles component from sign-in page
// ...

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
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

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const params = useParams<{ token: string }>();
  
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/reset-password', {
        token: params?.token || '',
        password: data.password
      });
      
      toast.success(response.data.message);
      setResetComplete(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to reset password');
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
              <motion.h1 
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Set New Password
              </motion.h1>
              
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {resetComplete 
                  ? "Your password has been reset successfully" 
                  : "Create a new password for your account"}
              </motion.p>
            </div>

            {!resetComplete ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <motion.div variants={itemVariants}>
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-purple-400" />
                            <span>New Password</span>
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
                                placeholder="Create new password"
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
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-purple-400" />
                            <span>Confirm Password</span>
                          </FormLabel>
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                {...field} 
                                className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all pr-10" 
                                placeholder="Confirm new password"
                              />
                            </motion.div>
                            <motion.button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-purple-300 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <span>Reset Password</span>
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
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">Password Reset Successful</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Your password has been updated. Redirecting to sign in...
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}