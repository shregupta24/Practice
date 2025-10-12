import taskSch from "@/app/taskModel/taskModel";
import { connect  } from "@/app/dbConfig/dbconfig";
import { NextResponse } from "next/server";


export async function POST(request){
    await connect();
    const{title,desc,status} = await request.json();

    if(!title || !desc || !status) 
        return NextResponse.json({message:"Incomplete fields"},{status:404})

    try {
        const task = new taskSch({title,desc,status});
        const newTask = await task.save(); 
        return NextResponse.json({message:"Saved task successfully",newTask},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error while saving task"},{status:500})
    }

}

export async function GET(){
    await connect()
    try {
        const response = await taskSch.find({}).sort({createdAt:-1})
        if(!response)
            return NextResponse.json({message:"Error while fetching Tasks"},{status:404})
        return NextResponse.json({message:"Fetched tasks successfully",tasks:response},{status:200})
    } catch (error) {
        console.log("error while fetching",error)
        return NextResponse.json({message:"error while fetching"},{status:500})
    }
}

export async function DELETE(request){
    await connect();
    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id");

    try {
        const response = await taskSch.findByIdAndDelete(id);
        if(!response){
            return NextResponse.json({message:"Couldn't find Task"},{status:404})
        }
        return NextResponse.json({message:"Deleted Task Successfully"},{status:200})
    } catch (error) {
        console.log("error while deleting task",error)
        return NextResponse.json({message:"Error while deleting"},{status:500})
    }
}

