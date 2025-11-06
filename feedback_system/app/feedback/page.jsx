"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export default function Feedback() {
  const [formData, setFormData] = useState({
    username: " ",
    feedback: " ",
    rating: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: " ",
    feedback: " ",
    rating: 0,
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting,setIsDeleting] = useState(false);
  const [isSending,setIsSending] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false)
  const getFeedbacks = async () => {
    try {
      const response = await axios.get("/api/feedback");
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.log("error while fetching feedbacks", error);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);
  const handleEdit = (fb) => {
    setEditForm({
      username: fb.username,
      feedback: fb.feedback,
      rating: fb.rating,
    });
    setEditingId(fb._id);
  };
  const handleSave = async (id) => {
    setIsSending(true)
    try {
      const response = await axios.patch(`/api/feedback/${id}`, editForm);
      if (response.status === 200) {
        toast.success("Feedback edited successfully");
        setEditingId(null);
        setEditForm({ username: " ", feedback: " ", rating: 0 });
        getFeedbacks();
      }
    } catch (error) {
      console.log("error while updating feedback", error);
      toast.error("Error while updating feedback");
    }
    finally{
      setIsSending(false)
    }
  };
  const handleCancel = () => {
    setEditingId(null);
  };
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeletingId(id);
  };
  const deleteFeedback = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.delete(`/api/feedback/${deletingId}`);
      if (response.status === 200) {
        toast.success("Deleted feedback successfully");
        setShowDeleteModal(false);
        setDeletingId(null);
        getFeedbacks();
      }
    } catch (error) {
      toast.error("Error while deleting feedback");
    }
    finally{
      setIsDeleting(false)
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingId(null);
  };
  const saveFormData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/feedback", formData);
      if (response.status === 200) {
        getFeedbacks();
        toast.success("Feedback submitted successfully");
        setFormData({
          username: " ",
          feedback: " ",
          rating: 0,
        });
      }
    } catch (error) {
      toast.error("Error while submitting feedback");
      console.log("Error while submitting feedback", error);
    }
    finally{
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Feedback
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this feedback?
            </p>
            <div className="flex just gap-3">
              <button
                onClick={() => deleteFeedback()}
                className={`px-4 py-2 rounded-md text-white transition ${
                  isDeleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600  hover:bg-red-700"
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-400 text-gray-800 transition"
                onClick={cancelDelete}
                disable={!!deletingId}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-white to-pink-200 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Feedback Board
            </h1>
            <p className="mt-1 text-sm  text-gray-500">
              Collect user opinions and ratings. Add, edit or remove feedback
              easily.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 self-center">
            <form
              onSubmit={saveFormData}
              className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="feedback"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Feedback:{" "}
                </label>
                <textarea
                  id="feedback"
                  value={formData.feedback}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300"
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating
                </label>
                <select
                  value={formData.rating}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                >
                  <option value="">Select Rating</option>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
              </div>
              <div className="flex gap-3 items-center pt-2">
                <button
                  className={` hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-sm transition ${isSubmitting ? "bg-sky-400 cursor-not-allowed" :"bg-sky-600"}`}
                  type="submit"
                  disabled = {isSubmitting}
                >
                  {isSubmitting ? "Submitting...":"Submit"}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Feedback
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {feedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-gray-50 transition">
                    <td>
                      {fb._id === editingId ? (
                        <input
                          className="w-full border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-200"
                          type="text"
                          id="username"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                        />
                      ) : (
                        fb.username
                      )}
                    </td>
                    <td>
                      {fb._id === editingId ? (
                        <input
                          className="w-full border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-200"
                          type="text"
                          id="feedback"
                          value={editForm.feedback}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              feedback: e.target.value,
                            })
                          }
                        ></input>
                      ) : (
                        fb.feedback
                      )}
                    </td>
                    <td>
                      {editingId === fb._id ? (
                        <select
                          className="border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-200"
                          value={editForm.rating}
                          onChange={(e) =>
                            setEditForm({ ...editForm, rating: e.target.value })
                          }
                        >
                          <option value="">Select Rating</option>
                          <option value="1">⭐</option>
                          <option value="2">⭐⭐</option>
                          <option value="3">⭐⭐⭐</option>
                          <option value="4">⭐⭐⭐⭐</option>
                          <option value="5">⭐⭐⭐⭐⭐</option>
                        </select>
                      ) : (
                        fb.rating
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingId === fb._id ? (
                        <div className="flex gap-2">
                          <button
                            disabled={isSending}
                            onClick={() => handleSave(fb._id)}
                            className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition ${isSending ? "bg-green-400 cursor-not-allowed" :"bg-green-700" } `}
                          >
                            {isSending ? "Saving..." : "Save" }
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(fb)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(fb._id)}
                            className="px-3 py-1 rounded-md text-white transition bg-red-600 hover:bg-red-700 cursor-pointer" 
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {feedbacks.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No feedbacks yet — be the first!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
