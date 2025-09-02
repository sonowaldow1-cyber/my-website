import React from "react";
import "./ChatBox.css";

export default function ChatBox() {
  return (
    <div className="chat-box">
      <h2>Chat with Sophie 💬</h2>
      <div className="messages">
        <p><strong>Sophie:</strong> Hey there! 😊</p>
        <p><strong>You:</strong> Hi! How are you?</p>
      </div>
      <input type="text" placeholder="Type your message..." className="chat-input" />
      <button className="send-btn">Send</button>
    </div>
  );
}