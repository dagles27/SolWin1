import './style.css'; // ← MUSS OBEN STEHEN!
import { GameResult } from 'gamba-core-v2'
import { EffectTest, GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import React, { useEffect, useRef, useState } from 'react'
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
  const [showResult, setShowResult] = useState(false)

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  })
  const bet = React.useMemo(
    () => generateBetArray(pool.maxPayout, wager),
    [pool.maxPayout, wager],
  )
  const timeout = useRef<any>()
  const isValid = bet.some((x) => x > 1)

  useEffect(
    () => {
      return () => {
        timeout.current && clearTimeout(timeout.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (spinning) {
      setShowResult(false)
    }
  }, [spinning])

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
        setTimeout(() => setShowResult(true), 100)
      }, FINAL_DELAY)
    }
  }

  const play = async () => {
    try {
      setSpinning(true)
      setResult(undefined)
      setShowResult(false)
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
      const combination = getSlotCombination(NUM_SLOTS, result.multiplier, bet)
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
              {/* Banner */}
              <img
                className="headerImage"
                src="/slot-neonfruits-banner.png"
                alt="Neon Fruits Banner"
              />

              {/* ItemPreview + Result-Box in einer Zeile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                {/* ItemPreview (6 Boxen) */}
                <div style={{ flex: 1 }}>
                  <ItemPreview betArray={bet} />
                </div>

                {/* Payout-Box – kompakt, länglich, stylisch, einzeilig */}
                <div
                  className={`result-inline ${showResult ? 'animate' : ''}`}
                  data-good={good}
                  style={{
                    minWidth: '180px',
                    maxWidth: '220px',
                    padding: '8px 14px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    background: good
                      ? 'linear-gradient(135deg, #00ff9d, #00b86e)'
                      : 'linear-gradient(135deg, #4a00e0, #8e2de2)',
                    color: '#fff',
                    boxShadow: '0 0 0 2px rgba(255,255,255,0.3), 0 0 12px rgba(0,0,0,0.4)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    opacity: showResult ? 1 : 0,
                    transform: showResult ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {/* Neon-Border Effekt */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '10px',
                      padding: '2px',
                      background: good
                        ? 'linear-gradient(45deg, #00ff9d, #00b86e, #00ff9d)'
                        : 'linear-gradient(45deg, #8e2de2, #4a00e0, #8e2de2)',
                      mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMaskComposite: 'destination-out',
                      pointerEvents: 'none',
                      animation: good ? 'neonPulse 1.8s infinite' : 'none',
                    }}
                  />

                  {/* Inhalt – alles in einer Zeile */}
                  {spinning ? (
                    <Messages messages={['Spinning!', 'Good luck']} />
                  ) : result ? (
                    <>
                      Payout: <TokenValue mint={result.token} amount={result.payout} />
                    </>
                  ) : isValid ? (
                    <Messages messages={['SPIN ME!', 'LETS WIN!']} />
                  ) : (
                    <>❌ Lower wager!</>
                  )}
                </div>
              </div>

              {/* Slots */}
              <div className="slots" style={{ marginTop: '20px' }}>
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
            </div>
          </StyledSlots>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', margin: '10px 0'}}>
          <button className="multi-btn" onClick={() => setWager(wager * 0.5)}>x0.5</button>
          <button className="multi-btn green" onClick={() => setWager(wager * 2)}>x2</button>
        </div>
        <button
          className="spin-btn"
          disabled={!isValid || spinning}
          onClick={play}
        >
          {spinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </GambaUi.Portal>

      {/* Animationen & Mobile-Optimierung */}
      <style jsx>{`
        @keyframes neonPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .result-inline.animate {
          animation: fadeInScale 0.4s ease forwards;
        }

        @media (max-width: 640px) {
          .result-inline {
            min-width: 140px !important;
            max-width: 180px !important;
            font-size: 0.85rem !important;
            padding: 6px 10px !important;
          }
          [data-good="true"] .result-inline {
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="display: flex"][style*="gap: 12px"] {
            flex-direction: column;
            align-items: stretch;
          }
          div[style*="flex: 1"] {
            order: 2;
          }
          .result-inline {
            order: 1;
            max-width: 100% !important;
            min-width: auto !important;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </>
  )
}
