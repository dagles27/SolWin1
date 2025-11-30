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
const BG = '#07140c'

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
      <GambaUi.Portal target="screen">
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <div
            style={{
              background: BG,
              borderRadius: '28px',
              padding: '30px 24px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6), inset 0 0 45px rgba(0,255,120,0.12)',
              border: '1px solid rgba(0,255,120,0.22)',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            {/* Coin */}
            <div
              style={{
                marginBottom: '28px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
              }}
            >
              <Canvas
                linear
                flat
                orthographic
                camera={{ zoom: 160, position: [0, 0, 100] }}
                style={{ width: '100%', height: '340px', borderRadius: '50%' }}
              >
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

            {/* CONTROL ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>

              {/* WAGER */}
              <GambaUi.WagerInput
                unstyled
                options={WAGER_OPTIONS}
                value={wager}
                onChange={setWager}
                style={{
                  background: 'rgba(0, 20, 10, 0.85)',
                  color: '#00ffbf',
                  borderRadius: '18px',
                  fontWeight: '800',
                  fontSize: '17px',
                  height: '58px',
                  border: '1px solid rgba(0,255,150,0.35)',
                  boxShadow: '0 0 18px rgba(0,255,140,0.18) inset',
                  transition: '0.2s',
                }}
                hoverStyle={{
                  transform: 'translateY(-3px)',
                  border: '1px solid rgba(0,255,180,0.55)',
                  boxShadow: '0 0 35px rgba(0,255,160,0.45) inset',
                }}
              />

              {/* HEADS/TAILS */}
              <GambaUi.Button
                unstyled
                disabled={gamba.isPlaying || flipping}
                onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
                style={{
                  background:
                    side === 'heads'
                      ? 'linear-gradient(135deg, #00ff99, #00dd77)'
                      : 'rgba(0,20,10,0.85)',
                  color: side === 'heads' ? '#002a12' : '#00ffbf',
                  borderRadius: '18px',
                  fontWeight: '900',
                  fontSize: '17px',
                  height: '58px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border:
                    side === 'heads'
                      ? '1px solid rgba(0,255,160,0.7)'
                      : '1px solid rgba(0,255,140,0.25)',
                  boxShadow:
                    side === 'heads'
                      ? '0 0 22px rgba(0,255,170,0.45)'
                      : '0 0 12px rgba(0,255,140,0.12) inset',
                  transition: '0.2s',
                }}
                hoverStyle={{
                  transform: 'translateY(-3px)',
                  boxShadow: '0 0 35px rgba(0,255,160,0.45)',
                }}
              >
                <img height="26" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} />
                {side.toUpperCase()}
              </GambaUi.Button>

              {/* FLIP BUTTON */}
              <GambaUi.Button
                unstyled
                onClick={play}
                disabled={gamba.isPlaying || flipping}
                style={{
                  background: 'linear-gradient(135deg, #00ff99, #00e68a)',
                  color: '#002a12',
                  borderRadius: '18px',
                  fontWeight: '900',
                  fontSize: '22px',
                  height: '60px',
                  letterSpacing: '2px',
                  border: '1px solid rgba(0,255,160,0.55)',
                  boxShadow:
                    '0 0 28px rgba(0,255,150,0.55), inset 0 0 14px rgba(255,255,255,0.1)',
                  transition: '0.22s',
                }}
                hoverStyle={{
                  transform: 'translateY(-4px) scale(1.05)',
                  boxShadow:
                    '0 0 45px rgba(0,255,170,0.75), 0 12px 45px rgba(0,255,170,0.35)',
                }}
              >
                FLIP
              </GambaUi.Button>

            </div>

            <div style={{
              textAlign: 'center',
              marginTop: '14px',
              color: '#88ffaa',
              fontSize: '15px',
              fontWeight: '600',
            }}>
              2× Payout · 50% Win Chance
            </div>

          </div>
        </div>
      </GambaUi.Portal>
    </>
  )
}