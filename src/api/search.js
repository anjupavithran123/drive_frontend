import api from "./api";

export const search = (query) => {
  return api.get("/api/search", {
    params: { q: query }
  });
};
