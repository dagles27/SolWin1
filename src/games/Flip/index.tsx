import { Canvas } from '@react-three/fiber'
import { GambaUi, useSound } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin'
import { Effect } from './Effect'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'

const SIDES = { heads: [2, 0], tails: [0, 2] } as const
const WAGER_OPTIONS = [1, 5, 10, 50, 100]
type Side = keyof typeof SIDES

const GREEN = '#00ff88'
const BG = '#0a1a0f'

export default function Flip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [side, setSide] = React.useState<Side>('heads')
  const [wager, setWager] = React.useState(WAGER_OPTIONS[0])

  const sounds = useSound({ coin: SOUND_COIN, win: SOUND_WIN, lose: SOUND_LOSE })

  const play = async () => {
    try {
      setWin(false)
      setFlipping(true)
      sounds.play('coin', { playbackRate: 0.6 })
      await game.play({ bet: SIDES[side], wager, metadata: [side] })
      sounds.play('coin')
      const result = await game.result()
      setResultIndex(result.resultIndex)
      setWin(result.payout > 0)
      sounds.play(result.payout > 0 ? 'win' : 'lose')
    } catch (err) {
      console.error(err)
    } finally {
      setFlipping(false)
    }
  }

  return (
    <>
      {/* ULTRA-STARKES CSS – überschreibt wirklich ALLES von gamba-react-ui-v2 */}
      <style jsx global>{`
        /* Wager Input */
        .custom-wager-input > div,
        .custom-wager-input > div > div,
        .custom-wager-input input {
          background: rgba(0, 25, 15, 0.9) !important;
          color: #00ffbf !important;
          border-radius: 18px !important;
          height: 58px !important;
          border: 1px solid rgba(0,255,160,0.4) !important;
          box-shadow: 0 0 18px rgba(0,255,140,0.18) inset, 0 0 12px rgba(0,255,180,0.25) !important;
          font-weight: 800 !important;
          font-size: 17px !important;
        }
        .custom-wager-input > div:hover {
          box-shadow: 0 0 30px rgba(0,255,160,0.45) inset, 0 0 16px rgba(0,255,180,0.35) !important;
          transform: translateY(-3px) !important;
          border-color: rgba(0,255,180,0.6) !important;
        }

        /* Toggle & Flip Button – das überschreibt wirklich jedes !important von gamba-ui */
        .custom-toggle,
        .custom-flip-btn,
        .custom-toggle > button,
        .custom-flip-btn > button,
        .custom-toggle div,
        .custom-flip-btn div {
          all: unset !important;
          appearance: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          font-family: inherit !important;
          transition: all 0.2s ease-out !important;
        }

        /* Heads/Tails Toggle – inaktiv */
        .custom-toggle {
          background: rgba(0, 25, 15, 0.85) !important;
          color: #00ffbf !important;
          border: 1px solid rgba(0,255,140,0.25) !important;
          box-shadow: 0 0 12px rgba(0,255,140,0.12) inset !important;
          border-radius: 18px !important;
          height: 58px !important;
          gap: 8px !important;
          font-weight: 800 !important;
          font-size: 17px !important;
        }

        /* Heads/Tails Toggle – aktiv */
        .custom-toggle.active {
          background: linear-gradient(135deg, #00ff99, #00dd77) !important;
          color: #002a12 !important;
          border: 1px solid rgba(0,255,160,0.7) !important;
          box-shadow: 0 0 22px rgba(0,255,170,0.45), inset 0 0 14px rgba(255,255,255,0.08) !important;
        }

        .custom-toggle:hover:not(:disabled) {
          box-shadow: 0 0 34px rgba(0,255,170,0.7) !important;
          transform: translateY(-3px) !important;
        }

        /* FLIP Button – dein fetter Hauptbutton */
        .custom-flip-btn {
          background: linear-gradient(135deg, #00ff99, #00e68a) !important;
          color: #002a12 !important;
          border: 1px solid rgba(0,255,160,0.55) !important;
          box-shadow: 
            0 0 28px rgba(0,255,150,0.55), 
            0 8px 35px rgba(0,255,160,0.32), 
            inset 0 0 16px rgba(255,255,255,0.10) !important;
          border-radius: 18px !important;
          height: 60px !important;
          font-weight: 900 !important;
          font-size: 22px !important;
          text-transform: uppercase !important;
          letter-spacing: 2px !important;
        }

        .custom-flip-btn:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.05) !important;
          box-shadow: 0 0 45px rgba(0,255,170,0.75), 0 12px 45px rgba(0,255,170,0.35) !important;
          letter-spacing: 2.5px !important;
        }

        /* Disabled Zustand (optional – sieht sauber aus) */
        .custom-toggle:disabled,
        .custom-flip-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }
      `}</style>

      <GambaUi.Portal target="screen">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{
            background: BG,
            borderRadius: '28px',
            padding: '30px 24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.25)',
            maxWidth: '400px',
            width: '100%',
          }}>
            {/* 3D Coin */}
            <div style={{ marginBottom: '28px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.7)' }}>
              <Canvas linear flat orthographic camera={{ zoom: 160, position: [0, 0, 100] }} style={{ width: '100%', height: '340px', borderRadius: '50%' }}>
                <React.Suspense fallback={null}>
                  <group scale={0.78}>
                    <Coin result={resultIndex} flipping={flipping} />
                  </group>
                </React.Suspense>
                <Effect color="white" />
                {flipping && <Effect color="white" />}
                {win && <Effect color={GREEN} />}
                <ambientLight intensity={3} />
                <directionalLight position={[0, 1, 1]} intensity={1.8} />
              </Canvas>
            </div>

            {/* Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
              <GambaUi.WagerInput options={WAGER_OPTIONS} value={wager} onChange={setWager} className="custom-wager-input" />

              <GambaUi.Button
                disabled={gamba.isPlaying || flipping}
                onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
                className={`custom-toggle ${side === 'heads' ? 'active' : ''}`}
              >
                <img height="26" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} alt={side} />
                {side.toUpperCase()}
              </GambaUi.Button>

              <GambaUi.Button
                onClick={play}
                disabled={gamba.isPlaying || flipping}
                className="custom-flip-btn"
              >
                FLIP
              </GambaUi.Button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', color: '#88ffaa', fontSize: '15px', fontWeight: '600' }}>
              2× Payout · 50.0% Win Chance
            </div>
          </div>
        </div>
      </GambaUi.Portal>
    </>
  )
}