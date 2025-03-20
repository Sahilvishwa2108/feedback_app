"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  MessageSquare,
  Shield,
  Eye,
  Star,
  Sparkles,
  Lock,
  Send,
  RefreshCw,
  Share2,
  LucideIcon,
  Heart,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Optimized Cosmic Particles - much lighter
const CosmicParticles = () => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      size: number;
      x: string;
      y: string;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    // Reduced to 100 static particles
    const generateParticles = () => {
      return Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.3 + 0.1,
      }));
    };

    setParticles(generateParticles());
  }, []);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            backgroundColor: `rgba(94, 28, 207, ${particle.opacity})`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

// Simplified Nebula Effect - using CSS instead of animations
const CosmicNebula = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute rounded-full opacity-10 blur-[100px] animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(94, 28, 207, 0.6) 0%, rgba(109, 62, 216, 0.2) 50%, rgba(138, 55, 217, 0.05) 100%)",
          width: "60%",
          height: "60%",
          left: "20%",
          top: "10%",
          animationDuration: "25s",
        }}
      />
      <div
        className="absolute rounded-full opacity-10 blur-[120px] animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 50, 209, 0.5) 0%, rgba(79, 82, 221, 0.2) 50%, rgba(109, 120, 228, 0.05) 100%)",
          width: "50%",
          height: "50%",
          right: "10%",
          bottom: "10%",
          animationDuration: "30s",
          animationDelay: "2s",
        }}
      />
    </div>
  );
};

// Optimized Star Field - fewer stars, mostly static
const StarField = () => {
  const [stars, setStars] = useState<
    Array<{
      id: number;
      size: number;
      x: string;
      y: string;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    // Reduced to 50 stars, all static
    const starCount = 50;
    const generatedStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.7 + 0.2,
    }));

    setStars(generatedStars);
  }, []);

  if (!stars.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: star.x,
            top: star.y,
            opacity: star.opacity / 2,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
          }}
        />
      ))}
      {/* Only animate 10 stars for better performance */}
      {stars.slice(0, 10).map((star) => (
        <div
          key={`animated-${star.id}`}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: star.size,
            height: star.size,
            left: star.x,
            top: star.y,
            opacity: star.opacity / 3,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
            animationDuration: `${Math.random() * 3 + 3}s`,
          }}
        />
      ))}
    </div>
  );
};

