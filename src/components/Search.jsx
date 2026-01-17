import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function SearchComponent({ userId, onResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);



const handleSearch = async (q, userId) => {
  if (!q) return [];

  // Folders
  const { data: folders, error: folderError } = await supabase
    .from("folders")
    .select("id, name")
    .eq("owner_id", userId)
    .ilike("name", `%${q}%`)
    .is("deleted_at", null);

  // Files
  const { data: files, error: fileError } = await supabase
    .from("files")
    .select("id, file_name, mime_type")
    .eq("owner_id", userId)
    .ilike("file_name", `%${q}%`)
    .is("deleted_at", null);

  if (folderError || fileError) {
    console.error("Supabase search error:", folderError || fileError);
    return [];
  }

  return [
    ...folders.map((f) => ({ ...f, item_type: "folder" })),
    ...files.map((f) => ({ ...f, item_type: "file" })),
  ];
};

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-1 rounded flex-1"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value); // direct search
        }}
      />
      {loading && <span>Searching...</span>}
    </div>
  );
}
