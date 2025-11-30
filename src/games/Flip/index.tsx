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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          {/* Card */}
          <div
            style={{
              background: BG,
              borderRadius: '28px',
              padding: '30px 24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.25)',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            {/* 3D Coin */}
            <div style={{ marginBottom: '28px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.7)' }}>
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

            {/* WAGER + SIDE + FLIP in einer perfekten Zeile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
              {/* Wager Input */}
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

              {/* Heads / Tails Toggle */}
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
                  transition: 'all 0.25s',
                }}
              >
                <img height="24" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} alt={side} />
                {side.toUpperCase()}
              </GambaUi.Button>

              {/* FLIP Button – jetzt exakt gleich hoch und direkt daneben */}
              <GambaUi.PlayButton
  noPortal
  onClick={play}
  disabled={gamba.isPlaying || flipping}
  style={{
    background: `linear-gradient(135deg, ${GREEN}, #00ffaa)`,
    color: '#000',
    borderRadius: '18px',
    fontWeight: '900',
    fontSize: '20px',
    height: '56px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    boxShadow: '0 8px 25px rgba(0,255,136,0.5)',
    transition: 'transform 0.15s',
  }}
  hoverStyle={{ transform: 'translateY(-4px) scale(1.05)' }}
>
  FLIP
</GambaUi.PlayButton>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', color: '#88ffaa', fontSize: '15px', fontWeight: '600' }}>
              2× Payout · 50.0% Win Chance
            </div>
          </div>
        </div>
      </GambaUi.Portal>

      {/* Kein Control-Balken mehr */}
    </>
  )
}