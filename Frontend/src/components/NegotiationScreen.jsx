import { useState, useEffect, useRef } from 'react'
import TextArea from './TextArea'
import ShlokText from './ShlokText'
import PreNegotiationBrief from './NegotiationBrief'
import FinalOffer from './FinalOffer'
import OfferChange from './OfferChange'
import './NegotiationScreen.css'
import { sendChatMessage } from '../services/apiClient'

function NegotiationScreen({ playerData, onComplete, onNewSettings, skipToEnd }) {
  // Game states: 'shlok_speaking' → 'player_typing' → loop → 'complete'
  const [gameState, setGameState] = useState(skipToEnd ? 'complete' : 'shlok_speaking')
  const [playerMessage, setPlayerMessage] = useState('')
  const [dialogue, setDialogue] = useState([])
  const [currentShlokText, setCurrentShlokText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showBrief, setShowBrief] = useState(skipToEnd ? false : true) // Skip brief if going to end
  const [isTextAnimating, setIsTextAnimating] = useState(false) // Track if text is typing
  const [fullResponseText, setFullResponseText] = useState('') // Store full text for typewriter

  // AI response metadata
  const [currentOffer, setCurrentOffer] = useState(skipToEnd ? 110000 : (playerData?.currentSalary || 0))
  const [negotiationStatus, setNegotiationStatus] = useState(skipToEnd ? 'target_reached' : 'negotiating')
  const [hint, setHint] = useState('')

  // Animation state for offer changes
  const [offerDelta, setOfferDelta] = useState(0)
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const [offerBoxPulse, setOfferBoxPulse] = useState('')
  const prevOfferRef = useRef(currentOffer)

  // Disappointed state - when negative indicators outweigh positive
  const [isDisappointed, setIsDisappointed] = useState(false)

  const MAX_ROUNDS = 5

  // Terminal statuses that end the negotiation
  const TERMINAL_STATUSES = ['accepted_distraction', 'target_reached', 'too_rude', 'end_convo']

  // Opening message for Shlok (round 0)
  const OPENING_MESSAGE = `Ah, hello ${playerData?.jobTitle || 'there'}! Why are you here?`

  // Get Shlok's response from the AI backend
  const getShlokResponse = async (playerInput) => {
    setIsLoading(true)

    try {
      const response = await sendChatMessage(playerInput)

      // Update metadata state
      if (response.state) {
        if (response.state.current_offer !== undefined) {
          const newOffer = response.state.current_offer
          const delta = newOffer - prevOfferRef.current

          // Trigger animation if there's a change
          if (delta !== 0) {
            setOfferDelta(delta)
            setAnimationTrigger(prev => prev + 1)

            // Add pulse effect to the offer box
            setOfferBoxPulse(delta > 0 ? 'offer-box-pulse-positive' : 'offer-box-pulse-negative')
            setTimeout(() => setOfferBoxPulse(''), 1200)
          }

          setCurrentOffer(newOffer)
          prevOfferRef.current = newOffer
        }
        if (response.state.status) {
          setNegotiationStatus(response.state.status)
        }
        if (response.state.hint) {
          setHint(response.state?.hint)
        } else {
          setHint('')
        }

        // Calculate if Shlok should look disappointed
        // Disappointed when negative indicators outweigh positive ones
        const negativeScore = (response.state.rude_streak || 0) +
                              (response.state.no_data_turns || 0) +
                              (response.state.repeat_streak || 0)
        const positiveScore = response.state.strong_argument_count || 0
        setIsDisappointed(negativeScore > positiveScore)
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

  // Typewriter effect for Shlok's dialogue (round 0)
  useEffect(() => {
    // Pause when brief modal is open
    if (showBrief) return

    if (gameState === 'shlok_speaking' && currentRound === 0) {
      if (textIndex === 0) {
        // Start animation
        setIsTextAnimating(true)
        setCurrentShlokText('')
      }
      
      if (textIndex < OPENING_MESSAGE.length) {
        // Opening dialogue
        const timer = setTimeout(() => {
          setCurrentShlokText(prev => prev + OPENING_MESSAGE[textIndex])
          setTextIndex(prev => prev + 1)
        }, 15)
        return () => clearTimeout(timer)
      } else if (textIndex >= OPENING_MESSAGE.length) {
        // Opening finished
        setIsTextAnimating(false)
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

    if (gameState === 'shlok_speaking' && currentRound > 0 && fullResponseText) {
      if (textIndex === 0) {
        // Start animation
        setIsTextAnimating(true)
        setCurrentShlokText('')
      }
      
      if (textIndex < fullResponseText.length) {
        // Character by character animation
        const timer = setTimeout(() => {
          setCurrentShlokText(prev => prev + fullResponseText[textIndex])
          setTextIndex(prev => prev + 1)
        }, 15)
        return () => clearTimeout(timer)
      } else if (textIndex >= fullResponseText.length) {
        // Animation finished
        setIsTextAnimating(false)
        const timer = setTimeout(() => {
          setGameState('player_typing')
        }, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [gameState, currentRound, fullResponseText, textIndex, showBrief])

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
    setFullResponseText(shlokResponse.text)
    setTextIndex(0) // Reset for typewriter
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

  const handlePlayAgain = () => {
    // Reset game state; brief will show and user must enter target goal again
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
    // Reset animation state
    setOfferDelta(0)
    setAnimationTrigger(0)
    setOfferBoxPulse('')
    prevOfferRef.current = playerData?.currentSalary || 0
    setIsDisappointed(false)
    // Chat is re-initialized when user submits the Pre-Negotiation Brief
  }


  // Negotiation complete screen
  if (gameState === 'complete') {
    const outcome = getOutcomeMessage()

    return (
      <div className="game-container relative flex items-center justify-center">
        {/* Background - same as main game screen */}
        <img
          src="/background.png"
          alt="Office Background"
          className="absolute inset-0 w-full h-full object-cover pixel-art"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* FinalOffer component now handles its own notepad display */}
        <FinalOffer 
          playerData={playerData} 
          currentOffer={currentOffer}
          outcome={outcome}
          onPlayAgain={handlePlayAgain}
          onNewSettings={onNewSettings}
        />
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

      {/* Background layer - separate from character */}
      <div className="absolute inset-0">
        <img
          src="background.png"
          alt="Office Background"
          className="background"
        />
      </div>

      {/* Character layer - positioned on top of background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={isDisappointed
            ? (isTextAnimating ? '/shlok_disappointed_mouth_open.png' : '/shlok_disappointed_mouth_closed.png')
            : (isTextAnimating ? '/shlok_idle_mouth_open.png' : '/shlok_idle_mouth_closed.png')
          }
          alt="shlok"
          className="character"
        />
      </div>

      {/* Current offer display - top center */}
      {currentOffer > 0 && (
        <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 z-30 bg-green-50 border-4 border-green-600 rounded-lg px-6 py-3 ${offerBoxPulse}`}>
          <span className="text-green-700 text-lg font-medium" style={{ fontFamily: 'vt323-regular-webfont, monospace' }}>
            Current Offer: ${currentOffer.toLocaleString()}
          </span>
        </div>
      )}

      {/* Floating offer change animation */}
      <OfferChange delta={offerDelta} trigger={animationTrigger} />

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
        <span className="text-sm font-medium">New Game</span>
      </button>

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
