// src/sections/Header.tsx – 100% buildbar + korrekter Leaderboard-Import

import React from 'react'
import { GambaUi, JackpotTicker } from 'gamba-react-ui-v2'
import LeaderboardsModal from '../LeaderBoard/LeaderboardsModal' // ← Korrekter Pfad!

export default function Header() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {/* CLEAN HEADER – Logo links | Balance Mitte | Hamburger rechts */}
      <header className="solwin-header">
        <div className="header-content">
          <a href="/" className="logo-link">
            <img src="/logo.png" alt="SolWin" className="logo" />
          </a>

          <div className="balance-center">
            <GambaUi.Balance showTokenSelect />
          </div>

          <button className="menu-btn" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" width="32" height="32">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* SLIDE-IN SIDEBAR */}
      <div className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-inner">
          <button className="close" onClick={() => setOpen(false)}>✕</button>

          {/* JACKPOT */}
          <div className="menu-block">
            <h3>Jackpot</h3>
            <JackpotTicker />
          </div>

          {/* LEADERBOARD – jetzt der echte Modal! */}
          <div className="menu-block">
            <h3>Leaderboard</h3>
            <LeaderboardsModal />
          </div>

          {/* WALLET */}
          <div className="menu-block">
            <h3>Wallet</h3>
            <GambaUi.WalletButton fullWidth />
          </div>
        </div>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SOL-WIN NEON DESIGN */}
      <style jsx>{`
        .solwin-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: linear-gradient(180deg, rgba(15,0,40,0.95), rgba(10,0,30,0.8));
          backdrop-filter: blur(15px);
          border-bottom: 2px solid #8e2de2;
          box-shadow: 0 4px 25px rgba(142,45,226,0.5);
          z-index: 1000;
          padding: 0 20px;
        }

        .header-content {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo-link img {
          height: 48px;
          filter: drop-shadow(0 0 15px #8e2de2);
        }

        .balance-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.5);
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: bold;
          font-size: 1.2rem;
          color: #00ff9d;
          box-shadow: 0 0 20px rgba(0,255,157,0.6);
          backdrop-filter: blur(8px);
        }

        .menu-btn {
          background: rgba(142,45,226,0.2);
          border: 2px solid #8e2de2;
          border-radius: 12px;
          padding: 10px;
          color: #8e2de2;
          cursor: pointer;
          transition: all 0.3s;
        }

        .menu-btn:hover {
          background: #8e2de2;
          color: white;
          box-shadow: 0 0 20px #8e2de2;
          transform: scale(1.1);
        }

        .menu-btn svg line {
          stroke: currentColor;
          stroke-width: 3;
        }

        /* SIDEBAR */
        .sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          max-width: 90vw;
          height: 100vh;
          background: linear-gradient(135deg, #0f0028 0%, #1a0033 100%);
          z-index: 1001;
          transform: translateX(100%);
          transition: transform 0.4s ease;
          padding: 90px 24px 40px;
          overflow-y: auto;
          box-shadow: -15px 0 40px rgba(142,45,226,0.6);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .close {
          position: absolute;
          top: 20px;
          right: 24px;
          background: rgba(255,107,107,0.2);
          border: 2px solid #ff6b6b;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 2rem;
          color: #ff6b6b;
          cursor: pointer;
        }

        }

        .menu-block {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(142,45,226,0.4);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 0 20px rgba(142,45,226,0.3);
        }

        .menu-block h3 {
          margin: 0 0 12px;
          color: #00ff9d;
          text-shadow: 0 0 12px #00ff9d;
          font-size: 1.3rem;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
        }

        /* MOBILE */
        @media (max-width: 480px) {
          .solwin-header { height: 65px; padding: 0 16px; }
          .logo { height: 42px; }
          .balance-center { font-size: 1.1rem; padding: 6px 16px; }
          .sidebar { padding: 80px 16px 30px; }
        }
      `}</style>
    </>
  )
}
