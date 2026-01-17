import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatDistanceToNow } from "date-fns";
import MainLayout from "../components/mainlayout";

export default function RecentUploads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  const fetchRecentUploads = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    // Fetch recent files
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("id, file_name, created_at")
      .eq("owner_id", user.id);

    if (filesError) console.error("Files error:", filesError);

    // Fetch recent folders
    const { data: folders, error: foldersError } = await supabase
      .from("folders")
      .select("id, name, created_at")
      .eq("owner_id", user.id);

    if (foldersError) console.error("Folders error:", foldersError);

    // Merge and sort by newest first
    const merged = [
      ...(files || []).map(f => ({ ...f, type: "file" })),
      ...(folders || []).map(f => ({ ...f, type: "folder" })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setItems(merged);
    setLoading(false);
  };

  return (
    <MainLayout>
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Recent Uploads</h1>

      {loading && <p className="text-gray-500">Loading recent items...</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-500">No recent uploads yet</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={`${item.type}-${item.id}`}
            className="p-4 bg-white border rounded-lg hover:shadow transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">
                {item.type === "folder" ? "📁" : "📄"}
              </span>
              <p className="font-medium truncate">{item.name}</p>
            </div>
            <p className="text-xs text-gray-500">
              {item.type.toUpperCase()} •{" "}
              {formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
    </MainLayout>
  );
}
