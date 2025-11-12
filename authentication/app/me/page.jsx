"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";
export default function Me(){
    const router = useRouter();
    const[user,setUser] = useState(null);
    useEffect(()=>{
        const fetchUser = async () =>{
            try {
                const response = await axios.get("/api/auth/me");
                setUser(response.data.user)
            } catch (error) {
                toast.error("Session expired,please login again")
                console.log(error)
                router.push("/login")
            }
        }
        fetchUser();
    },[])
    const handleLogout = async() =>{
        try {
            const response = await axios.post("/api/auth/logout");
            toast.success(response.data.message)
            router.push("/login")
        } catch (error) {
            console.log(error)
            toast.error("Error while logging out")
        }
    }
    if(!user) return <p>Loading...</p>

    return(
        <div>
            <h1>Welcome {user.name}</h1>
            <p>User Id : {user._id}</p>
            <p>Email : {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}