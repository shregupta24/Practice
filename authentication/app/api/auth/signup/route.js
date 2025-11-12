import { NextResponse } from "next/server";
import { connect } from "../../../dbconfig/dbconfig"
import User from "../../../userSchema/userSchema";
import bcrypt from "bcryptjs"

export async function POST(request){
    try {
        const {name,email,password} = await request.json()
        await connect();
        if(!name || !email || !password){
            return NextResponse.json({message:"All fields are required"},{status:404})
        }
        const existing = await User.findOne({email})
        if(existing){
            return NextResponse.json({message:"User with same Email id already exists"},{status:404})
        }
        const hashedPass = await bcrypt.hash(password,10);
        const newUser = await User.create({name,email,password:hashedPass});
        return NextResponse.json(
                {message:"User created Successfully",
                user:{id:newUser._id,name:newUser.name,email:newUser.email}},
                {status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Error while creating user"},{status:500})
    }
}