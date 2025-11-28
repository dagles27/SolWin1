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

// Dein SOL-WIN Grün
const GREEN = '#00ff88'
const GREEN_DARK = '#00cc66'
const BG_DARK = '#0a1a0f'

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
      {/* Hauptbereich – alles schön kompakt zentriert */}
      <GambaUi.Portal target="screen">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            pointerEvents: 'none',
          }}
        >
          {/* Card-Container für besseres Grouping & Schatten */}
          <div
            style={{
              background: BG_DARK,
              borderRadius: '24px',
              padding: '24px 20px 30px',
              boxShadow: '0 20px 40px rgba(0, 255, 136, 0.15), inset 0 0 30px rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              pointerEvents: 'auto',
              maxWidth: '380px',
              width: '100%',
            }}
          >
            {/* 3D Coin – größer & zentral */}
            <div style={{ marginBottom: '20px', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
              <Canvas
                linear
                flat
                orthographic
                camera={{ zoom: 160, position: [0, 0, 100] }}
                style={{ borderRadius: '50%', width: '100%', height: '320px' }}
              >
                <React.Suspense fallback={null}>
                  <group scale={0.75}>
                    <Coin result={resultIndex} flipping={flipping} />
                  </group>
                </React.Suspense>
                <Effect color="white" />
                {flipping && <Effect color="white" />}
                {win && <Effect color={GREEN} />}
                <ambientLight intensity={3} />
                <directionalLight position={[0, 1, 1]} intensity={1.5} color="#fff" />
              </Canvas>
            </div>

            {/* Alles in einer Zeile: Wager + Side + Play */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Wager */}
              <GambaUi.WagerInput
                options={WAGER_OPTIONS}
                value={wager}
                onChange={setWager}
                style={{
                  background: GREEN_DARK,
                  color: 'white',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  minWidth: '110px',
                  height: '52px',
                  fontSize: '16px',
                }}
              />

              {/* Heads / Tails Toggle */}
              <GambaUi.Button
                disabled={gamba.isPlaying || flipping}
                onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
                style={{
                  background: side === 'heads' ? GREEN : GREEN_DARK,
                  color: side === 'heads' ? '#000' : '#fff',
                  fontWeight: 'bold',
                  borderRadius: '16px',
                  padding: '0 20px',
                  height: '52px',
                  minWidth: '120px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: side === 'heads' ? '0 0 20px rgba(0,255,136,0.6)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <img height="22" src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS} alt={side} />
                {side === 'heads' ? 'Heads' : 'Tails'}
              </GambaUi.Button>

              {/* Play Button – jetzt in der gleichen Zeile */}
              <GambaUi.PlayButton
                onClick={play}
                disabled={gamba.isPlaying || flipping}
                style={{
                  background: `linear-gradient(135deg, ${GREEN}, #00ffaa)`,
                  color: '#000',
                  fontWeight: '900',
                  fontSize: '20px',
                  height: '52px',
                  minWidth: '140px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,255,136,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  transition: 'transform 0.1s',
                }}
                hoverStyle={{ transform: 'translateY(-3px) scale(1.03)' }}
              >
                FLIP
              </GambaUi.PlayButton>
            </div>

            {/* Optional: Multiplier & Chance Anzeige */}
            <div style={{ textAlign: 'center', marginTop: '16px', color: '#aaa', fontSize: '14px' }}>
              2x Payout • 49.5% Chance
            </div>
          </div>
        </div>
      </GambaUi.Portal>

      {/* Entfernt den standard schwarzen Control-Balken komplett */}
      <GambaUi.Portal target="controls">
        <div style={{ height: 0, overflow: 'hidden', padding: 0, margin: 0 }} />
      </GambaUi.Portal>
    </>
  )
}