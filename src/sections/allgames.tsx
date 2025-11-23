import React from "react"
import { Link } from "react-router-dom"

const games = [
  { id: "jackpot", name: "Jackpot", description: "Massive progressive prizes", image: "/games/jackpot.png" },
  { id: "coinflip", name: "Coin Flip", description: "50/50 — double your SOL", image: "/games/coinflip.png" },
  { id: "roulette", name: "Roulette", description: "Spin the wheel of fortune", image: "/games/roulette.png" },
  { id: "mines", name: "Mines", description: "Risk it all or cash out early", image: "/games/mines.png" },
  { id: "plinko", name: "Plinko", description: "Drop. Bounce. Win big.", image: "/games/plinko.png" },
]

export default function AllGames() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "120px 20px 100px",
      background: "linear-gradient(160deg, #0a0a1a 0%, #0f0f28 45%, #0a0a1f 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtiler animierter Hintergrund-Glow */}
      <div style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: "radial-gradient(circle, rgba(0,255,180,0.08) 0%, transparent 60%)",
        animation: "float 25s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(5%, 5%) rotate(1deg); }
        }
      `}</style>

      <div style={{ maxWidth: "1480px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Title – fetter, aggressiver, mit stärkerem Glow */}
        <h1 style={{
          textAlign: "center",
          fontSize: "clamp(56px, 10vw, 100px)",
          fontWeight: 900,
          letterSpacing: "-2px",
          margin: "0 0 20px 0",
          background: "linear-gradient(to right, #00ffbc, #00ff9d, #00ffb8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 60px rgba(0,255,180,0.7), 0 0 120px rgba(0,255,180,0.4)",
        }}>
          GAMES
        </h1>

        <p style={{
          textAlign: "center",
          fontSize: "22px",
          color: "#88ffcc",
          fontWeight: 600,
          marginBottom: "80px",
          opacity: 0.9,
        }}>
          Pick your game. Win SOL. Repeat.
        </p>

        {/* Grid – große, luxuriöse Karten */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "36px",
          padding: "0 16px",
        }}>
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div style={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                background: "linear-gradient(135deg, rgba(20,25,55,0.9), rgba(10,15,40,0.95))",
                border: "2px solid rgba(0,255,180,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,255,180,0.2)",
                transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
                backdropFilter: "blur(20px)",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-20px) scale(1.02)"
                  e.currentTarget.style.border = "2px solid rgba(0,255,180,0.8)"
                  e.currentTarget.style.boxShadow = "0 30px 80px rgba(0,0,0,0.9), 0 0 80px rgba(0,255,180,0.5)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.border = "2px solid rgba(0,255,180,0.25)"
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,255,180,0.2)"
                }}
              >
                {/* Neon Glow Border Effect */}
                <div style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "32px",
                  background: "linear-gradient(45deg, #00ffbc, transparent 30%, transparent 70%, #00ff9d)",
                  opacity: 0,
                  transition: "opacity 0.5s",
                  zIndex: -1,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.6"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
                />

                <div style={{ padding: "32px 28px", textAlign: "center" }}>
                  <div style={{
                    width: "100%",
                    height: "220px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    marginBottom: "24px",
                    boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)",
                  }}>
                    <img
                      src={game.image}
                      alt={game.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>

                  <h2 style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    margin: "0 0 12px",
                    color: "#00ffbc",
                    textShadow: "0 0 25px rgba(0,255,180,0.8)",
                  }}>
                    {game.name}
                  </h2>

                  <p style={{
                    fontSize: "17px",
                    color: "#aaffdd",
                    margin: "0 0 32px",
                    opacity: 0.9,
                    lineHeight: 1.5,
                  }}>
                    {game.description}
                  </p>

                  {/* CTA Button – fett, aggressiv, Sol-Win Style */}
                  <div style={{
                    padding: "16px 48px",
                    background: "linear-gradient(90deg, #00ffbc, #00d4aa)",
                    color: "#000",
                    fontSize: "19px",
                    fontWeight: 900,
                    borderRadius: "50px",
                    display: "inline-block",
                    boxShadow: "0 10px 30px rgba(0,255,180,0.5)",
                    transition: "all 0.3s ease",
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)"
                      e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,255,180,0.7)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,255,180,0.5)"
                    }}
                  >
                    PLAY NOW →
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