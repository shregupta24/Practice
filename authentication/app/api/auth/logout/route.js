import { NextResponse } from "next/server"
export async function POST(){
    try {
        const response = NextResponse.json({
            message:"User Logged out successfully"
        },
    {
        status:200
    }) 
    response.cookies.set("token","",{
        httpOnly: true,
        expires : new Date(0)
    })
    return response;
    } catch (error) {
        console.log("Error while logging out",error)
        return NextResponse.json(
            {message:"Error while logging out"},
            {status:500}
        )
    }
}