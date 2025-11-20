"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Me() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data.user);
      } catch (err) {
        toast.error("Session expired, please login again");
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      toast.success(res.data.message);
      router.push("/login");
    } catch (err) {
      toast.error("Error while logging out");
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-lg text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-white/40">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome, {user.name} 👋
        </h1>

        <div className="space-y-4">
          <p className="text-lg bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
            <span className="font-semibold">User ID:</span> {user._id}
          </p>
          <p className="text-lg bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-red-700 transition-all duration-300 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
