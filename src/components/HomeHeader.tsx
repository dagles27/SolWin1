import React from "react";
import "../styles/home-header.css";

export default function HomeHeader() {
  return (
    <section className="home-header">
      <div className="banner-wrapper">
        <img
          src="/WelcomeBanner-Home.png"
          alt="Welcome to Sol-Win Casino"
          className="banner-image"
          loading="eager"
        />
      </div>

      <div className="banner-buttons">
        <button className="btn neon">Play Now</button>
        <button className="btn ghost">Referral Program</button>
        <button className="btn">Learn More</button>
      </div>
    </section>
  );
}
