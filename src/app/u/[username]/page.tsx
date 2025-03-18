"use client";

import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Send,
  MessageSquare,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { motion, AnimatePresence } from "framer-motion";
import suggestedMessages from "@/suggested-messages.json";

const specialChar = "||";

// Parse the message string into an array of messages
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

// Get unique categories from the JSON file
const getUniqueCategories = (): string[] => {
  const categories = suggestedMessages.map((message) => message.category);
  return ["All", ...Array.from(new Set(categories))];
};

// Function to get random messages from the JSON file filtered by category
const getRandomMessages = (
  count: number = 4,
  category: string = "All"
): string => {
  const filteredMessages =
    category === "All"
      ? suggestedMessages
      : suggestedMessages.filter((msg) => msg.category === category);

  if (filteredMessages.length === 0) {
    return "";
  }

  const messagesCopy = [...filteredMessages];
  const selectedMessages: string[] = [];

  for (let i = 0; i < Math.min(count, messagesCopy.length); i++) {
    if (messagesCopy.length === 0) break;

    const randomIndex = Math.floor(Math.random() * messagesCopy.length);
    selectedMessages.push(messagesCopy[randomIndex].message);
    messagesCopy.splice(randomIndex, 1);
  }

  return selectedMessages.join(specialChar);
};

