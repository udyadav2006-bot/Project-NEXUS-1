import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <nav style={{ padding: 10 }}>
      <Link to="/">Login</Link> | <Link to="/dash">Dashboard</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dash" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
