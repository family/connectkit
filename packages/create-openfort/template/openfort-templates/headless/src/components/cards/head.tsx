import { useEffect, useMemo, useRef, useState } from 'react'

type RoutePoint = {
  x: number
  y: number
  delay: number
}

type Route = {
  start: RoutePoint
  end: RoutePoint
  color: string
  outDelay?: number
}

function withOpacity(color: string, opacity: number) {
  if (color.startsWith('rgb')) {
    const nums = color.match(/[\d.]+/g)?.map(Number)
    if (!nums || nums.length < 3) throw new Error('Invalid rgb format')
    const [r, g, b] = nums
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  throw new Error(`Unsupported color format: ${color}`)
}

const GlowCanvas = ({
  accentColor,
  backgroundColor,
}: {
  accentColor: string
  backgroundColor: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mousePosRef = useRef<{ x: number; y: number } | null>(null)
  const animationRef = useRef<number | null>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const color = useMemo(() => withOpacity(accentColor, 0.7), [accentColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height })
      canvas.width = width
      canvas.height = height
    })

    resizeObserver.observe(canvas.parentElement as Element)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    let startTime = Date.now()

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gap = 14
    const dotRadius = 1.5

    const generateDots = (width: number, height: number) => {
      const dots: { x: number; y: number; radius: number; opacity: number }[] =
        []

      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          if (Math.random() > 0.4) {
            dots.push({
              x,
              y,
              radius: dotRadius,
              opacity: Math.random() * 0.4 + 0.1,
            })
          }
        }
      }
      return dots
    }
    const dots = generateDots(dimensions.width, dimensions.height)

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      if (mousePosRef.current) {
        const { x, y } = mousePosRef.current

        ctx.shadowBlur = 25
        ctx.shadowColor = backgroundColor

        dots.forEach((dot) => {
          const dx = dot.x - x
          const dy = dot.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)

          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)

          const opacityFactor = 1 - distance / 100

          ctx.fillStyle = withOpacity(accentColor, opacityFactor)
          ctx.fill()
        })
      }

      // Draw the dots
      dots.forEach((dot) => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = withOpacity(backgroundColor, dot.opacity)
        ctx.fill()
      })

      drawRoutes()
      // If all routes are complete, restart the animation
      const currentTime = (Date.now() - startTime) / 1000
      if (currentTime > 25) {
        // Reset after 15 seconds
        startTime = Date.now()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    // Set up routes that will animate across the map
    const yOffset = 50
    const scale = 12
    const h = 11 * scale
    const w = 18 * scale
    const xOffset = (dimensions.width - w) / 2

    const routes: Route[] = [
      {
        start: { x: xOffset, y: yOffset + h, delay: 0 },
        end: { x: xOffset, y: yOffset, delay: 2 },
        color,
        outDelay: 10,
      },
      {
        start: { x: xOffset, y: yOffset, delay: 2 },
        end: { x: xOffset + w, y: yOffset, delay: 4 },
        color,
        outDelay: 10,
      },
      {
        start: { x: xOffset + w, y: yOffset, delay: 4 },
        end: { x: xOffset + w, y: yOffset + h, delay: 6 },
        color,
        outDelay: 10,
      },

      {
        start: { x: xOffset + w / 4, y: yOffset + h / 3, delay: 4 },
        end: { x: xOffset + w / 4, y: yOffset + h, delay: 6 },
        color,
        outDelay: 10,
      },
      {
        start: { x: xOffset + (3 * w) / 4, y: yOffset + h / 3, delay: 2 },
        end: { x: xOffset + w / 4, y: yOffset + h / 3, delay: 4 },
        color,
        outDelay: 10,
      },
      {
        start: { x: xOffset + (3 * w) / 4, y: yOffset + h, delay: 0 },
        end: { x: xOffset + (3 * w) / 4, y: yOffset + h / 3, delay: 2 },
        color,
        outDelay: 10,
      },

      {
        start: { x: xOffset + (2 * w) / 4, y: yOffset + h, delay: 6 },
        end: { x: xOffset + (2 * w) / 4, y: yOffset + (2 * h) / 3, delay: 7 },
        color,
        outDelay: 10,
      },

      {
        start: { x: 200, y: 280, delay: 2 },
        end: { x: 260, y: 420, delay: 4 },
        color,
      },
      {
        start: { x: 50, y: 550, delay: 2 },
        end: { x: 150, y: 380, delay: 7 },
        outDelay: 4,
        color,
      },
      {
        start: { x: 280, y: 260, delay: 7.5 },
        end: { x: 80, y: 280, delay: 12.5 },
        color,
      },

      {
        start: { x: 380, y: 460, delay: 15 },
        end: { x: 180, y: 520, delay: 20 },
        color,
      },
    ]

    function drawRoutes() {
      if (!ctx) return

      const debug = false
      // const debug = true;

      const currentTime = (Date.now() - startTime) / 1000 // Time in seconds
      routes.forEach((route) => {
        const elapsed = debug ? 100 : currentTime - route.start.delay
        if (elapsed <= 0) return

        const duration = route.end.delay - route.start.delay // animation duration
        const progress = Math.min(elapsed / duration, 1) // normal progress

        // Fade from end to start after the line is fully drawn
        let startProgress = 0 // the starting point along the line
        const outDelay = route.outDelay || 0
        if (elapsed > duration + outDelay) {
          const fadeProgress = Math.min(
            (elapsed - (duration + outDelay)) / duration,
            1,
          )
          startProgress = fadeProgress // move the start point forward
        }

        // Line vector
        const dx = route.end.x - route.start.x
        const dy = route.end.y - route.start.y

        for (let x = 0; x < dimensions.width; x += gap) {
          for (let y = 0; y < dimensions.height; y += gap) {
            const t =
              ((x - route.start.x) * dx + (y - route.start.y) * dy) /
              (dx * dx + dy * dy)
            if (t < startProgress || t > progress) continue // only show dots in the visible segment

            const closestX = route.start.x + dx * t
            const closestY = route.start.y + dy * t
            const distance = Math.hypot(x - closestX, y - closestY)

            if (distance < gap) {
              ctx.beginPath()
              ctx.arc(x, y, dotRadius, 0, Math.PI * 2)

              // Fade in: opacity goes from 0 → 1 as `progress` grows
              const opacity = Math.min(
                1,
                Math.max(0, Math.min(t - startProgress, progress - t) * 5),
              )
              ctx.fillStyle = withOpacity(route.color, opacity)

              ctx.fill()
            }
          }
        }

        if (debug) {
          const xStart = route.start.x
          const yStart = route.start.y
          const xEnd = route.start.x + dx * progress
          const yEnd = route.start.y + dy * progress

          ctx.beginPath()
          ctx.moveTo(xStart, yStart)
          ctx.lineTo(xEnd, yEnd)
          ctx.strokeStyle = route.color
          ctx.lineWidth = 1.5
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(xEnd, yEnd, 3, 0, Math.PI * 2)
          ctx.fillStyle = route.color
          ctx.fill()
        }
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = {
        x: e.x - rect.left,
        y: e.y - rect.top,
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    draw()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, accentColor, backgroundColor, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

export const Head = ({
  onStart,
  sample,
  color,
  backgroundColor = color,
  logo,
  href,
  subtitle,
}: {
  onStart: () => void
  sample: string
  color: string
  backgroundColor?: string
  logo: string
  href: string
  subtitle?: string
}) => {
  return (
    <div
      className="bg-zinc-900 w-(--card-width) flex flex-col items-center justify-center text-center relative"
      style={{ '--color-sample': color } as React.CSSProperties}
    >
      <div>
        <a href="https://openfort.io/" target="_blank" rel="noopener">
          <img src="/openfort.svg" className="logo" alt="Openfort logo" />
        </a>
        <a href={href} target="_blank">
          <img src={logo} className="logo sample-logo" alt={`${sample} logo`} />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-4">
        <span style={{ color: '#FC3627' }}>Openfort</span> +{' '}
        <span style={{ color }}>{sample}</span>
      </h1>
      {subtitle && <p className="mb-6 text-sm max-w-2/3">{subtitle}</p>}
      <button
        className="lg:hidden mt-4 px-6 py-2 border border-zinc-500 rounded hover:bg-zinc-500/10 transition-colors cursor-pointer"
        onClick={onStart}
      >
        Click here to Start
      </button>
      <p className="absolute text-zinc-400 mb-6 text-sm bottom-0">
        Sign in to explore openfort capabilities.
      </p>
      <GlowCanvas accentColor={color} backgroundColor={backgroundColor} />
    </div>
  )
}
