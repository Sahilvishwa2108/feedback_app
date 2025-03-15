'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { MessageSquare, Lock, ExternalLink, LogOut, LogIn } from 'lucide-react';

// Enhanced logo with mysterious theme animations
const Logo = () => (
  <motion.svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.25 }}
    />
    <motion.circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="rgba(168, 85, 247, 0.5)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 1],
        opacity: [0, 0.8, 0]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: 1 
      }}
    />
  </motion.svg>
);

// GitHub icon component
const GitHubIcon = () => (
  <motion.svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ rotate: [0, -5, 5, -5, 0] }}
    transition={{ duration: 0.6 }}
  >
    <motion.path
      d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.52 21.272 9.52 21.007C9.52 20.719 9.514 20.061 9.51 19.226C6.73 19.87 6.139 17.794 6.139 17.794C5.694 16.636 5.028 16.326 5.028 16.326C4.132 15.728 5.097 15.739 5.097 15.739C6.094 15.812 6.622 16.766 6.622 16.766C7.52 18.318 8.97 17.839 9.54 17.583C9.631 16.928 9.889 16.449 10.175 16.168C7.955 15.885 5.62 15.073 5.62 11.256C5.62 10.219 6.01 9.369 6.639 8.702C6.539 8.45 6.199 7.566 6.739 6.304C6.739 6.304 7.586 6.036 9.5 7.378C10.3 7.161 11.15 7.054 12 7.05C12.85 7.054 13.7 7.162 14.5 7.378C16.414 6.036 17.26 6.304 17.26 6.304C17.801 7.566 17.461 8.45 17.361 8.702C17.991 9.369 18.38 10.219 18.38 11.256C18.38 15.083 16.042 15.883 13.813 16.161C14.172 16.513 14.492 17.211 14.492 18.273C14.492 19.8 14.479 20.627 14.479 21.007C14.479 21.275 14.659 21.587 15.167 21.489C19.138 20.162 22 16.417 22 12C22 6.477 17.523 2 12 2Z"
      fill="currentColor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  </motion.svg>
);

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <motion.path
      d={isOpen ? "M18 6L6 18" : "M4 6H20"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ d: isOpen ? "M18 6L6 18" : "M4 6H20" }}
      transition={{ duration: 0.3 }}
    />
    <motion.path
      d={isOpen ? "M6 6L18 18" : "M4 12H20"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ d: isOpen ? "M6 6L18 18" : "M4 12H20" }}
      transition={{ duration: 0.3, delay: 0.1 }}
    />
    <motion.path
      d="M4 18H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={{ 
        opacity: isOpen ? 0 : 1,
        pathLength: isOpen ? 0 : 1
      }}
      transition={{ duration: 0.2 }}
    />
  </motion.svg>
);

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Detect scroll for nav appearance change
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.4,
        ease: "easeOut"
      } 
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
      } 
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        delay: 0.2 
      } 
    },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  const mobileMenuVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        ease: "easeInOut"
      }
    },
    open: { 
      height: "auto",
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const mobileItemVariants = {
    closed: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      transition: { duration: 0.2 } 
    },
    open: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      } 
    }
  };

  // Mysterious glow animation for nav
  const glowVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0.1, 0.3, 0.1], 
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 p-4 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled 
            ? "bg-gradient-to-r from-gray-900/95 to-indigo-900/95 border-purple-900/50 shadow-lg shadow-purple-900/20" 
            : "bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-gray-700/30"
        }`}
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        {/* Mysterious glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
        
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and brand name */}
          <motion.div 
            className="flex items-center space-x-2"
            variants={logoVariants}
            whileHover="hover"
          >
            <Logo />
            <motion.div className="relative">
              <motion.span 
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                variants={itemVariants}
              >
                True Feedback
              </motion.span>
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </motion.div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#" 
              className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                <MessageSquare size={16} className="text-purple-400" />
              </motion.div>
              About
            </motion.a>
            <motion.a 
              href="https://github.com/sahilvishwa2108/feedback_app" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              <GitHubIcon />
              <span className="flex items-center">
                GitHub
                <ExternalLink size={12} className="ml-1 opacity-70" />
              </span>
            </motion.a>
            
            {/* Auth buttons */}
            {session ? (
              <div className="flex items-center space-x-4">
                <motion.div
                  className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30"
                  variants={itemVariants}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                >
                  <motion.span
                    animate={{ 
                      color: ["rgb(191, 219, 254)", "rgb(216, 180, 254)", "rgb(191, 219, 254)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center"
                  >
                    <Lock size={12} className="mr-1 opacity-80" />
                    {user.username || user.email}
                  </motion.span>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    onClick={() => signOut()} 
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none flex items-center gap-1" 
                    variant="outline"
                  >
                    <LogOut size={14} />
                    Logout
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link href="/sign-in">
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg shadow-blue-700/20 flex items-center gap-1" 
                    variant="outline"
                  >
                    <LogIn size={14} />
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            variants={itemVariants}
          >
            <MenuIcon isOpen={isMenuOpen} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed top-[72px] left-0 right-0 z-40 backdrop-blur-md border-b border-purple-800/50 shadow-lg px-4 overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            style={{
              background: "linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(49, 46, 129, 0.95))"
            }}
          >
            <div className="py-4 flex flex-col space-y-4">
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-purple-300 py-2 transition-colors flex items-center gap-2"
                variants={mobileItemVariants}
                whileTap={{ scale: 0.95 }}
                whileHover={{ x: 3 }}
              >
                <MessageSquare size={16} className="text-purple-400" />
                About
              </motion.a>
              <motion.a 
                href="https://github.com/sahilvishwa2108/feedback_app" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-300 py-2 transition-colors flex items-center gap-2"
                variants={mobileItemVariants}
                whileTap={{ scale: 0.95 }}
                whileHover={{ x: 3 }}
              >
                <GitHubIcon />
                <span className="flex items-center">
                  GitHub
                  <ExternalLink size={12} className="ml-1 opacity-70" />
                </span>
              </motion.a>
              
              {/* Mobile auth buttons */}
              <motion.div className="pt-2" variants={mobileItemVariants}>
                {session ? (
                  <div className="flex flex-col space-y-3">
                    <div className="text-sm px-3 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 text-center">
                      <span className="flex items-center justify-center">
                        <Lock size={12} className="mr-1 opacity-80" />
                        {user.username || user.email}
                      </span>
                    </div>
                    <Button 
                      onClick={() => signOut()} 
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none flex items-center justify-center gap-1" 
                      variant="outline"
                    >
                      <LogOut size={14} />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/sign-in" className="block">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg shadow-blue-700/20 flex items-center justify-center gap-1" 
                      variant="outline"
                    >
                      <LogIn size={14} />
                      Login
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;