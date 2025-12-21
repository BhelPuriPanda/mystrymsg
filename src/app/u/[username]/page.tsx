'use client'

import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import messageSchema from '@/schemas/messageSchema'

const specialChar = '||'

const parseStringMessages = (messageString: string): string[] =>
  messageString.split(specialChar)

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const [completion, setCompletion] = useState(initialMessageString)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      })
      toast.success('Message sent anonymously')
      form.reset({ content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.toString())
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true)
      setError(null)
      toast.success('Generating ideas…')

      const res = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: true }),
      })

      const text = await res.text()
      setCompletion(text)
      toast.success('New prompts ready')
    } catch {
      setError('Failed to fetch suggestions')
      toast.error('Error fetching messages')
    } finally {
      setIsSuggestLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-[#020617] to-[#003F91] px-4 py-20 text-slate-200">
      <div className="relative max-w-4xl mx-auto">

        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#5DA9E9] to-[#6D326D] blur-3xl opacity-20" />

        <div className="relative bg-black/70 backdrop-blur-xl border border-[#5DA9E9]/30 rounded-3xl p-6 md:p-10">

          {/* HEADER */}
          <div className="text-center mb-10">
            <p className="uppercase tracking-widest text-xs text-[#5DA9E9] mb-2">
              Anonymous Message
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold font-mono">
              Send a message to{' '}
              <span className="text-[#e472e4]">@{username}</span>
            </h1>
            <p className="text-slate-400 mt-2">
              They’ll never know it was you.
            </p>
          </div>

          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      Your message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Say what you really think…"
                        className="resize-none bg-[#020617] border-[#5DA9E9]/30 text-white placeholder:text-slate-500 focus-visible:ring-[#5DA9E9]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="px-10 bg-black border border-[#5DA9E9]/40 hover:border-[#5DA9E9]
                             hover:shadow-[0_0_30px_rgba(93,169,233,0.6)]
                             transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send Anonymously'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* SUGGESTIONS */}
          <div className="mt-14 space-y-6">
            <div className="text-center">
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                className="bg-[#020617] border border-[#5DA9E9]/40 hover:border-[#5DA9E9]"
              >
                {isSuggestLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest Messages
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-400 mt-3">
                Click a prompt to auto-fill
              </p>
            </div>

            <Card className="bg-[#020617]/70 border border-[#5DA9E9]/30 rounded-2xl">
              <CardHeader>
                <h3 className="text-lg font-semibold text-[#5DA9E9]">
                  Suggested prompts
                </h3>
              </CardHeader>
              <CardContent className="grid gap-3">
                {error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  parseStringMessages(completion).map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left text-white font-mono bg-black/40 border-[#5DA9E9]/20 hover:border-[#5DA9E9]"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12 bg-[#5DA9E9]/20" />

          {/* CTA */}
          <div className="text-center">
            <p className="text-slate-400 mb-4">
              Want your own anonymous inbox?
            </p>
            <Link href="/sign-up">
              <Button className="bg-black border border-[#5DA9E9]/40 hover:border-[#5DA9E9]">
                Create Your RantOut
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
