import React, { useState } from 'react'
import { GambaUi, useGame, useSound, useWagerInput } from 'gamba-react-ui-v2'
import styled from 'styled-components'

const FlipContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  text-align: center;
`

export default function Flip() {
  const game = useGame()
  const sound = useSound()
  const wager = useWagerInput()

  const [result, setResult] = useState<string | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)

  const flipCoin = async (side: string) => {
    try {
      setIsFlipping(true)
      sound.play('spin')
      const outcome = await game.play({
        wager: wager.value,
        bet: side === 'heads' ? 0 : 1,
      })
      setResult(outcome === 0 ? 'heads' : 'tails')
      sound.play(outcome === 0 ? 'win' : 'lose')
    } catch (err) {
      console.error(err)
    } finally {
      setIsFlipping(false)
    }
  }

  return (
    <FlipContainer>
      <div>
        <img
          src={
            result === null
              ? '/coin.png'
              : result === 'heads'
              ? '/coin-heads.png'
              : '/coin-tails.png'
          }
          alt="Coin"
          style={{
            width: '120px',
            height: '120px',
            transition: 'transform 0.5s',
            transform: isFlipping ? 'rotateY(720deg)' : 'none',
          }}
        />
      </div>

      {/* Controls leeren → kein schwarzer Balken */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <GambaUi.Button disabled={isFlipping} onClick={() => flipCoin('heads')}>
          Heads
        </GambaUi.Button>
        <GambaUi.Button disabled={isFlipping} onClick={() => flipCoin('tails')}>
          Tails
        </GambaUi.Button>
      </div>

      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager.value} onChange={wager.setValue} />
      </GambaUi.Portal>
    </FlipContainer>
  )
}
