'use client'

import { useEffect, useState } from 'react'

/**
 * Liquid-glass refraction lens, after Aave's "Building glass for the web".
 *
 * A displacement map PNG is built on the fly from the lens shape and size:
 * the red channel encodes horizontal bend, green encodes vertical bend, and
 * everything outside the edge band stays neutral (128) so only the rim
 * refracts. The map feeds an SVG feDisplacementMap that the nav droplet
 * applies via backdrop-filter, so the page content behind the glass actually
 * bends. Three displacement passes at slightly different scales are
 * recombined per channel for a subtle chromatic fringe.
 *
 * backdrop-filter: url(#...) only works on Chromium, so the effect is gated
 * behind a .glass-refract-on root class; other engines keep the plain
 * blur-based glass.
 */

// Lens geometry: matches the nav droplet's typical proportions.
const MAP_W = 160
const MAP_H = 48
const RADIUS = 16
const EDGE_DEPTH = 13 // px band from the rim that bends light
const CURVATURE = 1.7 // falloff exponent: higher = flatter center, sharper rim
const DISPLACE_SCALE = 22 // max pixel shift at the rim
const CHROMA = 0.14 // per-channel scale spread for the color fringe

function buildDisplacementMap(): string | null {
  const canvas = document.createElement('canvas')
  canvas.width = MAP_W
  canvas.height = MAP_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const img = ctx.createImageData(MAP_W, MAP_H)
  const halfW = MAP_W / 2
  const halfH = MAP_H / 2

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const px = x + 0.5 - halfW
      const py = y + 0.5 - halfH

      // Signed distance to the rounded-rect surface (<= 0 inside)
      const dx = Math.abs(px) - (halfW - RADIUS)
      const dy = Math.abs(py) - (halfH - RADIUS)
      const dist =
        Math.min(Math.max(dx, dy), 0) +
        Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) -
        RADIUS

      // 0 deep inside the glass, 1 at the rim
      const t = Math.min(Math.max(1 + dist / EDGE_DEPTH, 0), 1)
      const bulge = Math.pow(t, CURVATURE)

      // Bend inward toward the lens center, strongest at the rim
      const len = Math.hypot(px, py) || 1
      const dispX = (-px / len) * bulge
      const dispY = (-py / len) * bulge

      const i = (y * MAP_W + x) * 4
      img.data[i] = Math.round(128 + dispX * 127) // R: horizontal bend
      img.data[i + 1] = Math.round(128 + dispY * 127) // G: vertical bend
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

const GlassLens = () => {
  const [mapUri, setMapUri] = useState<string | null>(null)

  useEffect(() => {
    // Chromium is the only engine that resolves url() backdrop-filters today.
    // Safari parses the value but drops the reference, killing the blur too,
    // so it (and Firefox) stay on the plain-blur glass.
    const isChromium = 'chrome' in window
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (!isChromium || isSafari) return
    if (!CSS.supports('backdrop-filter', 'url(#glass-lens)')) return

    const uri = buildDisplacementMap()
    if (!uri) return
    setMapUri(uri)
    document.documentElement.classList.add('glass-refract-on')

    return () => {
      document.documentElement.classList.remove('glass-refract-on')
    }
  }, [])

  if (!mapUri) return null

  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', overflow: 'hidden' }}
    >
      <defs>
        <filter
          id="glass-lens"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={mapUri}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="map"
          />

          {/* Chromatic refraction: each channel bends a touch differently */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={DISPLACE_SCALE * (1 + CHROMA)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispR"
          />
          <feColorMatrix
            in="dispR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="chanR"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={DISPLACE_SCALE}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispG"
          />
          <feColorMatrix
            in="dispG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="chanG"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={DISPLACE_SCALE * (1 - CHROMA)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispB"
          />
          <feColorMatrix
            in="dispB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="chanB"
          />

          <feComposite in="chanR" in2="chanG" operator="arithmetic" k2="1" k3="1" result="chanRG" />
          <feComposite in="chanRG" in2="chanB" operator="arithmetic" k2="1" k3="1" />
        </filter>
      </defs>
    </svg>
  )
}

export default GlassLens
