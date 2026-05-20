# Triangle Geometry Builder

An interactive canvas tool for exploring the classical circles of a triangle — circumscribed, inscribed, and the three edge (Malfatti-like) circles tangent to the circumcircle. Built with React, TypeScript, Tailwind CSS, and shadcn/ui, rendered on Vite.

![status](https://img.shields.io/badge/status-active-informational)
![node](https://img.shields.io/badge/node-%E2%89%A518-brightgreen)

## Features

- **Click-to-place vertices** — click three points on the canvas to define a triangle
- **Circumscribed circle** — the unique circle passing through all three vertices, centered at the circumcenter
- **Inscribed circle** — the largest circle that fits inside the triangle, tangent to all three edges
- **Edge circles** — one circle per edge, internally tangent to the circumcircle and tangent to that edge
- **Live status and legend** — vertex badges track progress; a color-coded legend appears once the triangle is complete
- **Reset** — clear the canvas and start over at any time

## Getting Started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser. Click three points on the canvas to build a triangle.

### Other scripts

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
```

## How it works

All geometry is pure math in [`src/lib/geometry.ts`](src/lib/geometry.ts), decoupled from rendering:

- `circumcenter(a, b, c)` — solves the circumcenter via the perpendicular-bisector determinant method; returns `null` for degenerate (collinear) triangles
- `incenter(a, b, c)` / `inradius(a, b, c)` — computed from the triangle's side lengths and area (Heron's formula)
- `computeEdgeCircles(points, circumcenter, R)` — for each edge, finds the circle of radius `(R - d) / 2` tangent to that edge and internally tangent to the circumcircle, where `d` is the edge's distance from the circumcenter

Canvas drawing lives in [`src/hooks/useTriangleCanvas.ts`](src/hooks/useTriangleCanvas.ts), a hook that owns the `<canvas>` ref and redraws the grid, triangle, circles, and legend whenever the point set changes.

## Project Structure

```
src/
  lib/
    geometry.ts             # Pure math: circumcenter, incenter, inradius, edge circles
    utils.ts                # cn() helper for merging Tailwind classes
  hooks/
    useTriangleCanvas.ts    # Canvas rendering hook (grid, triangle, circles, legend)
  components/
    ui/
      button.tsx            # shadcn/ui Button
      badge.tsx             # shadcn/ui Badge
      card.tsx              # shadcn/ui Card
  App.tsx                   # Main app component and interaction state
  main.tsx                  # Entry point
  index.css                 # Tailwind base styles + CSS variables
```

## Tech Stack

| Layer      | Choice                          |
| ---------- | -------------------------------- |
| Framework  | React 18 + TypeScript            |
| Build tool | Vite                              |
| Styling    | Tailwind CSS                     |
| Components | shadcn/ui (Radix-based primitives) |
| Icons      | lucide-react                     |

## License

No license has been chosen for this project yet.
