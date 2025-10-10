import mongoose from "mongoose";
const NotesSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

const Notes = mongoose.models.Notes || mongoose.model("Notes",NotesSchema)

export default Notes