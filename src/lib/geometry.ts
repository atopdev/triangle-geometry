// Geometry types and pure math utilities

export type Point = [number, number]

export function dist(a: Point, b: Point): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

export function circumcenter(p1: Point, p2: Point, p3: Point): Point | null {
  const [ax, ay] = p1
  const [bx, by] = p2
  const [cx, cy] = p3
  const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
  if (Math.abs(D) < 1e-10) return null
  const ux =
    ((ax * ax + ay * ay) * (by - cy) +
      (bx * bx + by * by) * (cy - ay) +
      (cx * cx + cy * cy) * (ay - by)) /
    D
  const uy =
    ((ax * ax + ay * ay) * (cx - bx) +
      (bx * bx + by * by) * (ax - cx) +
      (cx * cx + cy * cy) * (bx - ax)) /
    D
  return [ux, uy]
}

export function incenter(p1: Point, p2: Point, p3: Point): Point {
  const a = dist(p2, p3)
  const b = dist(p1, p3)
  const c = dist(p1, p2)
  const perim = a + b + c
  return [
    (a * p1[0] + b * p2[0] + c * p3[0]) / perim,
    (a * p1[1] + b * p2[1] + c * p3[1]) / perim,
  ]
}

export function inradius(p1: Point, p2: Point, p3: Point): number {
  const a = dist(p2, p3)
  const b = dist(p1, p3)
  const c = dist(p1, p2)
  const s = (a + b + c) / 2
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))
  return area / s
}

export interface EdgeCircle {
  cx: number
  cy: number
  r: number
}

export function computeEdgeCircles(
  points: [Point, Point, Point],
  cc: Point,
  R: number
): EdgeCircle[] {
  const [A, B, C] = points
  const edges: [Point, Point][] = [
    [A, B],
    [B, C],
    [C, A],
  ]
  const result: EdgeCircle[] = []

  for (const [p1, p2] of edges) {
    const ex = p2[0] - p1[0]
    const ey = p2[1] - p1[1]
    const len = Math.sqrt(ex * ex + ey * ey)
    let nx = -ey / len
    let ny = ex / len
    const signedDist = (cc[0] - p1[0]) * nx + (cc[1] - p1[1]) * ny
    if (signedDist < 0) { nx = -nx; ny = -ny }
    const d = Math.abs(signedDist)
    const r = (R - d) / 2
    if (r <= 0) continue
    result.push({
      cx: cc[0] - (R - r) * nx,
      cy: cc[1] - (R - r) * ny,
      r,
    })
  }
  return result
}
