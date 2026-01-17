import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/mainlayout";
import { getFolders, createFolder,apiRenameFolder } from "../api/folders";
import { getFiles, uploadFile, deleteFile } from "../api/files";
import FolderMenu from "../components/FolderMenu";
import FileMenu from "../components/FileMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";
import { supabase } from "../lib/supabase";
import FolderInfoPanel from "../components/FolderInfoPanel";

// ✅ Define fileIcons mapping at the top
const fileIcons = {
  "image/png": "🖼️",
  "image/jpeg": "🖼️",
  "image/jpg": "🖼️",
  "application/pdf": "📄",
  "text/plain": "📄",
  "text/html": "🌐",
  "video/mp4": "🎬",
  "audio/mpeg": "🎵",
  // fallback for unknown types
  default: "📄",
};
/*file type mime*/ 
const getFileTypeFromMime = (mime, fileName = "") => {
  // ✅ normalize inputs
  const safeMime = mime || "";
  const ext = fileName?.split(".").pop()?.toLowerCase();

  if (safeMime.startsWith("image/")) return "image";
  if (safeMime.startsWith("video/")) return "video";
  if (safeMime.startsWith("audio/")) return "audio";

  if (safeMime.includes("pdf") || ext === "pdf") return "pdf";

  if (
    safeMime.includes("word") ||
    safeMime.includes("officedocument") ||
    ext === "doc" ||
    ext === "docx"
  )
    return "word";

  if (ext === "html" || ext === "htm") return "html";
  if (["js", "jsx", "ts", "tsx"].includes(ext)) return "code";

  if (safeMime.startsWith("text/")) return "text";

  return "other";
};


export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFileMenu, setActiveFileMenu] = useState(null);

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const uploadFinishedRef = useRef(false);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [activeFolderMenu, setActiveFolderMenu] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [tempFolderName, setTempFolderName] = useState("");
  const [infoFolder, setInfoFolder] = useState(null);
  
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderInfo, setShowFolderInfo] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const foldersToShow = searchResults
    ? searchResults.filter(item => item.item_type === "folder")
    : folders;
  
  const filesToShow = searchResults
    ? searchResults.filter(item => item.item_type === "file")
    : files;
  
  /* ========= LOAD FOLDERS + FILES ========= */
/* ========= LOAD FOLDERS + FILES ========= */
const load = async (folderId = null) => {
  try {
    setLoading(true);

    const [foldersRes, filesRes] = await Promise.all([
      getFolders(folderId),
      getFiles(folderId), // <-- ensure backend filters deleted_at = null
    ]);

    // Only non-trashed files
    const activeFiles = Array.isArray(filesRes.data)
      ? filesRes.data.filter((f) => f.deleted_at === null)
      : [];

    setFolders(Array.isArray(foldersRes.data) ? foldersRes.data : []);
    setFiles(activeFiles);
  } catch (err) {
    console.error("LOAD ERROR:", err);
  } finally {
    setLoading(false);
  }
};


  /*progressbar*/

  const uploadingEntries = Object.values(uploadingFiles);

const totalProgress =
  uploadingEntries.length > 0
    ? uploadingEntries.reduce((sum, p) => sum + Math.max(p, 0), 0) /
      uploadingEntries.length
    : 0;

const hasError = uploadingEntries.includes(-1);

const isUploading = uploadingEntries.some(
  (p) => p >= 0 && p < 100
);

