// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useGambaPlatformContext,
  useUserBalance,
} from "gamba-react-ui-v2"
import React from "react"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import { Modal } from "../components/Modal"
import LeaderboardsModal from "../sections/LeaderBoard/LeaderboardsModal"
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS } from "../constants"
import { useMediaQuery } from "../hooks/useMediaQuery"
import TokenSelect from "./TokenSelect"
import { UserButton } from "./UserButton"
import { ENABLE_LEADERBOARD } from "../constants"

//
// --- STYLES ---
//

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 10px 14px;

  background: #000000cc;
  backdrop-filter: blur(18px);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;

  overflow: visible;
`

const Logo = styled(NavLink)`
  height: 35px;
  & > img {
    height: 120%;
  }
`

// MOBILE BURGER ICON
const MobileMenuIcon = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 32px;
  color: white;
  cursor: pointer;

  padding: 6px;
  z-index: 3000; /* absolute top */

  @media (min-width: 1025px) {
    display: none;
  }
`

// MOBILE DROPDOWN CONTAINER
const MobileMenu = styled.div<{ open: boolean }>`
  @media (min-width: 1025px) {
    display: none;
  }

  position: absolute;
  top: 60px;
  right: 15px;

  background: #111;
  border: 1px solid #333;
  width: 220px;

  border-radius: 12px;
  padding: 12px 0;

  display: flex;
  flex-direction: column;

  box-shadow: 0 12px 25px rgba(0,0,0,0.6);

  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? "0" : "-10px")});
  pointer-events: ${({ open }) => (open ? "auto" : "none")};

  transition: all 0.25s ease;

  z-index: 2500;
`

const MobileMenuItem = styled(NavLink)`
  padding: 14px 20px;
  color: white;
  text-decoration: none;
  font-size: 15px;

  &:hover {
    background: #222;
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
    color: black;
  }
`

//
// --- COMPONENT ---
//

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery("lg")

  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)

  // MOBILE MENU STATE
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <>
      <StyledHeader>
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Logo to="/">
            <img src="/logo.svg" alt="SolWin Logo" />
          </Logo>
        </div>

        {/* RIGHT SECTION */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Jackpot */}
          {pool.jackpotBalance > 0 && (
            <Bonus onClick={() => setJackpotHelp(true)}>
              💰 <TokenValue amount={pool.jackpotBalance} />
            </Bonus>
          )}

          {/* Bonus */}
          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {/* DESKTOP ITEMS */}
          {isDesktop && (
            <>
              <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
                Leaderboard
              </GambaUi.Button>

              <TokenSelect />
              <UserButton />
            </>
          )}

          {/* MOBILE MENU BUTTON (replaces connect/user btn) */}
          {!isDesktop && (
            <MobileMenuIcon onClick={() => setMobileOpen(!mobileOpen)}>
              ☰
            </MobileMenuIcon>
          )}

          {/* MOBILE MENU */}
          <MobileMenu open={mobileOpen}>
            <MobileMenuItem to="/games" onClick={() => setMobileOpen(false)}>
              🎮 Games
            </MobileMenuItem>

            <MobileMenuItem to="/referral" onClick={() => setMobileOpen(false)}>
              🎁 Referral
            </MobileMenuItem>

            <MobileMenuItem to="/profile" onClick={() => setMobileOpen(false)}>
              👤 My Profile
            </MobileMenuItem>

            <MobileMenuItem to="/wallet" onClick={() => setMobileOpen(false)}>
              💼 Wallet
            </MobileMenuItem>

            <div style={{ padding: "14px 20px" }}>
              {/* CONNECT / USER BUTTON INS MENU VERSCHOBEN */}
              <UserButton />
            </div>
          </MobileMenu>
        </div>
      </StyledHeader>
    </>
  )
}

