import { useState } from "react";
import { shareResource } from "../api/shares";
import { toast } from "react-toastify";

const ShareModal = ({ resource, onClose }) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email) return toast.error("Email required");

    try {
      setLoading(true);
      await shareResource({
        resourceId: resource.id,
        resourceType: resource.type, // 'file' | 'folder'
        email,
        permission
      });

      toast.success("Shared via email");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Share failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[380px]">
        <h2 className="text-lg font-semibold mb-4">Share</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="view">View only</option>
          <option value="edit">Can edit</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
