import React from "react"
import { Link } from "react-router-dom"

const games = [
  { id: "jackpot", name: "Jackpot", description: "High stakes. Huge rewards.", image: "/games/jackpot.png" },
  { id: "coinflip", name: "Coin Flip", description: "50/50 — double or nothing.", image: "/games/coinflip.png" },
  { id: "roulette", name: "Roulette", description: "Bet, spin, win!", image: "/games/roulette.png" },
  { id: "mines", name: "Mines", description: "Stay alive. Cash out in time!", image: "/games/mines.png" },
  { id: "plinko", name: "Plinko", description: "Drop the ball. Win big.", image: "/games/plinko.png" },
]

export default function AllGames() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "100px 20px 80px",
      background: "linear-gradient(135deg, #0a0a1f 0%, #0f0f2e 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Hintergrund-Glow wie im Leaderboard */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 50% 20%, rgba(0, 255, 180, 0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "clamp(44px, 8vw, 72px)",
          fontWeight: 900,
          marginBottom: "12px",
          background: "linear-gradient(90deg, #00ffbc 0%, #00ff9d 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 30px rgba(0, 255, 180, 0.5)",
        }}>
          ALL GAMES
        </h1>

        <p style={{
          textAlign: "center",
          fontSize: "20px",
          color: "#a0ffdd",
          opacity: 0.9,
          marginBottom: "60px",
          fontWeight: 500,
        }}>
          Choose your game and start winning SOL
        </p>

        {/* Grid – identisch wie Leaderboard-Rows */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
          padding: "0 10px",
        }}>
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                background: "rgba(15, 20, 45, 0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "20px",
                border: "1px solid rgba(0, 255, 180, 0.3)",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 255, 180, 0.15)",
                transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
                position: "relative",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px)"
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 255, 180, 0.4)"
                  e.currentTarget.style.border = "1px solid rgba(0, 255, 180, 0.7)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 255, 180, 0.15)"
                  e.currentTarget.style.border = "1px solid rgba(0, 255, 180, 0.3)"
                }}
              >
                {/* Neon Top-Bar wie im Leaderboard */}
                <div style={{
                  height: "6px",
                  background: "linear-gradient(90deg, #00ffbc, #00ff9d)",
                  boxShadow: "0 0 20px rgba(0, 255, 180, 0.8)",
                }} />

                <div style={{ padding: "28px 24px" }}>
                  <img
                    src={game.image}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      marginBottom: "20px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                    }}
                  />

                  <h3 style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    margin: "0 0 10px 0",
                    color: "#00ffbc",
                    textShadow: "0 0 15px rgba(0, 255, 180, 0.6)",
                  }}>
                    {game.name}
                  </h3>

                  <p style={{
                    fontSize: "16px",
                    color: "#ccffe8",
                    opacity: 0.9,
                    margin: "0 0 24px 0",
                    lineHeight: 1.5,
                  }}>
                    {game.description}
                  </p>

                  {/* Play Button – exakt wie im Leaderboard */}
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                  }}>
                    <span style={{
                      padding: "14px 36px",
                      background: "linear-gradient(90deg, #00ffbc, #00d4aa)",
                      color: "#000",
                      fontWeight: 900,
                      fontSize: "17px",
                      borderRadius: "50px",
                      boxShadow: "0 8px 25px rgba(0, 255, 180, 0.5)",
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.08)"
                        e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 255, 180, 0.7)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 255, 180, 0.5)"
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