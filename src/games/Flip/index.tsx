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
    background: '#0d2618',
    color: 'white',
    borderRadius: '18px',
    fontWeight: '700',
    fontSize: '17px',
    height: '56px',
    border: '1px solid rgba(0,255,136,0.32)',
    boxShadow: '0 0 18px rgba(0,255,136,0.12) inset',
    transition: 'all 0.2s',
  }}
  hoverStyle={{
    boxShadow: '0 0 25px rgba(0,255,136,0.25) inset',
  }}
/>

              {/* Heads / Tails Toggle */}
              <GambaUi.Button
  disabled={gamba.isPlaying || flipping}
  onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
  style={{
    background: side === 'heads' ? '#00ff88' : '#0d2618',
    color: side === 'heads' ? '#001303' : 'white',
    borderRadius: '18px',
    fontWeight: '700',
    fontSize: '17px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: side === 'heads'
      ? '1px solid rgba(0,255,136,0.7)'
      : '1px solid rgba(0,255,136,0.25)',
    boxShadow: side === 'heads'
      ? '0 0 25px rgba(0,255,136,0.55), inset 0 0 8px rgba(255,255,255,0.12)'
      : '0 0 14px rgba(0,255,136,0.08) inset',
    transition: 'all 0.18s',
  }}
  hoverStyle={{
    boxShadow: side === 'heads'
      ? '0 0 32px rgba(0,255,160,0.7)'
      : '0 0 20px rgba(0,255,136,0.2) inset',
    transform: 'translateY(-3px)',
  }}
>
  <img height="24" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} alt={side} />
  {side.toUpperCase()}
</GambaUi.Button>

              {/* FLIP Button – jetzt exakt gleich hoch und direkt daneben */}
              <GambaUi.Button
  onClick={play}
  disabled={gamba.isPlaying || flipping}
  style={{
    background: `linear-gradient(135deg, #00ff88, #00dd77)`,
    color: '#001303',
    borderRadius: '18px',
    fontWeight: '900',
    fontSize: '22px',
    height: '60px',
    textTransform: 'uppercase',
    letterSpacing: '1.8px',
    boxShadow:
      '0 0 25px rgba(0,255,136,0.45), 0 8px 30px rgba(0,255,136,0.28), inset 0 0 12px rgba(255,255,255,0.12)',
    border: '1px solid rgba(0,255,136,0.45)',
    transition: 'all 0.18s ease-out',
  }}
  hoverStyle={{
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: '0 0 35px rgba(0,255,160,0.65), 0 12px 35px rgba(0,255,160,0.3)',
  }}
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

      {/* Kein Control-Balken mehr */}
    </>
  )
}