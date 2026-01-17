import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/mainlayout";
import {
  getStarredFolders,
  toggleStarFolder,
} from "../api/folders";
import {
  getStarredFiles,
  toggleStarFile,
  downloadFile,
} from "../api/files";
import { toast } from "react-toastify";

export default function Starred() {
  const navigate = useNavigate();

  const [starredFolders, setStarredFolders] = useState([]);
  const [starredFiles, setStarredFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStarred = async () => {
    try {
      setLoading(true);

      const [foldersRes, filesRes] = await Promise.all([
        getStarredFolders(),
        getStarredFiles(),
      ]);

      setStarredFolders(Array.isArray(foldersRes.data) ? foldersRes.data : []);
      setStarredFiles(Array.isArray(filesRes.data) ? filesRes.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load starred items");
      setStarredFolders([]);
      setStarredFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStarred();
  }, []);

  /* ⭐ UNSTAR FOLDER */
  const handleUnstarFolder = async (e, folder) => {
    e.stopPropagation();
    try {
      await toggleStarFolder(folder.id, false);
      toast.success("Folder unstarred ⭐");
      // Remove folder from state without reload
      setStarredFolders((prev) => prev.filter((f) => f.id !== folder.id));
    } catch {
      toast.error("Failed to update star");
    }
  };

  /* ⭐ UNSTAR FILE */
  const handleUnstarFile = async (e, file) => {
    e.stopPropagation();
    try {
      await toggleStarFile(file.id, false);
      toast.success("File unstarred ⭐");
      // Remove file from state without reload
      setStarredFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch {
      toast.error("Failed to update star");
    }
  };

  /* ⬇ DOWNLOAD FILE */
  const handleDownloadFile = async (e, file) => {
    e.stopPropagation();
    try {
      const res = await downloadFile(file.id);
      const blob = new Blob([res.data], { type: file.mime_type || "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed ❌");
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">⭐ Starred</h1>

        {loading && <p className="text-gray-500">Loading starred items...</p>}

        {!loading && starredFolders.length === 0 && starredFiles.length === 0 && (
          <p className="text-gray-500">No starred items</p>
        )}

        {/* ⭐ FOLDERS */}
        {starredFolders.length > 0 && (
          <>
            <h2 className="text-lg font-medium mt-6 mb-2">Folders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {starredFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => navigate(`/folder/${folder.id}`)}
                  className="p-4 border rounded cursor-pointer hover:bg-gray-50 flex items-center gap-2"
                >
                  📁
                  <span className="truncate">{folder.name}</span>

                  <div className="ml-auto flex gap-2 text-sm">
                    <button
                      onClick={(e) => handleUnstarFolder(e, folder)}
                      title="Unstar"
                    >
                      ⭐
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ⭐ FILES */}
        {starredFiles.length > 0 && (
          <>
            <h2 className="text-lg font-medium mt-8 mb-2">Files</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {starredFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded hover:bg-gray-50 flex items-center gap-2"
                >
                  📄
                  <span className="truncate">{file.file_name}</span>

                  <div className="ml-auto flex gap-2 text-sm">
                    <button
                      onClick={(e) => handleDownloadFile(e, file)}
                      title="Download"
                    >
                      ⬇
                    </button>
                    <button
                      onClick={(e) => handleUnstarFile(e, file)}
                      title="Unstar"
                    >
                      ⭐
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
