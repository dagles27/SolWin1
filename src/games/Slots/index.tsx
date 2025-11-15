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
      setGood(false)
      setRevealedSlots(0)
      await game.play({
        wager,
        bet,
      })
      sounds.play('play')
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
        {/* LEGENDARY WIN EFFECT – durchklickbar */}
        {good && (
          <div
            style={{
              pointerEvents: 'none',
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              userSelect: 'none',
            }}
          >
            <EffectTest src={combination[0].image} />
          </div>
        )}

        <GambaUi.Responsive>
          <StyledSlots>
            <div style={{ position: 'relative', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
              {/* HEADER – NOCH NÄHER ZU ITEMPREVIEW */}
              <img
                className="headerImage"
                src="/slot-neonfruits-banner.png"
                alt="Neon Fruits Banner"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 'none',
                  objectFit: 'cover',
                  borderRadius: '0 0 20px 20px',
                  marginTop: '-30px',
                  marginBottom: '-85px',         // ← NOCH STÄRKER nach unten → näher zu ItemPreview
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  zIndex: 1,
                }}
              />

              {/* Payout-Box – über Header */}
              <div
                className={`result-inline ${showResult ? 'animate' : ''}`}
                data-good={good}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  width: '100%',
                  maxWidth: '300px',
                  margin: '0 auto 8px',
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

              {/* ItemPreview – jetzt näher am Header */}
              <div style={{ width: '100%', marginBottom: '12px', position: 'relative', zIndex: 2 }}>
                <ItemPreview betArray={bet} />
              </div>

              {/* SLOTS + WAGER + SPIN */}
              <div className="slots-container">
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

                {/* WAGER + SPIN – MOBILE: 75%/25% */}
                <div className="wager-spin-row">
                  <GambaUi.WagerInput value={wager} onChange={setWager} />
                  <button
                    className="spin-btn-inline"
                    disabled={!isValid || spinning}
                    onClick={play}
                  >
                    {spinning ? 'SPINNING...' : 'SPIN'}
                  </button>
                </div>
              </div>
            </div>
          </StyledSlots>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      {/* STYLING – MOBILE: 75%/25% MIT !IMPORTANT + SPEZIFISCHER SELEKTOR */}
      <style jsx>{`
        .slots-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-top: 16px;
          padding: 16px;
          background: rgba(0,0,0,0.4);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .slots {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        /* BASE: Desktop – 60/40 */
        .wager-spin-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 400px;
        }

        .wager-spin-row :global(.wager-input) {
          flex: 1 1 60%;
          min-width: 0;
          height: 52px;
          font-size: 1rem;
          padding: 0 14px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          background: linear-gradient(135deg, rgba(74,0,224,0.3), rgba(142,45,226,0.3));
          color: #fff;
          box-shadow: 0 0 16px rgba(74,0,224,0.4);
          backdrop-filter: blur(10px);
        }

        .spin-btn-inline {
          flex: 1 1 40%;
          height: 52px;
          font-size: 1.05rem;
          font-weight: bold;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #f94d6a, #ff8e8e);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.2), 0 4px 16px rgba(255,107,107,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .spin-btn-inline::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .spin-btn-inline:hover:not(:disabled)::before { left: 100%; }
        .spin-btn-inline:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 0 2px rgba(255,255,255,0.3), 0 6px 24px rgba(255,107,107,0.7); }
        .spin-btn-inline:disabled { opacity: 0.6; cursor: not-allowed; background: linear-gradient(135deg, #666, #888); }

        /* MOBILE: 75%/25% – SPEZIFISCHER SELEKTOR + !IMPORTANT */
        @media (max-width: 768px) {
          .wager-spin-row :global(.wager-input) {
            flex: 1 1 75% !important;
            min-width: 0 !important;
          }
          .wager-spin-row .spin-btn-inline {
            flex: 1 1 25% !important;
            font-size: 0.9rem !important;
          }
        }

        /* STAPELN ERST AB 380PX */
        @media (max-width: 380px) {
          .wager-spin-row {
            flex-direction: column;
            gap: 10px;
          }
          .wager-spin-row :global(.wager-input),
          .wager-spin-row .spin-btn-inline {
            flex: 1 1 100% !important;
            width: 100% !important;
            height: 48px !important;
            font-size: 0.95rem !important;
          }
        }

        @keyframes neonPulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .result-inline.animate { animation: fadeInScale 0.4s ease forwards; }

        @media (min-width: 769px) { .result-inline { max-width: 300px !important; margin: 0 auto 8px !important; } }
        @media (max-width: 768px) { .result-inline { max-width: 100% !important; margin: 0 auto 8px !important; font-size: 0.95rem !important; padding: 8px 12px !important; } }
        @media (max-width: 480px) { .result-inline { font-size: 0.85rem !important; padding: 7px 10px !important; } }
      `}</style>
    </>
  )
}
