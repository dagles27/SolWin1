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
import { PLATFORM_CREATOR_ADDRESS } from '../constants'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { ENABLE_LEADERBOARD } from '../constants'

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
`;

const MobileMenuIcon = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 30px;
  color: #00ffc8;
  cursor: pointer;
  padding: 8px;
  transition: 0.2s ease;

  text-shadow: 0 0 8px rgba(0, 255, 180, 0.75);

  &:hover {
    color: #8affea;
    text-shadow: 0 0 12px rgba(0, 255, 200, 1);
    transform: scale(1.12);
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const MobileDropdown = styled.div<{ open: boolean }>`
  @media (min-width: 1025px) {
    display: none;
  }

  position: absolute;
  top: 58px;
  right: 12px;
  min-width: 240px;
  border-radius: 14px;

  /* HOLOGRAPHIC FUTURE PANEL */
  background: rgba(12, 12, 20, 0.85);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(0, 255, 160, 0.25);

  padding: 12px 0;

  /* NEON SHADOW */
  box-shadow:
    0 0 14px rgba(0, 255, 180, 0.45),
    inset 0 0 6px rgba(0, 255, 180, 0.15);

  /* OPEN/CLOSE ANIMATION */
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: scale(${({ open }) => (open ? 1 : 0.92)})
    translateY(${({ open }) => (open ? "0" : "-8px")});
  pointer-events: ${({ open }) => (open ? "auto" : "none")};

  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  z-index: 999999;
`;

const MobileMenuItem = styled(NavLink)`
  display: block;
  padding: 13px 20px;
  color: #e5fff5;
  font-size: 15px;
  text-decoration: none;
  letter-spacing: 0.5px;

  position: relative;
  overflow: hidden;

  transition: 0.25s ease;

  &:hover {
    background: rgba(0, 255, 180, 0.08);
    color: #00ffbf;
  }

  /* Futuristic hover underline */
  &:after {
    content: "";
    position: absolute;
    left: 20px;
    bottom: 8px;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, #00ffbf, transparent);
    transition: width 0.25s ease;
  }

  &:hover:after {
    width: 60%;
  }
`;

const MobileSectionLabel = styled.div`
  padding: 14px 22px 6px;
  color: #6affd8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.4px;

  opacity: 0.75;

  /* Glow line under title */
  position: relative;
  margin-bottom: 6px;

  &:after {
    content: "";
    position: absolute;
    left: 22px;
    bottom: 0;
    height: 1px;
    width: 40%;
    background: linear-gradient(90deg, #00ffbf66, transparent);
  }
`;

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
  border: 1px solid rgba(0, 255, 170, 0.25);

  box-shadow: inset 0 0 8px rgba(0, 255, 150, 0.12);

  span {
    opacity: 0.65;
  }
`;

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

  // === NEW: Outside click handler ===
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("button[data-menu]")
      ) {
        setMobileOpen(false)
      }
    }

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileOpen])

  // ========================================================

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays.
          </p>
          <p>A fee is still taken for each play.</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p style={{ fontWeight: "bold" }}>
            <TokenValue amount={pool.jackpotBalance} /> is currently in the pot.
          </p>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal
          creator={PLATFORM_CREATOR_ADDRESS.toBaseBase58()}
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
          {/* Balance */}
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

          {/* Mobile menu button */}
          <MobileMenuIcon
            data-menu
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </MobileMenuIcon>
        </div>

        {/* MOBILE DROPDOWN */}
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

          <MobileMenuItem to="/games" onClick={() => setMobileOpen(false)}>
            Games
          </MobileMenuItem>

          <MobileMenuItem to="/referral" onClick={() => setMobileOpen(false)}>
            Referral Program
          </MobileMenuItem>

          <MobileMenuItem to="/leaderboard" onClick={() => setMobileOpen(false)}>
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