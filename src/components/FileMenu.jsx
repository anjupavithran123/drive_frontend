import { useEffect, useRef, useState } from "react";
import ShareModal from "./ShareModal";
import { toast } from "react-toastify";
import {
  toggleStarFile,
  moveFileToTrash,
  renameFile,
  getFileInfo,
  downloadFile,
  getFileSignedUrl,
  moveFile,
} from "../api/files";
import { getFolders } from "../api/folders"; // ✅ correct import for Move dropdown

export default function FileMenu({ file, isOpen, onClose, refresh }) {
  const menuRef = useRef(null);
  const [isStarred, setIsStarred] = useState(false);
  const [position, setPosition] = useState("bottom");
  const [showShareCard, setShowShareCard] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Move states
  const [showMove, setShowMove] = useState(false);
  const [folders, setFolders] = useState([]);
  const [targetFolder, setTargetFolder] = useState("");

  // Sync starred state
  useEffect(() => {
    if (file) setIsStarred(file.is_starred || false);
  }, [file]);

  // Close menu and share card on outside click
// Fetch folders for Move dropdown
useEffect(() => {
  if (!showMove || !file) return;

  const fetchFolders = async () => {
    try {
      const res = await getFolders();
      let allFolders = [];
      // Support backend returning { data: [...] } or { data: { folders: [...] } }
      if (Array.isArray(res.data)) {
        allFolders = res.data;
      } else if (res.data?.folders) {
        allFolders = res.data.folders;
      }

      // Remove current folder's parent to avoid moving into itself
      const filteredFolders = allFolders.filter(f => f.id !== file.folder_id);
      setFolders(filteredFolders);
    } catch (err) {
      console.error("Fetch folders failed:", err);
    }
  };

  fetchFolders();
}, [showMove, file]);

  // Flip menu if near bottom
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    setPosition(rect.bottom > window.innerHeight ? "top" : "bottom");
  }, [isOpen]);

  // Fetch folders for Move dropdown
  useEffect(() => {
    if (!showMove || !file) return;

    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        // Ensure data is an array
        const allFolders = Array.isArray(res.data) ? res.data : res.data.folders || [];
        // Exclude current parent folder
        const filteredFolders = allFolders.filter(f => f.id !== file.folder_id);
        setFolders(filteredFolders);
      } catch (err) {
        console.error("Fetch folders failed:", err);
      }
    };
    fetchFolders();
  }, [showMove, file]);

  /* ---------- Actions ---------- */
  const handleStarToggle = async () => {
    try {
      await toggleStarFile(file.id, !isStarred);
      setIsStarred(!isStarred);
      toast.success(!isStarred ? "Added to Starred ⭐" : "Removed from Starred ⭐");
      refresh?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Star update failed ❌");
    }
  };

  const handleTrash = async () => {
    if (!window.confirm("Move file to trash?")) return;
    try {
      await moveFileToTrash(file.id);
      toast.success("Moved to Trash ✅");
      refresh?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Trash failed ❌");
    }
  };

  const handleRename = async () => {
    const newName = prompt("Rename file", file.file_name);
    if (!newName || newName === file.file_name) return;
    try {
      await renameFile(file.id, newName);
      toast.success("File renamed ✅");
      refresh?.();
      onClose();
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Rename failed ❌");
    }
  };

  const handleInfo = async () => {
    try {
      const { data } = await getFileInfo(file.id);
      alert(`File Info\n\nName: ${data.file_name}\nID: ${data.id}\nSize: ${data.size} bytes`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch info ❌");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadFile(file.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Download started ⬇");
      onClose();
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Download failed ❌");
    }
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data } = await getFileSignedUrl(file.id);
      await navigator.clipboard.writeText(data.url);
      toast.success("Link copied 🔗");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Copy link failed ❌");
    }
  };

  const handleMoveFile = async () => {
    if (!targetFolder) return toast.error("Select target folder");
    try {
      await moveFile(file.id, targetFolder);
      toast.success("File moved ✅");
      setShowMove(false);
      refresh?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Move failed ❌");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if menuRef exists and click is outside
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.(); // Call onClose to hide the menu
      }
    };
  
    // Listen for all clicks on document
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  if (!isOpen || !file) return null;

  return (
    <>
      {/* File Menu */}
      <div
        ref={menuRef}
        className={`absolute right-2 ${position === "top" ? "bottom-10" : "top-10"} bg-white border rounded shadow w-56 z-50`}
      >
        <button className="menu-item" onClick={handleStarToggle}>
          {isStarred ? "⭐ Unstar" : "⭐ Add to Starred"}
        </button>
        <button className="menu-item" onClick={handleTrash}>🗑 Move to Trash</button>
        <button className="menu-item" onClick={handleRename}>✏ Rename</button>
        <button className="menu-item" onClick={handleCopyLink}>🔗 Copy link</button>

<button
  onClick={() => setShowShare(true)}
  className="menu-item"
>
📨 Share via email
</button>

{showShare && (
  <ShareModal
    resource={{ id: file.id, type: "file" }}
    onClose={() => setShowShare(false)}
  />
)}
        <button className="menu-item" onClick={handleDownload}>⬇ Download</button>
        <button className="menu-item" onClick={handleInfo}>ℹ Info</button>

        {/* Move Dropdown */}
        <button className="menu-item" onClick={() => setShowMove(prev => !prev)}>📂 Move</button>
        {showMove && (
          <div className="p-2">
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="w-full border rounded p-1 mb-2"
            >
              <option value="">Select target folder</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <button onClick={handleMoveFile} className="w-full bg-blue-500 text-white rounded py-1">
              Move
            </button>
          </div>
        )}
      </div>

      {/* Share Email Card */}
      {showShareCard && (
        <div
          id="share-card"
          className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <ShareEmailCard
            type="file"
            id={file.id}
            onClose={() => setShowShareCard(false)}
          />
        </div>
      )}
    </>
  );
}