// Enhanced animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Enhanced background with trending gradient ball
const EnhancedBackground = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Lighter gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#170B36] via-[#1F0E4A] to-[#180B3D]" />

      {/* Trending Gradient Glow Balls */}
      <motion.div
        className="absolute rounded-full blur-[100px] opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(216, 180, 254, 0.8) 0%, rgba(149, 94, 255, 0.4) 50%, rgba(88, 28, 230, 0.1) 100%)",
          width: "60vw",
          height: "60vw",
          left: "20%",
          top: "10%",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Secondary gradient ball */}
      <motion.div
        className="absolute rounded-full blur-[120px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(192, 132, 252, 0.8) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(124, 58, 237, 0.1) 100%)",
          width: "50vw",
          height: "50vw",
          right: "10%",
          bottom: "5%",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Simple star field - client side only */}
      {isMounted && (
        <>
          {Array.from({ length: 50 }).map((_, i) => {
            // Stable randomization with seed based on index
            const seed = i * 1000;
            const rng = () => (Math.sin(seed) + 1) / 2;

            const size = rng() * 1.5 + 0.5;
            const opacity = rng() * 0.7 + 0.3;

            return (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: size,
                  height: size,
                  top: `${rng() * 100}%`,
                  left: `${rng() * 100}%`,
                  opacity,
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity})`,
                }}
                animate={{
                  opacity: [opacity, opacity * 1.5, opacity],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + rng() * 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: rng() * 2,
                }}
              />
            );
          })}
        </>
      )}

      {/* Light grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(216, 180, 254, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(216, 180, 254, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params?.username || "unknown";

  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [suggestedMessageString, setSuggestedMessageString] =
    useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  // Load initial messages
  useEffect(() => {
    setSuggestedMessageString(getRandomMessages(4, selectedCategory));
    setIsInitialLoading(false);
  }, []);

  // Load new messages when category changes
  useEffect(() => {
    if (!isInitialLoading) {
      fetchSuggestedMessages();
    }
  }, [selectedCategory]);

  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);

  // Scroll handlers for category carousel
  const scrollLeft = () => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleMessageClick = (message: string, index: number) => {
    form.setValue("content", message);
    setSelectedMessageIndex(index);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
      setSelectedMessageIndex(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated function to fetch suggested messages
  const fetchSuggestedMessages = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSuggestedMessageString(getRandomMessages(4, selectedCategory));
      setIsRefreshing(false);
    }, 500);
  };

  // Get all unique categories
  const categories = getUniqueCategories();

  return (
    <div className="relative min-h-screen py-16 px-4">
      {/* Enhanced background */}
      <EnhancedBackground />

      {/* Main content */}
      <motion.div
        className="relative z-10 container mx-auto max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header with username */}
        <motion.div className="text-center mb-14" variants={itemVariants}>
          <motion.div
            className="inline-block mb-4 relative"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-purple-500/20 p-3 rounded-full backdrop-blur-md border border-purple-300/20">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MessageSquare className="h-7 w-7 text-purple-200" />
              </motion.div>
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-purple-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              background:
                "linear-gradient(to right, #E9D5FF, #C084FC, #A855F7, #C084FC, #E9D5FF)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            @{username}
          </motion.h1>

          <motion.p
            className="text-purple-100 text-lg max-w-lg mx-auto"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
          >
            Share your thoughts anonymously. Your message will be delivered, but
            your identity remains hidden.
          </motion.p>

          {/* Animated separator */}
          <motion.div
            className="w-24 h-0.5 mx-auto rounded-full overflow-hidden mt-6 mb-2"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300 bg-[length:200%_100%]"
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Message input card */}
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {/* Card glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-xl opacity-20 blur-md" />

            <Card className="bg-white/10 border-purple-300/30 shadow-xl backdrop-blur-lg overflow-hidden relative">
              <CardHeader className="border-b border-purple-500/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -5, 0] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-purple-200"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-100">
                      Send Anonymous Feedback
                    </h3>
                    <p className="text-sm text-purple-200/80">
                      Your message will remain anonymous
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-purple-200 sr-only">
                            Your Message
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              className="relative"
                              whileHover={{
                                boxShadow: "0 0 15px rgba(216, 180, 254, 0.3)",
                                transition: { duration: 0.2 },
                              }}
                            >
                              <Textarea
                                placeholder="Write your feedback here..."
                                className="min-h-32 bg-white/5 border-purple-300/30 focus-visible:ring-purple-400/50 focus:border-purple-400/50 text-purple-50 placeholder:text-purple-300/40 backdrop-blur-sm"
                                {...field}
                              />
                              <AnimatePresence>
                                {field.value && (
                                  <motion.div
                                    className="absolute bottom-3 right-3 text-xs text-purple-300/70"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <span className="font-mono">
                                      {field.value.length}
                                    </span>{" "}
                                    / 500
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-pink-300" />
                        </FormItem>
                      )}
                    />

                    <motion.div
                      className="flex justify-end"
                      whileHover={{ scale: 1.01 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          type="submit"
                          className="relative bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white px-6 py-2 overflow-hidden group"
                          disabled={isLoading}
                        >
                          {/* Animated shine effect */}
                          <motion.div
                            className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                            initial={false}
                            animate={{
                              x: ["-100%", "200%"],
                              opacity: [0, 0.5, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut",
                            }}
                          />

                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}

                          {/* Subtle particles on hover */}
                          <AnimatePresence>
                            {!isLoading && (
                              <motion.div
                                className="absolute inset-0 pointer-events-none"
                                initial={false}
                                whileHover="visible"
                              >
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full"
                                    variants={{
                                      visible: {
                                        opacity: [0, 1, 0],
                                        y: [0, -10 - i * 5],
                                        x: [0, 5 - i * 3],
                                      },
                                    }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      delay: i * 0.2,
                                    }}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Message suggestions section */}
        <motion.div
          className="mt-14"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <motion.h2
              className="text-2xl font-bold text-purple-100 flex items-center gap-2"
              animate={{
                textShadow: [
                  "0 0 0px rgba(216, 180, 254, 0)",
                  "0 0 8px rgba(216, 180, 254, 0.3)",
                  "0 0 0px rgba(216, 180, 254, 0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-5 w-5 text-purple-300" />
              </motion.div>
              Message Inspirations
            </motion.h2>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={fetchSuggestedMessages}
                className="bg-white/10 hover:bg-white/15 text-purple-200 border border-purple-300/30 backdrop-blur-sm"
                disabled={isRefreshing}
                size="sm"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Finding Ideas...
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                    </motion.div>
                    Refresh Ideas
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Category filters with animation */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/5 text-purple-200 z-10 rounded-full h-8 w-8 flex items-center justify-center shadow-lg shadow-purple-900/10 border border-purple-300/20"
              onClick={scrollLeft}
            >
              <motion.div whileHover={{ x: -2 }} whileTap={{ x: -4 }}>
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>

            <div
              ref={categoryScrollRef}
              className="flex overflow-x-auto py-2 px-8 space-x-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white shadow-lg shadow-purple-500/20"
                        : "bg-white/5 border-purple-300/30 text-purple-200 hover:text-purple-100 backdrop-blur-sm"
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {/* Animated selection indicator */}
                    {selectedCategory === category && (
                      <motion.span
                        className="absolute inset-0 rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 0.2, 0],
                          scale: [0.8, 1.1, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    )}

                    <span className="relative z-10">{category}</span>
                  </Button>
                </motion.div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/5 text-purple-200 z-10 rounded-full h-8 w-8 flex items-center justify-center shadow-lg shadow-purple-900/10 border border-purple-300/20"
              onClick={scrollRight}
            >
              <motion.div whileHover={{ x: 2 }} whileTap={{ x: 4 }}>
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Message suggestions */}
          <motion.div
            className="relative"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {/* Card glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400 to-purple-300 rounded-xl opacity-20 blur-md" />

            <Card className="bg-white/10 border-purple-300/20 backdrop-blur-lg shadow-xl overflow-hidden">
              <CardContent className="p-5">
                <AnimatePresence mode="wait">
                  {isInitialLoading ? (
                    <motion.div
                      className="flex justify-center items-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        animate={{
                          rotate: 360,
                          boxShadow: [
                            "0 0 0 rgba(216, 180, 254, 0)",
                            "0 0 15px rgba(216, 180, 254, 0.5)",
                            "0 0 0 rgba(216, 180, 254, 0)",
                          ],
                        }}
                        transition={{
                          rotate: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          boxShadow: { duration: 2, repeat: Infinity },
                        }}
                        className="p-3 rounded-full"
                      >
                        <Loader2 className="h-6 w-6 text-purple-300" />
                      </motion.div>
                    </motion.div>
                  ) : suggestedMessageString === "" ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-8 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="bg-purple-500/10 p-4 rounded-full mb-4"
                      >
                        <Sparkles className="h-8 w-8 text-purple-300" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-medium text-purple-300 mb-2">
                          No suggestions found
                        </h3>
                        <p className="text-purple-200/70 text-sm">
                          Try selecting a different category or click "Refresh
                          Ideas"
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                      key={suggestedMessageString}
                    >
                      {parseStringMessages(suggestedMessageString).map(
                        (message, index) => (
                          <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                          >
                            <motion.div
                              className={`relative overflow-hidden rounded-md border transition-all cursor-pointer ${
                                selectedMessageIndex === index
                                  ? "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-400/40"
                                  : "bg-white/5 border-purple-500/10 hover:bg-white/10"
                              }`}
                              onClick={() => handleMessageClick(message, index)}
                            >
                              {/* Selection highlight effect */}
                              {selectedMessageIndex === index && (
                                <motion.div
                                  className="absolute inset-0 bg-purple-500/5"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 0.2, 0] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "easeInOut",
                                  }}
                                />
                              )}

                              {/* Animated shine effect on hover */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
                                initial={false}
                                whileHover={{
                                  x: ["0%", "150%"],
                                  transition: { duration: 0.8 },
                                }}
                              />

                              <p
                                className={`p-3 text-sm ${
                                  selectedMessageIndex === index
                                    ? "text-purple-100"
                                    : "text-purple-200/70"
                                }`}
                              >
                                {message}
                              </p>

                              {/* Selection indicator */}
                              <motion.div
                                className="absolute bottom-2 right-2"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={
                                  selectedMessageIndex === index
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.5 }
                                }
                                transition={{ duration: 0.2 }}
                              >
                                <div className="h-2 w-2 rounded-full bg-purple-400" />
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Footer with return link */}
        <motion.footer
          className="mt-12 text-center pb-8"
          variants={itemVariants}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="text-purple-300/60 hover:text-purple-200 text-sm flex items-center gap-1.5 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Return to Dashboard</span>
            </Link>
          </motion.div>

          <motion.p
            className="text-purple-300/30 text-xs mt-3"
            animate={{ opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
          >
            Your anonymous feedback helps people grow and improve
          </motion.p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