const isCompleted =
  uploadingEntries.length > 0 &&
  uploadingEntries.every((p) => p === 100);

  useEffect(() => {
    if (isUploading) {
      uploadFinishedRef.current = false;
      setShowUploadProgress(true);
    }
  
    if (isCompleted && !uploadFinishedRef.current) {
      uploadFinishedRef.current = true;
  
      toast.success("All files uploaded successfully ✅");
  
      setTimeout(() => {
        setUploadingFiles({});
        setShowUploadProgress(false);
      }, 1200);
    }
  
    if (hasError && !uploadFinishedRef.current) {
      uploadFinishedRef.current = true;
  
      toast.error("Some files failed to upload ❌");
  
      setTimeout(() => {
        setUploadingFiles({});
        setShowUploadProgress(false);
      }, 1500);
    }
  }, [isUploading, isCompleted, hasError]);
  

  /* ========= AUTH CHECK ========= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      navigate("/login");
      return;
    }
    load(null);
  }, []);

  /*doubleclick*/

  const handleFileDoubleClick = async (file) => {
    if (!file.storage_key) {
      toast.error("File path missing");
      return;
    }
  
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(file.storage_key, 60);
  
      if (error || !data?.signedUrl) {
        toast.error("Failed to load file preview");
        return;
      }
  
      const signedUrl = data.signedUrl;
      const type = getFileTypeFromMime(file.mime_type);
  
      if (type === "text" || type === "html" || type === "code") {
        const res = await fetch(signedUrl);
        const content = await res.text();
  
        setPreviewFile({
          type,
          content,
          file_name: f.file_name,
        });
      } else {
        setPreviewFile({
          type,
          url: signedUrl,
          file_name: f.file_name,
        });
      }
    } catch (err) {
      console.error("Failed to load file preview:", err);
      toast.error("Failed to load content");
    }
  };

  /* ========= FOLDER NAVIGATION ========= */
  const openFolder = async (folder) => {
    setCurrentFolder(folder);
    setFolderStack((prev) => [...prev, folder]);
    await load(folder.id);
  };

  const goBack = async () => {
    const stack = [...folderStack];
    stack.pop();
    const parent = stack[stack.length - 1] || null;
    setFolderStack(stack);
    setCurrentFolder(parent);
    await load(parent?.id || null);
  };

  /* ========= FOLDER UPLOAD ========= */
  const handleUploadFolder = async (e) => {
    const filesArr = Array.from(e.target.files);
    if (!filesArr.length) return;
  
    try {
      setLoading(true);
      const folderMap = new Map();
  
      for (const file of filesArr) {
        const parts = file.webkitRelativePath.split("/");
        const filePath = file.webkitRelativePath;
  
        parts.pop(); // remove filename
        let parentId = currentFolder?.id || null;
        let path = "";
  
        for (const part of parts) {
          path += part + "/";
          if (!folderMap.has(path)) {
            const res = await createFolder({ name: part, parentId });
            folderMap.set(path, res.data.id);
            parentId = res.data.id;
          } else {
            parentId = folderMap.get(path);
          }
        }
  
        const formData = new FormData();
        formData.append("file", file);
        if (parentId) formData.append("folderId", parentId);
  
        // Track upload per file inside folder
        setUploadingFiles((prev) => ({ ...prev, [filePath]: 0 }));
        try {
          await uploadFile(formData);
          setUploadingFiles((prev) => ({ ...prev, [filePath]: 100 }));
          toast.success(`Uploaded ${filePath}`);
        } catch (err) {
          setUploadingFiles((prev) => ({ ...prev, [filePath]: -1 }));
          toast.error(`Failed ${filePath}`);
          console.error(err);
        }
      }
  
      await load(currentFolder?.id || null);
      e.target.value = null;
    } finally {
      setLoading(false);
    }
  };
  
  /* ========= FILE UPLOAD ========= */
  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    if (currentFolder) formData.append("folderId", currentFolder.id);
  
    try {
      // Show progress circle (UI)
      setShowUploadProgress(true);
  
      // Initialize this file's progress
      setUploadingFiles((prev) => ({ ...prev, [file.name]: 0 }));
  
      toast.info(`Uploading ${file.name}...`);
  
      // Simulate progress if backend doesn’t stream progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadingFiles((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 90), // don't reach 100% yet
        }));
      }, 200);
  
      // Upload the file
      await uploadFile(formData);
      clearInterval(interval);
  
      // Set final progress to 100%
      setUploadingFiles((prev) => ({ ...prev, [file.name]: 100 }));
  
      toast.success(`${file.name} uploaded successfully!`);
  
      // Reload files in folder
      await load(currentFolder?.id || null);
    } catch (err) {
      toast.error(`Upload failed: ${file.name}`);
      setUploadingFiles((prev) => ({ ...prev, [file.name]: -1 }));
      console.error(err);
    } finally {
      e.target.value = null;
    }
  };
  
  /* ========= DELETE FILE ========= */
  const handleDeleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    await deleteFile(id);
    await load(currentFolder?.id || null);
  };

  /* ========= CREATE FOLDER ========= */
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      setLoading(true);
      await createFolder({
        name: folderName,
        parentId: currentFolder?.id || null,
      });
      setFolderName("");
      setShowCreateFolder(false);
      await load(currentFolder?.id || null);
    } catch (err) {
      console.error("Folder creation failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const openPreview = async (file) => {
    setPreviewFile(file);
  
    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(file.path, 60 * 10);
  
    if (error) {
      toast.error("Failed to load preview");
      return;
    }
  
    setPreviewUrl(data.signedUrl);
  };
  


  return (
    <MainLayout onSearchResults={setSearchResults}> 
         <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-3xl font-bold">
      📁 {currentFolder ? currentFolder.name : "My Drive"}
    </h1>

    {currentFolder && (
      <button
        onClick={goBack}
        className="text-blue-600 text-sm mt-1 hover:underline"
      >
        ← Back
      </button>
    )}
  </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + New
            </button>

            {showMenu && (
  <div className="absolute right-0 mt-2 bg-white shadow rounded w-48 z-50">
    {showCreateFolder ? (
      <div className="px-4 py-2 flex gap-2">
        <input
          type="text"
          className="border px-2 py-1 flex-1 rounded"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleCreateFolder();
            }
          }}
        />
        <button
          onClick={handleCreateFolder}
          className="bg-blue-600 text-white px-2 rounded"
        >
          Create
        </button>
        <button
          onClick={() => setShowCreateFolder(false)}
          className="px-2 rounded hover:bg-gray-100"
        >
          ✖
        </button>
      </div>
    ) : (
      <button
        onClick={() => setShowCreateFolder(true)}
        className="w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        📁 Create Folder
      </button>
    )}

    {/* Upload Folder */}
    <label className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
      📁 Upload Folder
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        hidden
        onChange={handleUploadFolder}
      />
    </label>

    {/* Upload File */}
    <label className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
      📄 Upload File
      <input type="file" hidden onChange={handleUploadFile} />
    </label>
  </div>
)}

          </div>
        </div>

