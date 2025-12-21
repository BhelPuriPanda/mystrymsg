'use client'

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import *as z from "zod"
import { signUpSchema } from '@/schemas/signUpSchema';
import React, { use } from 'react'
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form ,FormField , FormItem , FormControl ,FormLabel , FormMessage , FormDescription} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const page = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        }
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>) => {
        try{
            const response = await axios.post('/api/verify-code' , {
                username: params.username,
                code: data.code,
            })

            toast.success(response.data.message);
            router.replace('/sign-in');

        }catch(error){
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || "Error checking username tretter uniqueness";
            toast.error(errorMessage);
        }
    }
    

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h2 className="text-6xl font-bold mb-2">Verify Your Account</h2>
                <p className="text-gray-600">Enter the verification code sent to your email. It's 123456 coz i'm broke and can't buy a domain</p>
            </div>
            <div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="code" render={({ field }) => (
                        <FormItem>
                            <FormLabel className='px-1'>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Verification Code" {...field} />
                                </FormControl>
                                <FormMessage />
                        </FormItem>
                    )}/>
                    <Button type="submit" className='m-4'>Verify Code</Button>
                </form>
            </Form>
            </div>
        </div>
    </div>
  )
}

export default page