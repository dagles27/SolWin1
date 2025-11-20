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

const StyledHeader = styled.header`
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
  img { height: 120%; filter: drop-shadow(0 0 15px #8e2de2); }
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
`

const MenuButton = styled.button`
  all: unset;
  cursor: pointer;
  background: rgba(142,45,226,0.2);
  border: 2px solid #8e2de2;
  border-radius: 16px;
  padding: 14px 28px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  &:hover { background: #8e2de2; box-shadow: 0 0 30px #8e2de2; transform: translateY(-3px); }
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 20px;
  width: 360px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(135deg, #0f0028, #1a0033);
  border: 2px solid #8e2de2;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 20px 50px rgba(142,45,226,0.7);
  z-index: 999;
  max-height: 80vh;
  overflow-y: auto;
`

const InfoBox = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(142,45,226,0.4);
  border-radius: 16px;
  padding: 18px;
  text-align: center;
  color: white;
`

export default function Header() {
  const pool = useCurrentPool()
  const context = useGambaPlatformContext()
  const { balance, publicKey, bonusBalance } = useUserBalance()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [showLeaderboard, setShowLeaderboard] = React.useState(false)
  const [jackpotHelp, setJackpotHelp] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const shortAddress = publicKey ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}` : 'Nicht verbunden'

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <>
      {/* Jackpot Hilfe Modal */}
      {jackpotHelp && (
        <Modal onClose={() => setJackpotHelp(false)}>
          <h1>Jackpot</h1>
          <p>Aktuell im Jackpot: <TokenValue amount={pool.jackpotBalance} /></p>
          <p>Du zahlst max. {(PLATFORM_JACKPOT_FEE * 100).toFixed(4)} % deines Einsatzes für die Chance auf den Jackpot.</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            {context.defaultJackpotFee === 0 ? 'DEAKTIVIERT' : 'AKTIVIERT'}
            <GambaUi.Switch
              checked={context.defaultJackpotFee > 0}
              onChange={checked => context.setDefaultJackpotFee(checked ? PLATFORM_JACKPOT_FEE : 0)}
            />
          </label>
        </Modal>
      )}

      {ENABLE_LEADERBOARD && showLeaderboard && (
        <LeaderboardsModal creator={PLATFORM_CREATOR_ADDRESS.toBase58()} onClose={() => setShowLeaderboard(false)} />
      )}

      <StyledHeader>
        <Logo to="/"><img src="/logo.svg" alt="SolWin" /></Logo>

        <BalanceCenter>
          <GambaUi.Balance />
        </BalanceCenter>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Menü
          </MenuButton>

          {menuOpen && (
            <Dropdown>
              {/* Wallet Adresse */}
              <InfoBox>
                <strong>Wallet Adresse</strong><br />
                <span style={{ fontSize: '1.1rem', color: '#00ff9d' }}>{shortAddress}</span>
                <GambaUi.WalletButton fullWidth />
              </InfoBox>

              {/* Jackpot Chance */}
              {pool.jackpotBalance > 0 && (
                <InfoBox>
                  <strong>Jackpot Chance</strong><br />
                  <TokenValue amount={pool.jackpotBalance} />
                  <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
                    Chance: {(PLATFORM_JACKPOT_FEE * 100).toFixed(4)} % deines Einsatzes
                  </p>
                  <GambaUi.Button onClick={() => { setJackpotHelp(true); setMenuOpen(false); }} fullWidth>
                    Mehr Infos
                  </GambaUi.Button>
                </InfoBox>
              )}

              {/* Bonus falls vorhanden */}
              {bonusBalance > 0 && (
                <InfoBox>
                  <strong>Bonus</strong><br />
                  <TokenValue amount={bonusBalance} />
                </InfoBox>
              )}

              {/* Leaderboard */}
              {ENABLE_LEADERBOARD && (
                <GambaUi.Button onClick={() => { setShowLeaderboard(true); setMenuOpen(false); }} fullWidth>
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
