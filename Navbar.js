import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">💘 Dating App</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/chat">Chat</Link>
      </div>
    </nav>
  );
}