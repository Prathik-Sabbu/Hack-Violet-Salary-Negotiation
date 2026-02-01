import { useState, useEffect } from 'react'

function FinalOffer({ playerData, currentOffer, onPlayAgain, onNewSettings, outcome }) {
  const [isAnimating, setIsAnimating] = useState(true)
  
  const salaryIncrease = currentOffer - (playerData?.currentSalary || 0)
  const increasePercent = playerData?.currentSalary
    ? ((salaryIncrease / playerData.currentSalary) * 100).toFixed(1)
    : 0

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Placeholder data - will be replaced with actual analysis
  const mistakes = [
    "Did not provide specific data or metrics to support salary request",
    "Accepted first counter-offer without further negotiation",
    "Failed to mention market research or comparable salaries",
    "Got distracted by alternative benefits instead of focusing on base salary",
    "Used emotional language instead of professional, data-driven arguments"
  ]

  const tips = [
    "Always research market rates for your role before negotiating",
    "Use specific numbers and data points to justify your ask",
    "Practice active listening and acknowledge the other party's constraints",
    "Be prepared to walk away if the offer doesn't meet your minimum requirements",
    "Consider the total compensation package, not just base salary",
    "Build rapport before making demands - start with gratitude",
    "Use silence strategically after stating your position",
    "Have 2-3 concrete achievements ready to cite as evidence of your value"
  ]

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50 p-0">
      <div 
        className={`bg-yellow-50 shadow-2xl max-w-3xl w-full relative pointer-events-auto max-h-[90vh] overflow-y-auto my-4 ${
          isAnimating ? 'animate-slideUpBounce' : ''
        }`}
        style={{ imageRendering: 'pixelated' }}
      >
        <div 
          className="p-6 relative"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #d1d5db 31px, #d1d5db 32px)',
            backgroundSize: '100% 32px',
            minHeight: '100%'
          }}
        >
          {/* Red vertical margin line */}
          <div className="absolute top-0 bottom-0 left-16 w-0.5 bg-red-400 opacity-50 z-0"></div>
          
          {/* Notepad binding holes */}
          <div className="absolute top-6 left-0 right-0 flex justify-around px-12 z-10">
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 pl-12">
            {/* Header with outcome */}
            <div className="mb-8 mt-12 text-center">
                <h2
                className={`text-3xl font-bold mb-2 ${outcome?.color || 'text-gray-900'}`}
                style={{ fontFamily: 'Stardew Valley, monospace' }}
                >
                {outcome?.title || 'Negotiation Complete'}
                </h2>

    <p
      className="text-gray-600 text-sm mb-6"
      style={{ fontFamily: 'Stardew Valley, monospace' }}
    >
      {outcome?.message || 'Review your results'}
    </p>
  </div>


            {/* Salary Comparison Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                💰 Final Results
              </h3>
              <div className="bg-white/80 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Stardew Valley, monospace' }}>Starting Salary:</span>
                  <span className="text-lg font-bold" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                    ${(playerData?.currentSalary || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Stardew Valley, monospace' }}>Final Offer:</span>
                  <span className="text-lg font-bold text-green-600" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                    ${currentOffer.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Stardew Valley, monospace' }}>Target Range:</span>
                  <span className="text-sm font-medium" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                    ${(playerData?.targetRange?.min || 0).toLocaleString()} - ${(playerData?.targetRange?.max || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Stardew Valley, monospace' }}>Increase:</span>
                  <span className={`text-xl font-bold ${salaryIncrease > 0 ? 'text-green-600' : salaryIncrease < 0 ? 'text-red-600' : 'text-gray-600'}`} style={{ fontFamily: 'Stardew Valley, monospace' }}>
                    {salaryIncrease >= 0 ? '+' : ''}{increasePercent}%
                    <span className="text-sm font-normal ml-1">
                      (${salaryIncrease >= 0 ? '+' : ''}{salaryIncrease.toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-gray-400 my-6"></div>

            {/* Mistakes Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-red-700 mb-4" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                ❌ Areas for Improvement
              </h3>
              <div className="space-y-3">
                {mistakes.map((mistake, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-red-600 font-bold mt-1" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      {index + 1}.
                    </span>
                    <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      {mistake}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-gray-400 my-6"></div>

            {/* Tips Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-4" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                💡 Tips for Next Time
              </h3>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      •
                    </span>
                    <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={onPlayAgain}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 border-4 border-purple-800 shadow-lg transition-colors"
                style={{ fontFamily: 'Stardew Valley, monospace', imageRendering: 'pixelated' }}
              >
                Play Again
              </button>
              <button
                onClick={onNewSettings}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 border-4 border-gray-800 shadow-lg transition-colors"
                style={{ fontFamily: 'Stardew Valley, monospace', imageRendering: 'pixelated' }}
              >
                New Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinalOffer
