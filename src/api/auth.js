import api from "./api";

export const register = (data) => api.post("/api/auth/signup", data);
export const login = (data) => api.post("/api/auth/login", data);
export const googleLogin = (data) => api.post("/api/auth/google", data);
export const getMe = () => api.get("/api/auth/me");
