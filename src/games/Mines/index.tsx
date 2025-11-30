// src/games/Mines/index.tsx
import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  GRID_SIZE,
  MINE_SELECT,
  PITCH_INCREASE_FACTOR,
  SOUND_EXPLODE,
  SOUND_FINISH,
  SOUND_STEP,
  SOUND_TICK,
  SOUND_WIN,
} from './constants'
import { generateGrid, revealAllMines, revealGold } from './utils'

// -----------------------------
// Theme / Colors (Sol-Win Neon Green)
// -----------------------------
const NEON = '#00ff88'
const NEON_DARK = '#00cc66'
const BG = '#050807'
const CARD_BG = 'linear-gradient(180deg, rgba(5,10,7,0.85), rgba(8,12,10,0.95))'
const ACCENT = 'rgba(0,255,136,0.12)'
const TEXT = '#e9fff4'
const MUTED = '#9fbfb0'

// -----------------------------
// Animations
// -----------------------------
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.9 }
  50% { transform: scale(1.06); opacity: 1 }
  100% { transform: scale(1); opacity: 0.9 }
`

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(0,255,136,0.0) }
  50% { box-shadow: 0 0 20px rgba(0,255,136,0.3) }
  100% { box-shadow: 0 0 0 rgba(0,255,136,0.0) }
`

const explode = keyframes`
  0% { transform: scale(1); opacity: 1 }
  60% { transform: scale(1.5); opacity: 1 }
  100% { transform: scale(1.2); opacity: 0 }
`

// -----------------------------
// Styled components
// -----------------------------
const Screen = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
`

const Container2 = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  gap: 18px;
  align-items: start;
  color: ${TEXT};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${CARD_BG};
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(0,255,136,0.06);
  box-shadow: 0 10px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,255,136,0.02);
`

const Levels = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: fit-content;
  min-height: 240px;
  padding: 14px;
  background: linear-gradient(180deg, rgba(3,6,5,0.9), rgba(8,12,10,0.95));
`

const LevelRow = styled.div<{ $active?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  color: ${TEXT};
  transition: all 0.18s;

  ${(p) =>
    p.$active
      ? css`
          background: linear-gradient(90deg, rgba(0,255,136,0.06), rgba(0,255,136,0.03));
          border: 1px solid rgba(0,255,136,0.18);
          box-shadow: 0 6px 18px rgba(0,255,136,0.06);
          transform: translateX(2px);
          animation: ${pulse} 2.2s ease-in-out infinite;
        `
      : css`
          background: transparent;
          border: 1px solid rgba(255,255,255,0.02);
        `}
`

const StatusBar = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${TEXT};
  border-radius: 12px;
`

const CenterCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const GridEl = styled.div`
  width: 100%;
  display: grid;
  gap: 10px;
`

type CellStatus = 'hidden' | 'gold' | 'mine' | 'revealed'
const CellButton = styled.button<{ status: CellStatus; $selected?: boolean }>`
  width: 100%;
  height: 64px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: visible;
  outline: none;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  font-size:14px;
  color: ${TEXT};
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;

  ${(p) =>
    p.status === 'hidden' &&
    css`
      background: linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.25));
      border: 1px solid rgba(255,255,255,0.03);
      box-shadow: 0 6px 18px rgba(0,0,0,0.6), inset 0 -6px 18px rgba(0,0,0,0.3);
      &:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,255,136,0.06); }
    `}

  ${(p) =>
    p.status === 'gold' &&
    css`
      background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.06);
      color: #06120a;
      box-shadow: 0 8px 28px rgba(255,220,120,0.08), 0 0 18px rgba(255,220,120,0.05) inset;
      animation: ${glow} 2.2s ease-in-out infinite;
    `}

  ${(p) =>
    p.status === 'mine' &&
    css`
      background: radial-gradient(circle at 30% 30%, rgba(255,20,20,0.08), rgba(0,0,0,0.5));
      border: 1px solid rgba(255,80,80,0.12);
      box-shadow: 0 12px 30px rgba(255,40,40,0.06);
      color: #ffd6d6;
      &::after {
        content: '';
        position:absolute;
        width:110%;
        height:110%;
        left:-5%;
        top:-5%;
        border-radius:12px;
        animation: ${explode} 700ms ease-out both;
        background: radial-gradient(circle, rgba(255,120,80,0.12), transparent 45%);
        mix-blend-mode: screen;
        pointer-events:none;
      }
    `}

  ${(p) =>
    p.$selected &&
    css`
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 18px 40px rgba(0,255,136,0.12);
    `}
`

const Controls = styled.div`
  display:flex;
  flex-direction:column;
  gap:12px;
  align-items:stretch;
