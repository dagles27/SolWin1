import './style.css';  // ← MUSS OBEN STEHEN!
import { GameResult } from 'gamba-core-v2'
import { EffectTest, GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React, { useEffect, useRef } from 'react'
import { ItemPreview } from './ItemPreview'
import { Slot } from './Slot'
import { StyledSlots } from './Slots.styles'
import {
  FINAL_DELAY,
  LEGENDARY_THRESHOLD,
  NUM_SLOTS,
  REVEAL_SLOT_DELAY,
  SLOT_ITEMS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_REVEAL,
  SOUND_REVEAL_LEGENDARY,
  SOUND_SPIN,
  SOUND_WIN,
  SPIN_DELAY,
  SlotItem,
} from './constants'
import { generateBetArray, getSlotCombination } from './utils'

function Messages({ messages }: {messages: string[]}) {
  const [messageIndex, setMessageIndex] = React.useState(0)
  React.useEffect(
    () => {
      const timeout = setInterval(() => {
        setMessageIndex((x) => (x + 1) % messages.length)
      }, 2500)
      return () => clearInterval(timeout)
    },
    [messages],
  )
  return (
    <>
      {messages[messageIndex]}
    </>
  )
}

export default function Slots() {
  const game = GambaUi.useGame()
  const pool = useCurrentPool()
  const [spinning, setSpinning] = React.useState(false)
  const [result, setResult] = React.useState<GameResult>()
  const [good, setGood] = React.useState(false)
  const [revealedSlots, setRevealedSlots] = React.useState(0)
  const [wager, setWager] = useWagerInput()
  const [combination, setCombination] = React.useState(
    Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]),
  )
  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  })
 const [bet, setBet] = React.useState<number[]>([])

React.useEffect(() => {
  if (pool.maxPayout > 0 && wager > 0) {
    setBet(generateBetArray(pool.maxPayout, wager))
  } else {
    setBet([]) // Sicherer Fallback
  }
}, [pool.maxPayout, wager])
  const timeout = useRef<any>()

  const getIsValid = (betArray: number[]) => betArray.some((x) => x > 1)
  useEffect(
    () => {
      return () => {
        timeout.current && clearTimeout(timeout.current)
      }
    },
    [],
  )

  const revealSlot = (combination: SlotItem[], slot = 0) => {
    sounds.play('reveal', { playbackRate: 1.1 })

    const allSame = combination.slice(0, slot + 1).every((item, index, arr) => !index || item === arr[index - 1])

    if (combination[slot].multiplier >= LEGENDARY_THRESHOLD) {
      if (allSame) {
        sounds.play('revealLegendary')
      }
    }

    setRevealedSlots(slot + 1)

    if (slot < NUM_SLOTS - 1) {
      timeout.current = setTimeout(
        () => revealSlot(combination, slot + 1),
        REVEAL_SLOT_DELAY,
      )
    } else if (slot === NUM_SLOTS - 1) {
      sounds.sounds.spin.player.stop()
      timeout.current = setTimeout(() => {
        setSpinning(false)
        if (allSame) {
          setGood(true)
          sounds.play('win')
        } else {
          sounds.play('lose')
        }
      }, FINAL_DELAY)
    }
  }

const play = async () => {
  try {
    setSpinning(true)
    setResult(undefined)

    await game.play({
      wager,
      bet,
    })

    sounds.play('play')

    setRevealedSlots(0)
    setGood(false)

    const startTime = Date.now()

    sounds.play('spin', { playbackRate: .5 })

        const result = await game.result()

    const resultDelay = Date.now() - startTime
    const revealDelay = Math.max(0, SPIN_DELAY - resultDelay)

    // NEU: Zuerst bet berechnen!
    const newBet = generateBetArray(pool.maxPayout, wager)
    setBet(newBet)

    // Dann mit newBet arbeiten!
    const combination = getSlotCombination(NUM_SLOTS, result.multiplier, newBet)
    setCombination(combination)
    setResult(result)

    timeout.current = setTimeout(() => revealSlot(combination), revealDelay)
  } catch (err) {
    setSpinning(false)
    setRevealedSlots(NUM_SLOTS)
    throw err
  }
}

  return (
    <>
      <GambaUi.Portal target="screen">
        {good && <EffectTest src={combination[0].image} />}
        <GambaUi.Responsive>
          <StyledSlots>
            <div>
              {/* Banner HIER – über den 6 Boxen (vor ItemPreview) */}
              <img 
                className="headerImage" 
                src="/slot-neonfruits-banner.png"  
                alt="Neon Fruits Banner" 
              />
              <ItemPreview betArray={bet} />  {/* Die 6 Boxen */}
              <div className="slots">
                {combination.map((slot, i) => (
                  <Slot
                    key={i}
                    index={i}
                    revealed={revealedSlots > i}
                    item={slot}
                    good={good}
                  />
                ))}
              </div>
{/* RESULT + SPIN BUTTON NEBENEINANDER */}
<div className="neon-result-container">
  <div className="neon-result-box" data-good={good}>
    {spinning ? (
      <Messages messages={['Spinning!', 'Good luck']} />
    ) : result ? (
      <>
        Payout: <TokenValue mint={result.token} amount={result.payout} />
      </>
    ) : isValid ? (
      <Messages messages={['SPIN ME!', 'LETS WIN!']} />
    ) : (
      <>Choose a lower wager!</>
    )}
  </div>

  <button
  className="neon-spin-btn-inline"
  disabled={!getIsValid(bet) || spinning}
  onClick={play}
>
    {spinning ? 'SPINNING...' : 'SPIN'}
  </button>
</div>
            </div>
          </StyledSlots>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
       {/* MANUELLER EINGABE */}
       <GambaUi.WagerInput value={wager} onChange={setWager} />
  
  {/* SPARSAME x0.5 / x2 BUTTONS */}
  <div style={{display: 'flex', gap: '10px', justifyContent: 'center', margin: '10px 0'}}>
    <button 
      className="multi-btn" 
      onClick={() => setWager(wager * 0.5)}
    >
      x0.5
    </button>
    <button 
      className="multi-btn green" 
      onClick={() => setWager(wager * 2)}
    >
      x2
    </button>
    </div>
</GambaUi.Portal>
    </>
  )
}
