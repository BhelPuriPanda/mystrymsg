'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const debounced = useDebounceCallback(setUsername, 300)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!username) return

      setIsCheckingUsername(true)
      setUsernameMessage("")

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        )
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(
          axiosError.response?.data.message ||
            "Error checking username uniqueness"
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      await axios.post<ApiResponse>("/api/sign-up", data)
      toast.success("Account created successfully! Please verify.")
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message || "Error during sign-up"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#020617] to-[#003F91] overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,169,233,0.15),transparent_70%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 rounded-3xl bg-black/70 backdrop-blur-xl border border-[#5DA9E9]/30 shadow-[0_0_60px_-15px_rgba(93,169,233,0.4)]">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-white">
            Create your{' '}
            <span className="text-[#5DA9E9]">Rant</span>
            <span className="text-[#e965e9]">Out</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Anonymous. Honest. Unfiltered.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="your public handle"
                      className="bg-[#020617] border-[#5DA9E9]/30 text-white placeholder:text-slate-500 focus:border-[#5DA9E9]"
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>

                  <div className="flex items-center gap-2 mt-1">
                    {isCheckingUsername && (
                      <Loader2 className="h-4 w-4 animate-spin text-[#5DA9E9]" />
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-xs ${
                          usernameMessage === "Username is unique"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      className="bg-[#020617] border-[#5DA9E9]/30 text-white placeholder:text-slate-500 focus:border-[#5DA9E9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="••••••••"
                      className="bg-[#020617] border-[#5DA9E9]/30 text-white placeholder:text-slate-500 focus:border-[#5DA9E9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold bg-[#5DA9E9] text-black hover:bg-[#7bbbf0] transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account…
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="text-[#5DA9E9] hover:text-[#7bbbf0] transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