`

const Label = styled.div`
  color:${MUTED};
  font-size:12px;
  font-weight:700;
  margin-bottom:6px;
`

const ControlRow = styled.div`
  display:flex;
  gap:10px;
  align-items:center;
`

const CustomButton = styled.button<{ $primary?: boolean }>`
  cursor:pointer;
  padding:12px 18px;
  border-radius:12px;
  border: 1px solid rgba(255,255,255,0.04);
  background: ${(p) => (p.$primary ? `linear-gradient(135deg, ${NEON}, ${NEON_DARK})` : 'rgba(12,18,16,0.8)')};
  color: ${(p) => (p.$primary ? '#022611' : TEXT)};
  font-weight:800;
  font-size:15px;
  box-shadow: ${(p) =>
    p.$primary
      ? `0 6px 30px rgba(0,255,136,0.25), inset 0 0 12px rgba(255,255,255,0.06)`
      : '0 8px 24px rgba(0,0,0,0.6)'};
  transition: transform 0.14s ease, box-shadow 0.14s ease;
  &:hover { transform: translateY(-3px); }
  &:disabled { opacity:0.5; cursor:not-allowed; transform:none; box-shadow:none; }
`

const RightCard = styled(Card)`
  min-height: 240px;
  display:flex;
  flex-direction:column;
  gap:12px;
  padding:16px;
