'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { motion, useAnimationControls } from 'framer-motion';
import { signInSchema } from '@/schemas/signInSchema';
import { useEffect, useState, useRef } from 'react';
import { MessageSquare, Eye, EyeOff, Lock, UserCircle, Sparkles } from 'lucide-react';

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
      {/* Subtle background dots */}
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

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const buttonControls = useAnimationControls();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange'
  });

  // Check if form is filled completely
  useEffect(() => {
    const subscription = form.watch(() => {
      const values = form.getValues();
      const newIsComplete = !!values.identifier && !!values.password;
      setIsFormComplete(newIsComplete);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, form]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isFormComplete) return;
    
    setIsSubmitting(true);
    buttonControls.start({
      scale: 0.95,
      transition: { duration: 0.2 }
    });
    
    const result = await signIn('credentials', {
      redirect: false,
      email: data.identifier,
      password: data.password,
    });

    setIsSubmitting(false);
    buttonControls.start({ scale: 1 });

    if (result?.error) {
      // Error animations
      buttonControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      });

      if (result.error === 'CredentialsSignin') {
        toast.error('Invalid email or password');
      } else if (result.error.includes('verify your account')) {
        toast.error('Please verify your account before login');
      } else if (result.error.includes('No user found')) {
        toast.error('No user found with this email or username');
      } else {
        toast.error(result.error || 'An error occurred. Please try again later');
      }
      return;
    }

    // Success animation
    buttonControls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.4 }
    });
    
    toast.success("Welcome back to the realm of mystery!");
    
    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900">
      {/* Better background effects */}
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
                  <MessageSquare className="h-12 w-12 text-purple-400" />
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
                Welcome Back
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
                Enter the realm of anonymous feedback
              </motion.p>
            </div>

            <Form {...form}>
              <form 
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-5"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    name="identifier"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-purple-400" />
                          <span>Email/Username</span>
                        </FormLabel>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field} 
                            className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-purple-500 transition-all" 
                            placeholder="Enter your email or username"
                          />
                        </motion.div>
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
                              placeholder="Enter your password"
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

                <motion.div 
                  variants={itemVariants} 
                  className="pt-3"
                >
                  <motion.div
                    animate={buttonControls}
                    className="relative"
                  >
                    <Button 
                      className={`w-full relative z-0 ${
                        isFormComplete 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-900/30" 
                          : "bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-gray-300 cursor-not-allowed"
                      }`}
                      type="submit"
                      disabled={!isFormComplete || isSubmitting}
                    >
                      {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                    
                    {/* Subtle glow effect on button */}
                    <motion.div
                      className="absolute -inset-1 rounded-md bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-md z-[-1]"
                      animate={{ 
                        opacity: isFormComplete ? [0.3, 0.6, 0.3] : 0 
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

            {/* Add this Google Sign-In button section */}
            <motion.div 
              className="mt-6 relative"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="h-px bg-gray-700 flex-grow"></div>
                <span className="text-gray-400 text-sm">or continue with</span>
                <div className="h-px bg-gray-700 flex-grow"></div>
              </div>
              
              <motion.button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="w-full flex items-center justify-center gap-3 bg-gray-800/70 hover:bg-gray-800 text-white py-2 px-4 rounded-md border border-gray-700 transition-all"
                whileHover={{ scale: 1.01, borderColor: 'rgba(168, 85, 247, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="text-center mt-8 text-sm"
              variants={itemVariants}
            >
              <p className="text-gray-400">
                Not a member yet?{' '}
                <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  <motion.span whileHover={{ 
                    textShadow: "0 0 8px rgba(168, 85, 247, 0.6)",
                   }}>
                    Sign up
                  </motion.span>
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}