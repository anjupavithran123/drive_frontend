import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function TopBar({ onSearchResults }) {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      onSearchResults?.(null);
      return;
    }

    const delay = setTimeout(async () => {
      if (!user) return;
      setLoading(true);

      try {
        const { data: folders } = await supabase
          .from("folders")
          .select("id, name, parent_id")
          .eq("owner_id", user.id)
          .ilike("name", `%${query}%`)
          .is("deleted_at", null);

        const { data: files } = await supabase
          .from("files")
          .select("id, file_name, mime_type, folder_id")
          .eq("owner_id", user.id)
          .ilike("file_name", `%${query}%`)
          .is("deleted_at", null);

        const results = [
          ...(folders || []).map(f => ({ ...f, item_type: "folder" })),
          ...(files || []).map(f => ({ ...f, item_type: "file" }))
        ];

        onSearchResults?.(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, user, onSearchResults]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="h-20 border-b flex items-center px-8 bg-gray-900 text-white justify-between w-full">
      {/* 🔍 Search */}
      <div className="w-2/3 relative">
        <span className="absolute left-4 top-3 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search in Drive"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 transition"
        />
        {loading && (
          <span className="absolute right-4 top-3 text-gray-400 animate-spin text-sm">⏳</span>
        )}
      </div>

      {/* 👤 User + Logout */}
      {user && (
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-300">
            Hi, {user.user_metadata?.full_name || user.email}
          </span>

          <button
  onClick={handleLogout}
  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition duration-200"
>
  Logout
</button>

        </div>
      )}
    </div>
  );
}
