'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Message } from '@/model/User'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, Copy } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: { acceptMessages: false },
  })

  const { watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((m) => m._id.toString() !== messageId)
    )
  }

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ||
          'Failed to fetch message settings'
      )
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true)
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages')
        setMessages(response.data.messages || [])
        if (refresh) toast.success('Messages refreshed')
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(
          axiosError.response?.data.message || 'Failed to fetch messages'
        )
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!session?.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, fetchMessages, fetchAcceptMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        '/api/accept-messages',
        { acceptMessages: !acceptMessages }
      )
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ||
          'Failed to update settings'
      )
    }
  }

  if (!session?.user) return null

  const { username } = session.user as User
  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/u/${username}`
      : ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Profile link copied!')
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#020617] to-[#003F91] px-4 md:px-10 py-24">

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,169,233,0.15),transparent_70%)]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-white">
            Your Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            Manage your link, messages, and privacy.
          </p>
        </div>

        {/* Share link card */}
        <div className="rounded-2xl bg-black/70 backdrop-blur-xl border border-[#5DA9E9]/30 p-6 shadow-[0_0_40px_-15px_rgba(93,169,233,0.4)]">
          <h2 className="text-lg font-semibold text-[#5DA9E9] mb-3">
            Your Anonymous Link
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={profileUrl}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-[#020617] text-slate-300 border border-[#5DA9E9]/30 truncate"
              />

              <Button
                onClick={copyToClipboard}
                className="w-full sm:w-auto bg-[#5DA9E9] text-black hover:bg-[#7bbbf0] flex items-center justify-center"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
          </div>

        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-black/70 backdrop-blur-xl border border-[#5DA9E9]/30 p-6">

          <div className="flex items-center gap-3">
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className='bg-slate-50'
            />
            <span className="text-slate-300">
              Accept Messages:{' '}
              <span
                className={
                  acceptMessages
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {acceptMessages ? 'On' : 'Off'}
              </span>
            </span>
          </div>

          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            className="border-[#5DA9E9]/40 text-white hover:bg-[#5DA9E9]/10"
          >
            {isLoading ? (
              <Loader2 className="text-black h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="text-black h-4 w-4" />
            )}
            <span className="text-[#e472e4] ml-2">Refresh</span>
          </Button>
        </div>

        <Separator className="bg-[#5DA9E9]/20" />

        {/* Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-slate-400">
              No messages yet — share your link.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
