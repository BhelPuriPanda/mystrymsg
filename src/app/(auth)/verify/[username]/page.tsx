'use client'

import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import React from 'react'
import axios, { AxiosError } from 'axios'

import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Page = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      })

      toast.success(response.data.message)
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message || 'Verification failed'
      )
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#020617] to-[#003F91] px-4">

      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5DA9E9]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6D326D]/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#5DA9E9]/30 bg-black/70 backdrop-blur-xl p-8 shadow-[0_0_60px_-15px_rgba(93,169,233,0.45)]">

        <div className="text-center mb-8">
          <p className="uppercase tracking-widest text-xs text-[#5DA9E9] mb-2">
            Almost There
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-white mb-3">
            Verify Your Account
          </h1>
          <p className="text-slate-400 text-sm">
            Enter the verification code.
            <br />
            <span className="text-[#5DA9E9] font-medium">
              Hint: it’s <code>123456</code>
            </span>
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      className="bg-[#020617]/80 border-[#5DA9E9]/30 text-white placeholder:text-slate-500 focus-visible:ring-[#5DA9E9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-xl bg-black border border-[#5DA9E9]/40
                         hover:border-[#5DA9E9]
                         hover:shadow-[0_0_30px_rgba(93,169,233,0.6)]
                         transition-all duration-300"
            >
              Verify & Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
