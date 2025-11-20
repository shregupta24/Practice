"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {Eye , EyeOff} from "lucide-react"

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("")
    try {
      const response = await axios.post("/api/auth/signup", formData);
      toast.success(response.data.message);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      setError(msg)
      //toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/40">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="name">
              Name : 
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></input>
          </div>
          <div className="relative">
            <label
              className="block text-sm font-medium mb-1 text-gray-700"
              htmlFor="password"
            >
              Password: 
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

              required
            ></input>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-blue-700 cursor-pointer ${loading ? "cursor-not-allowed" : "cursor-pointer"} `}
          >
            {loading ? "Signing in..." : "Signup"}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-700">
          Already Have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </button>
        </p>
      </div>
      {
        error && (
          <p className="absolute bottom-10 text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded-lg shadow-lg">        
          {error}</p>
          )
      }
    </div>
  );
}
