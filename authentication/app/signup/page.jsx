"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const[loading,setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post("/api/auth/signup", formData);
      toast.success(response.data.message);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
    finally{
      setLoading(false)
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name : </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        ></input>
        <label htmlFor="email">Email : </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        ></input>
        <label htmlFor="password">Password : </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        ></input>
        <button type="submit" disabled={loading}>{loading ? "Signing in...":"Signup"}</button>
      </form>
    </div>
  );
}
