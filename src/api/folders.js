// src/api/folders.js
import api from "./api";


// Get folders (optionally by parent)
export const getFolders = (parentId = null) =>
  api.get("/api/folders", { params: { parentId } });

// ✅ rename folder


export const apiRenameFolder = (folderId, newName) =>
  api.patch(`/api/folders/${folderId}`, { name: newName });

// api/folders.js
export const getFolderShareLink = (folderId) =>
  api.post(`/api/folders/folder/${folderId}/share`);

// NEW: fetch shared folder files by token
export const getSharedFolderFiles = (token) =>
  api.get(`/api/folders/folder/${token}`); // matches backend route

// ✅ get folder info
export const getFolderInfo = (id) =>
  api.get(`/api/folders/${id}`);

// ✅ download folder (zip)
// Instead of `downloadFolder`
export const downloadFolderAsZip = (id) =>
  api.get(`/api/folders/${id}/download`, { responseType: "blob" });


/* ===============================
   TOGGLE STAR FOLDER
================================ */


/* ⭐ TOGGLE STAR */
export const toggleStarFolder = (folderId, isStarred) =>
  api.patch(`/api/folders/${folderId}/star`, { isStarred });

/* ⭐ GET STARRED FOLDERS */
export const getStarredFolders = () =>
  api.get("/api/folders", {
    params: { starred: true },
  });

// Create folder
export const createFolder = (data) =>
  api.post("/api/folders", data); // data = { name, parentId }

export const deleteFolder = (id) =>
  api.delete(`/api/folders/${id}`);

export const moveFolderToTrash = (id) =>
  api.put(`/api/folders/${id}/trash`);
import { supabase } from "../lib/supabase.js";

/* ===============================
   MOVE FOLDER

================================ */

export const moveFolder = (folderId, targetFolderId) =>
  api.post("/api/folders/move", { folderId, targetFolderId });
