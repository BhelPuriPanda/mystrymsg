import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(request: Request , {params} : {params : {messageid : string} }) {

  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  const messageId = params.messageid

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try{
    const updatedResult = await UserModel.updateOne(
      {_id : user._id},
      { $pull : {messages : {_id : messageId}} }
    )

    if(updatedResult.modifiedCount==0){
      return Response.json(
        {success : false, message : "Message Not Found or already deleted"},
        {status : 401}
      )
    }

    return Response.json(
        {success : true, message : "Message deleted succesfully"},
        {status : 200}
    )

  }catch(err){
    console.error('An unexpected error occurred:', err);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
  
}