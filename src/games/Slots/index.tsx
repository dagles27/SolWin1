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

  // NEU: Auto-reduce wager nach Gewinn, wenn not valid
  React.useEffect(() => {
    const currentBet = generateBetArray(pool.maxPayout, wager)
    if (!getIsValid(currentBet) && wager > 0.01) {
      setWager(wager * 0.5)  // Reduziere wager um 50%, bis valid
    } else {
      setBet(currentBet)  // Setze bet nur, wenn valid
    }
  }, [pool.maxPayout])

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

      const newBet = generateBetArray(pool.maxPayout, wager)
      setBet(newBet)  // ← Sofort State aktualisieren!

      await game.play({
        wager,
        bet: newBet,
      })

      sounds.play('play')

      setRevealedSlots(0)
      setGood(false)

      const startTime = Date.now()

      sounds.play('spin', { playbackRate: .5 })

      const result = await game.result()

      const resultDelay = Date.now() - startTime
      const revealDelay = Math.max(0, SPIN_DELAY - resultDelay)

// newBet wurde schon vorher berechnet!
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


