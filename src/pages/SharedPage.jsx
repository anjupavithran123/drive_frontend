import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSharedResource } from "../api/shares";
import { toast } from "react-toastify";

const SharedPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getSharedResource(token)
      .then((res) => setData(res.data))
      .catch(() => toast.error("Invalid or expired link"));
  }, [token]);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">
        Shared {data.resource_type}
      </h1>

      <p className="text-gray-600 mb-4">
        Permission: <b>{data.permission}</b>
      </p>

      {data.permission === "view" && (
        <p className="text-sm text-gray-500">
          Read-only access
        </p>
      )}

      {/* Render file preview / folder contents here */}
    </div>
  );
};

export default SharedPage;
