'use client'

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import React from "react"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import dayjs from 'dayjs'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    )
    toast.success(response.data.message)
    onMessageDelete(message._id.toString())
  }

  return (
    <div className="relative group">
      {/* Glow */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#5DA9E9] to-[#6D326D] opacity-20 blur-xl group-hover:opacity-40 transition" />

      <Card className="relative rounded-2xl bg-black/70 backdrop-blur-xl border border-[#5DA9E9]/30 shadow-[0_0_30px_-15px_rgba(93,169,233,0.4)]">

        <CardHeader className="flex flex-row justify-between items-start gap-4">
          <p className="text-lg leading-relaxed text-slate-200 font-mono">
            “{message.content}”
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#020617] border border-[#5DA9E9]/30 text-slate-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Delete message?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. The message will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-xs text-slate-500 text-right">
            {dayjs(message.createdAt).format('MMM D, YYYY • h:mm A')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default MessageCard
