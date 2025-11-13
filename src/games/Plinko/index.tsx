import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { PEG_RADIUS, PLINKO_RAIUS, Plinko as PlinkoGame, PlinkoProps, barrierHeight, barrierWidth, bucketHeight } from './game'

import BUMP from './bump.mp3'
import FALL from './fall.mp3'
import WIN from './win.mp3'

function usePlinko(props: PlinkoProps, deps: React.DependencyList) {
  const [plinko, set] = React.useState<PlinkoGame>(null!)

  React.useEffect(() => {
    const p = new PlinkoGame(props)
    set(p)
    return () => p.cleanup()
  }, deps)

  return plinko
}

const DEGEN_BET = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 10, 10, 10, 15]
const BET = [.5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3, 3, 3, 3, 3, 3, 3, 6]

export default function Plinko() {
  const game = GambaUi.useGame()
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const [debug, setDebug] = React.useState(false)
  const [degen, setDegen] = React.useState(false)
  const sounds = useSound({
    bump: BUMP,
    win: WIN,
    fall: FALL,
  })

  const pegAnimations = React.useRef<Record<number, number>>({})
  const bucketAnimations = React.useRef<Record<number, number>>({})
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const bet = degen ? DEGEN_BET : BET
  const rows = degen ? 12 : 14
  const multipliers = React.useMemo(() => Array.from(new Set(bet)), [bet])

  const plinko = usePlinko({
    rows,
    multipliers,
    onContact(contact) {
      if (contact.peg && contact.plinko) {
        pegAnimations.current[contact.peg.plugin.pegIndex] = 1
        sounds.play('bump', { playbackRate: 1 + Math.random() * .05 })
      }
      if (contact.barrier && contact.plinko) {
        sounds.play('bump', { playbackRate: .5 + Math.random() * .05 })
      }
      if (contact.bucket && contact.plinko) {
        bucketAnimations.current[contact.bucket.plugin.bucketIndex] = 1
        sounds.play(contact.bucket.plugin.bucketMultiplier >= 1 ? 'win' : 'fall')
      }
    },
  }, [rows, multipliers])

  const play = async () => {
    await game.play({ wager, bet })
    const result = await game.result()
    plinko.reset()
    plinko.run(result.multiplier)
  }

  return (
    <>
      <GambaUi.Canvas
        render={({ ctx, size }, clock) => {
          if (!plinko) return

          const bodies = plinko.getBodies()
          const xx = size.width / plinko.width
          const yy = size.height / plinko.height
          const s = Math.min(xx, yy)

          ctx.clearRect(0, 0, size.width, size.height)
          const gradient = ctx.createLinearGradient(0, 0, 0, size.height)
          gradient.addColorStop(0, '#000000')
          gradient.addColorStop(1, '#00ff99')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, size.width, size.height)

          ctx.save()
          ctx.translate(size.width / 2 - plinko.width / 2 * s, size.height / 2 - plinko.height / 2 * s)
          ctx.scale(s, s)

          // --- draw bodies ---
          bodies.forEach((body) => {
            const { label, position } = body

            if (label === 'Peg') {
              ctx.save()
              ctx.translate(position.x, position.y)
              const animation = pegAnimations.current[body.plugin.pegIndex] ?? 0
              if (pegAnimations.current[body.plugin.pegIndex]) {
                pegAnimations.current[body.plugin.pegIndex] *= 0.9
              }
              ctx.beginPath()
              ctx.arc(0, 0, PEG_RADIUS, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(0,0,0,0.95)'
              ctx.fill()
              if (animation > 0.02) {
                const alpha = Math.min(1, animation)
                ctx.beginPath()
                ctx.arc(0, 0, PEG_RADIUS + 6, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`
                ctx.shadowColor = `rgba(255,255,255,${alpha})`
                ctx.shadowBlur = 20 * alpha
                ctx.fill()
                ctx.shadowBlur = 0
              }
              ctx.restore()
              return
            }

            if (label === 'Plinko') {
              ctx.save()
              ctx.translate(position.x, position.y)
              ctx.beginPath()
              ctx.arc(0, 0, PLINKO_RAIUS, 0, Math.PI * 2)
              ctx.fillStyle = '#ffffff'
              ctx.shadowColor = 'rgba(255,255,255,0.9)'
              ctx.shadowBlur = 18
              ctx.fill()
              ctx.lineWidth = 1
              ctx.strokeStyle = 'rgba(0,0,0,0.15)'
              ctx.stroke()
              ctx.shadowBlur = 0
              ctx.restore()
              return
            }

            if (label === 'Bucket') {
              const animation = bucketAnimations.current[body.plugin.bucketIndex] ?? 0
              if (bucketAnimations.current[body.plugin.bucketIndex]) {
                bucketAnimations.current[body.plugin.bucketIndex] *= 0.9
              }
              ctx.save()
              ctx.translate(position.x, position.y)
              const bucketHue = 25 + (multipliers.indexOf(body.plugin.bucketMultiplier) / multipliers.length) * 125
              const bucketAlpha = 0.05 + animation
              ctx.save()
              ctx.translate(0, bucketHeight / 2)
              ctx.scale(1, 1 + animation * 2)
              ctx.fillStyle = `hsla(${bucketHue}, 75%, 75%, ${bucketAlpha})`
              ctx.fillRect(-25, -bucketHeight, 50, bucketHeight)
              ctx.restore()
              ctx.font = '20px Arial'
              ctx.textAlign = 'center'
              const brightness = 75 + animation * 25
              ctx.fillStyle = `hsla(${bucketHue}, 75%, ${brightness}%, 1)`
              ctx.fillText('x' + body.plugin.bucketMultiplier, 0, 0)
              ctx.restore()
              return
            }

            if (label === 'Barrier') {
              ctx.save()
              ctx.translate(position.x, position.y)
              ctx.fillStyle = '#cccccc22'
              ctx.fillRect(-barrierWidth / 2, -barrierHeight / 2, barrierWidth, barrierHeight)
              ctx.restore()
              return
            }
          })

          ctx.restore()
        }}
      />

      <GambaUi.Portal target="controls">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
          }}
        >
          <GambaUi.WagerInput value={wager} onChange={setWager} />
          <GambaUi.PlayButton onClick={play}>
            Play
          </GambaUi.PlayButton>
        </div>
      </GambaUi.Portal>
    </>
  )
}
