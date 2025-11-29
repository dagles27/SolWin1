import './style.css' // ← MUSS OBEN STEHEN!
import { GambaUi, useSound, useWager } from 'gamba-react-ui-v2'
import React from 'react'
import coinHeads from './heads.png'
import coinTails from './tails.png'
import { FlipResult } from 'gamba-core-v2'
import { SOUND_FLIP, SOUND_HEADS, SOUND_TAILS } from './constants'

const SIDES = [
  { name: 'Heads', image: coinHeads, sound: SOUND_HEADS },
  { name: 'Tails', image: coinTails, sound: SOUND_TAILS },
]

export default function Flip() {
  const [side, setSide] = React.useState(0)
  const [flipping, setFlipping] = React.useState(false)
  const wager = useWager()
  const sounds = useSound({ flip: SOUND_FLIP })
  const game = GambaUi.useGame()

  const play = async () => {
    try {
      setFlipping(true)
      sounds.play('flip', { playbackRate: 0.8 })
      await game.play({ bet: [wager / 2, wager / 2], wager })
      const result = await game.result<FlipResult>()
      const winner = result.resultIndex
      setSide(winner)
      sounds.play(SIDES[winner].sound)
    } finally {
      setFlipping(false)
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
            {/* Coin Display */}
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={SIDES[side].image}
                style={{
                  maxHeight: '60%',
                  transform: flipping ? 'rotateY(720deg)' : 'none',
                  transition: 'transform 1.5s ease',
                }}
              />
            </div>

            {/* KOMPAKTE CONTROLS – Wager + Heads/Tails + FLIP in einer Zeile */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '0 10px',
            }}>
              <GambaUi.WagerInput />

              <div style={{ display: 'flex', gap: '10px' }}>
                {SIDES.map((s, i) => (
                  <GambaUi.Button key={i} selected={side === i} onClick={() => setSide(i)}>
                    {s.name}
                  </GambaUi.Button>
                ))}

                {/* DER NEUE FLIP BUTTON – groß, neon, direkt hier! */}
                <GambaUi.PlayButton
                  size="large"
                  text={flipping ? 'FLIPPING...' : 'FLIP'}
                  onClick={play}
                  disabled={flipping}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ff6b6b, #f94d6a)',
                    boxShadow: '0 0 30px rgba(255, 107, 107, 0.8)',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                />
              </div>
            </div>
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        {/* LEER – wir brauchen keine extra Controls mehr */}
      </GambaUi.Portal>
    </>
  )
}
