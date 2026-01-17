// src/components/FileInfoPanel.jsx
export default function FileInfoPanel({ file, onClose }) {
    if (!file) return null;
  
    return (
      <div className="fixed right-6 top-20 w-80 bg-white border rounded shadow-lg z-50">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold">File Info</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
  
        <div className="p-4 space-y-2 text-sm">
          <p><b>Name:</b> {file.name}</p>
          <p><b>ID:</b> {file.id}</p>
          <p><b>Type:</b> {file.mime_type}</p>
          <p><b>Size:</b> {(file.size / 1024).toFixed(2)} KB</p>
          <p><b>Owner:</b> {file.owner_id}</p>
          <p><b>Folder:</b> {file.folder_id || "Root"}</p>
          <p><b>Starred:</b> {file.is_starred ? "Yes ⭐" : "No"}</p>
          <p><b>Deleted:</b> {file.is_deleted ? "Yes" : "No"}</p>
          <p><b>Created:</b> {new Date(file.created_at).toLocaleString()}</p>
        </div>
      </div>
    );
  }
  