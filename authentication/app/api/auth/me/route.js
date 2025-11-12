import { NextResponse } from "next/server";
import { connect } from "../../../dbconfig/dbconfig";
import User from "../../../userSchema/userSchema";
import jwt from "jsonwebtoken"
export async function GET(request){
    try {
        await connect();
        const token = request.cookies.get("token")?.value;
        if(!token){
            return NextResponse.json({message:"Not Authenticated"},{status:401})
        }
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password")
        if(!user){
            return NextResponse.json({message:"User Not found"},{status:404})
        }
        return NextResponse.json({user},{status:200})
    } catch (error) {
        console.log("Error in me route",error)
        return NextResponse.json({message:"Invalid token"},{status:401})
    }
}