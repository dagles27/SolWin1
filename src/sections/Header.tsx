// src/sections/Header.tsx
import React from 'react'
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
} from 'gamba-react-ui-v2'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_CREATOR_ADDRESS, ENABLE_LEADERBOARD } from '../constants'
import TokenSelect from './TokenSelect' // optional, falls du TokenSelect weiterhin verwenden willst
import { UserButton } from './UserButton'

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  z-index: 1000;
`

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 48px;
  img {
    height: 120%;
    display: block;
  }
`

const BalanceCenter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  color: #00ff9d;
  font-weight: 600;
  z-index: 1001;
`

const MenuButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(142, 45, 226, 0.12);
  border: 1px solid rgba(142, 45, 226, 0.25);
  color: #fff;
  font-weight: 600;
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  max-width: calc(100vw - 32px);
  background: linear-gradient(180deg, #0f0028, #12001f);
  border: 1px solid rgba(142, 45, 226, 0.35);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  z-index: 1100;
`

export default function Header() {
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <>
      {/* Jackpot Modal */}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot 💰</h1>
          <p style={{ fontWeight: 'bold' }}>
            Aktuell sind <TokenValue amount={pool?.jackpotBalance ?? 0} /> im Jackpot.
          </p>
          <p>Der Jackpot wächst mit jedem Einsatz. Viel Glück!</p>
        </Modal>
      )}

      {/* Leaderboard Modal */}
      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <StyledHeader>
        {/* Logo links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo to="/">
            <img src="/logo.svg" alt="Logo" />
          </Logo>
        </div>

        {/* Wallet Balance Mitte */}
        <BalanceCenter>
          <GambaUi.Balance />
        </BalanceCenter>

        {/* Menu rechts */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <MenuButton onClick={() => setMenuOpen((s) => !s)} aria-expanded={menuOpen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Menu
          </MenuButton>

          {menuOpen && (
            <Dropdown>
              {/* Jackpot Button */}
              {pool?.jackpotBalance > 0 && (
                <GambaUi.Button
                  onClick={() => {
                    setJackpotHelp(true)
                    setMenuOpen(false)
                  }}
                >
                  💰 Jackpot <span style={{ marginLeft: 8 }}><TokenValue amount={pool.jackpotBalance} /></span>
                </GambaUi.Button>
              )}

              {/* Wallet Connect / UserButton */}
              <div>
                <UserButton fullWidth onClick={() => setMenuOpen(false)} />
              </div>

              {/* Leaderboard */}
              {ENABLE_LEADERBOARD && (
                <GambaUi.Button
                  onClick={() => {
                    setShowLeaderboard(true)
                    setMenuOpen(false)
                  }}
                >
                  Leaderboard
                </GambaUi.Button>
              )}
            </Dropdown>
          )}
        </div>
      </StyledHeader>
    </>
  )
}