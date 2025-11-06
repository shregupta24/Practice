import { connect } from "../../../dbconfig/dbconfig";
import Msg from "../../../messageSchema";
import {NextResponse} from "next/server"

export async function PUT(request,{params}){
    const {id} = await params;
    const data = await request.json();
    const message = data.message
    await connect();
    try {
        const response = await Msg.findByIdAndUpdate(id,{msg:message},{new:true})
        if(!response){
            return NextResponse.json({message:"message not found"},{status:404})
        }
        return NextResponse.json({message:"Message updated successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error while updating message"},{status:500})
    }
}

export async function DELETE(request,{params}){
    await connect();
    const{id} = await params;
    try {
        const response = await Msg.findByIdAndDelete(id);
        if(!response){
            return NextResponse.json({message:"didn't find msg"},{status:404})
        }
        return NextResponse.json({message:"Message deleted successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:"error while deleting msg"},{status:500})
    } 
}