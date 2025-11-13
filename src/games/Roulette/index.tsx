import { computed } from '@preact/signals-react'
import { GambaUi, TokenValue, useCurrentPool, useCurrentToken, useSound, useUserBalance } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import styled from 'styled-components'
import { Chip } from './Chip'
import { StyledResults } from './Roulette.styles'
import { Table } from './Table'
import { CHIPS, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from './constants'
import { addResult, bet, clearChips, results, selectedChip, totalChipValue } from './signals'

// 🎨 Hintergrund Wrapper mit Roulette-Background
const BackgroundWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: url('/roulette-bg.png') center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: white;
  overflow: hidden;
  padding-top: 80px; /* 👈 Verschiebt Inhalt etwas nach unten, kannst du anpassen */
`

const ContentWrapper = styled.div`
  display: grid;
  gap: 20px;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  z-index: 2;
  margin-top: 100px; /* 👈 optional, falls du mehr Abstand zum oberen Rand willst */
`

function Results() {
  const _results = computed(() => [...results.value].reverse())
  return (
    <StyledResults>
      {_results.value.map((index, i) => (
        <div key={i}>{index + 1}</div>
      ))}
    </StyledResults>
  )
}

function Stats() {
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const balance = useUserBalance()
  const wager = totalChipValue.value * token.baseWager / 10_000
  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  return (
    <div style={{ textAlign: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>
        {balanceExceeded ? (
          <span style={{ color: '#ff0066' }}>TOO HIGH</span>
        ) : (
          <TokenValue amount={wager} />
        )}
        <div>Wager</div>
      </div>
      <div>
        {maxPayoutExceeded ? (
          <span style={{ color: '#ff0066' }}>TOO HIGH</span>
        ) : (
          <>
            <TokenValue amount={maxPayout} /> ({multiplier.toFixed(2)}x)
          </>
        )}
        <div>Potential win</div>
      </div>
    </div>
  )
}

export default function Roulette() {
  const game = GambaUi.useGame()
  const token = useCurrentToken()
  const pool = useCurrentPool()
  const balance = useUserBalance()
  const gamba = useGamba()

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  })

  const wager = totalChipValue.value * token.baseWager / 10_000
  const multiplier = Math.max(...bet.value)
  const maxPayout = multiplier * wager
  const maxPayoutExceeded = maxPayout > pool.maxPayout
  const balanceExceeded = wager > (balance.balance + balance.bonusBalance)

  const play = async () => {
    await game.play({
      bet: bet.value,
      wager,
    })
    sounds.play('play')
    const result = await game.result()
    addResult(result.resultIndex)
    sounds.play(result.payout > 0 ? 'win' : 'lose')
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <BackgroundWrapper>
            <ContentWrapper onContextMenu={(e) => e.preventDefault()}>
              <Stats />
              <Results />
              <Table />
            </ContentWrapper>
          </BackgroundWrapper>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <GambaUi.Select
          options={CHIPS}
          value={selectedChip.value}
          onChange={(value) => (selectedChip.value = value)}
          label={(value) => (
            <>
              <Chip value={value} /> = <TokenValue amount={token.baseWager * value} />
            </>
          )}
        />
        <GambaUi.Button disabled={!wager || gamba.isPlaying} onClick={clearChips}>
          Clear
        </GambaUi.Button>
        <GambaUi.PlayButton disabled={!wager || balanceExceeded || maxPayoutExceeded} onClick={play}>
          Spin
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
