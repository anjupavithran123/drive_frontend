import { useEffect, useState } from "react";
import MainLayout from "../components/mainlayout";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

export default function Trash() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTrash = async () => {
    try {
      setLoading(true);

      // 🔹 Get trashed folders
      const { data: folderData, error: folderError } = await supabase
        .from("folders")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (folderError) throw folderError;

      // 🔹 Get trashed files
      const { data: fileData, error: fileError } = await supabase
        .from("files")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (fileError) throw fileError;

      setFolders(folderData || []);
      setFiles(fileData || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trash");
      setFolders([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const restoreFolder = async (folderId) => {
    try {
      await supabase.from("folders").update({ deleted_at: null }).eq("id", folderId);
      toast.success("Folder restored ✅");
      loadTrash();
    } catch {
      toast.error("Restore failed ❌");
    }
  };

  const deleteFolderForever = async (folderId) => {
    if (!window.confirm("Delete folder forever?")) return;
    try {
      await supabase.from("folders").delete().eq("id", folderId);
      toast.success("Folder deleted permanently ✅");
      loadTrash();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const restoreFile = async (fileId) => {
    try {
      await supabase.from("files").update({ deleted_at: null }).eq("id", fileId);
      toast.success("File restored ✅");
      loadTrash();
    } catch {
      toast.error("Restore failed ❌");
    }
  };

  const deleteFileForever = async (fileId) => {
    if (!window.confirm("Delete file forever?")) return;
    try {
      await supabase.from("files").delete().eq("id", fileId);
      toast.success("File deleted permanently ✅");
      loadTrash();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">🗑 Trash</h1>

        {loading && <p>Loading...</p>}

        {!loading && folders.length === 0 && files.length === 0 && (
          <p className="text-gray-500">Trash is empty</p>
        )}

        {/* 🔹 Folders */}
        {folders.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-4 mb-2">Folders</h2>
            <div className="bg-white rounded shadow divide-y">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex justify-between items-center p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📁</span>
                    <div>
                      <p className="font-medium">{folder.name}</p>
                      <p className="text-xs text-gray-500">
                        Deleted on {new Date(folder.deleted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => restoreFolder(folder.id)}
                      className="text-green-600 hover:underline"
                    >
                      Restore
                    </button>

                    <button
                      onClick={() => deleteFolderForever(folder.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete forever
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 🔹 Files */}
        {files.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-6 mb-2">Files</h2>
            <div className="bg-white rounded shadow divide-y">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium">{file.file_name}</p>
                      <p className="text-xs text-gray-500">
                        Deleted on {new Date(file.deleted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => restoreFile(file.id)}
                      className="text-green-600 hover:underline"
                    >
                      Restore
                    </button>

                    <button
                      onClick={() => deleteFileForever(file.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete forever
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
