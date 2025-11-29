import './style.css' // ← MUSS OBEN STEHEN!
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
const GREEN_DARK = '#00cc66'
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
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '20px 10px',
            gap: '20px',
          }}>
            {/* 3D Coin – nimmt den oberen Bereich ein */}
            <div style={{ 
              flex: '1 1 60%', 
              minHeight: '300px',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
            }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '380px', 
                aspectRatio: '1/1', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                boxShadow: '0 12px 40px rgba(0,0,0,0.7)' 
              }}>
                <Canvas linear flat orthographic camera={{ zoom: 160, position: [0, 0, 100] }}>
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
            </div>

            {/* ALLE CONTROLS in einer Zeile – perfekt für Mobile (kein Scrollen!) */}
            <div style={{ 
              flex: '0 0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.3fr',
              gap: '12px',
              padding: '0 10px',
            }}>
              {/* Wager */}
              <GambaUi.WagerInput
                options={WAGER_OPTIONS}
                value={wager}
                onChange={setWager}
                style={{
                  background: GREEN_DARK,
                  color: 'white',
                  borderRadius: '18px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  height: '56px',
                }}
              />

              {/* Heads / Tails */}
              <GambaUi.Button
                disabled={gamba.isPlaying || flipping}
                onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
                style={{
                  background: side === 'heads' ? GREEN : GREEN_DARK,
                  color: side === 'heads' ? '#000' : 'white',
                  borderRadius: '18px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: side === 'heads' ? '0 0 25px rgba(0,255,136,0.7)' : 'none',
                }}
              >
                <img height="24" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} alt={side} />
                {side.toUpperCase()}
              </GambaUi.Button>

              {/* FLIP Button – jetzt oben, groß & auffällig! */}
              <GambaUi.PlayButton
                onClick={play}
                disabled={gamba.isPlaying || flipping}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #f94d6a)',
                  color: 'white',
                  borderRadius: '18px',
                  fontWeight: '900',
                  fontSize: '20px',
                  height: '56px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  boxShadow: '0 8px 30px rgba(255,107,107,0.6)',
                }}
              >
                FLIP
              </GambaUi.PlayButton>
            </div>

            {/* Info-Text */}
            <div style={{ textAlign: 'center', color: '#88ffaa', fontSize: '15px', fontWeight: '600' }}>
              2× Payout · 50.0% Win Chance
            </div>
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      {/* Keine extra Controls mehr nötig */}
      <GambaUi.Portal target="controls">
        <div style={{ display: 'none' }} />
      </GambaUi.Portal>
    </>
  )
}
