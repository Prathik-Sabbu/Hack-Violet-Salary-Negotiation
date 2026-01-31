import { useState, useEffect } from 'react'
import TextArea from './TextArea'
import ShlokText from './ShlokText'
import PreNegotiationBrief from './PreNegotiationBrief'
import './NegotiationScreen.css'
import StaminaBar from './StaminaBar'

function NegotiationScreen({ playerData, onComplete }) {
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

  const MAX_ROUNDS = 5

  // ============================================================
  // PLACEHOLDER RESPONSES - REPLACE WITH GEMINI API CALL
  // ============================================================
  // TODO: Replace this with actual Gemini API integration
  // Example API call structure:
  //
  // async function getShlokResponse(playerMessage, conversationHistory, playerData) {
  //   const response = await fetch('/api/negotiate', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       playerMessage,
  //       conversationHistory,
  //       playerData,
  //       round: currentRound,
  //       maxRounds: MAX_ROUNDS
  //     })
  //   });
  //   const data = await response.json();
  //   return data.shlokResponse;
  // }
  // ============================================================

  const PLACEHOLDER_SHLOK_RESPONSES = [
    // Round 0 - Opening (used automatically)
    `Ah, ${playerData?.jobTitle || 'there'}! Come in, come in. Have a seat. So, I've been looking over your file... You wanted to discuss your compensation, correct?`,

    // Round 1 - After player's first response
    // TODO: Replace with Gemini API call - should respond to player's opening argument
    `I see, I see. You make some interesting points. But you know, the budget is tight this quarter. We were thinking more along the lines of a 3% increase. What makes you think you deserve more than that?`,

    // Round 2 - Middle negotiation
    // TODO: Replace with Gemini API call - should challenge player's justification
    `Hmm, those achievements are noted in your file. But everyone here works hard, you know? Tell me specifically - what value have you brought that goes above and beyond your job description?`,

    // Round 3 - Pushback
    // TODO: Replace with Gemini API call - should create tension/resistance
    `*leans back in chair* Look, I appreciate your confidence. But I've got other team members to think about too. If I give you that much, everyone will want the same. How do you suggest I handle that?`,

    // Round 4 - Softening
    // TODO: Replace with Gemini API call - should show willingness to negotiate
    `You know what, you've given me a lot to think about. I can see you've done your research. Let me be honest with you - I might be able to go a bit higher than I initially said. What's the absolute minimum you'd be happy with?`,

    // Round 5 - Final decision
    // TODO: Replace with Gemini API call - should give final offer based on player's performance
    `Alright, I've made my decision. Based on everything you've told me and your contributions to the team, here's what I can offer you... *shuffles papers*`
  ]

  // Get Shlok's response for current round
  // TODO: Replace this function body with actual Gemini API call
  const getShlokResponse = async (playerInput) => {
    setIsLoading(true)

    // ============================================================
    // TODO: REPLACE THIS PLACEHOLDER WITH GEMINI API CALL
    // ============================================================
    // const response = await fetchGeminiResponse({
    //   systemPrompt: `You are Shlok, a tough but fair manager in a salary negotiation...`,
    //   playerMessage: playerInput,
    //   conversationHistory: dialogue,
    //   playerData: playerData,
    //   round: currentRound,
    //   maxRounds: MAX_ROUNDS
    // });
    // return response;
    // ============================================================

    // Simulate API delay (playerInput will be sent to Gemini API)
    console.log('Player input for Gemini:', playerInput)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return placeholder response for current round
    const nextRound = currentRound + 1
    if (nextRound >= MAX_ROUNDS) {
      setIsLoading(false)
      return PLACEHOLDER_SHLOK_RESPONSES[MAX_ROUNDS] // Final response
    }

    setIsLoading(false)
    return PLACEHOLDER_SHLOK_RESPONSES[nextRound]
  }

  // Typewriter effect for Shlok's dialogue
  useEffect(() => {
    // Pause when brief modal is open
    if (showBrief) return

    if (gameState === 'shlok_speaking') {
      if (currentRound === 0 && textIndex < PLACEHOLDER_SHLOK_RESPONSES[0].length) {
        // Opening dialogue
        const timer = setTimeout(() => {
          setCurrentShlokText(prev => prev + PLACEHOLDER_SHLOK_RESPONSES[0][textIndex])
          setTextIndex(prev => prev + 1)
        }, 30)
        return () => clearTimeout(timer)
      } else if (currentRound === 0 && textIndex >= PLACEHOLDER_SHLOK_RESPONSES[0].length) {
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

    // Check if negotiation is complete
    if (currentRound >= MAX_ROUNDS - 1) {
      // TODO: Calculate final result and call onComplete
      console.log('Negotiation complete!')
      setGameState('complete')
      onComplete?.({ dialogue, finalRound: currentRound })
      return
    }

    // Get Shlok's response (placeholder or API)
    const shlokResponse = await getShlokResponse(playerInput)

    // Add Shlok's response to dialogue
    setDialogue(prev => [
      ...prev,
      { speaker: 'shlok', text: shlokResponse, round: currentRound + 1 }
    ])

    // Update state for next round
    setCurrentRound(prev => prev + 1)
    setCurrentShlokText(shlokResponse)
    setGameState('shlok_speaking')
  }

  // Negotiation complete screen
  if (gameState === 'complete') {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Negotiation Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            You completed {MAX_ROUNDS} rounds of negotiation with Shlok.
          </p>
          {/* TODO: Show final salary offer, score, feedback */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Results coming soon...</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Play Again
          </button>
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
