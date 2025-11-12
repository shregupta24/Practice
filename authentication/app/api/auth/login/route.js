import { NextResponse } from "next/server"
import { connect } from "../../../dbconfig/dbconfig";
import User from "../../../userSchema/userSchema";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request){
    await connect();
    const {email,password} = await request.json();
    if(!email || !password){
        return NextResponse.json({message:"All fields are required"},{status:400})
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({message:"No user found with such username"},{status:404});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return NextResponse.json({message:"Invalid credentials"},{status:401})
        }
        const token = jwt.sign({id:user._id,email:user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn : "1d"})
        const res = NextResponse.json({message:"User loggedIn successfully",user:{id:user._id,email:user.email}},{status:200})
        res.cookies.set("token",token,{httpOnly:true})
        return res;
    } catch (error) {
        return NextResponse.json({message:"Error while logging in"},{status:500})
    }
}