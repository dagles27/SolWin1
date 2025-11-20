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

// --- Existing styles ---
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
  z-index: 1000;
`

const Logo = styled(NavLink)`
  height: 35px;
  margin: 0 15px;
  & > img {
    height: 120%;
  }
`
// ⬇️ ADD THIS HERE (below Logo styled-component)

// MOBILE ONLY ICON
const MobileMenuIcon = styled.button`
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }

  background: transparent;
  border: none;
  font-size: 28px;
  color: white;
  cursor: pointer;
`

// ANIMATED DROPDOWN CONTAINER
const AnimatedDropdown = styled.div<{ open: boolean }>`
  @media (min-width: 1025px) {
    display: none;
  }

  position: absolute;
  top: 55px;
  right: 0;
  background: #111;
  border: 1px solid #333;
  border-radius: 10px;
  min-width: 180px;
  padding: 10px 0;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);

  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? "0" : "-10px")});
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: opacity 0.25s ease, transform 0.25s ease;
`

// MENU LINKS
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

// ⬇️ NEW DROPDOWN STYLES
const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownButton = styled.button`
  background: #222;
  border: 1px solid #444;
  color: white;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #333;
  }
`

const DropdownMenu = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 42px;
  right: 0;
  background: #111;
  border: 1px solid #444;
  padding: 8px 0;
  border-radius: 8px;
  min-width: 160px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`

const DropdownItem = styled(NavLink)`
  padding: 10px 16px;
  color: white;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #222;
  }
`
// ⬆️ NEW DROPDOWN PART END

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg')
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // ⬇️ NEW DROPDOWN STATE
  const [openMenu, setOpenMenu] = React.useState(false)

  return (
    <>
      {/* Existing modals ... */}

      <StyledHeader>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Logo to="/">
            <img alt="Gamba logo" src="/logo.svg" />
          </Logo>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {pool.jackpotBalance > 0 && (
            <Bonus onClick={() => setJackpotHelp(true)}>
              💰 <TokenValue amount={pool.jackpotBalance} />
            </Bonus>
          )}

          {balance.bonusBalance > 0 && (
            <Bonus onClick={() => setBonusHelp(true)}>
              ✨ <TokenValue amount={balance.bonusBalance} />
            </Bonus>
          )}

          {/* Desktop Leaderboard Button */}
          {isDesktop && (
            <GambaUi.Button onClick={() => setShowLeaderboard(true)}>
              Leaderboard
            </GambaUi.Button>
          )}

          <TokenSelect />
<UserButton />

{/* MOBILE MENU ICON */}
<MobileMenuIcon onClick={() => setMobileOpen(!mobileOpen)}>
  ☰
</MobileMenuIcon>

{/* MOBILE DROPDOWN */}
<AnimatedDropdown open={mobileOpen}>
  <MobileMenuItem to="/games" onClick={() => setMobileOpen(false)}>
    Games
  </MobileMenuItem>

  <MobileMenuItem to="/profile" onClick={() => setMobileOpen(false)}>
    My Profile
  </MobileMenuItem>

  <MobileMenuItem to="/wallet" onClick={() => setMobileOpen(false)}>
    Wallet
  </MobileMenuItem>

  <MobileMenuItem to="/referral" onClick={() => setMobileOpen(false)}>
    Referral Program
  </MobileMenuItem>
</AnimatedDropdown>

        </div>
      </StyledHeader>
    </>
  )
}
