"use client";

import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Send,
  MessageSquare,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  PenLine,
  Star,
  Lightbulb,
  Wand2,
  Palette,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const getUniqueCategories = (): string[] => {
  const categories = suggestedMessages.map((message) => message.category);
  return ["All", ...Array.from(new Set(categories))];
};

const getRandomMessages = (
  count: number = 4,
  category: string = "All"
): string => {
  const filteredMessages =
    category === "All"
      ? suggestedMessages
      : suggestedMessages.filter((msg) => msg.category === category);

  if (filteredMessages.length === 0) return "";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const EnhancedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0720] via-[#170B36] to-[#0F0720]" />
      
      {/* Static radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_60%)]" />
      
      {/* Static dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(167, 139, 250, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(167, 139, 250, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Static accent lines */}
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent top-1/4" />
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent top-2/4" />
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent top-3/4" />
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(15,7,32,0.4))]" />
    </div>
  );
};

interface AiGeneratedTextProps {
  text: string;
  isGenerating: boolean;
  className?: string;
  speed?: number;
  index: number;
  totalCount: number;
}

const AiGeneratedText = ({
  text,
  isGenerating,
  className = "",
  speed = 20,
  index = 0,
  totalCount = 1,
}: AiGeneratedTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [animationState, setAnimationState] = useState<
    "waiting" | "typing" | "complete"
  >("waiting");

  useEffect(() => {
    if (!isGenerating) {
      setDisplayedText(text);
      setAnimationState("complete");
      return;
    }

    setDisplayedText("");
    setAnimationState("waiting");

    const baseDelay = 800;
    const prevMessagesDelay = index * 1200;

    const sequenceTimer = setTimeout(() => {
      setAnimationState("typing");
    }, baseDelay + prevMessagesDelay);

    return () => clearTimeout(sequenceTimer);
  }, [isGenerating, index, text]);

  useEffect(() => {
    if (animationState !== "typing") return;

    let currentIndex = 0;
    const interval = 1000 / speed;

    const typingTimer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingTimer);
        setAnimationState("complete");
      }
    }, interval);

    return () => clearInterval(typingTimer);
  }, [animationState, text, speed]);

  useEffect(() => {
    if (animationState !== "typing") {
      setCursorVisible(false);
      return;
    }

    const cursorTimer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [animationState]);

  if (!isGenerating) {
    return <div className={className}>{text}</div>;
  }

  return (
    <div className={className}>
      {animationState === "waiting" ? (
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-purple-400/50"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-purple-400/50"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-purple-400/50"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
          </div>
          <span className="text-purple-300/50 text-sm">Waiting...</span>
        </div>
      ) : (
        <>
          {displayedText}
          {animationState === "typing" && cursorVisible && (
            <span className="inline-block w-1.5 h-4 ml-0.5 -mb-0.5 bg-purple-400 animate-pulse" />
          )}
        </>
      )}
    </div>
  );
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params?.username || "unknown";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [suggestedMessageString, setSuggestedMessageString] =
    useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  useEffect(() => {
    setSuggestedMessageString(getRandomMessages(4, selectedCategory));
    setIsInitialLoading(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoading) {
      fetchSuggestedMessages();
    }
  }, [selectedCategory]);

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

  const fetchSuggestedMessages = () => {
    setIsRefreshing(true);
    setSuggestedMessageString("");

    setTimeout(() => {
      const newMessages: string = getRandomMessages(4, selectedCategory);
      setSuggestedMessageString(newMessages);

      const messageCount = parseStringMessages(newMessages).length;
      const timePerMessage = 1200;
      const totalGenerationTime = messageCount * timePerMessage + 800;

      setTimeout(() => {
        setIsRefreshing(false);
      }, totalGenerationTime);
    }, 700);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success(response.data.message, {
        position: "top-center",
        icon: <MessageCircle className="h-4 w-4 text-green-400" />,
      });
      form.reset({ ...form.getValues(), content: "" });
      setSelectedMessageIndex(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {
        position: "top-center",
        icon: <MessageCircle className="h-4 w-4 text-red-400" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = getUniqueCategories();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "personal":
        return <PenLine className="h-3.5 w-3.5" />;
      case "professional":
        return <Star className="h-3.5 w-3.5" />;
      case "creative":
        return <Palette className="h-3.5 w-3.5" />;
      case "inspirational":
        return <Lightbulb className="h-3.5 w-3.5" />;
      default:
        return <Sparkles className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="relative min-h-screen pt-12 px-4 pb-20">
      <EnhancedBackground />

      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10 md:mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-purple-300/80 hover:text-purple-200 border border-purple-500/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-purple-500/30"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Return to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          <motion.header
            variants={itemVariants}
            className="flex flex-col items-center text-center mb-8"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-full bg-purple-600/20 blur-md"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <motion.div
                className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-800/60 to-indigo-800/60 rounded-full backdrop-blur-md border border-purple-500/30 mb-4 shadow-xl shadow-purple-900/30"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 5px 20px -10px rgba(139, 92, 246, 0.3)",
                    "0 5px 25px -5px rgba(139, 92, 246, 0.5)",
                    "0 5px 20px -10px rgba(139, 92, 246, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <MessageSquare className="h-7 w-7 text-purple-300" />
                </motion.div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold relative mb-3"
                variants={itemVariants}
              >
                <span className="inline-block">
                  <motion.span 
                    animate={{ 
                      color: ["rgb(216, 180, 254)", "rgb(167, 139, 250)", "rgb(196, 181, 253)", "rgb(216, 180, 254)"]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center"
                  >
                    <MessageCircle size={24} className="mr-2 opacity-70 hidden sm:inline-block" />
                    @{username}
                  </motion.span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.8 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-purple-200/80 text-base bg-white/5 px-4 py-1.5 rounded-full border border-purple-500/20 backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              >
                Share your thoughts anonymously
              </motion.p>
            </div>
          </motion.header>

          <motion.div variants={slideUpVariants} className="relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 blur-sm" />

            <Card className="relative bg-gradient-to-b from-gray-900/80 to-gray-950/80 border-purple-500/20 backdrop-blur-md shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 px-4 py-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <motion.div
                        animate={{
                          rotate: [0, 10, 0, -10, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Wand2 className="h-4 w-4 text-purple-300" />
                      </motion.div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Send Anonymous Message
                      </h2>
                      <p className="text-xs text-purple-200/70">
                        Your identity remains hidden
                      </p>
                    </div>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-purple-100 text-sm">
                            Your Message
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Type your anonymous message here..."
                                className="min-h-28 resize-none bg-gray-800/40 border-purple-500/30 focus-visible:ring-purple-500/50 focus:border-purple-500/50 text-purple-50 placeholder:text-purple-300/40"
                                {...field}
                              />
                              <AnimatePresence>
                                {field.value && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-2 right-2 text-xs text-purple-300/60 font-mono"
                                  >
                                    {field.value.length}/500
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="mt-4 flex justify-end">
                      <motion.div
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="relative px-6 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 overflow-hidden"
                          disabled={isLoading}
                        >
                          <motion.div
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                          />

                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-3 w-3" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.section variants={slideUpVariants} className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  {isRefreshing && (
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-purple-500/30 blur-sm"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent flex items-center">
                  Message Inspirations
                  {isRefreshing && (
                    <span className="ml-3 text-sm font-normal text-purple-400 flex items-center">
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="rounded-full h-2 w-2 bg-purple-400 mr-1.5"
                      />
                      Generating...
                    </span>
                  )}
                </h2>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={fetchSuggestedMessages}
                  className="bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30 backdrop-blur-sm"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Generate New Ideas
                    </>
                  )}
                </Button>
              </motion.div>
            </header>

            <motion.div className="relative" variants={fadeInVariants}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 text-purple-300 hover:text-white hover:bg-purple-800/30 rounded-full h-8 w-8 backdrop-blur-sm border border-purple-500/30"
                onClick={scrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div
                ref={categoryScrollRef}
                className="flex overflow-x-auto py-2 px-10 space-x-3 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        selectedCategory === category
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-purple-900/20"
                          : "bg-gray-900/50 border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-800/40 hover:border-purple-500/50 backdrop-blur-sm transition-all duration-200"
                      }
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </div>

                      {selectedCategory === category && (
                        <motion.span
                          className="absolute inset-0 rounded-md"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0, 0.2, 0],
                            scale: [0.8, 1.05, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 text-purple-300 hover:text-white hover:bg-purple-800/30 rounded-full h-8 w-8 backdrop-blur-sm border border-purple-500/30"
                onClick={scrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-violet-500/10 blur-md" />

              <Card className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 border-purple-500/20 backdrop-blur-md shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    {isInitialLoading ? (
                      <motion.div
                        className="flex justify-center items-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          animate={{
                            rotate: 360,
                            boxShadow: [
                              "0 0 0 rgba(139, 92, 246, 0)",
                              "0 0 20px rgba(139, 92, 246, 0.5)",
                              "0 0 0 rgba(139, 92, 246, 0)",
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
                          <Loader2 className="h-8 w-8 text-purple-400" />
                        </motion.div>
                      </motion.div>
                    ) : suggestedMessageString === "" ? (
                      <motion.div
                        className="flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="bg-purple-900/30 p-4 rounded-full mb-4"
                        >
                          <Sparkles className="h-8 w-8 text-purple-300" />
                        </motion.div>
                        <h3 className="text-xl font-medium text-purple-200 mb-2">
                          No suggestions found
                        </h3>
                        <p className="text-purple-300/70 max-w-md">
                          Try selecting a different category or click "Refresh
                          Ideas"
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        key={suggestedMessageString}
                      >
                        {parseStringMessages(suggestedMessageString).map(
                          (message, index) => (
                            <motion.div key={index} variants={itemVariants}>
                              <motion.div
                                className={`relative h-full cursor-pointer rounded-lg border transition-all overflow-hidden ${
                                  selectedMessageIndex === index
                                    ? "bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/50"
                                    : "bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40"
                                }`}
                                onClick={() =>
                                  handleMessageClick(message, index)
                                }
                                whileHover={{
                                  y: -3,
                                  boxShadow:
                                    "0 10px 30px -15px rgba(124, 58, 237, 0.5)",
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {selectedMessageIndex === index && (
                                  <motion.div
                                    className="absolute inset-0 bg-purple-600/5"
                                    animate={{
                                      opacity: [0, 0.2, 0],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                  />
                                )}
                                <div className="relative p-4 h-full">
                                  <AiGeneratedText
                                    text={message}
                                    isGenerating={
                                      isRefreshing &&
                                      suggestedMessageString !== ""
                                    }
                                    className={`${
                                      selectedMessageIndex === index
                                        ? "text-purple-100"
                                        : "text-purple-300/80"
                                    }`}
                                    speed={30}
                                    index={index}
                                    totalCount={
                                      parseStringMessages(
                                        suggestedMessageString
                                      ).length
                                    }
                                  />
                                  <AnimatePresence>
                                    {selectedMessageIndex === index && (
                                      <motion.div
                                        className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-purple-500"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                      />
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <motion.footer
            variants={fadeInVariants}
            className="text-center pt-8 border-t border-purple-500/10"
          >
            <p className="text-purple-300/40 text-sm">
              Your anonymous feedback helps people grow and improve
            </p>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}
