import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudentProfiling from "./pages/StudentProfiling";
import ProfileView from "./pages/ProfileView";
import CareerResults from "./pages/CareerResults";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import RoadmapView from "./pages/RoadmapView";
import MentalHealthChat from "./pages/MentalHealthChat";

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
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-profile"
            element={
              <ProtectedRoute>
                <StudentProfiling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-results"
            element={
              <ProtectedRoute>
                <CareerResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mental-health-chat"
            element={
              <ProtectedRoute>
                <MentalHealthChat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
