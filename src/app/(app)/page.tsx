'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, MessageSquare, Shield, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import messages from '@/messages.json';

// Fix for the Particles component to avoid hydration errors

// Particles for background effect
const Particles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    duration: number;
    delay: number;
    size: number;
    initialX: number;
    initialY: number;
  }>>([]);
  
  // Generate particles only on the client side to avoid hydration mismatch
  useEffect(() => {
    const particleCount = 30;
    const generatedParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      duration: Math.random() * 40 + 20,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100
    }));
    
    setParticles(generatedParticles);
  }, []);
  
  if (particles.length === 0) {
    return null; // Return nothing on first render to match SSR
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: particle.size,
            height: particle.size,
            top: `${particle.initialY}%`,
            left: `${particle.initialX}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.4, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Main section animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3
    } 
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      type: "spring",
      stiffness: 100
    } 
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      delay: 0.6
    } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      type: "spring",
      bounce: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    filter: "blur(10px)",
    transition: { duration: 0.3 }
  }
};

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    } 
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(30, 20, 60, 0.8)",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
    transition: { 
      duration: 0.2 
    }
  }
};

// Footer animations
const footerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    } 
  }
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position for the glow effect
  const glowX = useTransform(mouseX, [-100, 100], [-50, 50]);
  const glowY = useTransform(mouseY, [-100, 100], [-50, 50]);

  // Track mouse movement for the glow effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
  }, [messages.length]);

  const startAutoplay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  }, [nextSlide]); // Add nextSlide as a dependency

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + messages.length) % messages.length);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay]); // Add startAutoplay to dependency array

  const [currentYear, setCurrentYear] = useState(""); 

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <>
      <main 
        className="flex-grow flex flex-col items-center justify-center relative py-16 overflow-hidden"
        style={{
          background: "radial-gradient(circle at 50% 50%, #1a0b2e 0%, #12071d 100%)"
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Mystery-themed particles background */}
        <Particles />
        
        {/* Animated spotlight effect */}
        <motion.div 
          className="absolute pointer-events-none w-[40vw] h-[40vw] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-purple-600 to-blue-400"
          style={{ 
            x: glowX,
            y: glowY,
            top: "30%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
        
        {/* Main content container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-5xl px-4 md:px-8 z-10"
        >
          {/* Header section with title and subtitle */}
          <motion.section className="text-center mb-12">
            <motion.h1 
              className="inline-block text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={titleVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                Unveil the Hidden Truth
              </span>
              <motion.span
                animate={{ 
                  opacity: [1, 0.6, 1],
                  textShadow: [
                    "0 0 5px rgba(167, 139, 250, 0.7)",
                    "0 0 20px rgba(167, 139, 250, 1)",
                    "0 0 5px rgba(167, 139, 250, 0.7)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block ml-2"
              >
                <Sparkles size={36} className="inline text-purple-300" />
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto"
              variants={subtitleVariants}
            >
              Share and receive anonymous feedback in the shadows. Your identity remains veiled, but your words illuminate.
            </motion.p>
          </motion.section>
          
          {/* Message carousel */}
          <motion.div 
            className="w-full max-w-lg mx-auto relative mb-16"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.3)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ 
                    x: direction > 0 ? 300 : -300,
                    opacity: 0,
                    filter: "blur(10px)"
                  }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4 },
                      filter: { duration: 0.3 }
                    }
                  }}
                  exit={{ 
                    x: direction < 0 ? 300 : -300, 
                    opacity: 0,
                    filter: "blur(10px)",
                    transition: {
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.3 },
                      filter: { duration: 0.2 }
                    }
                  }}
                  className="w-full"
                >
                  <motion.div 
                    className="p-4"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md text-white shadow-xl overflow-hidden border border-purple-500/30">
                      <CardHeader className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-purple-500/30">
                        <CardTitle className="text-xl font-bold">
                          <motion.div 
                            className="flex items-center"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <MessageSquare className="mr-2 text-purple-300" size={20} />
                            {messages[currentIndex].title}
                          </motion.div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start gap-4 p-6">
                        <motion.div 
                          whileHover={{ rotate: [0, -5, 5, -5, 5, 0], scale: 1.1 }}
                          className="bg-gradient-to-br from-purple-600 to-indigo-800 p-3 rounded-full shadow-lg shadow-purple-900/50"
                        >
                          <Mail className="text-white" size={24} />
                        </motion.div>
                        <div>
                          <motion.p 
                            className="text-gray-200 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            {messages[currentIndex].content}
                          </motion.p>
                          <motion.p 
                            className="text-xs text-purple-300 mt-3 italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            {messages[currentIndex].received}
                          </motion.p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation arrows */}
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-purple-900/60 hover:bg-purple-800/80 p-2 rounded-r-lg text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                  stopAutoplay();
                  startAutoplay();
                }}
                whileHover={{ scale: 1.1, x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft />
              </motion.button>
              
              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-900/60 hover:bg-purple-800/80 p-2 rounded-l-lg text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                  stopAutoplay();
                  startAutoplay();
                }}
                whileHover={{ scale: 1.1, x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight />
              </motion.button>
            </div>
            
            {/* Pagination indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {messages.map((_, index) => (
                <motion.div 
                  key={index}
                  className={`h-2 rounded-full cursor-pointer ${
                    index === currentIndex 
                      ? 'bg-purple-400 w-6' 
                      : 'bg-white/20 w-2'
                  }`}
                  whileHover={{ scale: 1.3, backgroundColor: "rgb(192, 132, 252)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                    stopAutoplay();
                    startAutoplay();
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Feature highlights */}
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            variants={containerVariants}
          >
            {[
              {
                icon: <Shield className="text-purple-300" />,
                title: "Complete Anonymity",
                description: "Your identity remains protected. Share feedback without revealing who you are."
              },
              {
                icon: <MessageSquare className="text-purple-300" />,
                title: "Honest Feedback",
                description: "Receive genuine thoughts and opinions in a safe, judgment-free environment."
              },
              {
                icon: <Eye className="text-purple-300" />,
                title: "Total Control",
                description: "Manage your profile and choose when to receive anonymous messages."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 text-center"
                variants={featureVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-900/50 flex items-center justify-center"
                  whileHover={{ rotate: 360, transition: { duration: 0.7 } }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-purple-200 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>
          
          {/* CTA button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link href="/sign-in" passHref>
              <motion.div
                className="inline-block rounded-full overflow-hidden" // Added these classes to match button shape
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 px-8 text-lg rounded-full">
                  <motion.span
                    animate={{ 
                      textShadow: [
                        "0 0 5px rgba(255, 255, 255, 0)",
                        "0 0 10px rgba(255, 255, 255, 0.5)",
                        "0 0 5px rgba(255, 255, 255, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Start Your Mystery Journey
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Enhanced footer with animation */}
      <motion.footer 
        className="bg-gray-900 text-gray-300 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.7 }}
      >
        {/* Animated background element */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-indigo-900/10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
        
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand section */}
            <motion.div variants={footerItemVariants} className="col-span-1 md:col-span-1">
              <motion.div 
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                </motion.div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                  True Feedback
                </span>
              </motion.div>
              <p className="text-sm text-gray-400 mb-4">
                The anonymous feedback platform where truth flows freely and identities remain hidden.
              </p>
            </motion.div>

            {/* Quick links */}
            <motion.div variants={footerItemVariants} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    How it works
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Features
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Security
                  </motion.a>
                </li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={footerItemVariants} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Privacy Policy
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Terms of Service
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Cookie Policy
                  </motion.a>
                </li>
              </ul>
            </motion.div>

            {/* Connect */}
            <motion.div variants={footerItemVariants} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a 
                    href="https://github.com/sahilvishwa2108/feedback_app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-300 transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Contact Us
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Support
                  </motion.a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom section */}
          <motion.div 
            className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear || "2025"} True Feedback. All rights reserved. Share thoughts, stay anonymous.
            </p>
            <motion.div 
              className="flex space-x-4"
              variants={containerVariants}
            >
              {['Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                <motion.a 
                  key={index}
                  href="#"
                  className="text-gray-500 hover:text-purple-300 transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}