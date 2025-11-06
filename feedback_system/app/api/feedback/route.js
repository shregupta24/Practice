import { connect } from "../../dbconfig/dbconfig";
import {NextResponse} from "next/server"
import { Feedback } from "../../feedbackSchema/feedbackSchema";
export async function POST(request){
    await connect()
    try {
        const {username,feedback,rating} = await request.json();
        if(!username || !feedback || !rating){
            return NextResponse.json({
                message:"All feilds are required"
            },{
                status:400
            })
        }
        const newFeedback = new Feedback({
            username,
            feedback,
            rating
        })
        await newFeedback.save();
        return NextResponse.json({message:"Feedback submitted successfully"},{status:200})
    } catch (error) {
        console.log("error while submitting feedback",error)
        return NextResponse.json({message:"Error while submitting feedback"},{status:500})
    }
}

export async function GET(){
    await connect();
    try {
        const feedbacks = await Feedback.find({}).sort({createdAt:-1});
        return NextResponse.json({message:"Fetched feedbacks",feedbacks},{status:200})
    } catch (error) {
        console.log("error while fetching feedbacks",error)
        return NextResponse.json({message:"error while fetching feedbacks"},{status:500})
    }
}