{/* FOLDERS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {(searchResults
    ? searchResults.filter(item => item.item_type === "folder")
    : folders
  ).map((f) => (
    <div
      key={f.id}
      onDoubleClick={() => openFolder(f)}
      className="relative bg-white p-4 rounded shadow cursor-pointer"
    >
      {/* 3 DOT BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveFolderMenu(activeFolderMenu === f.id ? null : f.id);
        }}
        className="absolute top-2 right-2 text-gray-600 hover:bg-gray-100 rounded px-2"
      >
        ⋮
      </button>

      {/* MENU COMPONENT */}
      <FolderMenu
  folder={f}
  isOpen={activeFolderMenu === f.id}
  onClose={() => setActiveFolderMenu(null)}
  refresh={() => load(currentFolder?.id || null)}
  onInfo={(folder) => {
    console.log("Folder info:", folder);
    setSelectedFolder(folder);     // ✅ now exists
    setShowFolderInfo(true);       // ✅ now exists
    setActiveFolderMenu(null);
  }}
/>



      <div className="text-4xl">📁</div>

      {/* 🔽 INLINE RENAME */}
      {renamingFolderId === f.id ? (
  <input
    autoFocus
    value={tempFolderName}
    onChange={(e) => setTempFolderName(e.target.value)}
    onClick={(e) => e.stopPropagation()}
    onBlur={async () => {
      if (tempFolderName.trim()) {
        await apiRenameFolder(f.id, tempFolderName.trim());
        load(currentFolder?.id || null);
      }
      setRenamingFolderId(null);
    }}
    onKeyDown={async (e) => {
      if (e.key === "Enter") {
        await apiRenameFolder(f.id, tempFolderName.trim());
        setRenamingFolderId(null);
        load(currentFolder?.id || null);
      }
      if (e.key === "Escape") {
        setRenamingFolderId(null);
      }
    }}
    className="border px-2 py-1 rounded w-full text-sm"
  />
) : (
  <p
    className="truncate"
    onDoubleClick={(e) => {
      e.stopPropagation();
      setRenamingFolderId(f.id);
      setTempFolderName(f.name);
    }}
  >
    {f.name}
  </p>
)}

    </div>
  ))}
</div>
{/* FOLDER INFO PANEL (ONCE) */}
{showFolderInfo && selectedFolder && (
  <FolderInfoPanel
    folder={selectedFolder}
    onClose={() => setShowFolderInfo(false)}
  />
)}


