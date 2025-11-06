import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    username :{
        type:String,
        required:true
    },
    feedback : {
        type:String,
        required:true
    },
    rating:{
        type:Number,
        enum : [1,2,3,4,5],
        required:true
    },
},{
    timestamps:true
}
)

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback",feedbackSchema)