// src/api/files.js
import api from "./api";

/* ===============================
   UPLOAD
================================ */
export const uploadFile = (formData) =>
  api.post("/api/files/upload", formData);

/* ===============================
   LIST FILES
================================ */
export const getFiles = (folderId = null) =>
  api.get("/api/files", {
    params: {
      folderId: folderId ?? null,
    },
  });

export const getStarredFiles = () =>
  api.get("/api/files/starred");

export const getTrashedFiles = () =>
  api.get("/api/files/trash");

/* ===============================
   FILE ACTIONS
================================ */

// DELETE ✅
export const deleteFile = (id) =>
  api.delete(`/api/files/${id}`);

// STAR ✅ FIXED KEY
export const toggleStarFile = (id, isStarred) =>
  api.patch(`/api/files/${id}/star`, {
    is_starred: isStarred,
  });

// TRASH ✅
export const moveFileToTrash = (id) =>
  api.patch(`/api/files/${id}/trash`);

// RENAME ✅ FIXED KEY
export const renameFile = (id, fileName) =>
  api.patch(`/api/files/${id}/rename`, {
    file_name: fileName,
  });

// INFO ✅ (match backend)
export const getFileInfo = (id) =>
  api.get(`/api/files/${id}`);

// DOWNLOAD ✅
export const downloadFile = (id) =>
  api.get(`/api/files/${id}/download`, {
    responseType: "blob",
  });
  export const getFileSignedUrl = (id) =>
    api.get(`/api/files/${id}/signed-url`);


// Move a file to another folder
export const moveFile = (fileId, targetFolderId) =>
  api.post("/api/files/move", { fileId, targetFolderId });

export const getFolders = (parentId = null) =>
  api.get("/api/folders", { params: { parentId } });
