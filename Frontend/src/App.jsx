import { useState } from 'react'
import SetupScreen from './components/setupscreen'
import PreNegotiationBrief from './components/PreNegotiationBrief'

function App() {
  const [gamePhase, setGamePhase] = useState('setup')
  const [playerData, setPlayerData] = useState(null)

  const handleSetupComplete = (data) => {
    console.log('Setup complete! Player data:', data)
    setPlayerData(data)
    setGamePhase('brief')
  }

  const handleStartNegotiation = () => {
    console.log('Starting negotiation...')
    setGamePhase('negotiation')
  }

  return (
    <>
      {gamePhase === 'setup' && (
        <SetupScreen onComplete={handleSetupComplete} />
      )}
      
      {gamePhase === 'brief' && (
        <PreNegotiationBrief 
          playerData={playerData} 
          onStartNegotiation={handleStartNegotiation}
        />
      )}

      {gamePhase === 'negotiation' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Negotiation Screen
            </h1>
            <p className="text-gray-600">
              Coming soon... This is where the negotiation dialogue will happen!
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default App