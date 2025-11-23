import React from "react"
import { Link } from "react-router-dom"

// Liste deiner Spiele → später erweiterbar
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
    <div style={{ padding: "80px 20px", color: "white" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "10px",
          fontWeight: 800,
          textShadow: "0 0 15px rgba(0,255,180,0.7)",
        }}
      >
        🎮 Games
      </h1>

      <p style={{ textAlign: "center", opacity: 0.8, marginBottom: "50px" }}>
        Choose a game and start playing!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "25px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "rgba(0, 255, 170, 0.06)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(0, 255, 170, 0.18)",
                boxShadow: "0 0 20px rgba(0,255,150,0.15)",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,150,0.35)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(0,255,150,0.15)"
              }}
            >
              <img
                src={game.image}
                alt={game.name}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "15px",
                }}
              />

              <h2
                style={{
                  fontSize: "24px",
                  margin: 0,
                  textShadow: "0 0 8px rgba(0,255,150,0.6)",
                }}
              >
                {game.name}
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  opacity: 0.65,
                  marginTop: "8px",
                }}
              >
                {game.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}