import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import NegotiationScreen from './components/NegotiationScreen'

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

  // Game phases: 'setup' → 'negotiation' (brief is now a modal inside negotiation)
  const [gamePhase, setGamePhase] = useState(skipSetup ? 'negotiation' : 'setup')
  const [playerData, setPlayerData] = useState(skipSetup ? DEV_PLAYER_DATA : null)

  const handleSetupComplete = (data) => {
    console.log('Setup complete! Player data:', data)
    setPlayerData(data)
    setGamePhase('negotiation') // Go directly to negotiation
  }

  const handleNegotiationComplete = (result) => {
    console.log('Negotiation complete!', result)
    // TODO: Add results screen
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
        />
      )}
    </>
  )
}

export default App