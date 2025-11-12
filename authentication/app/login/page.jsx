"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";
import toast from "react-hot-toast"
export default function Login(){
    const router = useRouter();
    const[form,setForm] = useState({
        email:"",
        password:""
    })
    const[isSubmit,setIsSubmit] = useState(false)
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        try {
            const response = await axios.post("/api/auth/login",form);
            toast.success(response.data.message)
            if(response.status === 200){
               router.push("/me") 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed")
            console.log("Error while logging :",error)
        }
        finally{
            setIsSubmit(false)
        }
    }
    return(
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email ID : </label>
                <input type="text" id="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})}></input>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={form.password} onChange={(e) => setForm({...form,password:e.target.value})}></input>
                <button type="submit" disabled={isSubmit}>{isSubmit ? "Logging In..." :"Login" }</button>
            </form>
        </div>
    )
}