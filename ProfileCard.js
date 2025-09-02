import React from "react";
import "./ProfileCard.css";

export default function ProfileCard({ name, age, bio, img }) {
  return (
    <div className="profile-card">
      <img src={img} alt="profile" className="profile-img" />
      <h2>{name}, {age}</h2>
      <p>{bio}</p>
      <div className="buttons">
        <button className="dislike-btn">❌ Dislike</button>
        <button className="like-btn">❤️ Like</button>
      </div>
    </div>
  );
}