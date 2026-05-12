import { useEffect, useRef } from 'react'
import type { Point } from '@/lib/geometry'
import {
  circumcenter,
  computeEdgeCircles,
  dist,
  incenter,
  inradius,
} from '@/lib/geometry'

const COLORS = {
  dot: '#ff9f43',
  dotBorder: '#e67e22',
  triangle: '#74b9ff',
  circumCircle: '#a29bfe',
  incircle: '#55efc4',
  edgeCircle: '#fd79a8',
  label: '#dfe6e9',
  centerDot: '#a29bfe',
}

const CANVAS_W = 680
const CANVAS_H = 500

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.strokeStyle = '#1e2a3a'
  ctx.lineWidth = 0.5
  for (let x = 0; x < CANVAS_W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
  }
  for (let y = 0; y < CANVAS_H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
  }
  ctx.restore()
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, 8, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.dot
  ctx.fill()
  ctx.strokeStyle = COLORS.dotBorder
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.font = 'bold 13px sans-serif'
  ctx.fillStyle = COLORS.label
  ctx.fillText(label, x + 12, y - 10)
  ctx.restore()
}

function drawCircleArc(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string,
  dash: number[] = [],
  lineWidth = 1.5
) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.setLineDash(dash)
  ctx.stroke()
  ctx.restore()
}

function drawSmallDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 4) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function drawLegendItem(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  color: string,
  label: string,
  dash: number[] = []
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash(dash)
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + 20, y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#94a3b8'
  ctx.font = '11px sans-serif'
  ctx.fillText(label, x + 26, y + 4)
  ctx.restore()
}

export function useTriangleCanvas(points: Point[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    drawGrid(ctx)

    // Draw preview dots for partial points
    if (points.length < 3) {
      points.forEach((p, i) => drawDot(ctx, p[0], p[1], ['A', 'B', 'C'][i]))
      return
    }

    const [A, B, C] = points as [Point, Point, Point]

    // Triangle fill + stroke
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(A[0], A[1])
    ctx.lineTo(B[0], B[1])
    ctx.lineTo(C[0], C[1])
    ctx.closePath()
    ctx.strokeStyle = COLORS.triangle
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = 'rgba(116, 185, 255, 0.06)'
    ctx.fill()
    ctx.restore()

    // Circumscribed circle
    const cc = circumcenter(A, B, C)
    if (cc) {
      const R = dist(cc, A)
      drawCircleArc(ctx, cc[0], cc[1], R, COLORS.circumCircle, [6, 4], 1.5)
      drawSmallDot(ctx, cc[0], cc[1], COLORS.circumCircle)

      // Inscribed circle
      const ic = incenter(A, B, C)
      const ir = inradius(A, B, C)
      drawCircleArc(ctx, ic[0], ic[1], ir, COLORS.incircle, [], 1.5)
      drawSmallDot(ctx, ic[0], ic[1], COLORS.incircle)

      // Edge circles — tangent to circumcircle and each edge
      const edgeCircles = computeEdgeCircles([A, B, C], cc, R)
      edgeCircles.forEach(({ cx, cy, r }) => {
        drawCircleArc(ctx, cx, cy, r, COLORS.edgeCircle, [3, 3], 1.5)
        drawSmallDot(ctx, cx, cy, COLORS.edgeCircle, 3)
      })
    }

    // Vertex dots on top
    ;([A, B, C] as Point[]).forEach((p, i) =>
      drawDot(ctx, p[0], p[1], ['A', 'B', 'C'][i])
    )

    // Legend
    const lx = 12, ly = CANVAS_H - 80
    drawLegendItem(ctx, lx, ly,      COLORS.triangle,     'Triangle', [])
    drawLegendItem(ctx, lx, ly + 18, COLORS.circumCircle, 'Circumscribed circle', [6, 4])
    drawLegendItem(ctx, lx, ly + 36, COLORS.incircle,     'Inscribed circle', [])
    drawLegendItem(ctx, lx, ly + 54, COLORS.edgeCircle,   'Edge circles', [3, 3])
  }, [points])

  return { canvasRef, width: CANVAS_W, height: CANVAS_H }
}
