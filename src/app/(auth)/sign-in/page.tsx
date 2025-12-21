'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })

    setIsSubmitting(false)

    if (result?.error) {
      toast.error(
        result.error === "CredentialsSignin"
          ? "Invalid credentials"
          : result.error
      )
      return
    }

    if (result?.url) {
      router.replace("/dashboard")
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
            Sign In to{' '}
            <span className="text-[#5DA9E9]">Rant</span>
            <span className="text-[#e965e9]">Out</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Welcome back. Speak freely.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="your identity"
                      className="bg-[#020617] border-[#5DA9E9]/30 text-white placeholder:text-slate-500 focus:border-[#5DA9E9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-semibold bg-[#5DA9E9] text-black hover:bg-[#7bbbf0] transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Not a member?{" "}
          <Link
            href="/sign-up"
            className="text-[#5DA9E9] hover:text-[#7bbbf0] transition"
          >
            Create a RantOut
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