`

// -----------------------------
// Helper: columns (attempt square grid)
const calcCols = (size: number) => {
  const root = Math.round(Math.sqrt(size))
  return root * root === size ? root : Math.ceil(Math.sqrt(size))
}

// -----------------------------
// Component (logic unchanged, UI replaced)
// -----------------------------
function Mines() {
  const game = GambaUi.useGame()
  const sounds = useSound({
    tick: SOUND_TICK,
    win: SOUND_WIN,
    finish: SOUND_FINISH,
    step: SOUND_STEP,
    explode: SOUND_EXPLODE,
  })
  const pool = useCurrentPool()

  const [grid, setGrid] = React.useState(generateGrid(GRID_SIZE))
  const [currentLevel, setLevel] = React.useState(0)
  const [selected, setSelected] = React.useState(-1)
  const [totalGain, setTotalGain] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [started, setStarted] = React.useState(false)

  const [initialWager, setInitialWager] = useWagerInput()
  const [mines, setMines] = React.useState(MINE_SELECT[2])

  const getMultiplierForLevel = (level: number) => {
    const remainingCells = GRID_SIZE - level
    return Number(BigInt(remainingCells * BPS_PER_WHOLE) / BigInt(remainingCells - mines)) / BPS_PER_WHOLE
  }

  const levels = React.useMemo(
    () => {
      const totalLevels = GRID_SIZE - mines
      let cumProfit = 0
      let previousBalance = initialWager

      return Array.from({ length: totalLevels }).map((_, level) => {
        const wager = level === 0 ? initialWager : previousBalance
        const multiplier = getMultiplierForLevel(level)
        const remainingCells = GRID_SIZE - level
        const bet = Array.from({ length: remainingCells }, (_, i) => (i < mines ? 0 : multiplier))

        const profit = wager * (multiplier - 1)
        cumProfit += profit
        const balance = wager + profit

        previousBalance = balance
        return { bet, wager, profit, cumProfit, balance }
      }).filter(x => Math.max(...x.bet) * x.wager < pool.maxPayout)
    },
    [initialWager, mines, pool.maxPayout],
  )

  const remainingCells = GRID_SIZE - currentLevel
  const gameFinished = remainingCells <= mines
  const canPlay = started && !loading && !gameFinished

  const { wager, bet } = levels[currentLevel] ?? {}

  const start = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(true)
    sounds.play('tick') // subtle starter tick
    setTimeout(() => sounds.sounds.tick.player?.stop?.(), 120)
  }

  const endGame = async () => {
    sounds.play('finish')
    reset()
  }

  const reset = () => {
    setGrid(generateGrid(GRID_SIZE))
    setLoading(false)
    setLevel(0)
    setTotalGain(0)
    setStarted(false)
  }

  const play = async (cellIndex: number) => {
    setLoading(true)
    setSelected(cellIndex)
    try {
      sounds.sounds.step.player.loop = true
      sounds.play('step', {})
      sounds.sounds.tick.player.loop = true
      sounds.play('tick', {})
      await game.play({
        bet,
        wager,
        metadata: [currentLevel],
      })

      const result = await game.result()

      sounds.sounds.tick.player.stop?.()

      if (result.payout === 0) {
        setStarted(false)
        setGrid(revealAllMines(grid, cellIndex, mines))
        sounds.play('explode')
        return
      }

      const nextLevel = currentLevel + 1
      setLevel(nextLevel)
      setGrid(revealGold(grid, cellIndex, result.profit))
      setTotalGain(result.payout)

      if (nextLevel < GRID_SIZE - mines) {
        sounds.play('win', { playbackRate: Math.pow(PITCH_INCREASE_FACTOR, currentLevel) })
      } else {
        sounds.play('win', { playbackRate: 0.95 })
        sounds.play('finish')
      }
    } finally {
      setLoading(false)
      setSelected(-1)
      sounds.sounds.tick.player.stop?.()
      sounds.sounds.step.player.stop?.()
    }
  }

  // grid layout
  const cols = calcCols(GRID_SIZE)

  return (
    <>
      <GambaUi.Portal target="screen">
        <Screen>
          <Container2>
            {/* LEFT: Levels */}
            <Levels>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 900, color: NEON }}>LEVELS</div>
                <div style={{ color: MUTED, fontSize: 13 }}>{levels.length} steps</div>
              </div>

              {levels.map(({ cumProfit }, i) => (
                <LevelRow key={i} $active={currentLevel === i}>
                  <div>LEVEL {i + 1}</div>
                  <div style={{ color: currentLevel === i ? '#bfffe0' : MUTED }}>
                    <TokenValue amount={cumProfit} />
                  </div>
                </LevelRow>
              ))}
            </Levels>

            {/* CENTER: Grid + Status */}
            <CenterCard>
              <StatusBar>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, color: NEON }}>Mines</div>
                  <div style={{ color: MUTED }}>{mines}</div>
                  <div style={{ marginLeft: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', fontWeight:700 }}>
                    <TokenValue amount={initialWager} />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {totalGain > 0 ? (
                    <>
                      <div style={{ color: NEON, fontWeight: 900 }}>+<TokenValue amount={totalGain} /></div>
                      <div style={{ fontSize: 12, color: MUTED }}>+{Math.round(totalGain / initialWager * 100 - 100)}%</div>
                    </>
                  ) : (
                    <div style={{ color: MUTED }}>Select a tile</div>
                  )}
                </div>
              </StatusBar>

              <GridEl style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: '100%' }}>
                {grid.map((cell, index) => (
                  <CellButton
                    key={index}
                    status={cell.status as CellStatus}
                    $selected={selected === index}
                    onClick={() => play(index)}
                    disabled={!canPlay || cell.status !== 'hidden' || loading}
                    title={cell.status === 'hidden' ? 'Pick' : cell.status}
                  >
                    {/* content */}
                    {cell.status === 'hidden' && <div style={{ fontSize: 12, color: '#7fbfa8' }}>?</div>}
                    {cell.status === 'gold' && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #fff7d9, #ffd88a)',
                          padding: '4px 8px',
                          borderRadius: 8,
                          boxShadow: '0 6px 18px rgba(255,200,120,0.14)'
                        }}>
                          +<TokenValue amount={cell.profit} />
                        </div>
                      </div>
                    )}
                    {cell.status === 'mine' && <div style={{ fontSize: 20 }}>💥</div>}
                    {cell.status === 'revealed' && <div style={{ fontSize: 12, color: MUTED }}>X</div>}
                  </CellButton>
                ))}
              </GridEl>
            </CenterCard>

            {/* RIGHT: Controls */}
            <RightCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 900, color: NEON }}>Controls</div>
                <div style={{ color: MUTED, fontSize: 13 }}>Sol-Win</div>
              </div>

              <Controls>
                <div>
                  <Label>Wager</Label>
                  <GambaUi.WagerInput value={initialWager} onChange={setInitialWager} />
                </div>

                <div>
                  <Label>Mines</Label>
                  <GambaUi.Select
                    options={MINE_SELECT}
                    value={mines}
                    onChange={setMines}
                    label={(m) => <>{m} mines</>}
                  />
                </div>

                {!started ? (
                  <CustomButton $primary onClick={() => start()} disabled={!initialWager || loading}>
                    Start
                  </CustomButton>
                ) : (
                  <CustomButton onClick={() => endGame()}>
                    {totalGain > 0 ? 'Finish' : 'Reset'}
                  </CustomButton>
                )}

                <div style={{ marginTop: 8, color: MUTED, fontSize: 13 }}>
                  Tip: Choose tiles to collect gold. Avoid mines. Each step increases payout.
                </div>
              </Controls>
            </RightCard>
          </Container2>
        </Screen>
      </GambaUi.Portal>
    </>
  )
}

export default Mines