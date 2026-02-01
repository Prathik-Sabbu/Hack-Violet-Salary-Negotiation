import { useState, useEffect } from 'react'
import './OfferChange.css'

/**
 * Floating animation component that shows salary changes
 * Similar to purchase animations - shows +$5,000 or -$1,000 floating up and fading out
 */
function OfferChange({ delta, trigger }) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    // Only animate when we have a non-zero delta and a new trigger
    if (delta !== 0 && trigger > 0) {
      setVisible(true)
      setAnimating(true)

      // Start fade out after the animation plays
      const fadeTimer = setTimeout(() => {
        setAnimating(false)
      }, 1500)

      // Hide completely after animation ends
      const hideTimer = setTimeout(() => {
        setVisible(false)
      }, 2000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [trigger]) // Trigger changes each time we want to show animation

  if (!visible || delta === 0) return null

  const isPositive = delta > 0
  const formattedDelta = isPositive
    ? `+$${Math.abs(delta).toLocaleString()}`
    : `-$${Math.abs(delta).toLocaleString()}`

  return (
    <div
      className={`offer-change ${isPositive ? 'positive' : 'negative'} ${animating ? 'animating' : 'fading'}`}
    >
      {formattedDelta}
    </div>
  )
}

export default OfferChange
