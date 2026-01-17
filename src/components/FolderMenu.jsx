import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ShareModal from "./ShareModal";
import {
  moveFolderToTrash,
  downloadFolderAsZip,
  toggleStarFolder,
  getFolderShareLink,
  getFolders,
  moveFolder,
  apiRenameFolder,
} from "../api/folders";

export default function FolderMenu({
  folder,
  isOpen,
  onClose,
  refresh,
  onInfo,
}) {
  const menuRef = useRef(null);

  // States
  const [isStarred, setIsStarred] = useState(folder?.is_starred || false);
  const [showMove, setShowMove] = useState(false);
  const [targetFolder, setTargetFolder] = useState("");
  const [folders, setFolders] = useState([]);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showShare, setShowShare] = useState(false);
  /* ---------- Close on outside click ---------- */
  /* ---------- Close on outside click ---------- */
const modalRef = useRef(null); // <--- new ref for modal

useEffect(() => {
  const handler = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      (!modalRef.current || !modalRef.current.contains(e.target))
    ) {
      onClose();
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, [onClose]);


  /* ---------- Fetch folders for Move dropdown ---------- */
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        setFolders(res.data.filter((f) => f.id !== folder.id));
      } catch (err) {
        console.error(err);
      }
    };
    if (showMove) fetchFolders();
  }, [showMove, folder.id]);

  /* ---------- Star toggle ---------- */
  const handleStarToggle = async () => {
    try {
      await toggleStarFolder(folder.id, !isStarred);
      setIsStarred(!isStarred);
      toast.success("Updated ⭐");
      refresh?.();
      onClose();
    } catch {
      toast.error("Failed to update star ❌");
    }
  };

  /* ---------- Trash ---------- */
  const handleTrash = async () => {
    try {
      await moveFolderToTrash(folder.id);
      toast.success("Moved to Trash ✅");
      refresh?.();
      onClose();
    } catch {
      toast.error("Failed to move ❌");
    }
  };

  /* ---------- Download ---------- */
  const handleDownload = async () => {
    try {
      const res = await downloadFolderAsZip(folder.id);
      const blob = new Blob([res.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folder.name}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started ⬇");
      onClose();
    } catch {
      toast.error("Download failed ❌");
    }
  };

  /* ---------- Copy link ---------- */
  const handleCopyFolderLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await getFolderShareLink(folder.id);
      await navigator.clipboard.writeText(data.url);
      toast.success("Folder link copied 🔗");
      onClose();
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Copy link failed ❌");
    }
  };

  /* ---------- Rename folder ---------- */
  const handleRename = async () => {
    const newName = prompt("Enter new folder name", folder.name);
    if (!newName || newName === folder.name) return;
    try {
      await apiRenameFolder(folder.id, newName);
      toast.success("Folder renamed ✅");
      refresh?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Rename failed ❌");
    }
  };

  /* ---------- Move folder ---------- */
  const handleMoveFolder = async () => {
    if (!targetFolder) return toast.error("Select target folder");
    try {
      await moveFolder(folder.id, targetFolder);
      toast.success("Folder moved ✅");
      refresh?.();
      setShowMove(false);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Move failed ❌");
    }
  };

  /* ---------- JSX ---------- */
  if (!isOpen) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="absolute right-2 top-10 bg-white border rounded shadow w-56 z-50"
      >
        {/* Rename */}
        <button className="menu-item" onClick={handleRename}>
          ✏ Rename
        </button>

        {/* Star */}
        <button className="menu-item" onClick={handleStarToggle}>
          {isStarred ? "⭐ Unstar" : "⭐ Add to Starred"}
        </button>

        {/* Info */}
        <button
  className="menu-item"
  onClick={() => onInfo?.(folder)} // optional chaining
>
  ℹ Folder information
</button>


        {/* Share via email */}
       {/* Share via email */}
<button
  onClick={() => setShowShare(true)} // only open modal
  className="menu-item flex items-center gap-2"
>
  📨 Share via email
</button>


        {/* Copy link */}
        <button
          type="button"
          className="menu-item"
          onClick={handleCopyFolderLink}
        >
          🔗 Copy folder link
        </button>

        {/* Download */}
        <button className="menu-item" onClick={handleDownload}>
          ⬇ Download
        </button>

        <div className="border-t my-1" />

        {/* Move dropdown */}
        <button
          className="menu-item"
          onClick={() => setShowMove((prev) => !prev)}
        >
          📂 Move
        </button>

        {showMove && (
          <div className="p-2">
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="w-full border rounded p-1 mb-2"
            >
              <option value="">Select target folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleMoveFolder}
              className="w-full bg-blue-500 text-white rounded py-1"
            >
              Move
            </button>
          </div>
        )}

        <div className="border-t my-1" />

        {/* Trash */}
        <button className="menu-item text-red-600" onClick={handleTrash}>
          🗑 Move to Trash
        </button>
      </div>

      {/* ---------- Share Modal ---------- */}
      {/* ---------- Share Modal ---------- */}
{showShare && (
  <div ref={modalRef}>
    <ShareModal
      isOpen={showShare}
      onClose={() => setShowShare(false)}
      folder={folder}
      refresh={refresh}
    />
  </div>
)}

    </>
  );
}
