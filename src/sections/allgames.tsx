import React from "react"
import { Link } from "react-router-dom"

// Deine Spiele bleiben unverändert
const games = [
  {
    id: "jackpot",
    name: "Jackpot",
    description: "High stakes. Huge rewards.",
    image: "/games/jackpot.png",
  },
  {
    id: "coinflip",
    name: "Coin Flip",
    description: "50/50 — double or nothing.",
    image: "/games/coinflip.png",
  },
  {
    id: "roulette",
    name: "Roulette",
    description: "Bet, spin, win!",
    image: "/games/roulette.png",
  },
  {
    id: "mines",
    name: "Mines",
    description: "Stay alive. Cash out in time!",
    image: "/games/mines.png",
  },
  {
    id: "plinko",
    name: "Plinko",
    description: "Drop the ball. Win big.",
    image: "/games/plinko.png",
  },
]

export default function AllGames() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "100px 20px 60px",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3d 50%, #0f0c29 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtiler Hintergrund-Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 30%, rgba(0, 255, 180, 0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1400px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(48px, 8vw, 84px)",
            fontWeight: 900,
            marginBottom: "16px",
            background: "linear-gradient(90deg, #00ffbc, #00ffb3, #00ff9d)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 40px rgba(0, 255, 180, 0.6)",
            letterSpacing: "-1px",
          }}
        >
          ALL GAMES
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            opacity: 0.85,
            marginBottom: "60px",
            color: "#a0ffc9",
            fontWeight: 500,
          }}
        >
          Choose your destiny. Win SOL.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            padding: "0 10px",
          }}
        >
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(145deg, rgba(20, 25, 50, 0.7), rgba(10, 15, 40, 0.9))",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "2px solid transparent",
                  backgroundClip: "padding-box",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 255, 180, 0.15)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-16px) scale(1.03)"
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 255, 180, 0.4)"
                  e.currentTarget.style.border = "2px solid rgba(0, 255, 180, 0.6)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 255, 180, 0.15)"
                  e.currentTarget.style.border = "2px solid transparent"
                }}
              >
                {/* Neon-Rahmen-Effekt */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-4px",
                    borderRadius: "28px",
                    background: "linear-gradient(45deg, #00ffbc, #00ffb8, #00ff9d)",
                    opacity: 0,
                    transition: "opacity 0.4s",
                    zIndex: -1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                />

                <div style={{ position: "relative", zIndex: 2 }}>
                  <img
                    src={game.image}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      marginBottom: "20px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
                    }}
                  />

                  <h2
                    style={{
                      fontSize: "32px",
                      fontWeight: 800,
                      margin: "0 0 12px 0",
                      color: "#00ffbc",
                      textShadow: "0 0 20px rgba(0, 255, 180, 0.7)",
                    }}
                  >
                    {game.name}
                  </h2>

                  <p
                    style={{
                      fontSize: "16px",
                      opacity: 0.9,
                      margin: 0,
                      color: "#ccffe8",
                      lineHeight: "1.5",
                    }}
                  >
                    {game.description}
                  </p>

                  {/* Play Button */}
                  <div
                    style={{
                      marginTop: "20px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "12px 32px",
                        background: "linear-gradient(90deg, #00ffbc, #00d4a0)",
                        color: "#000",
                        fontWeight: 800,
                        borderRadius: "50px",
                        fontSize: "16px",
                        boxShadow: "0 8px 25px rgba(0, 255, 180, 0.4)",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)"
                        e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 255, 180, 0.6)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 255, 180, 0.4)"
                      }}
                    >
                      PLAY NOW →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}