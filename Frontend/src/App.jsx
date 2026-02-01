import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import NegotiationScreen from './components/NegotiationScreen'
import { initializeChat } from './services/apiClient'

// LocalStorage key for persisting player data
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

function App() {
  // Check for ?skip in URL to skip setup screen
  const skipSetup = new URLSearchParams(window.location.search).has('skip')

  // Try to restore player data from localStorage
  // In dev mode, always start fresh unless ?resume is in URL
  const getSavedPlayerData = () => {
    // In development, skip localStorage unless explicitly requested
    if (import.meta.env.DEV && !new URLSearchParams(window.location.search).has('resume')) {
      return null
    }
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  // Game phases: 'setup' → 'negotiation' (brief is now a modal inside negotiation)
  const [gamePhase, setGamePhase] = useState(() => {
    if (skipSetup) return 'negotiation'
    // Check if we have saved player data to resume
    const savedData = getSavedPlayerData()
    if (savedData) return 'negotiation'
    return 'setup'
  })
  const [playerData, setPlayerData] = useState(() => {
    if (skipSetup) return DEV_PLAYER_DATA
    // Restore from localStorage if available
    return getSavedPlayerData()
  })

  // Reset backend chat on mount if we have existing player data (page reload case)
  useEffect(() => {
    if (playerData && gamePhase === 'negotiation') {
      initializeChat().catch(err => {
        console.error('Failed to initialize chat on reload:', err)
      })
    }
  }, []) // Only run on mount

  const handleSetupComplete = (data) => {
    console.log('Setup complete! Player data:', data)
    // Save to localStorage for reload persistence
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (err) {
      console.error('Failed to save player data to localStorage:', err)
    }
    setPlayerData(data)
    setGamePhase('negotiation')
  }

  const handleNewSettings = () => {
    // Clear saved data when starting fresh
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('Failed to clear localStorage:', err)
    }
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