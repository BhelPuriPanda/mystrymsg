'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import *as z from "zod"
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useDebounceValue , useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import axios , { AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form ,FormField , FormItem , FormControl ,FormLabel , FormMessage , FormDescription} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { is } from "zod/locales";
import { Loader, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const Page = () => {
    const [isSubmitting , setIsSubmitting] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    })

    const onSubmit = async(data: z.infer<typeof signInSchema>) =>{
      const result = await signIn('credentials' , {
            identifier: data.identifier,
            password: data.password,
            redirect: false,
      })

      if(result?.error){
        if(result.error === "CredentialsSignin"){
          toast.error("Invalid credentials");
        } else {
          toast.error(result.error);
        }
      }

      if(result?.url){
        router.replace('/dashboard');
      }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-7xl font-bold mb-2">Sign In to Tretter</h1>
                <p className="text-gray-600">Welcome Back! Please enter your credentials to sign in.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="identifier" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Identifier</FormLabel>
                                <FormControl>
                                    <Input placeholder="identifier" {...field} />
                                </FormControl>
                                <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                        </FormItem>
                    )}/>
                    <Button type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait
                            </>
                        ) : "Sign In"
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                    Not a member?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign up</Link>
                </p>
            </div>  
        </div>
    </div>
  )
}

export default Page