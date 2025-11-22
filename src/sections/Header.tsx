// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
} from 'gamba-react-ui-v2'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import LeaderboardsModal from '../sections/LeaderBoard/LeaderboardsModal'
import { PLATFORM_CREATOR_ADDRESS, ENABLE_LEADERBOARD } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { Modal } from '../components/Modal'

// ========================================================
// STYLES
// ========================================================

const GlowButton = styled.div`
  background: #00ff99;
  color: #000000;
  text-align: center;
  font-weight: bold;
  padding: 10px 18px;
  font-size: 14px;
  border-radius: 8px;
  width: 100%;
  margin: 0 auto;
  cursor: pointer;
  box-shadow: 0 0 6px #00ff99, 0 0 12px #00ff9977;
  transition: 0.2s;
  &:active {
    transform: scale(0.96);
  }
`

const GlowWrapper = styled.div`
  width: 100%;
  padding: 0;
  background: transparent !important;
  border-radius: 12px;
  box-shadow: 0 0 6px #00ff99, 0 0 12px #00ff9944;
`

const CleanUserButtonWrapper = styled.div`
  * {
    background: transparent !important;
    box-shadow: none !important;
  }
`

const Bonus = styled.button`
  all: unset;
  cursor: pointer;
  color: #ffe42d;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
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

  @media (max-width: 1024px) {
    padding: 10px 6px;
  }
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  display: flex;
  align-items: center;

  img {
    height: 130%;
    filter: drop-shadow(0 0 6px rgba(0, 255, 180, 0.45));
    transition: 0.25s ease;
  }

  &:hover img {
    filter: drop-shadow(0 0 10px rgba(0, 255, 200, 0.7));
    transform: scale(1.03);
  }
`

// HAMBURGER HIDDEN ON DESKTOP
const MobileMenuIcon = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 30px;
  color: #00ffc8;
  cursor: pointer;
  padding: 8px;
  transition: 0.2s ease;
  margin-right: 6px;
  text-shadow: 0 0 8px rgba(0, 255, 180, 0.75);

  &:hover {
    color: #8affea;
    text-shadow: 0 0 12px rgba(0, 255, 200, 1);
    transform: scale(1.12);
  }

  @media (min-width: 1025px) {
    display: none; /* ← makes it invisible on desktop */
  }
`

// SHOW DROPDOWN ALSO ON DESKTOP
const MobileDropdown = styled.div<{ open: boolean }>`
  @media (min-width: 1025px) {
    display: block !important;   /* ← always visible on desktop */
    opacity: 1 !important;
    transform: scale(1) translateY(0);
    pointer-events: auto;
    position: fixed; /* keep same location */
    top: 58px;
    right: 12px;
  }

  @media (max-width: 1024px) {
    display: ${({ open }) => (open ? "block" : "none")};
  }

  position: absolute;
  top: 58px;
  right: 12px;
  min-width: 240px;
  border-radius: 14px;
  background: rgba(12, 12, 20, 0.85);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(0, 255, 160, 0.25);
  padding: 12px 0;
  box-shadow:
    0 0 14px rgba(0, 255, 180, 0.45),
    inset 0 0 6px rgba(0, 255, 180, 0.15);
  z-index: 999999;
`

const MobileMenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 13px 20px;
  color: #e5fff5;
  font-size: 15px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  transition: 0.25s ease;

  &:hover {
    background: rgba(0, 255, 180, 0.08);
    color: #00ffbf;
  }
`

const MobileSectionLabel = styled.div`
  padding: 14px 22px 6px;
  color: #6affd8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  opacity: 0.75;
  margin-bottom: 6px;
`

const BalanceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 255, 170, 0.08);
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #eafff7;
  border: 1px solid rgba(0, 255, 170, 0.25);
  box-shadow: inset 0 0 8px rgba(0, 255, 150, 0.12);

  span {
    opacity: 0.65;
  }
`

// ========================================================
// HEADER
// ========================================================

export default function Header() {
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg')

  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays.
          </p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p><TokenValue amount={pool.jackpotBalance} /> is currently in the pot.</p>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      <StyledHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Logo to="/">
            <img alt="Sol-Win logo" src="/logo.svg" />
          </Logo>
        </div>

        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>

          {balance.balance > 0 && (
            <BalanceBox>
              <span>Balance:</span>
              <TokenValue amount={balance.balance} />
            </BalanceBox>
          )}

          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {isDesktop && (
            <>
              <TokenSelect />
              <UserButton />
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>
            </>
          )}

          {/* MOBILE ONLY BUTTON */}
          <MobileMenuIcon
            data-menu
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </MobileMenuIcon>
        </div>

        {/* MOBILE DROPDOWN (ALSO DESKTOP NOW) */}
        <MobileDropdown ref={dropdownRef} open={mobileOpen}>
          {pool.jackpotBalance > 0 && (
            <>
              <MobileSectionLabel>Jackpot</MobileSectionLabel>
              <GlowButton
                onClick={() => {
                  setJackpotHelp(true)
                  setMobileOpen(false)
                }}
              >
                💰 <TokenValue amount={pool.jackpotBalance} />
              </GlowButton>
            </>
          )}

          <MobileSectionLabel>Navigation</MobileSectionLabel>

          <MobileMenuItem>
            <NavLink to="/games" style={{ color: "inherit", textDecoration: "none" }}>
              Games
            </NavLink>
          </MobileMenuItem>

          <MobileMenuItem>
            <NavLink to="/referral" style={{ color: "inherit", textDecoration: "none" }}>
              Referral Program
            </NavLink>
          </MobileMenuItem>

          <MobileMenuItem onClick={() => setShowLeaderboard(true)}>
            Leaderboard
          </MobileMenuItem>

          <MobileSectionLabel>Wallet</MobileSectionLabel>

          <div style={{ padding: "12px 18px" }}>
            <GlowWrapper>
              <TokenSelect />
            </GlowWrapper>
          </div>

          <div style={{ padding: "12px 18px" }}>
            <GlowButton>
              <CleanUserButtonWrapper>
                <UserButton />
              </CleanUserButtonWrapper>
            </GlowButton>
          </div>
        </MobileDropdown>
      </StyledHeader>
    </>
  )
}
