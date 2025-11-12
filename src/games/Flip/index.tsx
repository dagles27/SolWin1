import { Canvas } from '@react-three/fiber'
import { GambaUi, useSound } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { Coin, TEXTURE_HEADS, TEXTURE_TAILS } from './Coin'
import { Effect } from './Effect'

import SOUND_COIN from './coin.mp3'
import SOUND_LOSE from './lose.mp3'
import SOUND_WIN from './win.mp3'

const SIDES = {
  heads: [2, 0],
  tails: [0, 2],
}
const WAGER_OPTIONS = [1, 5, 10, 50, 100]

type Side = keyof typeof SIDES

function Flip() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [flipping, setFlipping] = React.useState(false)
  const [win, setWin] = React.useState(false)
  const [resultIndex, setResultIndex] = React.useState(0)
  const [side, setSide] = React.useState<Side>('heads')
  const [wager, setWager] = React.useState(WAGER_OPTIONS[0])

  const sounds = useSound({
    coin: SOUND_COIN,
    win: SOUND_WIN,
    lose: SOUND_LOSE,
  })

  const play = async () => {
    try {
      setWin(false)
      setFlipping(true)

      sounds.play('coin', { playbackRate: 0.5 })

      await game.play({
        bet: SIDES[side],
        wager,
        metadata: [side],
      })

      sounds.play('coin')

      const result = await game.result()
      const win = result.payout > 0

      setResultIndex(result.resultIndex)
      setWin(win)

      if (win) {
        sounds.play('win')
      } else {
        sounds.play('lose')
      }
    } finally {
      setFlipping(false)
    }
  }

  return (
    <>
      {/* 🪙 Coin-Bereich */}
      <GambaUi.Portal target="screen">
  <div
    style={{
      width: '260px',                // 👈 kleinerer Container
      height: '260px',               // 👈 Coin-Bereich reduziert
      margin: '40px auto 0 auto',    // 👈 oben etwas Abstand, unten automatisch
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',          // 👈 Coin exakt mittig
      position: 'relative',
      borderRadius: '12px',
      boxShadow: '0 0 20px rgba(0,0,0,0.25)',
    }}
  >
    <Canvas
      linear
      flat
      orthographic
      camera={{
        zoom: 130,
        position: [0, 0, 100],
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <React.Suspense fallback={null}>
        <group scale={0.65}> {/* 👈 Coin leicht verkleinert */}
          <Coin result={resultIndex} flipping={flipping} />
        </group>
      </React.Suspense>

      {/* ✨ Effekte */}
      <Effect color="white" />
      {flipping && <Effect color="white" />}
      {win && <Effect color="#42ff78" />}

      {/* 💡 Lichtsetup */}
      <ambientLight intensity={2.5} />
      <directionalLight position-z={1} position-y={1} castShadow color="#CCCCCC" />
      <hemisphereLight
        intensity={0.5}
        position={[0, 1, 0]}
        color="#ffadad"
        groundColor="#6666fe"
      />
    </Canvas>
  </div>
</GambaUi.Portal>

      {/* 🎛️ Buttons (überlappend am Coin) */}
      <GambaUi.Portal target="controls">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',       // 👈 enger Abstand zwischen Buttons
            marginTop: '-8px', // 👈 zieht Buttons nach oben — Coin überlappt leicht
          }}
        >
          <GambaUi.WagerInput
            options={WAGER_OPTIONS}
            value={wager}
            onChange={setWager}
          />

          <GambaUi.Button
            disabled={gamba.isPlaying}
            onClick={() => setSide(side === 'heads' ? 'tails' : 'heads')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                height="20px"
                src={side === 'heads' ? TEXTURE_HEADS : TEXTURE_TAILS}
                alt={side}
              />
              {side === 'heads' ? 'Heads' : 'Tails'}
            </div>
          </GambaUi.Button>

          <GambaUi.PlayButton onClick={play}>
            Flip
          </GambaUi.PlayButton>
        </div>
      </GambaUi.Portal>
    </>
  )
}

export default Flip
