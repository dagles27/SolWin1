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

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(180deg, rgba(15,0,40,0.95), rgba(10,0,30,0.8));
  backdrop-filter: blur(15px);
  border-bottom: 2px solid #8e2de2;
  box-shadow: 0 4px 25px rgba(142,45,226,0.5);
  z-index: 1000;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled(NavLink)`
  height: 48px;
  img {
    height: 120%;
    filter: drop-shadow(0 0 15px #8e2de2);
  }
`

const BalanceCenter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.5);
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.3rem;
  color: #00ff9d;
  box-shadow: 0 0 20px rgba(0,255,157,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 12px;
`

const MenuButton = styled.button`
  all: unset;
  cursor: pointer;
  background: rgba(142,45,226,0.2);
  border: 2px solid #8e2de2;
  border-radius: 14px;
  padding: 12px 24px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    background: #8e2de2;
    box-shadow: 0 0 25px #8e2de2;
    transform: translateY(-2px);
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 20px;
  width: 340px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(135deg, #0f0028, #1a0033);
  border: 2px solid #8e2de2;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 15px 40px rgba(142,45,226,0.6);
  z-index: 999;
  max-height: 80vh;
  overflow-y: auto;
`

const WalletInfo = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(0,255,157,0.4);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: #00ff9d;
  font-weight: bold;
`

const JackpotChance = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,228,45,0.4);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: #ffe42d;
  font-weight: bold;
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
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const shortAddress = balance.publicKey ? `${balance.publicKey.toBase58().slice(0, 6)}...${balance.publicKey.toBase58().slice(-4)}` : 'Nicht verbunden'

  return (
    <>
      {/* MODALS – unverändert */}
      {bonusHelp && (
        <Modal onClose={() => setBonusHelp(false)}>
          <h1>Bonus ✨</h1>
          <p>
            Du hast <b><TokenValue amount={balance.bonusBalance} /></b> an Gratis-Spielen.
          </p>
          <p>Hinweis: Für jeden Spielzug wird trotzdem eine kleine Gebühr aus deinem Wallet benötigt.</p>
        </Modal>
      )}

      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p style={{ fontWeight: 'bold' }}>
            Aktuell sind <TokenValue amount={pool.jackpotBalance} /> im Jackpot.
          </p>
          <p>
            Der Jackpot wächst mit jedem Einsatz. Je größer er ist, desto höher ist deine Gewinnchance.
          </p>
          <p>
            Du zahlst maximal {(PLATFORM_JACKPOT_FEE * 100).toLocaleString('de-DE', { maximumFractionDigits: 4 })} % deines Einsatzes für die Teilnahme.
          </p>
          <label style={{ display: 'flex', align-items: 'center', gap: '10px' }}>
            {context.defaultJackpotFee === 0 ? 'DEAKTIVIERT' : 'AKTIVIERT'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={(checked) => context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)}
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
        {/* LOGO LINKS */}
        <Logo to="/">
          <img src="/logo.svg" alt="SolWin" />
        </Logo>

        {/* WALLET BALANCE MITTE */}
        <BalanceCenter>
          <TokenValue amount={balance.balance} /> Wallet
        </BalanceCenter>

        {/* MENU BUTTON RECHTS */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Menu
          </MenuButton>

          {/* LANGES DROPDOWN – lang gezogen */}
          {menuOpen && (
            <Dropdown>
              {/* WALLET ADRESSE */}
              <WalletInfo>
                <h4>Wallet Adresse</h4>
                <p>{shortAddress}</p>
                <GambaUi.WalletButton fullWidth />
              </WalletInfo>

              {/* JACKPOT CHANCE */}
              {pool.jackpotBalance > 0 && (
                <JackpotChance>
                  <h4>Jackpot Chance</h4>
                  <JackpotTicker />
                  <p>Chance: {((PLATFORM_JACKPOT_FEE * 100).toFixed(2))}% deines Einsatzes</p>
                  <GambaUi.Button onClick={() => { setJackpotHelp(true); setMenuOpen(false); }} fullWidth>
                    Mehr Info
                  </GambaUi.Button>
                </JackpotChance>
              )}

              {/* BONUS */}
              {balance.bonusBalance > 0 && (
                <div className="menu-block">
                  <h4>Bonus</h4>
                  <TokenValue amount={balance.bonusBalance} />
                  <GambaUi.Button onClick={() => { setBonusHelp(true); setMenuOpen(false); }} fullWidth>
                    Mehr Info
                  </GambaUi.Button>
                </div>
              )}

              {/* LEADERBOARD */}
              {ENABLE_LEADERBOARD && (
                <GambaUi.Button onClick={() => { setShowLeaderboard(true); setMenuOpen(false); }} fullWidth>
                  Leaderboard
                </GambaUi.Button>
              )}

              {/* TOKEN SELECT & USER */}
              <TokenSelect />
              <UserButton fullWidth />
            </Dropdown>
          )}
        </div>
      </StyledHeader>
    </>
  )
}
