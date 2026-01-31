import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudentProfiling from "./pages/StudentProfiling";
import ProfileView from "./pages/ProfileView";
import CareerSimulation from "./pages/CareerSimulation";
import RoadmapView from "./pages/RoadmapView";
import Layout from "./components/Layout";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-profiling" element={<ProtectedRoute><StudentProfiling /></ProtectedRoute>} />

          {/* Protected Routes with Sidebar Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/home" element={<Home />} />
            <Route path="/student-profile" element={<ProfileView />} />
            <Route path="/career-simulation" element={<CareerSimulation />} />
            <Route path="/roadmap" element={<RoadmapView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
