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

// Grün-Töne (passend zu SOL-WIN)
const GREEN = '#00ff88'
const GREEN_DARK = '#00cc66'

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
      sounds.play('coin', { playbackRate: 0.5 })
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
      {/* ZENTRIERT, KOMPAKT, HÖHER */}
      <GambaUi.Portal target="screen">
        <div
          style={{
            position: 'absolute',
            top: '48%', // Etwas höher als 50%
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Coin */}
          <div
            style={{
              width: '300px',
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'auto',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
            }}
          >
            <Canvas
              linear
              flat
              orthographic
              camera={{ zoom: 140, position: [0, 0, 100] }}
              style={{ borderRadius: '50%', background: 'transparent' }}
            >
              <React.Suspense fallback={null}>
                <group scale={0.68}>
                  <Coin result={resultIndex} flipping={flipping} />
                </group>
              </React.Suspense>
              <Effect color="white" />
              {flipping && <Effect color="white" />}
              {win && <Effect color={GREEN} />}
              <ambientLight intensity={2.5} />
              <directionalLight position={[0, 1, 1]} color="#ccc" />
            </Canvas>
          </div>

          {/* Buttons – kompakt, grün, direkt drunter */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              marginTop: '-18px', // Sehr eng an Coin
              pointerEvents: 'auto',
            }}
          >
            <GambaUi.WagerInput
              options={WAGER_OPTIONS}
              value={wager}
              onChange={setWager}
              style={{
                background: GREEN_DARK,
                color: 'white',
                borderRadius: '12px',
                fontWeight: 'bold',
              }}
            />

            <GambaUi.Button
              disabled={gamba.isPlaying || flipping}
              onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
              style={{
                background: GREEN,
                color: '#000',
                fontWeight: 'bold',
                borderRadius: '12px',
                padding: '10px 16px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img height="18" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} alt={side} />
                {side === 'heads' ? 'Heads' : 'Tails'}
              </div>
            </GambaUi.Button>

            <GambaUi.PlayButton
              onClick={play}
              disabled={gamba.isPlaying || flipping}
              style={{
                background: `linear-gradient(135deg, ${GREEN}, #00cc66)`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                padding: '14px 32px',
                borderRadius: '16px',
                boxShadow: '0 6px 12px rgba(0,255,136,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Flip
            </GambaUi.PlayButton>
          </div>
        </div>
      </GambaUi.Portal>

      {/* Controls leeren → kein schwarzer Balken */}
      <GambaUi.Portal target="controls">
        <div style={{ height: 0, overflow: 'hidden' }} />
      </GambaUi.Portal>
    </>
  )
}
