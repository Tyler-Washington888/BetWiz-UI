import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import LoginScreen from "./screens/auth/LoginScreen/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen/SignupScreen";
import DashboardScreen from "./screens/main/DashboardScreen/DashboardScreen";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layouts/MainLayout/MainLayout";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardScreen />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
