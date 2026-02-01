import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import NegotiationScreen from './components/NegotiationScreen'

// LocalStorage key for persisting player data
const STORAGE_KEY = 'negotiation_player_data'
const SESSION_KEY = 'negotiation_session_active'

// Clear localStorage on fresh browser session (server restart)
// but preserve it on page reloads
if (!sessionStorage.getItem(SESSION_KEY)) {
  // Fresh browser session - clear saved state
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.setItem(SESSION_KEY, 'true')
}

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
  const urlParams = new URLSearchParams(window.location.search)
  const skipSetup = urlParams.has('skip')
  const showEndScreen = urlParams.has('end')

  // Try to restore player data from localStorage
  const getSavedPlayerData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  // Game phases: 'setup' → 'negotiation' (brief is now a modal inside negotiation)
  const [gamePhase, setGamePhase] = useState(() => {
    if (skipSetup || showEndScreen) return 'negotiation'
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

  // Chat is initialized when the user submits the Pre-Negotiation Brief with their target goal
  // (no early init — we need startingSalary, jobTitle, marketAverage, targetGoal)

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
          skipToEnd={showEndScreen}
          skipIntro={skipSetup}
        />
      )}
    </>
  )
}

export default App