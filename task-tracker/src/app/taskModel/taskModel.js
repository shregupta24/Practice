import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","In Progress","Completed"]
    },
},
{
        timestamps:true
}
)

const taskSch = mongoose.models.taskSch || mongoose.model("taskSch",TaskSchema)

export default taskSch;