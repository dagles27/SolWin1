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
import { PLATFORM_JACKPOT_FEE, PLATFORM_CREATOR_ADDRESS, ENABLE_LEADERBOARD } from '../constants'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'

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

const GuthabenButton = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffe42d;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const Hamburger = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 32px;
  padding: 6px 4px;
  box-sizing: border-box;
  & > div {
    width: 100%;
    height: 4px;
    background: white;
    border-radius: 4px;
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #000000ee;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 260px;
  z-index: 999;
  box-shadow: 0 12px 32px rgba(0,0,0,0.7);
  border: 1px solid rgba(255,255,255,0.1);
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  background: #000000cc;
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`

const Logo = styled(NavLink)`
  height: 40px;
  & > img {
    height: 120%;
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
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <>
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            Du hast <b>
              <TokenValue amount={balance.bonusBalance} />
            </b>{' '}
            an Gratis-Spielen. Der Bonus wird automatisch beim Spielen verwendet.
          </p>
          <p>Hinweis: Für jeden Spielzug wird trotzdem eine kleine Gebühr aus deinem Wallet benötigt.</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot </h1>
          <p style={{ fontWeight: 'bold' }}>
            Aktuell sind <TokenValue amount={pool.jackpotBalance} /> im Jackpot.
          </p>
          <p>
            Der Jackpot wächst mit jedem Einsatz. Je größer er ist, desto höher ist deine Gewinnchance.
            Wird ein Gewinner ermittelt, wird der Pot zurückgesetzt und beginnt wieder zu wachsen.
          </p>
          <p>
            Du zahlst maximal{' '}
            {(PLATFORM_JACKPOT_FEE * 100).toLocaleString('de-DE', { maximumFractionDigits: 4 })} % deines Einsatzes
            für die Teilnahme.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? 'DEAKTIVIERT' : 'AKTIVIERT'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked) =>
                context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)
              }
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

      <StyledHeader>
        <Logo to="/">
          <img alt="logo" src="/logo.svg" />
        </Logo>

        <div
          ref={menuRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
          }}
        >
          {/* Bonus / Guthaben immer sichtbar (auch bei 0) */}
          <GuthabenButton onClick={() => setBonusHelp(true)}>
            Guthaben ✨ <TokenValue amount={balance.bonusBalance} />
          </GuthabenButton>

          <Hamburger
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((prev) => !prev)
            }}
          >
            <div />
            <div />
            <div />
          </Hamburger>

          {menuOpen && (
            <Dropdown onClick={(e) => e.stopPropagation()}>
              <TokenSelect />
              <UserButton />
              {pool.jackpotBalance > 0 && (
                <Bonus
                  onClick={() => {
                    setJackpotHelp(true)
                    setMenuOpen(false)
                  }}
                >
                  💰 Jackpot <TokenValue amount={pool.jackpotBalance} />
                </Bonus>
              )}
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