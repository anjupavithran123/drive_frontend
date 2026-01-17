export default function FolderInfoPanel({ folder, onClose }) {
    if (!folder) return null;
  
    return (
      <div className="fixed right-6 top-20 w-80 bg-white border rounded shadow-lg z-50">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold">Folder Info</h3>
          <button onClick={onClose}>✕</button>
        </div>
  
        <div className="p-4 space-y-2 text-sm">
          <p><b>Name:</b> {folder.name}</p>
          <p><b>ID:</b> {folder.id}</p>
          <p><b>Owner:</b> {folder.owner_id}</p>
          <p><b>Parent:</b> {folder.parent_id || "Root"}</p>
          <p><b>Starred:</b> {folder.is_starred ? "Yes ⭐" : "No"}</p>
          <p><b>Deleted:</b> {folder.is_deleted ? "Yes" : "No"}</p>
        </div>
      </div>
    );
  }
  