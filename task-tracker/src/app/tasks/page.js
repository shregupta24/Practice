"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactConfetti from "react-confetti";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function Tasks() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    status: "",
  });
  const [allTask, setAllTask] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [filter, setFilter] = useState("All");

  const filteredTasks = allTask.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });
  const handleConfirmDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/tasks?id=${id}`);
      if (response.status === 200) {
        toast.success("Task Deleted Successfully");
        setAllTask((prevTasks) => prevTasks.filter((task) => task._id !== id));
      }
    } catch (error) {
      console.log("error while deleting", error);
      toast.error("Error while deleting task");
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `/api/tasks/${editTask._id}`,
        editTask
      );
      if (response.status === 200) {
        toast.success("Task Updated Successfully");

        if (editTask.status === "Completed") {
          setConfetti(true);
          setTimeout(() => setConfetti(false), 6000);
        }
        setAllTask((prev) =>
          prev.map((task) => (task._id === editTask._id ? editTask : task))
        );
        setEditTask(null);
      }
    } catch (error) {
      toast.error("Error in updating task");
      console.log("Error in updating task", error);
    }
  };
  useEffect(() => {
    const getAllTask = async () => {
      try {
        const response = await axios.get("/api/tasks");
        setAllTask(response.data.tasks);
      } catch (error) {
        console.log("error while fetching tasks", error);
      }
    };
    getAllTask();
  }, []);
  const submitFormData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/tasks", form);
      if (response.status === 200) {
        toast.success("Task Saved Successfully");
        setAllTask((prevTasks) => [response.data.newTask, ...prevTasks]);
        setForm({
          title: "",
          desc: "",
          status: "",
        });
      } else {
        toast.error("Error while saving task");
      }
    } catch (error) {
      toast.error("Error while saving task");
      console.log("Error while saving task", error);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-50">
      {confetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      {deleteTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-smw-[90%] text-center">
            <p className=" mb-4 text-lg font-semibold">
              Are you sure you want to delete this Task?
            </p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-gray-400 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteTaskId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800"
                onClick={() => handleConfirmDelete(deleteTaskId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div >
        <div className="flex gap-4 px-4 mx-4 justify-center mb-4">
          <button
            onClick={() => setFilter("All")}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-semibold cursor-pointer ${
              filter === "All"
                ? "bg-blue-600 text-white shadow-md cursor-pointer"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Completed")}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-semibold cursor-pointer ${
              filter === "Completed"
                ? "bg-blue-600 text-white shadow-md "
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("In Progress")}
            className={`py-2 px-5 rounded-full transition-all duration-300 font-semibold cursor-pointer  ${
              filter === "In Progress"
                ? "bg-blue-600 text-white shadow-md "
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-semibold cursor-pointer ${
              filter === "Pending"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center p-6 text-blue-700 font-serif animate-pulse">
          Keep your all tasks at one place
        </h2>
        <form
          onSubmit={(e) => submitFormData(e)}
          className="flex flex-col gap-4 bg-white shadow-lg rounded-2xl p-6 w-[90%] max-w-md border border-gray-200 items-center"
        >
          <label className="font-semibold text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            type="text"
            id="title"
            className="border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
          />

          <label className="font-semibold text-gray-700" htmlFor="des">
            Description
          </label>
          <textarea
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none transition-all duration-300"
            id="des"
            rows={5}
            cols={40}
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          ></textarea>

          <label className="font-semibold text-gray-700" htmlFor="status">
            Status :
          </label>
          <select
            className="border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            id="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="">Select Your status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="mt-4 py-2 px-3 cursor-pointer bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300">
            Add Task
          </button>
        </form>
      </div>
      <div className="w-[90%] max-w-4xl mt-10 overflow-x-auto shadow-lg rounded-xl bg-white border border-gray-200">
        <table className="w-full border-collapse shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center uppercase">
            <tr>
              <th className="py-3 px-4 font-semibold tracking-wide">Title</th>
              <th className="py-3 px-4 font-semibold tracking-wide">
                Description
              </th>
              <th className="py-3 px-4 font-semibold tracking-wide">Status</th>
              <th>Delete Task</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
                className="even:bg-blue-50 odd:bg-white text-center hover:bg-blue-100 transition-all duration-300"
                key={task._id}
              >
                <td className="py-3 px-4 text-gray-700 font-medium">
                  {task.title}
                </td>
                <td className="py-3 px-4 text-gray-700">{task.desc}</td>
                <td
                  className={`py-3 px-4 font-semibold 
                    ${
                      task.status === "Completed"
                        ? "text-green-600"
                        : task.status === "In Progress"
                        ? "text-yellow-500"
                        : "text-gray-600"
                    }`}
                >
                  {task.status}
                </td>
                <td>
                  <button
                    className="py-3 px-4 text-red-600 cursor-pointer hover:text-xl transition-all duration-300"
                    onClick={() => setDeleteTaskId(task._id)}
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setEditTask(task)}
                    className="py-3 px-4 text-yellow-500 cursor-pointer hover:text-xl transition-all duration-300"
                  >
                     <FaEdit />
                  </button>
                  {editTask && editTask._id === task._id && (
                    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center bg-black bg-opacity-30 z-50">
                      <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
                        <h2 className="text-2xl  font-bold text-blue-700 mb-4">
                          Edit Task
                        </h2>
                        <form
                          onSubmit={handleUpdate}
                          className="flex flex-col gap-4"
                        >
                          <input
                            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                            value={editTask.title}
                            onChange={(e) =>
                              setEditTask({
                                ...editTask,
                                title: e.target.value,
                              })
                            }
                            placeholder="Title"
                          />
                          <textarea
                            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 resize-none"
                            value={editTask.desc}
                            onChange={(e) =>
                              setEditTask({ ...editTask, desc: e.target.value })
                            }
                            placeholder="Description"
                          />
                          <select
                            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                            value={editTask.status}
                            onChange={(e) =>
                              setEditTask({
                                ...editTask,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => setEditTask(null)}
                              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
                            >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
