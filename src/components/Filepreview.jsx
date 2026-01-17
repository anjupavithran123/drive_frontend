import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function FilePreview({ filePath, type }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function fetchSignedUrl() {
      const { data, error } = await supabase.storage
        .from("your-bucket-name")
        .createSignedUrl(filePath, 60); // 60 seconds

      if (error) {
        console.error("Error generating signed URL:", error);
      } else {
        setUrl(data.signedUrl); // save the signed URL in state
      }
    }

    fetchSignedUrl();
  }, [filePath]);

  if (!url) return <p>Loading preview...</p>;

  if (type.startsWith("image/")) return <img src={url} alt="preview" />;
  if (type.startsWith("video/")) return <video controls src={url}></video>;
  if (type === "text/plain") return <pre>{url}</pre>; // optionally fetch content

  return <a href={url}>Download file</a>;
}
