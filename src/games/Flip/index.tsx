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
const BG = 'rgba(10, 26, 15, 0.95)'

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
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          {/* Einzige Box – alles drin */}
          <div style={{
            background: BG,
            borderRadius: '32px',
            padding: '32px 28px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.3)',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Coin */}
            <div style={{ marginBottom: '30px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.8)' }}>
              <Canvas
                linear flat orthographic
                camera={{ zoom: 165, position: [0, 0, 100] }}
                style={{ width: '100%', height: '340px', borderRadius: '50%' }}
              >
                <React.Suspense fallback={null}>
                  <group scale={0.8}>
                    <Coin result={resultIndex} flipping={flipping} />
                  </group>
                </React.Suspense>
                <Effect color="white" />
                {flipping && <Effect color="white" />}
                {win && <Effect color={GREEN} />}
                <ambientLight intensity={3.2} />
                <directionalLight position={[0, 1, 1]} intensity={2} />
              </Canvas>
            </div>

            {/* Eine einzige Zeile mit allen drei Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.3fr',
              gap: '14px',
            }}>
              <GambaUi.WagerInput
                options={WAGER_OPTIONS}
                value={wager}
                onChange={setWager}
                style={{
                  background: GREEN_DARK,
                  color: 'white',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '17px',
                  height: '62px',
                }}
              />

              <GambaUi.Button
                disabled={gamba.isPlaying || flipping}
                onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
                style={{
                  background: side === 'heads' ? GREEN : GREEN_DARK,
                  color: side === 'heads' ? '#000' : 'white',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '17px',
                  height: '62px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: side === 'heads' ? '0 0 30px rgba(0,255,136,0.8)' : 'none',
                }}
              >
                <img height="28" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} />
                {side.toUpperCase()}
              </GambaUi.Button>

              {/* FLIP ist jetzt wirklich hier drin – nicht mehr unten! */}
              <GambaUi.PlayButton
                onClick={play}
                disabled={gamba.isPlaying || flipping}
                style={{
                  background: `linear-gradient(to right, ${GREEN}, #00ffaa)`,
                  color: '#000',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: '22px',
                  height: '62px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: '0 10px 30px rgba(0,255,136,0.6)',
                }}
                hoverStyle={{ transform: 'translateY(-5px) scale(1.06)' }}
              >
                FLIP
              </GambaUi.PlayButton>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', color: '#88ffbb', fontSize: '16px', fontWeight: '600' }}>
              2× Payout • 49.5% Chance
            </div>
          </div>
        </div>
      </GambaUi.Portal>

      {/* WICHTIG: Standard-Controls komplett ausblenden */}
      <GambaUi.Portal target="controls">
        <div style={{ display: 'none' }} />
      </GambaUi.Portal>
    </>
  )
}