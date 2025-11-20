// src/sections/Header.tsx – FIXED VERSION, NO JackpotTicker

import React from 'react'
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
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
      {/* BONUS MODAL */}
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays.
          </p>
          <p>A fee from your wallet is still required for every play.</p>
        </Modal>
      )}

      {/* JACKPOT MODAL */}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p style={{ fontWeight: 'bold' }}>
            Jackpot contains: <TokenValue amount={pool.jackpotBalance} />
          </p>
          <p>
            The Jackpot grows with every bet and resets when a winner is chosen.
          </p>
          <p>
            Max fee: {(PLATFORM_JACKPOT_FEE * 100).toFixed(4)}%
          </p>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? 'DISABLED' : 'ENABLED'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked) =>
                context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
              }
            />
          </label>
        </Modal>
      )}

      {/* LEADERBOARD */}
      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* HEADER */}
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

      {/* SIDEBAR */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-inner">
          <button className="close" onClick={() => setMenuOpen(false)}>✕</button>

          {/* JACKPOT BLOCK (Ticker entfernt → sichere Anzeige) */}
          {pool.jackpotBalance > 0 && (
            <div className="menu-block">
              <h3>Jackpot 💰</h3>
              <div className="jackpot-value pulse">
                <TokenValue amount={pool.jackpotBalance} />
              </div>
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
              <GambaUi.Button onClick={() => {
                setMenuOpen(false)
                setShowLeaderboard(true)
              }}>
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

      {/* STYLE */}
      <style jsx>{`
        .pulse {
          animation: pulse 2s infinite;
          color: #00ff9d;
          text-shadow: 0 0 12px #00ff9d;
        }
        @keyframes pulse {
          0% { opacity: 0.75; }
          50% { opacity: 1; }
          100% { opacity: 0.75; }
        }
      `}</style>
    </>
  )
}
