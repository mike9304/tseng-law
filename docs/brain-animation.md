# Brain Animation Notes

## What Was Added
- `src/components/BrainMeshCanvas.tsx`
- Hero integration in `src/components/HeroSearch.tsx`
- Styling in `src/app/globals.css` (`.brain-bg`, `.brain-bg-canvas`)

## Behavior
- Canvas 2D + `requestAnimationFrame` brain mesh animation.
- Node network forms a brain silhouette (two lobes + stem).
- Pointer move: nearby nodes repel and links brighten.
- Pointer down/tap: short pulse ring highlight.

## Performance / A11y
- `IntersectionObserver`: pauses when hero is outside viewport.
- `document.visibilitychange`: pauses in background tabs.
- `prefers-reduced-motion: reduce`: no continuous loop, static/minimal redraw.
- `devicePixelRatio` capped to `2`.

## Tuning
- Density: change `intensity` prop (`low | medium | high`) in `src/components/HeroSearch.tsx`.
- Opacity: tweak `.brain-bg` in `src/app/globals.css`.
- Colors: edit `ink`, `accent`, `highlight` in `src/components/BrainMeshCanvas.tsx`.
