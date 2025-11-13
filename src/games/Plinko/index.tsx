import { GambaUi, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import { PEG_RADIUS, PLINKO_RAIUS, Plinko as PlinkoGame, PlinkoProps, barrierHeight, barrierWidth, bucketHeight } from './game'

import BUMP from './bump.mp3'
import FALL from './fall.mp3'
import WIN from './win.mp3'

function usePlinko(props: PlinkoProps, deps: React.DependencyList) {
  const [plinko, set] = React.useState<PlinkoGame>(null!)

  React.useEffect(
    () => {
      const p = new PlinkoGame(props)
      set(p)
      return () => p.cleanup()
    },
    deps,
  )

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
      <GambaUi.Portal target="screen">
        <GambaUi.Canvas
          render={({ ctx, size }, clock) => {
            if (!plinko) return

            const bodies = plinko.getBodies()

            const xx = size.width / plinko.width
            const yy = size.height / plinko.height
            const s = Math.min(xx, yy)

            ctx.clearRect(0, 0, size.width, size.height)
            const gradient = ctx.createLinearGradient(0, 0, 0, size.height)
            gradient.addColorStop(0, '#001100')  // Dunkleres Grün oben für Tiefe
            gradient.addColorStop(1, '#00ff99')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, size.width, size.height)

            // Leichter Nebel-Overlay für Atmosphäre
            const fogGradient = ctx.createLinearGradient(0, 0, 0, size.height)
            fogGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)')
            fogGradient.addColorStop(1, 'rgba(0, 255, 153, 0.1)')
            ctx.fillStyle = fogGradient
            ctx.fillRect(0, 0, size.width, size.height)

            ctx.save()
            ctx.translate(size.width / 2 - plinko.width / 2 * s, size.height / 2 - plinko.height / 2 * s)
            ctx.scale(s, s)
            if (debug) {
              ctx.beginPath()
              bodies.forEach(
                ({ vertices }, i) => {
                  ctx.moveTo(vertices[0].x, vertices[0].y)
                  for (let j = 1; j < vertices.length; j += 1) {
                    ctx.lineTo(vertices[j].x, vertices[j].y)
                  }
                  ctx.lineTo(vertices[0].x, vertices[0].y)
                },
              )
              ctx.lineWidth = 1
              ctx.strokeStyle = '#fff'
              ctx.stroke()
            } else {
              bodies.forEach(
                (body, i) => {
                  const { label, position } = body
                  if (label === 'Peg') {
                    ctx.save()
                    ctx.translate(position.x, position.y)

                    const animation = pegAnimations.current[body.plugin.pegIndex] ?? 0

                    if (pegAnimations.current[body.plugin.pegIndex]) {
                      pegAnimations.current[body.plugin.pegIndex] *= 0.9
                    }

                    // Schatten für 3D-Effekt
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
                    ctx.shadowBlur = 5
                    ctx.shadowOffsetX = 2
                    ctx.shadowOffsetY = 2

                    // Basis: Dunkler Kreis
                    ctx.beginPath()
                    ctx.arc(0, 0, PEG_RADIUS, 0, Math.PI * 2)
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'
                    ctx.fill()

                    // Glow bei Hit (grünlich für Theme)
                    const glow = Math.min(1, animation)
                    ctx.shadowColor = `rgba(0, 255, 153, ${glow})`
                    ctx.shadowBlur = 20 * glow
                    ctx.beginPath()
                    ctx.arc(0, 0, PEG_RADIUS + 2, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(0, 255, 153, ${glow * 0.3})`
                    ctx.fill()

                    // Innerer Shine
                    ctx.shadowBlur = 0
                    ctx.save()
                    ctx.scale(1 + animation * 0.3, 1 + animation * 0.3)
                    ctx.beginPath()
                    ctx.arc(0, 0, PEG_RADIUS * 0.5, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, animation * 1.5)})`
                    ctx.fill()
                    ctx.restore()

                    ctx.restore()
                  }
                  if (label === 'Plinko') {
                    ctx.save()
                    ctx.translate(position.x, position.y)

                    // Trail-Effekt (leichte Spur hinter dem Ball)
                    ctx.beginPath()
                    ctx.arc(0, 0, PLINKO_RAIUS + 15, 0, Math.PI * 2)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
                    ctx.fill()

                    // Äußerer Glow (stärker, grün-tinted)
                    ctx.shadowColor = '#00ff99'
                    ctx.shadowBlur = 30
                    ctx.beginPath()
                    ctx.arc(0, 0, PLINKO_RAIUS + 10, 0, Math.PI * 2)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
                    ctx.fill()

                    // Hauptball: Metallisch mit grünem Tint
                    const ballGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, PLINKO_RAIUS)
                    ballGradient.addColorStop(0, '#ffffff')
                    ballGradient.addColorStop(0.5, '#ccffdd')
                    ballGradient.addColorStop(1, '#008855')
                    ctx.shadowBlur = 0
                    ctx.beginPath()
                    ctx.arc(0, 0, PLINKO_RAIUS, 0, Math.PI * 2)
                    ctx.fillStyle = ballGradient
                    ctx.fill()

                    // Glanz-Highlight (stärker, versetzt)
                    ctx.beginPath()
                    ctx.arc(-PLINKO_RAIUS * 0.4, -PLINKO_RAIUS * 0.4, PLINKO_RAIUS * 0.5, 0, Math.PI * 2)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
                    ctx.fill()

                    ctx.restore()
                  }
                  if (label === 'Bucket') {
                    const animation = bucketAnimations.current[body.plugin.bucketIndex] ?? 0

                    if (bucketAnimations.current[body.plugin.bucketIndex]) {
                      bucketAnimations.current[body.plugin.bucketIndex] *= .9
                    }

                    ctx.save()
                    ctx.translate(position.x, position.y)

                    const multiplier = body.plugin.bucketMultiplier
                    let bucketHue = 120  // Basis Grün
                    if (multiplier < 1) bucketHue = 0;   // Rot für Verlust
                    else if (multiplier < 2) bucketHue = 60;  // Gelb für niedrig
                    else bucketHue = 120;  // Grün für hoch

                    const bucketAlpha = 0.4 + animation * 0.4  // Höher für Sichtbarkeit

                    // Glow-Effekt (stärker, passend zur Farbe)
                    const glowIntensity = 0.2 + animation * 0.8
                    ctx.shadowColor = `hsla(${bucketHue}, 100%, 50%, ${glowIntensity})`
                    ctx.shadowBlur = 25 + glowIntensity * 15

                    // Bucket-Form: Trapez für "Eimer"-Look
                    ctx.save()
                    ctx.translate(0, bucketHeight / 2)
                    ctx.scale(1 + animation * 0.15, 1 + animation * 2.5)  // Stärkeres Puls bei Hit
                    ctx.beginPath()
                    ctx.moveTo(-30, -bucketHeight)  // Breiter oben
                    ctx.lineTo(30, -bucketHeight)
                    ctx.lineTo(25, 0)
                    ctx.lineTo(-25, 0)
                    ctx.closePath()

                    // Fill mit Gradient (tiefer Look)
                    const innerGradient = ctx.createLinearGradient(0, -bucketHeight, 0, 0)
                    innerGradient.addColorStop(0, `hsla(${bucketHue}, 90%, 60%, ${bucketAlpha})`)
                    innerGradient.addColorStop(1, `hsla(${bucketHue}, 80%, 30%, ${bucketAlpha})`)
                    ctx.fillStyle = innerGradient
                    ctx.fill()

                    ctx.restore()

                    // Weißer Outline (dicker, glowy)
                    ctx.lineWidth = 4
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.7)'
                    ctx.shadowBlur = 10
                    ctx.beginPath()
                    ctx.roundRect(-30, -10, 60, bucketHeight + 10, 10)  // Etwas höher für Visibility
                    ctx.stroke()

                    // Obere Eingangs-Linie (dick, leuchtend)
                    ctx.lineWidth = 5
                    ctx.strokeStyle = `hsla(${bucketHue}, 100%, 80%, 1)`
                    ctx.beginPath()
                    ctx.moveTo(-30, -10)
                    ctx.lineTo(30, -10)
                    ctx.stroke()

                    // Text: Größer, fett, mit starkem Glow
                    ctx.font = 'bold 32px Arial'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.shadowBlur = 15 + animation * 15
                    ctx.shadowColor = `hsla(${bucketHue}, 100%, 100%, 1)`

                    // Outline
                    ctx.lineWidth = 7
                    ctx.strokeStyle = `hsla(${bucketHue}, 70%, 20%, 1)`
                    ctx.strokeText('x' + multiplier.toFixed(1), 0, 10)

                    // Fill
                    const textBrightness = 90 + animation * 15
                    ctx.fillStyle = `hsla(${bucketHue}, 90%, ${textBrightness}%, 1)`
                    ctx.fillText('x' + multiplier.toFixed(1), 0, 10)

                    ctx.restore()
                  }
                  if (label === 'Barrier') {
                    ctx.save()
                    ctx.translate(position.x, position.y)

                    ctx.fillStyle = 'rgba(204, 204, 204, 0.15)'  // Leichter transparent
                    ctx.fillRect(-barrierWidth / 2, -barrierHeight / 2, barrierWidth, barrierHeight)

                    ctx.restore()
                  }
                },
              )
            }
            ctx.restore()
          }}
        />
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <div>Degen:</div>
        <GambaUi.Switch
          disabled={gamba.isPlaying}
          checked={degen}
          onChange={setDegen}
        />
        {window.location.origin.includes('localhost') && (
          <>
            <GambaUi.Switch checked={debug} onChange={setDebug}  />
            <GambaUi.Button onClick={() => plinko.single()}>
              Test
            </GambaUi.Button>
            <GambaUi.Button onClick={() => plinko.runAll()}>
              Simulate
            </GambaUi.Button>
          </>
        )}
        <GambaUi.PlayButton onClick={() => play()}>
          Play
        </GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
