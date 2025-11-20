// src/sections/Header.tsx – FERTIG, BUILD-FIXED, ORIGINAL FUNKTIONALITÄT + NEUES MENÜ

import React from 'react'
import {
  GambaUi,
  JackpotTicker,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal' // ← ORIGINALER PFAD, BUILD FIX!
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  color: #ffe42d;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  transition: background-color 0.2s;
  &:hover {
    background: white;
  }
`

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <>
      {/* ORIGINAL MODALS – behalten */}
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays.
          </p>
          <p>Note that a fee is still needed from your wallet for each play.</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot </h1>
          <p style={{ fontWeight: 'bold' }}>
            There&apos;s <TokenValue amount={pool.jackpotBalance} /> in the Jackpot.
          </p>
          <p>
            The Jackpot is a prize pool that grows with every bet. As it grows, your chance of winning increases.
          </p>
          <p>
            You pay max {(PLATFORM_JACKPOT_FEE * 100).toFixed(4)}% fee for a chance to win.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? 'DISABLED' : 'ENABLED'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked) => context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)}
            />
          </label>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* NEUER CLEAN HEADER */}
      <header className="solwin-header">
        <div className="header-content">
          <NavLink to="/" className="logo-link">
            <img src="/logo.svg" alt="SolWin" className="logo" />
          </NavLink>

          <div className="balance-center">
            <GambaUi.Balance showTokenSelect />
          </div>

          <button className="menu-btn" onClick={() => setMenuOpen(true)}>
            <svg viewBox="0 0 24 24" width="32" height="32">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* SLIDE-IN MENÜ – alles drin */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-inner">
          <button className="close" onClick={() => setMenuOpen(false)}>✕</button>

          {/* JACKPOT */}
          {pool.jackpotBalance > 0 && (
            <div className="menu-block">
              <h3>Jackpot 💰</h3>
              <JackpotTicker />
              <Bonus onClick={() => { setMenuOpen(false); setJackpotHelp(true); }}>
                More info
              </Bonus>
            </div>
          )}

          {/* BONUS */}
          {balance.bonusBalance > 0 && (
            <div className="menu-block">
              <h3>Bonus ✨</h3>
              <TokenValue amount={balance.bonusBalance} />
              <Bonus onClick={() => { setMenuOpen(false); setBonusHelp(true); }}>
                More info
              </Bonus>
            </div>
          )}

          {/* LEADERBOARD */}
          {ENABLE_LEADERBOARD && (
            <div className="menu-block">
              <h3>Leaderboard</h3>
              <GambaUi.Button onClick={() => { setMenuOpen(false); setShowLeaderboard(true); }}>
                Open Leaderboard
              </GambaUi.Button>
            </div>
          )}

          {/* WALLET */}
          <div className="menu-block">
            <h3>Wallet</h3>
            <UserButton fullWidth />
          </div>
        </div>
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* SOL-WIN NEON STYLE */}
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
