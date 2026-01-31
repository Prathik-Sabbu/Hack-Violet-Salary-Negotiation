import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import NegotiationScreen from './components/NegotiationScreen'

const STORAGE_KEY = 'negotiation_player_data'

// Mock data for dev mode - skip setup with ?skip in URL
const DEV_PLAYER_DATA = {
  jobTitle: 'Software Engineer',
  experienceLevel: 'Mid-level (3-5 years)',
  location: 'San Francisco, CA',
  currentSalary: 95000,
  marketRate: 120000,
  achievements: [
    'Led a major project or initiative',
    'Received positive performance reviews',
    'Took on additional responsibilities'
  ]
}

// Load saved player data from localStorage
const loadSavedData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function App() {
  // Check for ?skip in URL to skip setup screen
  const skipSetup = new URLSearchParams(window.location.search).has('skip')
  const savedData = loadSavedData()

  // Game phases: 'setup' → 'negotiation' (brief is now a modal inside negotiation)
  const [gamePhase, setGamePhase] = useState(() => {
    if (skipSetup) return 'negotiation'
    if (savedData) return 'negotiation'
    return 'setup'
  })
  const [playerData, setPlayerData] = useState(() => {
    if (skipSetup) return DEV_PLAYER_DATA
    if (savedData) return savedData
    return null
  })

  // Save playerData to localStorage when it changes
  useEffect(() => {
    if (playerData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData))
    }
  }, [playerData])

  const handleSetupComplete = (data) => {
    console.log('Setup complete! Player data:', data)
    setPlayerData(data)
    setGamePhase('negotiation')
  }

  const handleNewSettings = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPlayerData(null)
    setGamePhase('setup')
  }

  const handleNegotiationComplete = (result) => {
    console.log('Negotiation complete!', result)
  }

  return (
    <>
      {gamePhase === 'setup' && (
        <SetupScreen onComplete={handleSetupComplete} />
      )}

      {gamePhase === 'negotiation' && (
        <NegotiationScreen
          playerData={playerData}
          onComplete={handleNegotiationComplete}
          onNewSettings={handleNewSettings}
        />
      )}
    </>
  )
}

export default App