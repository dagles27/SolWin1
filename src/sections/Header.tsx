import React from 'react'
import { GambaUi, JackpotTicker, usePlayer } from 'gamba-react-ui-v2'
import { TokenValue } from 'gamba-react-ui-v2'
import LeaderBoard from '../components/LeaderBoard' // ← Pfad ggf. anpassen!

export default function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const player = usePlayer()

  return (
    <>
      <header className="solwin-header">
        <div className="header-bar">
          {/* LOGO LINKS */}
          <a href="/" className="logo">
            <img src="/logo.png" alt="SolWin Casino" />
          </a>

          {/* TOKEN SELECT MITTIG */}
          <div className="token-select-wrapper">
            <GambaUi.TokenSelect />
          </div>

          {/* HAMBURGER BUTTON RECHTS */}
          <button className="menu-toggle" onClick={() => setMenuOpen(true)}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>

        {/* SLIDE-IN MENÜ */}
        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
            <nav className={`menu-sidebar ${menuOpen ? 'open : ''}`}>
              <div className="sidebar-inner">
                <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
                
                <div className="menu-section">
                  <h3>Jackpot</h3>
                  <JackpotTicker />
                </div>

                <div className="menu-section">
                  <h3>Leaderboard</h3>
                  <LeaderBoard /> {/* Jetzt immer sichtbar, auch Mobile */}
                </div>

                <div className="menu-section wallet-section">
                  <GambaUi.WalletButton />
                </div>
              </div>
            </nav>
          </>
        )}
      </header>

      {/* SOL-WIN NEON STYLING */}
      <style jsx>{`
        .solwin-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(17, 5, 34, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 2px solid #8e2de2;
          box-shadow: 0 4px 30px rgba(142, 45, 226, 0.4);
          z-index: 1000;
          padding: 0 20px;
        }

        .header-bar {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo img {
          height: 45px;
          filter: drop-shadow(0 0 10px #8e2de2);
        }

        .token-select-wrapper {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: #8e2de2;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .menu-toggle:hover {
          background: rgba(142,45,226,0.2);
          box-shadow: 0 0 15px #8e2de2;
        }

        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1001;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        .menu-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 340px;
          height: 100vh;
          background: linear-gradient(135deg, #110522 0%, #1a0b2e 100%);
          border-left: 3px solid #8e2de2;
          box-shadow: -20px 0 40px rgba(142,45,226,0.6);
          z-index: 1002;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 90px 24px 40px;
          overflow-y: auto;
        }

        .menu-sidebar.open {
          transform: translateX(0);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 24px;
          background: none;
          border: none;
          font-size: 2.5rem;
          color: #ff6b6b;
          cursor: pointer;
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(255,107,107,0.4);
        }

        .menu-section {
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(142,45,226,0.4);
          box-shadow: 0 0 20px rgba(142,45,226,0.2);
        }

        .menu-section h3 {
          margin: 0 0 12px 0;
          color: #00ff9d;
          text-shadow: 0 0 10px #00ff9d;
          font-size: 1.1rem;
        }

        .wallet-section {
          margin-top: auto;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* MOBILE OPTIMIERT */
        @media (max-width: 768px) {
          .menu-sidebar {
            width: 85vw;
          }
          .header-bar {
            padding: 0 16px;
          }
        }

        @media (max-width: 480px) {
          .menu-sidebar {
            width: 100vw;
          }
        }
      `}</style>
    </>
  )
}
