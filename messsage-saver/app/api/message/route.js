import { connect } from "../../dbconfig/dbconfig";
import Msg from "../../messageSchema";
import {NextResponse} from "next/server"
export async function POST(req){
    await connect();
    const data = await req.json();
    try {
        const newMsg = new Msg({msg:data.message})
        await newMsg.save();
        console.log("message saved successfully")
        return NextResponse.json({message:"Message saved successfully"},{status:200})
    } catch (error) {
        console.log("error while saving message")
        return NextResponse.json({message:"Error while saving message"},{status:500})
    }
}
export async function GET(){
    connect()
    try {
        const response = await Msg.find({}).sort({createdAt:-1});
        return NextResponse.json({message:"Messages fetched",response},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error while fectching message"},{status:500})
    }
}