'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import { Trash2, Clock, MessageSquare } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from "sonner";
import { ApiResponse } from '@/types/ApiResponse';
import { motion } from 'framer-motion';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

// Enhanced animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  hover: { 
    boxShadow: "0 8px 30px rgba(124, 58, 237, 0.15)",
    y: -3,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { duration: 0.2 } 
  }
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const formattedDate = new Date(message.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const handleDeleteConfirm = async () => {
    try {
      const messageId = message._id?.toString();
      
      if (!messageId) {
        toast.error("Cannot delete: Invalid message ID");
        return;
      }
      
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${messageId}`
      );
      
      toast.success(response.data.message);
      onMessageDelete(messageId);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to delete message');
    } 
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      whileHover="hover"
      layout
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md border border-purple-500/30 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-b border-purple-500/30 p-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center">
            <motion.div 
              className="flex items-center text-sm text-gray-300"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
              <Clock className="w-3.5 h-3.5 mr-1.5 text-purple-300/70" />
              {formattedDate}
            </motion.div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-800/50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border border-purple-500/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Confirm deletion</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 border-gray-700">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        
        <CardContent className="p-5">
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              whileHover={{ rotate: [-5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex bg-gradient-to-br from-purple-600 to-indigo-800 p-3 rounded-full shadow-lg shadow-purple-900/30 self-start"
            >
              <MessageSquare className="text-white" size={20} />
            </motion.div>
            <div className="flex-1">
              <p className="text-gray-200 leading-relaxed">
                {message.content}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mt-4 opacity-70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}