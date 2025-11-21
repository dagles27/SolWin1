// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
} from "gamba-react-ui-v2"
import React from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import LeaderboardsModal from "../sections/LeaderBoard/LeaderboardsModal"
import { PLATFORM_CREATOR_ADDRESS, ENABLE_LEADERBOARD } from "../constants"
import { useMediaQuery } from "../hooks/useMediaQuery"
import TokenSelect from "./TokenSelect"
import { UserButton } from "./UserButton"
import { Modal } from "../components/Modal"

// ========================================================
// STYLES
// ========================================================

const GlowButton = styled.div`
  background: #00ff99;
  color: #000;
  text-align: center;
  font-weight: bold;
  padding: 10px 12px;
  font-size: 15px;
  border-radius: 10px;
  width: 90%;
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

// ⭐ Modernisierte Version für Mobile UserButton
const MobileUserButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px; /* sorgt für perfekte Höhe */
  width: 100%;
  background: rgba(0, 255, 160, 0.08);
  border-radius: 10px;
  box-shadow:
    inset 0 0 6px rgba(0, 255, 160, 0.15),
    0 0 10px rgba(0, 255, 180, 0.25);
  padding: 6px 0;
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
  z-index: 9999;
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

const MobileMenuIcon = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 30px;
  color: #00ffc8;
  cursor: pointer;
  padding: 8px;
  text-shadow: 0 0 8px rgba(0, 255, 180, 0.75);

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
  right: 12px;
  min-width: 240px;
  border-radius: 14px;
  background: rgba(12, 12, 20, 0.85);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(0, 255, 160, 0.25);
  padding: 12px 0;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: scale(${({ open }) => (open ? 1 : 0.92)})
    translateY(${({ open }) => (open ? "0" : "-8px")});
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: 0.25s ease;
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
`

const MobileSectionLabel = styled.div`
  padding: 14px 22px 6px;
  color: #6affd8;
  font-size: 11px;
  letter-spacing: 1.4px;
  opacity: 0.75;
`

const BalanceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 255, 170, 0.08);
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #eafff7;
`

// ========================================================
// HEADER COMPONENT
// ========================================================

export default function Header() {
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery("lg")

  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {/* BONUS MODAL */}
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth
            of free plays.
          </p>
        </Modal>
      )}

      {/* JACKPOT MODAL */}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p style={{ fontWeight: "bold" }}>
            <TokenValue amount={pool.jackpotBalance} /> is currently in the pot.
          </p>
        </Modal>
      )}

      {/* LEADERBOARD MODAL */}
      {ENABLE_LEADERBOARD && showLeaderboard && PLATFORM_CREATOR_ADDRESS && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* HEADER */}
      <StyledHeader>
        {/* Logo */}
        <Logo to="/">
          <img alt="Sol-Win logo" src="/logo.svg" />
        </Logo>

        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {/* Balance */}
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

          {/* Desktop */}
          {isDesktop && (
            <>
              <TokenSelect />
              <UserButton />
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>
            </>
          )}

          {/* Mobile menu icon */}
          <MobileMenuIcon onClick={() => setMobileOpen(!mobileOpen)}>
            ☰
          </MobileMenuIcon>
        </div>

        {/* MOBILE DROPDOWN */}
        <MobileDropdown ref={dropdownRef} open={mobileOpen}>
          {pool.jackpotBalance > 0 && (
            <>
              <MobileSectionLabel>Jackpot</MobileSectionLabel>
              <GlowButton>
                💰 <TokenValue amount={pool.jackpotBalance} />
              </GlowButton>
            </>
          )}

          <MobileSectionLabel>Navigation</MobileSectionLabel>

          <NavLink to="/games" style={{ textDecoration: "none" }}>
            <MobileMenuItem>Games</MobileMenuItem>
          </NavLink>

          <NavLink to="/referral" style={{ textDecoration: "none" }}>
            <MobileMenuItem>Referral Program</MobileMenuItem>
          </NavLink>

          <MobileMenuItem onClick={() => setShowLeaderboard(true)}>
            Leaderboard
          </MobileMenuItem>

          <MobileSectionLabel>Wallet</MobileSectionLabel>

          {/* TOKEN SELECT */}
          <div style={{ padding: "12px 18px" }}>
            <GlowWrapper>
              <TokenSelect />
            </GlowWrapper>
          </div>

          {/* USER BUTTON – modern & perfekt ausgerichtet */}
          <div style={{ padding: "12px 18px" }}>
            <MobileUserButtonWrapper>
              <UserButton />
            </MobileUserButtonWrapper>
          </div>
        </MobileDropdown>
      </StyledHeader>
    </>
  )
}