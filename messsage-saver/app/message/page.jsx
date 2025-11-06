"use client"
import { useState , useEffect, useRef} from "react"
import axios from "axios";
import toast from "react-hot-toast"

export default function Message(){
    const[message,setMessage] = useState("")
    const[messages,setMessages] = useState([])
    const[editingId,setEditingId] = useState(null)
    const[editMsg,setEditMsg] = useState("")
    const[showDeleteModal,setShowDeleteModal] = useState(false)
    const[selectedDeletedId,setSelectedDeletedId] = useState(null)
    const[deletingId,setDelectingId] = useState(null)
    const cancelBtnRef = useRef(null)
    const openDeleteModal = (id) =>{
        setSelectedDeletedId(id)
        setShowDeleteModal(true)
    }
    const closeDeleteModal = () => {
        setSelectedDeletedId(null)
        setShowDeleteModal(false)
    }
    const startEdit = (msg) =>{
        setEditMsg(msg.msg)
        setEditingId(msg._id)
    }
    const cancelEdit = () =>{
        setEditMsg("")
        setEditingId(null)
    }
    const submitEdit = async (id) => {
        if(!editMsg.trim()){
            toast.error("Message should not be empty")
            return;
        }
        try {
            const response = await axios.put(`/api/message/${id}`,{message:editMsg})
            if(response.status === 200){
                setMessages(prev => prev.map(m => m._id === id ? {...m ,  msg:editMsg}:m))
                toast.success("Message updated successfully")
                cancelEdit();
            }
        } catch (error) {
            toast.error("error while updating message")
            console.log(error)
        }
    }

    const confirmDelete = async () =>{
        if(!selectedDeletedId){
            return
        }
        setDelectingId(selectedDeletedId)
        try {
            const response = await axios.delete(`/api/message/${selectedDeletedId}`)
            if(response.status === 200){
                toast.success("Message deleted successfully")
                setMessages(prev => prev.filter(msg => msg._id !== selectedDeletedId))
                closeDeleteModal()
            }
        } catch (error) {
            toast.error("error while deleting message")
            console.log(error)
        }
        finally{
            setDelectingId(null)
        }
    }
    const fetchMessages = async () =>{
            try {
                const response = await axios.get("/api/message");
                setMessages(response.data.response)
            } catch (error) {
                console.log("Error while fetching messages")
            }
        }
    useEffect(()=>{
        fetchMessages();
    },[])
    const saveMessage = async (e) =>{
        e.preventDefault()
        try {
            const response = await axios.post("/api/message",{message})
            if(response.status === 200){
                toast.success("Message saved successfully");
                fetchMessages();
                setMessage("")
            }
        } catch (error) {
            toast.error("error while saving message")
            console.log(error)
        }
    }
    return(
    <>
    {showDeleteModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    aria-modal="true"
    role="dialog"
    aria-labelledby="delete-modal-title"
  >
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
      <h3 id="delete-modal-title" className="text-lg font-semibold text-gray-800 mb-2">
        Delete message
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this message? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          ref={cancelBtnRef}
          onClick={closeDeleteModal}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          disabled={!!deletingId}
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className={`px-4 py-2 rounded-md text-white ${deletingId === selectedDeletedId ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          disabled={!!deletingId}
        >
          {deletingId === selectedDeletedId ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center py-10 px-4">
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6"> 
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your messages are saved here</h1>
                    <form onSubmit={saveMessage} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                        <label htmlFor="message">Write your message</label>
                        <input className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Message" id="message" value={message} onChange={(e) => setMessage(e.target.value)}></input>
                        <button className= "bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition cursor-pointer" type="submit">Save</button>
                    </form>
            </div>
            <div className="overflow-x-auto py-10 rounded-2xl">
                <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-blue-500 text-white rounded-2xl">
                        <tr>
                            <th className="py-3 px-4 text-left">
                                Messages
                            </th>
                            <th className="py-3 px-4 text-left">
                                Options
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            messages.map((msg)=>(
                                <tr key={msg._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-gray-800">
                                        {
                                            editingId === msg._id  
                                            ? (
                                                <input 
                                                    value={editMsg}
                                                    onChange={(e) => setEditMsg(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            )
                                            :
                                            (
                                                <span>{msg.msg}</span>
                                            )
                                        }
                                    </td>
                                    <td className="py-3 px-4 flex gap-3">
                                        {
                                            editingId === msg._id 
                                            ? (
                                                <>
                                                    <button onClick={() => submitEdit(msg._id)} className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md transition">Save</button>
                                                    <button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-600 text-white rounded-md px-3 py-1 transition">Cancel</button>
                                                </>
                                            )
                                            :(
                                                <>
                                                    <button onClick = {() => startEdit(msg)}className="bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition">Edit</button>
                                                    <button onClick = {() => openDeleteModal(msg._id)}className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded-md transition">Delete</button>
                                                </>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )
}