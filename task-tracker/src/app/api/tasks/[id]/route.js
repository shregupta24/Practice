import taskSch from "@/app/taskModel/taskModel";
import { connect  } from "@/app/dbConfig/dbconfig";
import { NextResponse } from "next/server";

export async function PATCH(request , {params}){
    await connect();
    const {id} = await params;
    const data = await request.json();
    try {
        const updatedTask = await taskSch.findByIdAndUpdate(id,data,{new:true});
        return NextResponse.json({message:"Task updated successfully",updatedTask},{status:200})
    } catch (error) {
        return NextResponse.json({message:"ERROR"},{status:500})
    }
}