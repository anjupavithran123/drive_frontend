import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import OAuthCallback from "./pages/OAuthCallback";
import Trash from "./pages/Trash";
import Starred from "./pages/Starred";
import SharedPage from "./pages/SharedPage";
import Register from "./pages/register";

import RecentUploads from "./pages/Recent";

<Route path="/recent" element={<RecentUploads />} />

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* OAuth callback route */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Public routes */}
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/starred" element={<Starred />} />
        <Route path="/shared/:token" element={<SharedPage />} />
        <Route path="/recent" element={<RecentUploads />} />

        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<Home />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    
    </BrowserRouter>
  );
}