{/* FILES */}
{/* FILES */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {(searchResults
    ? searchResults.filter(item => item.item_type === "file")
    : files
  ).map((f) => {
    const type = getFileTypeFromMime(f.mime_type);

    const handleDoubleClick = async () => {
      if (!f.storage_key) {
        toast.error("File path missing");
        return;
      }

      try {
        const { data, error } = await supabase.storage
          .from("files")
          .createSignedUrl(f.storage_key, 60);

        if (error || !data?.signedUrl) {
          toast.error("Failed to load file preview");
          return;
        }

        const signedUrl = data.signedUrl;

        if (type === "text" || type === "html") {
          const res = await fetch(signedUrl);
          const content = await res.text();
          setPreviewFile({ type, content, file_name: f.file_name });
        } else {
          setPreviewFile({ type, url: signedUrl, file_name: f.file_name });
        }
      } catch (err) {
        console.error("Failed to load file preview:", err);
        toast.error("Failed to load content");
      }
    };

    return (
      <div
        key={f.id}
        className="relative bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
        onDoubleClick={handleDoubleClick} // ✅ moved to top-level div
      >
        {/* 3 DOT BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevents triggering double-click
            setActiveFileMenu(activeFileMenu === f.id ? null : f.id);
          }}
          className="absolute top-2 right-2 z-10 text-gray-600 hover:bg-gray-100 rounded px-2"
        >
          ⋮
        </button>

        {/* FILE MENU */}
        <FileMenu
          file={f}
          isOpen={activeFileMenu === f.id}
          onClose={() => setActiveFileMenu(null)}
          refresh={() => load(currentFolder?.id || null)}
        />

        {/* CLICKABLE CONTENT */}
        <div className="flex flex-col items-start mt-6 gap-2 ">
          {type === "image" ? (
            <img
              src={`https://nsscslmjwrdmtfxogvqm.supabase.co/storage/v1/object/public/files/${f.storage_key}`}
              alt={f.file_name}
              className="h-24 w-24 object-cover rounded pointer-events-auto"
            />
          ) : (
            <span className="text-4xl pointer-events-auto">
              {fileIcons[f.mime_type] || fileIcons.default}
            </span>
          )}
          <p className="truncate pointer-events-auto">{f.file_name}</p>
        </div>
      </div>
    );
  })}
</div>


{/* Uploading progress */}
{showUploadProgress && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="relative w-16 h-16">
      <svg className="w-full h-full rotate-[-90deg]">
        <circle
          cx="32"
          cy="32"
          r="28"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          className="text-gray-300"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 28}
          strokeDashoffset={
            2 * Math.PI * 28 - (totalProgress / 100) * (2 * Math.PI * 28)
          }
          className={`transition-all duration-300 ${
            hasError ? "text-red-500" : "text-blue-600"
          }`}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
        {Math.round(totalProgress)}%
      </div>
    </div>
  </div>
)}

{/* Preview Modal */}
{previewFile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded shadow max-w-3xl w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={() => setPreviewFile(null)}
      >
        ✖
      </button>

      <h2 className="font-bold mb-4">{previewFile.file_name}</h2>

      {previewFile.type === "image" && (
        <img
          src={previewFile.url}
          alt={previewFile.file_name}
          className="max-h-[500px] mx-auto"
        />
      )}

      {previewFile.type === "video" && (
        <video
          src={previewFile.url}
          controls
          className="max-h-[500px] w-full"
        />
      )}

      {previewFile.type === "audio" && (
        <audio src={previewFile.url} controls className="w-full" />
      )}

{previewFile.type === "pdf" && (
  <iframe
    src={`https://docs.google.com/gview?url=${encodeURIComponent(
      previewFile.url
    )}&embedded=true`}
    className="w-full h-[500px]"
    title="PDF Preview"
  />
)}
{previewFile && previewUrl && (
  <>
    {fileType === "pdf" && (
      <iframe
        src={previewUrl}
        className="w-full h-[80vh]"
      />
    )}

    {fileType === "word" && (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
        className="w-full h-[80vh]"
      />
    )}
  </>
)}


{["html", "code", "text"].includes(previewFile.type) && (
  <pre className="bg-gray-900 text-green-200 p-4 rounded overflow-auto max-h-[500px] text-sm">
    <code>{previewFile.content}</code>
  </pre>
)}

    </div>
  </div>
)}

      </div>
       
    </MainLayout>
  );
}
