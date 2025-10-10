import { connect } from "../../dbconfig/db";
import Notes from "../../notesModel/notesModels";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();
  const { title, content } = await request.json();

  if (!title || !content)
    return NextResponse.json(
      { message: "Invalid or incomplete data" },
      { status: 400 }
    );
  try {
    const newNote = new Notes({ title, content });
    await newNote.save();
    return NextResponse.json(
      { message: "Note saved successfully" , note : newNote },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "error while saving notes" },
      { status: 500 }
    );
  }
}

export async function GET(){
    await connect();

    try {
        const response = await Notes.find({}).sort({createdAt:-1})
        return NextResponse.json(response,{status:200})
    } catch (error) {
        return NextResponse.json({message:"Error while fetching notes"},{status:500})
    }

}

export async function DELETE(request){
    await connect();
    try {
        const {searchParams} = new URL(request.url)

        const id = searchParams.get("id");

        if(!id) 
            return NextResponse.json({message:"Note id is required"},{status:400})
        const deletedNote = await Notes.findByIdAndDelete(id);
        if(!deletedNote) 
            return NextResponse.json({message:"Note not found"},{status:404})
         return NextResponse.json({message:"Note deleted successfully"},{status:200})
        
    } catch (error) {
        console.log("error while deleting note",error)
        return NextResponse.json({message:"error while deleting note"},{status:500})
    }
}