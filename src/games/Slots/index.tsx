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

              {/* Payout-Box: Desktop = über ItemPreview, eng */}
              <div
                className={`result-inline ${showResult ? 'animate' : ''}`}
                data-good={good}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  margin: '8px auto 4px',
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

                {spinning ? (
                  <Messages messages={['Spinning!', 'Good luck']} />
                ) : result ? (
                  <>
                    Payout: <TokenValue mint={result.token} amount={result.payout} />
                  </>
                ) : isValid ? (
                  <Messages messages={['SPIN ME!', 'LETS WIN!']} />
                ) : (
                  <>Lower wager!</>
                )}
              </div>

              {/* ItemPreview */}
              <div style={{ width: '100%' }}>
                <ItemPreview betArray={bet} />
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

      {/* MINIMALISTISCHE CONTROLS: NUR WAGER INPUT + SPIN BUTTON */}
      <GambaUi.Portal target="controls">
        <div className="controls-container">
          {/* Wager Input – mit integrierten x0.5 / x2 Buttons */}
          <GambaUi.WagerInput value={wager} onChange={setWager} />

          {/* SPIN BUTTON – direkt darunter, volle Breite */}
          <button
            className="spin-btn"
            disabled={!isValid || spinning}
            onClick={play}
          >
            {spinning ? 'SPINNING...' : 'SPIN'}
          </button>
        </div>
      </GambaUi.Portal>

      {/* STYLING: KOMPAKT, EINHEITLICH, SOL-WIN OPTIK */}
      <style jsx>{`
        .controls-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0 16px;
          max-width: 100%;
        }

        /* Wager Input – nutzt bereits eingebaute x0.5/x2 Buttons */
        .controls-container :global(.wager-input) {
          height: 48px;
          font-size: 1rem;
          padding: 0 12px;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.3);
          color: #fff;
          box-shadow: 0 0 8px rgba(0,0,0,0.3);
        }

        /* Integrierte Multiplikator-Buttons im Wager Input */
        .controls-container :global(.wager-input button) {
          width: 44px;
          height: 36px;
          font-size: 0.85rem;
          font-weight: bold;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .controls-container :global(.wager-input button:first-child) {
          background: linear-gradient(135deg, #6a11cb, #2575fc);
        }

        .controls-container :global(.wager-input button:last-child) {
          background: linear-gradient(135deg, #00b09b, #96c93d);
        }

        .controls-container :global(.wager-input button:hover) {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        }

        /* SPIN BUTTON – groß, auffällig, zentriert */
        .spin-btn {
          height: 56px;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #f94d6a);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255,107,107,0.4);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .spin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255,107,107,0.6);
        }

        .spin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile: Stapeln bei kleinem Bildschirm */
        @media (max-width: 480px) {
          .controls-container :global(.wager-input) {
            height: 44px;
            font-size: 0.95rem;
          }
          .spin-btn {
            height: 52px;
            font-size: 1.1rem;
          }
        }

        /* Animationen */
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

        @media (min-width: 769px) {
          .result-inline {
            max-width: 300px !important;
            margin: 8px auto 4px !important;
          }
        }

        @media (max-width: 768px) {
          .result-inline {
            max-width: 100% !important;
            margin: 12px auto 8px !important;
            font-size: 0.95rem !important;
            padding: 8px 12px !important;
          }
        }

        @media (max-width: 480px) {
          .result-inline {
            font-size: 0.85rem !important;
            padding: 7px 10px !important;
          }
        }
      `}</style>
    </>
  )
}
