import api from "./api";

export const shareResource = (payload) =>
  api.post("/api/shares", payload);

export const getSharedResource = (token) =>
  api.get(`/api/shares/${token}`);

export const revokeShare = (id) =>
  api.delete(`/api/shares/${id}`);
