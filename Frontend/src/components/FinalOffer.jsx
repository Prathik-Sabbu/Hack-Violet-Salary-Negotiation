import { useState, useEffect } from 'react'
import { sendChatMessage } from '../services/apiClient'


function FinalOffer({ playerData, currentOffer, onPlayAgain, onNewSettings, outcome }) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [aiFeedback, setAiFeedback] = useState({
    pros: [],
    mistakes: [],
    tips: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEarlyEnd = ['too_rude', 'end_convo'].includes(outcome?.status);
  const showTips = !isEarlyEnd;

  const salaryIncrease = currentOffer - (playerData?.currentSalary || 0)
  const increasePercent = isEarlyEnd ? 0 : (
    playerData?.currentSalary
      ? ((salaryIncrease / playerData.currentSalary) * 100).toFixed(1)
      : 0
  )

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showTips) return;

    const fetchAiFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await sendChatMessage('give tips');
        const text = response?.text ?? '';
        const items = typeof text === 'string' ? JSON.parse(text) : text;
        const arr = Array.isArray(items) ? items : [String(text || '')];

        setAiFeedback({
          pros: arr.filter(p => String(p).toLowerCase().includes('what you did well:')),
          mistakes: arr.filter(p => String(p).toLowerCase().includes('area for improvement:')),
          tips: arr.filter(p => String(p).toLowerCase().includes('tip:')),
        });
      } catch (error) {
        console.error('Error fetching AI tips:', error);
        setAiFeedback({ pros: [], mistakes: [], tips: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiFeedback();
  }, [showTips]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-0">
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
            <div className="mb-8 mt-12 flex flex-col items-center justify-center text-center">
                <h2
                className={`text-5xl font-bold ${showTips ? 'mb-2' : 'mb-6'} ${outcome?.color || 'text-gray-900'}`}
                style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '3.5rem' }}
                >
                {outcome?.title || 'Negotiation Complete'}
                </h2>

    {showTips && (
      <p
        className="text-gray-600 text-lg mb-6"
        style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.375rem' }}
      >
        {outcome?.message || 'Review your results'}
      </p>
    )}
  </div>


            {/* Salary Comparison Section */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-blue-700 mb-4" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '2.125rem' }}>
                💰 Final Results
              </h3>
              <div className="bg-white/80 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-600" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.375rem' }}>Starting Salary:</span>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.75rem' }}>
                    ${(playerData?.currentSalary || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-600" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.375rem' }}>Final Offer:</span>
                  <span className={`text-2xl font-bold ${isEarlyEnd ? 'text-red-600' : 'text-green-600'}`} style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.75rem' }}>
                    {isEarlyEnd ? 'Incomplete Offer' : `$${currentOffer.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-600" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.375rem' }}>Target Range:</span>
                  <span className="text-lg font-medium" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.375rem' }}>
                    ${(playerData?.salaryRange?.[0] || 0).toLocaleString()} - ${(playerData?.salaryRange?.[1] || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                  <span className="text-lg text-gray-600" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.375rem' }}>Increase:</span>
                  <span className={`text-3xl font-bold ${isEarlyEnd ? 'text-red-600' : salaryIncrease > 0 ? 'text-green-600' : salaryIncrease < 0 ? 'text-red-600' : 'text-gray-600'}`} style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '2.125rem' }}>
                    {isEarlyEnd ? '0%' : `${salaryIncrease >= 0 ? '+' : ''}${increasePercent}%`}
                    {!isEarlyEnd && (
                      <span className="text-lg font-normal ml-1">
                        (${salaryIncrease >= 0 ? '+' : ''}{salaryIncrease.toLocaleString()})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {showTips ? (
              <>
                {/* Divider */}
                <div className="border-t-4 border-gray-400 my-6"></div>

                {/* What You Did Well */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-blue-700 mb-4" style={{ fontSize: '1.5rem' }}>
                    ✅ What You Did Well
                  </h3>
                  <div className="space-y-3">
                    {(isLoading ? ['Loading...'] : aiFeedback.pros).map((pro, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-blue-600 font-bold mt-1">{index + 1}.</span>
                        <p className="text-gray-800 leading-relaxed">{pro}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-4 border-gray-400 my-6"></div>

                {/* Areas for Improvement */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-red-700 mb-4" style={{ fontSize: '1.5rem' }}>
                    ❌ Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    {(isLoading ? ['Loading...'] : aiFeedback.mistakes).map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">{index + 1}.</span>
                        <p className="text-gray-800 leading-relaxed">{mistake}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-4 border-gray-400 my-6"></div>

                {/* Tips */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-green-700 mb-4" style={{ fontSize: '1.5rem' }}>💡 Tips for Next Time</h3>
                  <div className="space-y-3">
                    {(isLoading ? ['Loading...'] : aiFeedback.tips).map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-green-600 font-bold mt-1">•</span>
                        <p className="text-gray-800 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Areas for Improvement for too_rude / end_convo */
              <>
                <div className="border-t-4 border-gray-400 my-6"></div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-red-700 mb-4" style={{ fontSize: '1.5rem' }}>
                    ❌ Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'vt323-regular-webfont, monospace' }}>
                      {outcome?.status === 'too_rude'
                        ? 'The conversation ended due to unprofessional conduct.'
                        : "You didn't make meaningful points and caused the conversation to end early."}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={onPlayAgain}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 border-4 border-purple-800 shadow-lg transition-colors"
                style={{ fontFamily: 'vt323-regular-webfont, monospace', imageRendering: 'pixelated' }}
              >
                Play Again
              </button>
              <button
                onClick={onNewSettings}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 border-4 border-gray-800 shadow-lg transition-colors"
                style={{ fontFamily: 'vt323-regular-webfont, monospace', imageRendering: 'pixelated' }}
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
