// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from 'gamba-react-ui-v2'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Modal } from '../components/Modal'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'

// ========================================================
// STYLES
// ========================================================

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

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background: #000000cc;
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  overflow: visible;
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img {
    height: 120%;
  }
`

const MobileMenuIcon = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 30px;
  color: white;
  cursor: pointer;
  padding: 8px;

  @media (min-width: 1025px) {
    display: none;
  }
`

const MobileDropdown = styled.div<{ open: boolean }>`
  @media (min-width: 1025px) {
    display: none;
  }

  position: absolute;
  top: 58px;
  right: 10px;
  background: #111;
  border: 1px solid #333;
  border-radius: 10px;
  min-width: 210px;
  padding: 10px 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);

  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? "0" : "-10px")});
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: opacity 0.25s ease, transform 0.25s ease;

  z-index: 999999; 
`

const MobileMenuItem = styled(NavLink)`
  display: block;
  padding: 12px 18px;
  color: white;
  text-decoration: none;
  font-size: 15px;

  &:hover {
    background: #222;
  }
`

const MobileSectionLabel = styled.div`
  padding: 14px 18px 4px;
  color: #aaa;
  font-size: 12px;
  text-transform: uppercase;
`

// ========================================================
// HEADER COMPONENT
// ========================================================

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg')

  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <>
      {/* ==================== BONUS MODAL ==================== */}
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b>
              <TokenValue amount={balance.bonusBalance} />
            </b>{' '}
            worth of free plays.
          </p>
          <p>A fee is still taken for each play.</p>
        </Modal>
      )}

      {/* ==================== JACKPOT MODAL ==================== */}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot </h1>
          <p style={{ fontWeight: 'bold' }}>
            <TokenValue amount={pool.jackpotBalance} /> is currently in the pot.
          </p>
        </Modal>
      )}

      {/* ==================== LEADERBOARD (DESKTOP ONLY) ==================== */}
      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBase58()}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* ========================================================
          HEADER
      ======================================================== */}
      <StyledHeader>
        {/* LEFT SIDE (LOGO) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo to="/">
            <img alt="Sol-Win logo" src="/logo.svg" />
          </Logo>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>

          {/* Stylische Balance Anzeige */}
          {balance.balance > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.1)",
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
              }}
            >
              <span style={{ opacity: 0.7 }}>Balance:</span>
              <TokenValue amount={balance.balance} />
            </div>
          )}

          {/* Bonus */}
          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {/* DESKTOP ELEMENTS */}
          {isDesktop && (
            <>
              <TokenSelect />
              <UserButton />
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>
            </>
          )}

          {/* MOBILE MENU BUTTON */}
          <MobileMenuIcon onClick={() => setMobileOpen(!mobileOpen)}>
            ☰
          </MobileMenuIcon>
        </div>

        {/* ==================== MOBILE DROPDOWN ==================== */}
        <MobileDropdown open={mobileOpen}>

          {/* Jackpot Button */}
          {pool.jackpotBalance > 0 && (
            <>
              <MobileSectionLabel>Jackpot</MobileSectionLabel>
              <div
                style={{
                  padding: "12px 18px",
                  color: "#ffe42d",
                  cursor: "pointer",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => {
                  setJackpotHelp(true)
                  setMobileOpen(false)
                }}
              >
                💰 <TokenValue amount={pool.jackpotBalance} />
              </div>
            </>
          )}

          <MobileSectionLabel>Navigation</MobileSectionLabel>

          <MobileMenuItem to="/games" onClick={() => setMobileOpen(false)}>
            Games
          </MobileMenuItem>

          <MobileMenuItem to="/referral" onClick={() => setMobileOpen(false)}>
            Referral Program
          </MobileMenuItem>

          <MobileMenuItem to="/leaderboard" onClick={() => setMobileOpen(false)}>
            Leaderboard
          </MobileMenuItem>

          {/* WALLET SECTION */}
          <MobileSectionLabel>Wallet</MobileSectionLabel>

          <div style={{ padding: "8px 18px" }}>
            <TokenSelect />
          </div>

          <div style={{ padding: "12px 18px" }}>
            <UserButton />
          </div>
        </MobileDropdown>
      </StyledHeader>
    </>
  )
}
