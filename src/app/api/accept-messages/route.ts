import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ca, tr } from "zod/locales";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Unauthorized',
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            {userId},
            {isAcceptingMessages:acceptMessages},
            {new:true},
        )

        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User preference updated successfully',
                data: {
                    isAcceptingMessages: updatedUser.isAcceptingMessages,
                },
            },
            { status: 200 }
        );
        
    }catch(error){
        console.error("Error in POST request:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Unauthorized',
            },
            { status: 401 }
        );
    }

    const userId = user._id;

    try{
        const foundUser = await UserModel.findById(userId);

        if(!foundUser){
             return Response.json(
            {
                success: false,
                message: 'User not found',
            },
            { status: 404 }
        );
    }

    return Response.json(
            {
                success: true,
                data: {
                    isAcceptingMessages: foundUser.isAcceptingMessages,
                },
            },
            { status: 200 }
        );
    }catch(error){
        console.error("Error in GET request:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        );
    }
}