"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios";
import toast from "react-hot-toast"
import {Eye,EyeOff} from "lucide-react"
export default function Login(){
    const router = useRouter();
    const[form,setForm] = useState({
        email:"",
        password:""
    })
    const[isSubmit,setIsSubmit] = useState(false)
    const[showPassword,setShowPassword] = useState(false)
    const[error,setError] = useState("")
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setError("")
        try {
            const response = await axios.post("/api/auth/login",form);
            toast.success(response.data.message)
            if(response.status === 200){
               router.push("/me") 
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed";
            setError(msg)
            console.log("Error while logging :",error)
        }
        finally{
            setIsSubmit(false)
        }
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300  p-4">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/40">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Welcome Back
            </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ">Email ID : </label>
                        <input className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none " type="text" id="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})}></input>
                    </div>
                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type={showPassword ? "text" :"password"} id="password" value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"></input>
                    <button type="button" className="absolute right-3 top-10 text-gray-500 hover:text-blue-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ?<EyeOff size={18}/> :<Eye size={18} />}</button>
                </div>
                <button type="submit" disabled={isSubmit} className={`w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium transition-all duration-300 ${isSubmit ?" opacity-50 cursor-not-allowed":"hover:bg-blue-700"}`}>{isSubmit ? "Logging In..." :"Login" }</button>
            </form>
            <p className="text-sm text-center mt-4 text-gray-700">Don't have an account ? {" "}
                <button onClick={() => router.push("/signup")} className="text-blue-600 font-semibold hover:underline">SignUp</button>
            </p>
            </div>
            {error && (
                <p className="absolute bottom-10 text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded-lg shadow-lg">{error}</p>
            )}
        </div>
    )
}