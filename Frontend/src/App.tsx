import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Settings from "./components/Settings";
import Login from "./components/Login/Login";
import { AuthProvider } from "./Context/AuthContext";
import AppLayout from "./components/Layout/appLayout";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App;