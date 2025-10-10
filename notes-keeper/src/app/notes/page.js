"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Notes() {
  const [notes, setNotes] = useState({
    title: "",
    content: "",
  });

  const [notesData, setNotesData] = useState([]);

  const storeFormData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/createNotes", notes);
      console.log("Form data submitted successfully");
      if (response.status === 200) {
        toast.success("Notes saved successfully");
        setNotesData((prevNotes) => [response.data.note, ...prevNotes]);
        setNotes({
          title: "",
          content: "",
        });
      }
    } catch (error) {
      console.log("Error while saving notes");
      toast.error("Error while saving notes");
    }
  };

  useEffect(() => {
    const getNotesData = async () => {
      const response = await axios.get("api/createNotes");
      setNotesData(response.data);
    };
    getNotesData();
  }, []);

  const deleteNote = async (id) =>{
    try {
        const response = await axios.delete(`api/createNotes?id=${id}`)
        if(response.status === 200){
            toast.success("note deleted successfully");

            setNotesData(prevNotes => prevNotes.filter(note => note._id !== id))
        }
    } catch (error) {
        console.log("error while deleting note",error)
        toast.error("Failed to delete note")
    }
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-4xl text-green-600 p-4 m-4">
        Keep your Notes safe here
      </h2>
      <form
        className="gap-2 flex flex-col items-center"
        onSubmit={storeFormData}
      >
        <div className="flex flex-row items-center p-2 m-4 gap-4">
          <label className="text-yellow-500 font-extrabold" htmlFor="title">
            Enter your notes title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Notes Title"
            id="title"
            value={notes.title}
            onChange={(e) => setNotes({ ...notes, title: e.target.value })}
            className="border-2 border-gray-400 rounded-md p-2 focus:outline-none 
          focus:ring-2 focus:ring-green-400"
          />
        </div>
        <br />
        <div className="flex flex-row items-center p-4 m-4 gap-2">
          <label className="text-yellow-500 font-extrabold" htmlFor="content">
            Enter your notes content
          </label>
          <textarea
            placeholder="Notes Content"
            name="content"
            id="content"
            value={notes.content}
            onChange={(e) => setNotes({ ...notes, content: e.target.value })}
            className="border-2 border-gray-400 rounded-md p-2 focus:outline-none 
            focus:ring-2 focus:ring-green-400"
            rows={5}
            cols={50}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Save Note
        </button>
      </form>

      <div className="w-full max-w-4xl mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4 text-green-600 text-center">All Notes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Delete Note</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notesData.map((note) => (
                <tr
                  key={note._id}
                  className="hover:bg-green-50 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {note.title}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{note.content}</td>
                  <td><button 
                    type="submit"
                    className="bg-red-400 rounded-lg border-1 border-red-800 text-amber-50 p-2
                     hover:bg-red-700 cursor-pointer"
                     onClick={() => deleteNote(note._id)}
                     >
                    Delete Note
                    </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
