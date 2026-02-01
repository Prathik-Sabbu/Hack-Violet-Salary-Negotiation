import { useState, useEffect } from 'react'
import TextArea from './TextArea'
import ShlokText from './ShlokText'
import PreNegotiationBrief from './NegotiationBrief'
import './NegotiationScreen.css'
import StaminaBar from './StaminaBar'
import { initializeChat, sendChatMessage } from '../services/apiClient'

function NegotiationScreen({ playerData, onComplete, onNewSettings }) {
  // Game states: 'shlok_speaking' → 'player_typing' → loop → 'complete'
  const [gameState, setGameState] = useState('shlok_speaking')
  const [playerMessage, setPlayerMessage] = useState('')
  const [dialogue, setDialogue] = useState([])
  const [currentShlokText, setCurrentShlokText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showBrief, setShowBrief] = useState(true) // Opens automatically on load
  const images = ['shlok_idle.png', 'shlok_cinema.png', 'shlok_uninterested.png'];
  const [index, setIndex] = useState(0);

  // AI response metadata
  const [currentOffer, setCurrentOffer] = useState(playerData?.currentSalary || 0)
  const [negotiationStatus, setNegotiationStatus] = useState('negotiating')
  const [hint, setHint] = useState('')

  const MAX_ROUNDS = 5

  // Terminal statuses that end the negotiation
  const TERMINAL_STATUSES = ['accepted_distraction', 'target_reached', 'too_rude', 'end_convo']

  // Opening message for Shlok (round 0)
  const OPENING_MESSAGE = `Ah, ${playerData?.jobTitle || 'there'}! [THIS IS PLACEHOLDER] Come in, come in. Have a seat. So, I've been looking over your file... You wanted to discuss your compensation. Why are you here?`

  // Get Shlok's response from the AI backend
  const getShlokResponse = async (playerInput) => {
    setIsLoading(true)

    try {
      const response = await sendChatMessage(playerInput)

      // Update metadata state
      if (response.state) {
        if (response.state.current_offer !== undefined) {
          setCurrentOffer(response.state.current_offer)
        }
        if (response.state.status) {
          setNegotiationStatus(response.state.status)
        }
        if (response.state.hint) {
          setHint(response.state.hint)
        } else {
          setHint('')
        }
      }

      setIsLoading(false)
      return {
        text: response.text,
        state: response.state
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      setIsLoading(false)
      return {
        text: "I'm having trouble processing that. Let's continue - what were you saying?",
        state: null
      }
    }
  }

  // Typewriter effect for Shlok's dialogue
  useEffect(() => {
    // Pause when brief modal is open
    if (showBrief) return

    if (gameState === 'shlok_speaking') {
      if (currentRound === 0 && textIndex < OPENING_MESSAGE.length) {
        // Opening dialogue
        const timer = setTimeout(() => {
          setCurrentShlokText(prev => prev + OPENING_MESSAGE[textIndex])
          setTextIndex(prev => prev + 1)
        }, 30)
        return () => clearTimeout(timer)
      } else if (currentRound === 0 && textIndex >= OPENING_MESSAGE.length) {
        // Opening finished
        const timer = setTimeout(() => {
          setGameState('player_typing')
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [gameState, textIndex, currentRound, showBrief])

  // Typewriter for subsequent rounds
  useEffect(() => {
    // Pause when brief modal is open
    if (showBrief) return

    if (gameState === 'shlok_speaking' && currentRound > 0 && currentShlokText) {
      // Text is already set, just transition to player typing after a delay
      const timer = setTimeout(() => {
        setGameState('player_typing')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [gameState, currentRound, currentShlokText, showBrief])

  // Handle player message submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!playerMessage.trim() || isLoading) return

    // Add player's message to dialogue
    setDialogue(prev => [
      ...prev,
      { speaker: 'player', text: playerMessage, round: currentRound }
    ])

    const playerInput = playerMessage
    setPlayerMessage('')

    // Get Shlok's response from AI
    const shlokResponse = await getShlokResponse(playerInput)

    // Add Shlok's response to dialogue
    setDialogue(prev => [
      ...prev,
      { speaker: 'shlok', text: shlokResponse.text, round: currentRound + 1 }
    ])

    // Check for terminal status or max rounds
    const status = shlokResponse.state?.status
    if (TERMINAL_STATUSES.includes(status) || currentRound >= MAX_ROUNDS - 1) {
      console.log('Negotiation complete!', { status, currentOffer })
      setGameState('complete')
      onComplete?.({
        dialogue,
        finalRound: currentRound,
        finalOffer: shlokResponse.state?.current_offer || currentOffer,
        status: status || 'max_rounds'
      })
      return
    }

    // Update state for next round
    setCurrentRound(prev => prev + 1)
    setCurrentShlokText(shlokResponse.text)
    setGameState('shlok_speaking')
  }

  // Get outcome message based on status
  const getOutcomeMessage = () => {
    switch (negotiationStatus) {
      case 'target_reached':
        return { title: 'Congratulations!', message: 'You successfully negotiated to your target salary!', color: 'text-green-600' }
      case 'accepted_distraction':
        return { title: 'Deal Made', message: 'You accepted an alternative offer (title/PTO).', color: 'text-blue-600' }
      case 'too_rude':
        return { title: 'Negotiation Failed', message: 'The conversation ended due to unprofessional conduct.', color: 'text-red-600' }
      case 'end_convo':
        return { title: 'Negotiation Ended', message: 'Shlok ended the conversation. Try providing more specific data next time.', color: 'text-orange-600' }
      case 'stalled':
        return { title: 'Negotiation Stalled', message: 'You ran out of time without making progress.', color: 'text-yellow-600' }
      default:
        return { title: 'Negotiation Complete', message: `You completed ${currentRound + 1} rounds of negotiation.`, color: 'text-gray-600' }
    }
  }

  const handlePlayAgain = async () => {
  // Reset game state
  setGameState('shlok_speaking')
  setPlayerMessage('')
  setDialogue([])
  setCurrentShlokText('')
  setTextIndex(0)
  setCurrentRound(0)
  setIsLoading(false)
  setShowBrief(true)
  setCurrentOffer(playerData?.currentSalary || 0)
  setNegotiationStatus('negotiating')
  setHint('')
  
  // Reset backend chat
  try {
    await initializeChat()
  } catch (err) {
    console.error('Failed to initialize chat:', err)
  }
}

  useEffect(() => {
    if (gameState === 'complete') {
      (async () => {
        try {
          await initializeChat()
        } catch (err) {
          console.error('Failed to initialize chat:', err)
        }
      })()
    }
  }, [gameState])

  // Negotiation complete screen
  if (gameState === 'complete') {
    const outcome = getOutcomeMessage()
    const salaryIncrease = currentOffer - (playerData?.currentSalary || 0)
    const increasePercent = playerData?.currentSalary
      ? ((salaryIncrease / playerData.currentSalary) * 100).toFixed(1)
      : 0

    return (
      <div className="game-container relative flex items-center justify-center p-4">
        {/* Shlok background */}
        <img
          src="/shlok_1.png"
          alt="Shlok's Office"
          className="absolute inset-0 w-full h-full object-cover pixel-art"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 bg-white/95 rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <h1 className={`text-3xl font-bold mb-2 ${outcome.color}`}>
            {outcome.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {outcome.message}
          </p>

          {/* Final offer display */}
          <div className="bg-gray-100 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Starting Salary</p>
                <p className="text-xl font-bold text-gray-800">
                  ${(playerData?.currentSalary || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Final Offer</p>
                <p className="text-xl font-bold text-green-600">
                  ${currentOffer.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Range</p>
                <p className="text-lg font-medium text-gray-700">
                  ${(playerData?.targetRange?.min || 0).toLocaleString()} - ${(playerData?.targetRange?.max || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Increase</p>
                <p className={`text-xl font-bold ${salaryIncrease > 0 ? 'text-green-600' : salaryIncrease < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {salaryIncrease >= 0 ? '+' : ''}{increasePercent}%
                  <span className="text-sm font-normal ml-1">
                    (${salaryIncrease >= 0 ? '+' : ''}{salaryIncrease.toLocaleString()})
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePlayAgain}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onNewSettings}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              New Settings
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main negotiation scene
  return (
    <div className="game-container relative">
      {/* Pre-Negotiation Brief Modal */}
      {showBrief && (
        <PreNegotiationBrief
          playerData={playerData}
          onClose={() => setShowBrief(false)}
        />
      )}

      {/* Shlok office background - full screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={`/${images[index]}`}
          alt="shlok"
          className="character"
          onClick={() => setIndex((prev) => (prev + 1) % images.length)}
        />
      </div>

      {/* Bottom-left button to reopen brief */}
      <button
        onClick={() => setShowBrief(true)}
        className="absolute bottom-4 left-4 z-30 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
      >
        <span>📋</span>
        <span className="text-sm font-medium">Brief</span>
      </button>

      {/* Top-left button for new settings */}
      <button
        onClick={onNewSettings}
        className="absolute top-4 left-4 z-30 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        <span className="text-sm font-medium">New Settings</span>
      </button>

      {/* Stamina Bar */}
      <StaminaBar 
        currentRound={currentRound}
        maxRounds={MAX_ROUNDS}
      />

      {/* Dialogue box */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mx-auto" style={{ width: '50vw', maxWidth: '800px' }}>
          {/* Shlok's speech bubble */}
          <ShlokText 
            gameState={gameState}
            currentShlokText={currentShlokText}
          />

          {/* Hint display when stalled */}
          {hint && negotiationStatus === 'stalled' && (
            <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <span className="font-bold">💡 Hint:</span> {hint}
              </p>
            </div>
          )}

          {/* Current offer display */}
          {currentOffer > 0 && (
            <div className="bg-green-100 border-2 border-green-400 rounded-lg px-4 py-2 mb-4 inline-block">
              <span className="text-green-800 text-sm font-medium">
                Current Offer: ${currentOffer.toLocaleString()}
              </span>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="bg-gray-100 border-4 border-gray-400 rounded-lg p-4 mb-4 text-center">
              <span className="text-gray-600 animate-pulse">Shlok is thinking...</span>
            </div>
          )}

          {/* Player input */}
          <TextArea 
            gameState={gameState}
            isLoading={isLoading}
            playerMessage={playerMessage}
            setPlayerMessage={setPlayerMessage}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default NegotiationScreen
