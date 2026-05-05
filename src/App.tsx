import { useCallback, useState } from 'react'
import { RotateCcw, MousePointer2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTriangleCanvas } from '@/hooks/useTriangleCanvas'
import type { Point } from '@/lib/geometry'

const LABELS = ['A', 'B', 'C']

function statusMessage(count: number): string {
  if (count < 3) return `Click to place vertex ${LABELS[count]} (${count + 1} of 3)`
  return 'Triangle complete — hit Reset to start over'
}

export default function App() {
  const [points, setPoints] = useState<Point[]>([])
  const { canvasRef, width, height } = useTriangleCanvas(points)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (points.length >= 3) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = width / rect.width
      const scaleY = height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      setPoints((prev) => [...prev, [x, y]])
    },
    [points.length, canvasRef, width, height]
  )

  const handleReset = useCallback(() => setPoints([]), [])

  const isComplete = points.length === 3

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-primary tracking-tight">
          Triangle Geometry Builder
        </h1>
        <p className="text-sm text-muted-foreground">
          Click 3 points to construct a triangle with its circumscribed circle, inscribed circle, and edge circles
        </p>
      </div>

      {/* Main card */}
      <Card className="w-full max-w-[720px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-foreground/80">Canvas</CardTitle>
            <div className="flex items-center gap-2">
              {LABELS.map((label, i) => (
                <Badge
                  key={label}
                  variant={i < points.length ? 'default' : 'outline'}
                  className="font-mono"
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pb-4 px-4">
          <div className="relative rounded-md overflow-hidden border border-border bg-[#12122a]">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              onClick={handleClick}
              className="block w-full"
              style={{ cursor: isComplete ? 'default' : 'crosshair' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center gap-4 w-full max-w-[720px] justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MousePointer2 size={14} className="text-primary" />
          <span>{statusMessage(points.length)}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={points.length === 0}
          className="gap-2"
        >
          <RotateCcw size={14} />
          Reset
        </Button>
      </div>

      {/* Legend */}
      {isComplete && (
        <Card className="w-full max-w-[720px]">
          <CardContent className="py-4 px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { color: '#74b9ff', label: 'Triangle' },
                { color: '#a29bfe', label: 'Circumscribed circle', dashed: true },
                { color: '#55efc4', label: 'Inscribed circle' },
                { color: '#fd79a8', label: 'Edge circles', dashed: true },
              ].map(({ color, label, dashed }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="inline-block w-5 h-0.5 rounded shrink-0"
                    style={{
                      background: dashed
                        ? `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)`
                        : color,
                    }}
                  />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
