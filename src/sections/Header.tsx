// src/sections/Header.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
  useReferral,
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
  &:active { transform: scale(0.96); }
`

const GlowWrapper = styled.div`
  width: 100%;
  padding: 0;
  background: transparent !important;
  border-radius: 12px;
  box-shadow: 0 0 6px #00ff99, 0 0 12px #00ff9944;
`

const CleanUserButtonWrapper = styled.div`
  * { background: transparent !important; box-shadow: none !important; }
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
  &:hover { background: white; }
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
  @media (max-width: 1024px) { padding: 10px 6px; }
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

const MobileMenuIcon = styled.button<{ open?: boolean }>`
  display: block;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin-right: 6px;
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;

  /* Hover Glow */
  &:hover {
    background: rgba(0, 255, 180, 0.15);
    box-shadow: 0 0 20px rgba(0, 255, 180, 0.7);
  }

  /* Die drei Neon-Striche */
  &::before,
  &::after,
  & > span {
    content: '';
    position: absolute;
    width: 26px;
    height: 3px;
    left: 9px;
    background: #00ffc8;
    border-radius: 3px;
    box-shadow: 0 0 10px #00ffc8;
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &::before { top: 13px; }
  & > span  { top: 20px; }
  &::after  { top: 27px; }

  /* Hamburger → X + PULSE wenn offen */
  ${({ open }) => open && `
    &::before {
      top: 20px;
      transform: rotate(45deg) translate(7px, 7px);
      background: #00ffcc;
      box-shadow: 0 0 16px #00ffcc, 0 0 30px #00ffcc;
      animation: pulse 2s infinite;
    }

    & > span {
      opacity: 0;
      transform: translateX(-30px);
    }

    &::after {
      top: 20px;
      transform: rotate(-45deg) translate(7px, -7px);
      background: #00ffcc;
      box-shadow: 0 0 16px #00ffcc, 0 0 30px #00ffcc;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 16px #00ffcc, 0 0 30px #00ffcc;
      }
      50% {
        box-shadow: 0 0 20px #00ffcc, 0 0 50px #00ffcc, 0 0 70px rgba(0, 255, 204, 0.6);
      }
    }
  `}

  @media (min-width: 1025px) {
    display: none;
  }
`

const MobileDropdown = styled.div<{ open: boolean }>`
  @media (min-width: 1025px) { display: none; }
  position: absolute;
  top: 58px;
  right: 12px;
  min-width: 240px;
  border-radius: 14px;
  background: rgba(12, 12, 20, 0.85);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(0, 255, 160, 0.25);
  padding: 12px 0;
  box-shadow: 0 0 14px rgba(0, 255, 180, 0.45), inset 0 0 6px rgba(0, 255, 180, 0.15);
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: scale(${({ open }) => (open ? 1 : 0.92)}) translateY(${({ open }) => (open ? "0" : "-8px")});
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
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
  transition: 0.25s ease;
  &:hover { background: rgba(0, 255, 180, 0.08); color: #00ffbf; }
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
  &:hover:after { width: 60%; }
`

const MobileSectionLabel = styled.div`
  padding: 14px 22px 6px;
  color: #6affd8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  opacity: 0.75;
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
  span { opacity: 0.65; }
`

