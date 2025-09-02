import React from "react";
import ProfileCard from "../components/ProfileCard";

export default function Home() {
  return (
    <div className="home">
      <h1>Find Your Perfect Match 💕</h1>
      <ProfileCard
        name="Sophie"
        age="23"
        bio="Loves hiking & coffee ☕"
        img="https://source.unsplash.com/300x300/?girl,model"
      />
    </div>
  );
}