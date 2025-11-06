import mongoose from "mongoose";


const msgSchema = new mongoose.Schema({
    msg : {
        type:String,
        required:true,
    }
},
{
        timestamps:true
    }
);

const Msg = mongoose.models.Msg || mongoose.model("Msg",msgSchema);
export default Msg;