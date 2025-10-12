import mongoose from "mongoose";

export async function connect() {
    if(mongoose.connection.readyState >= 1) return

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected successfully")
    } catch (error) {
        console.log("error while connecting to database")
    }

}