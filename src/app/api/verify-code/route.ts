import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try{

        const{username , code} = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const existingUser = await UserModel.findOne({ username: decodedUsername});

        if (!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        const isCodeValid = existingUser.verifyCode === code;
        const isCodeNotExpired = new Date(existingUser.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            existingUser.isVerified = true;
            await existingUser.save();

            return Response.json(
                {
                    success: true,
                    message: 'Verification successful',
                },
                { status: 200 }
            );
        }else if(!isCodeValid){
            return Response.json(
                {
                    success: false,
                    message: 'Invalid verification code',
                },
                { status: 400 }
            );
        }else{
            return Response.json(
                {
                    success: false,
                    message: 'Verification code has expired',
                },
                { status: 400 }
            );
        }
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