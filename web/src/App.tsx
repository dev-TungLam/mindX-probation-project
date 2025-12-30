import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { LoginCallback } from "./pages/LoginCallback";
import "./App.css";

const Home: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {username || "Guest"}!</h1>
      <p>This is a protected area.</p>
      <button
        onClick={handleLogout}
        style={{
          padding: "0.5rem 1rem",
          background: "#dc3545",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav
          style={{
            padding: "1rem",
            background: "#f8f9fa",
            marginBottom: "1rem",
          }}
        >
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          {!localStorage.getItem("token") && (
            <Link to="/login" style={{ marginRight: "1rem" }}>
              Login
            </Link>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
