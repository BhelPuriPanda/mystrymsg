'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import *as z from "zod"
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useDebounceValue , useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios , { AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form ,FormField , FormItem , FormControl ,FormLabel , FormMessage , FormDescription} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { is } from "zod/locales";
import { Loader, Loader2 } from "lucide-react";

const Page = () => {
    const [username , setUsername] = useState("");
    const [usernameMessage , setUsernameMessage] = useState("");
    const [isCheckingUsername , setIsCheckingUsername] = useState(false);
    const [isSubmitting , setIsSubmitting] = useState(false);

    const router = useRouter();
    const debounced = useDebounceCallback(setUsername , 300);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
        }
    })

    useEffect(()=>{
        const checkUsernameUnique = async () => {
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try{
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                }catch(error){
                    const axiosError = error as AxiosError<ApiResponse>;
                    let errorMessage = axiosError.response?.data.message || "Error checking username tretter uniqueness";
                    toast.error(errorMessage);
                }finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    },[username])

    const onSubmit = async(data: z.infer<typeof signUpSchema>) =>{
        setIsSubmitting(true);
        try{
            await axios.post<ApiResponse>('/api/sign-up' , data);
            toast.success("Account created successfully! Please sign in.");
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        }catch(error){
            console.error("Error during sign-up:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || "Error during sign-up";
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Join True Feedback
                </h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="username" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} 
                                    onChange={(e)=>{
                                        field.onChange(e);
                                        debounced(e.target.value);
                                    }}/>
                                </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p className={`text-sm ${usernameMessage === 'Username is unique'? 'text-red-500': 'text-green-500'}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
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
                        ) : "Sign Up"
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                    Already a member?{' '}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
                </p>
            </div>  
        </div>
    </div>
  )
}

export default Page