// ========================================================
// HEADER COMPONENT
// ========================================================
export default function Header() {
  const referral = useReferral()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg')

  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [bonusHelp, setBonusHelp] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [customCode, setCustomCode] = React.useState('')
  const [referralHelp, setReferralHelp] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest("button[data-menu]")) {
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const copyReferralLink = async () => {
    if (!customCode) {
      alert('Please enter a referral code first!')
      return
    }

    const link = `https://www.sol-win.casino/${customCode.trim()}`
    try {
      await navigator.clipboard.writeText(link)
      alert('Copied! Ready to share')
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = link
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Copied! Ready to share')
    }
  }

  return (
    <>
      {/* BONUS MODAL */}
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus</h1>
          <p>You have <b><TokenValue amount={balance.bonusBalance} /></b> worth of free plays.</p>
          <p>A fee is still taken for each play.</p>
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

      {/* REFERRAL MODAL – Custom Code + Copy */}
      {referralHelp && (
        <Modal onClose={() => setReferralHelp(false)}>
          <div style={{
            background: 'rgba(12, 12, 20, 0.95)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(0, 255, 160, 0.25)',
            borderRadius: '14px',
            padding: '24px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0, 255, 180, 0.3)',
            color: '#e5fff5',
          }}>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#00ffc8',
              textShadow: '0 0 8px rgba(0, 255, 180, 0.75)',
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              Referral Program
            </h1>

            <p style={{ color: '#eafff7', fontSize: '1rem', lineHeight: '1.5', marginBottom: '20px', opacity: 0.9 }}>
              Invite friends and earn <b style={{ color: '#ffe42d' }}>up to 25% of all fees</b> from their bets!
            </p>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ marginBottom: '12px', opacity: 0.85 }}>
                Enter your wallet address below! 
              </p>
              <input
                type="text"
                placeholder="B3Bp63a...Essq"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.trim())}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(0, 255, 174, 0.08)',
                  border: '1px solid rgba(0, 255, 170, 0.4)',
                  borderRadius: '12px',
                  color: '#eafff7',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />

              <button onClick={copyReferralLink} style={{
                marginTop: '16px',
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(0, 255, 174, 0.25), rgba(0, 255, 174, 0.1))',
                border: '2px solid rgba(0, 255, 170, 0.6)',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#eafff7',
                boxShadow: '0 0 25px rgba(0, 255, 174, 0.5)',
                transition: 'all 0.3s ease',
              }}>
                Copy Referral Link
              </button>

              {customCode && (
                <div style={{ marginTop: '12px', fontSize: '14px', opacity: 0.8, wordBreak: 'break-all' }}>
                  → <strong>https://www.sol-win.casino/{customCode}</strong>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <a
                href="https://www.linktr.ee/solwin_casino"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '13px',
                  background: 'rgba(0, 255, 174, 0.08)',
                  border: '1px solid rgba(0, 255, 170, 0.25)',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#eafff7',
                  textDecoration: 'none',
                }}
              >
                Watch Help Video
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* LEADERBOARD MODAL */}
      {ENABLE_LEADERBOARD && showLeaderboard && PLATFORM_CREATOR_ADDRESS && (
        <LeaderboardsModal
          creator={typeof PLATFORM_CREATOR_ADDRESS.toBase58 === "function" ? PLATFORM_CREATOR_ADDRESS.toBase58() : PLATFORM_CREATOR_ADDRESS}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* HEADER */}
      <StyledHeader>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Logo to="/">
            <img alt="Sol-Win logo" src="/logo.svg" />
          </Logo>
        </div>

        <div style={{ 
  display: "flex", 
  gap: "10px", 
  alignItems: "center",
  flexWrap: "wrap",           /* erlaubt Umbruch bei zu wenig Platz */
  justifyContent: "flex-end"
}}>
  {balance.balance > 0 && <BalanceBox>...}
  {balance.bonusBalance > 0 && <Bonus>...}

  {isDesktop && (
    <>
      <TokenSelect />
      <UserButton />
      <GambaUi.Button>Leaderboard</GambaUi.Button>
    </>
  )}


<MobileMenuIcon
  data-menu
  open={mobileOpen} // wichtig für die X-Animation
  onClick={() => setMobileOpen(!mobileOpen)}
>
  <span /> {/* mittlerer Strich */}
</MobileMenuIcon>
        </div>

        <MobileDropdown ref={dropdownRef} open={mobileOpen}>
          {pool.jackpotBalance > 0 && (
            <>
              <MobileSectionLabel>Jackpot</MobileSectionLabel>
              <GlowButton onClick={() => { setJackpotHelp(true); setMobileOpen(false) }}>
                Jackpot: <TokenValue amount={pool.jackpotBalance} />
              </GlowButton>
            </>
          )}

          <MobileSectionLabel>Navigation</MobileSectionLabel>
          <MobileMenuItem onClick={() => setMobileOpen(false)}>
            <NavLink to="/games" style={{ textDecoration: "none", color: "inherit" }}>Games</NavLink>
          </MobileMenuItem>

          <MobileMenuItem onClick={() => { setReferralHelp(true); setMobileOpen(false) }}>
            Referral Program
          </MobileMenuItem>

          <MobileMenuItem onClick={() => { setShowLeaderboard(true); setMobileOpen(false) }}>
            Leaderboard
          </MobileMenuItem>

          <MobileSectionLabel>Wallet</MobileSectionLabel>
          <div style={{ padding: "12px 18px" }}><GlowWrapper><TokenSelect /></GlowWrapper></div>
          <div style={{ padding: "12px 18px" }}><GlowButton><CleanUserButtonWrapper><UserButton /></CleanUserButtonWrapper></GlowButton></div>
        </MobileDropdown>
      </StyledHeader>
    </>
  )
}