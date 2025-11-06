import {connect } from "../../../dbconfig/dbconfig"
import {Feedback}  from "../../../feedbackSchema/feedbackSchema"
import {NextResponse} from "next/server"

export async function PATCH(request,{params}){
    const {id} =  await params;
    const data = await request.json();
    await connect();
    try {
        const updated = await Feedback.findByIdAndUpdate(id,data,{new:true});
        if(!updated) {
            return NextResponse.json({message:"Feedback is not found"},{status:404})
        }
        return NextResponse.json({message:"Feedback is updated successfully"},{status:200})
    } catch (error) {
        console.log("Error while updating feedback",error)
        return NextResponse.json({message:"Error while updating feedback"},{status:500})
    }
}

export async function DELETE(request,{params}){
    const {id} = await params;
    await connect();
    try {
        const deleted = await Feedback.findByIdAndDelete(id);
        if(!deleted){
            return NextResponse.json({message:"didn't find Feedback"},{status:404})
        }
        return NextResponse.json({message:"Feedback deleted successfully"},{status:200})
    } catch (error) {
        console.log("Errow while deleting feedback",error)
        return NextResponse.json({message:"Error while deleting feedback"},{status:500})
    }
}