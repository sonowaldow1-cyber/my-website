import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import ChatBox from "./components/ChatBox";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatBox />} />
      </Routes>
    </Router>
  );
}