// Simplified Grid Lines - static only
const GridLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines - reduced to 8 */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"
          style={{
            top: `${(i + 1) * 20}%`,
            left: 0,
          }}
        />
      ))}

      {/* Vertical lines - reduced to 4 */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent"
          style={{
            left: `${(i + 1) * 33}%`,
            top: 0,
          }}
        />
      ))}
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: FeatureCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 overflow-hidden relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
        borderColor: "rgba(139, 92, 246, 0.5)",
      }}
    >
      <motion.div
        className="absolute -inset-px opacity-0 group-hover:opacity-100 rounded-xl"
        style={{
          background:
            "linear-gradient(45deg, rgba(124, 58, 237, 0) 60%, rgba(124, 58, 237, 0.2))",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
      />

      <motion.div
        className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 mx-auto"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="text-purple-400" size={24} />
      </motion.div>

      <motion.h3
        className="text-xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent"
        animate={{
          textShadow: [
            "0 0 2px rgba(167, 139, 250, 0.1)",
            "0 0 8px rgba(167, 139, 250, 0.3)",
            "0 0 2px rgba(167, 139, 250, 0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        {title}
      </motion.h3>

      <p className="text-gray-300 text-center text-base">{description}</p>
    </motion.div>
  );
};

// How It Works Step
interface HowItWorksStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  delay: number;
}

const HowItWorksStep = ({
  icon: Icon,
  title,
  description,
  step,
  delay,
}: HowItWorksStepProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row items-center gap-6 relative"
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/50"
          animate={{
            boxShadow: [
              "0 0 0 rgba(139, 92, 246, 0.3)",
              "0 0 20px rgba(139, 92, 246, 0.7)",
              "0 0 0 rgba(139, 92, 246, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Icon className="text-white" size={28} />
        </motion.div>

        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {step}
        </div>
      </motion.div>

      <div className="flex-1 text-center md:text-left bg-gray-900/40 p-4 rounded-lg border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-100">{description}</p>
      </div>
    </motion.div>
  );
};

// FAQ Item
interface FAQItemProps {
  question: string;
  answer: string;
  delay: number;
}

const FAQItem = ({ question, answer, delay }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="mb-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.button
        className={`w-full p-4 text-left rounded-lg flex justify-between items-center ${
          isOpen
            ? "bg-purple-900/50 border-purple-500/40 border"
            : "bg-gray-900/70 hover:bg-gray-800/90 border border-gray-700/70"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{
          backgroundColor: isOpen
            ? "rgba(124, 58, 237, 0.5)"
            : "rgba(31, 41, 55, 0.9)",
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <h3 className="font-semibold text-white">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-purple-300"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.5V12.5M3.5 8H12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-white bg-gray-800/60 backdrop-blur-sm rounded-b-lg border-x border-b border-gray-700/50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main About Page Component
export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  // heroRef isn't being used with a ref attribute anywhere
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const faqRef = useRef(null);

  // Parallax effects - keep these as they're used in the floating objects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  // This opacity transform doesn't appear to be used
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950 overflow-hidden">
      {/* Background elements */}
      <CosmicNebula />
      <CosmicParticles />
      <StarField />
      <GridLines />

      {/* Hero section */}
      <motion.section
        className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="bg-purple-500/20 p-4 rounded-full backdrop-blur-md border border-purple-300/20 inline-block">
                <MessageSquare className="h-10 w-10 text-purple-300" />
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{
                background:
                  "linear-gradient(to right, #C084FC, #A855F7, #7C3AED, #A855F7, #C084FC)",
                backgroundSize: "200% auto",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Mystery Message
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Unveil the hidden truth through anonymous feedback that helps
              people grow and improve.
            </motion.p>

            <motion.div
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg">
                  <motion.span
                    className="flex items-center gap-2"
                    whileHover={{
                      gap: 3,
                      textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Join Now
                    <Sparkles size={20} />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating objects */}
          <motion.div
            className="absolute left-[5%] top-[30%] w-6 h-6 rounded-full bg-purple-400/20 backdrop-blur-sm border border-purple-500/20 z-0"
            style={{ y: y1 }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              },
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          />
          <motion.div
            className="absolute right-[10%] top-[20%] w-10 h-10 rounded-full bg-indigo-400/10 backdrop-blur-sm border border-indigo-500/10 z-0"
            style={{ y: y2 }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              },
              rotate: {
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          />
        </div>
      </motion.section>

      {/* Features section */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-purple-900/30 border border-purple-500/20 text-purple-300 inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span
                className="inline-flex items-center gap-1.5"
                animate={{
                  color: [
                    "rgb(216, 180, 254)",
                    "rgb(139, 92, 246)",
                    "rgb(216, 180, 254)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={14} />
                <span>Core Features</span>
                <Sparkles size={14} />
              </motion.span>
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              What Makes Mystery Message Special
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform offers unique features designed to provide valuable
              anonymous feedback while maintaining complete privacy and control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Complete Anonymity"
              description="Send feedback without revealing your identity. Your privacy is guaranteed throughout the entire process."
              delay={0.1}
            />
            <FeatureCard
              icon={Lock}
              title="Enhanced Privacy"
              description="We don't track IP addresses or store identifying information about feedback senders."
              delay={0.2}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Honest Feedback"
              description="Receive genuine thoughts and opinions in a safe, judgment-free environment."
              delay={0.3}
            />
            <FeatureCard
              icon={Eye}
              title="Total Control"
              description="Decide when to receive messages. Toggle feedback reception on and off at any time."
              delay={0.4}
            />
            <FeatureCard
              icon={Share2}
              title="Easy Sharing"
              description="Share your unique link via social media, email, or anywhere to receive anonymous messages."
              delay={0.5}
            />
            <FeatureCard
              icon={RefreshCw}
              title="AI-Powered Suggestions"
              description="OpenAI recommendations helps craft meaningful, constructive feedback for any situation."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section ref={howItWorksRef} className="py-20 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-900/50 border border-indigo-500/40 text-white inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span
                className="inline-flex items-center gap-1.5"
                animate={{
                  color: [
                    "rgb(224, 231, 255)",
                    "rgb(165, 180, 252)",
                    "rgb(224, 231, 255)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Zap size={14} />
                <span>Simple Process</span>
                <Zap size={14} />
              </motion.span>
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How Mystery Message Works
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              Our platform is designed to be simple and intuitive, making it
              easy to share and receive anonymous feedback.
            </p>
          </motion.div>

          <div className="space-y-12 relative">
            <HowItWorksStep
              icon={CheckCircle}
              title="Create Your Account"
              description="Sign up with a username, email, and password to get started. Verify your email to activate your account."
              step={1}
              delay={0.1}
            />
            <HowItWorksStep
              icon={Share2}
              title="Share Your Unique Link"
              description="Copy your personal feedback link from your dashboard and share it with friends, colleagues, or social media."
              step={2}
              delay={0.2}
            />
            <HowItWorksStep
              icon={MessageSquare}
              title="Receive Anonymous Feedback"
              description="Others can visit your link and send you completely anonymous messages and feedback."
              step={3}
              delay={0.3}
            />
            <HowItWorksStep
              icon={Heart}
              title="Grow From Insights"
              description="Read and reflect on the honest feedback to improve yourself and understand others' perspectives."
              step={4}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section ref={faqRef} className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-purple-900/50 border border-purple-500/40 text-white inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Clock className="inline-block mr-1 h-3.5 w-3.5" />
              <span>Frequently Asked Questions</span>
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Common Questions
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              Find answers to the most commonly asked questions about Mystery
              Message and anonymous feedback.
            </p>
          </motion.div>

          <div className="space-y-4">
            <FAQItem
              question="Is my identity truly anonymous when sending messages?"
              answer="Yes, your identity is completely anonymous. We don't track IP addresses, cookies, or any identifying information from message senders. The recipient will have no way of knowing who sent the message."
              delay={0.1}
            />
            <FAQItem
              question="How do I share my feedback link with others?"
              answer="After signing up, you'll get a unique link from your dashboard that looks like 'mysterymessage.com/u/your-username'. Share this link on social media, in emails, or anywhere you want to receive anonymous feedback."
              delay={0.2}
            />
            <FAQItem
              question="Can I disable receiving messages temporarily?"
              answer="Absolutely! You have complete control. From your dashboard, you can toggle the ability to receive messages on or off at any time. When turned off, visitors to your link will see a message indicating you're not accepting feedback at the moment."
              delay={0.3}
            />
            <FAQItem
              question="Are there any limits to how many messages I can receive?"
              answer="No, there are no limits on the number of messages you can receive on our platform. You can receive as many anonymous messages as people choose to send you."
              delay={0.4}
            />
            <FAQItem
              question="What should I do if I receive inappropriate messages?"
              answer="While our platform is designed for constructive feedback, we understand that misuse can occur. You can delete any messages you receive and you can report serious abuse to our support team."
              delay={0.5}
            />
            <FAQItem
              question="Can I respond to anonymous messages I receive?"
              answer="Currently, direct replies to anonymous messages aren't supported, as this would defeat the purpose of anonymity. However, we're exploring features for indirect responses in future updates."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-purple-900/30 border border-purple-500/20 text-purple-300 inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span
                className="inline-flex items-center gap-1.5"
                animate={{
                  color: [
                    "rgb(216, 180, 254)",
                    "rgb(139, 92, 246)",
                    "rgb(216, 180, 254)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star size={14} />
                <span>Our Mission</span>
                <Star size={14} />
              </motion.span>
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Behind Mystery Message
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              We believe honest feedback is the foundation of personal growth.
              Our platform was created to enable authentic communication in a
              safe, anonymous environment.
            </p>

            <motion.div
              className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-md p-8 rounded-xl border border-purple-500/20 mt-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(139, 92, 246, 0.4)",
                    "0 0 30px rgba(139, 92, 246, 0.6)",
                    "0 0 0 rgba(139, 92, 246, 0.4)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MessageSquare className="h-8 w-8 text-white" />
              </motion.div>

              <blockquote className="text-lg text-gray-300 italic mb-6 text-center">
                "We created Mystery Message because we believe that honest,
                anonymous feedback has the power to transform lives and
                relationships. Our mission is to build a platform where truth
                can be shared safely and respectfully."
              </blockquote>

              <p className="text-gray-400 text-center text-sm">
                — The Mystery Message Team
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Darker glow effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[120px] bg-purple-800"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center bg-gray-950/40 backdrop-blur-sm p-8 rounded-xl" // Added background for better text contrast
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-8"
              style={{
                background:
                  "linear-gradient(to right, #e9d5ff, #c4b5fd, #a5b4fc, #c4b5fd, #e9d5ff)",
                backgroundSize: "200% auto",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Ready to Discover Hidden Truths?
            </motion.h2>

            <motion.p
              className="text-xl text-white max-w-2xl mx-auto mb-12" // Changed from purple-200 to white for better contrast
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }} // Changed to once:true to reduce re-animations
            >
              Start your journey of self-discovery through anonymous feedback
              today.
            </motion.p>

            <motion.div
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }} // Changed to once:true to reduce re-animations
            >
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg shadow-xl shadow-purple-900/20">
                  <motion.span
                    className="flex items-center gap-2"
                    whileHover={{
                      gap: 3,
                      textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Create Your Mystery Link
                    <Send size={20} />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
