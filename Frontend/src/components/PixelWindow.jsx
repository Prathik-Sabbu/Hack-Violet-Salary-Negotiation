import { useState, useEffect } from 'react'
import './PixelWindow.css'

function PixelWindow() {
  const [birds, setBirds] = useState([])
  const [birdIdCounter, setBirdIdCounter] = useState(0)

  // Spawn birds periodically
  useEffect(() => {
    const spawnBird = () => {
      const newBird = {
        id: birdIdCounter,
        top: Math.random() * 60 + 10, // Random height (10-70%)
        delay: Math.random() * 2, // Random delay
        duration: 3 + Math.random() * 2 // 3-5 seconds
      }
      
      setBirds(prev => [...prev, newBird])
      setBirdIdCounter(prev => prev + 1)

      // Remove bird after animation completes
      setTimeout(() => {
        setBirds(prev => prev.filter(b => b.id !== newBird.id))
      }, (newBird.duration + newBird.delay) * 1000)
    }

    // Spawn first bird after 2 seconds
    const firstBird = setTimeout(spawnBird, 2000)

    // Then spawn a bird every 8-15 seconds
    const interval = setInterval(() => {
      spawnBird()
    }, 8000 + Math.random() * 7000)

    return () => {
      clearTimeout(firstBird)
      clearInterval(interval)
    }
  }, [birdIdCounter])

  return (
    <div className="pixel-window">
      {/* Window frame */}
      <div className="window-frame">
        {/* Top frame */}
        <div className="frame-top"></div>
        {/* Left frame */}
        <div className="frame-left"></div>
        {/* Right frame */}
        <div className="frame-right"></div>
        {/* Bottom frame */}
        <div className="frame-bottom"></div>
        {/* Center cross */}
        <div className="frame-cross-vertical"></div>
        <div className="frame-cross-horizontal"></div>
      </div>

      {/* Sky background */}
      <div className="window-sky">
        {/* Clouds */}
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>

        {/* Birds */}
        {birds.map(bird => (
          <div
            key={bird.id}
            className="bird"
            style={{
              top: `${bird.top}%`,
              animationDelay: `${bird.delay}s`,
              animationDuration: `${bird.duration}s`
            }}
          >
            {'>'} {/* Simple pixel bird */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PixelWindow
