'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

// Type for star objects
type Star = {
  id: number;
  size: number;
  top: string;
  left: string;
  opacity: number;
  duration: number;
};

export default function Footer() {
  const [currentYear, setCurrentYear] = useState("");
  const [stars, setStars] = useState<Star[]>([]);
  
  // Only generate stars after component mounts on client side
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    
    // Generate stars only on the client side
    const generatedStars = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 1.5 + 0.5,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 3 + 2,
    }));
    
    setStars(generatedStars);
  }, []);

  return (
    <motion.footer 
      className="text-gray-300 relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, #1a0b2e 0%, #12071d 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.7 }}
    >
      {/* Interactive animated background element */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          backgroundSize: ['100% 100%', '150% 150%', '100% 100%'],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      {/* Animated stars in footer - only rendered on client */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={`footer-star-${star.id}`}
            className="absolute rounded-full bg-blue-100"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        ))}
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div 
          className="relative flex flex-col items-center backdrop-blur-sm rounded-xl border border-purple-900/20 py-5 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: "0 0 25px rgba(139, 92, 246, 0.15)" }}
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-30"
            animate={{
              boxShadow: [
                "inset 0 0 15px rgba(99, 102, 241, 0.1)",
                "inset 0 0 30px rgba(99, 102, 241, 0.3)",
                "inset 0 0 15px rgba(99, 102, 241, 0.1)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Logo with enhanced animation */}
          <motion.div 
            className="flex items-center space-x-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300"
              animate={{
                textShadow: [
                  "0 0 5px rgba(167, 139, 250, 0.3)",
                  "0 0 10px rgba(167, 139, 250, 0.5)",
                  "0 0 5px rgba(167, 139, 250, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              True Feedback
            </motion.span>
          </motion.div>
          
          {/* Social icons row with compact design */}
          <motion.div className="flex space-x-3 mb-3">
            {[
              "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5",
              "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0 -2 -2a2 2 0 0 0 -2 2v7h-4v-7a6 6 0 0 1 6 -6z M2 9h4v12h-4z M4 2a2 2 0 0 0 0 4a2 2 0 0 0 0 -4z",
              "M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3",
              "M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z",
            ].map((path, i) => (
              <motion.a 
                key={i}
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-900/40 hover:bg-indigo-700/60 text-indigo-300 transition-colors"
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 6px 15px rgba(79, 70, 229, 0.4)",
                  scale: 1.15
                }}
                whileTap={{ scale: 0.9 }}
              >
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d={path} />
                </svg>
              </motion.a>
            ))}
          </motion.div>
          
          {/* Essential links in a compact row */}
          <motion.div className="flex flex-wrap justify-center gap-4 text-xs mb-3">
            {["Privacy", "Terms", "Support"].map((item, i) => (
              <motion.a 
                key={i}
                href="#" 
                className="text-gray-400 hover:text-indigo-300 transition-colors"
                whileHover={{ y: -2, x: 0, color: "rgb(165, 180, 252)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
          
          {/* Copyright with hover effect */}
          <motion.p 
            className="text-xs text-gray-500"
            whileHover={{ color: "rgb(165, 180, 252)" }}
          >
            © {currentYear} TrueFeedback
          </motion.p>
        </motion.div>
      </div>
      
      {/* Enhanced pulse line */}
      <motion.div 
        className="mt-2 opacity-20 mx-auto w-24 h-1"
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          width: ["4rem", "6rem", "4rem"]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      </motion.div>
    </motion.footer>
  );
}