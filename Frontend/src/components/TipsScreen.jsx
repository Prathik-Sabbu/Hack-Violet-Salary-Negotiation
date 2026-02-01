import { useEffect, useState, useRef } from 'react'

function TipsScreen({ onClose, isPeeking, onExpand }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimerRef = useRef(null)

  // Trigger bounce animation when transitioning from peeking to expanded
  useEffect(() => {
    if (!isPeeking) {
      // Expanded state - trigger animation
      setIsAnimating(true)
      // Clear any existing timer
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
      // Set new timer
      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false)
        animationTimerRef.current = null
      }, 1200)
    }
    
    // Cleanup
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
        animationTimerRef.current = null
      }
    }
  }, [isPeeking])

  // Handle click outside to close modal (only when expanded)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isPeeking) {
      onClose?.()
    }
  }

  // Handle peek area click
  const handlePeekClick = () => {
    if (isPeeking) {
      onExpand?.()
    }
  }

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
    <div
      className={`fixed inset-0 flex items-end justify-center z-50 transition-colors duration-300 ${
        isPeeking ? 'bg-transparent pointer-events-none p-0' : 'bg-black/60 p-4'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-yellow-50 shadow-2xl max-w-3xl w-full relative pointer-events-auto ${
          isPeeking ? 'h-24 cursor-pointer hover:h-28 transition-all duration-300' : 
          'max-h-[90vh] overflow-y-auto my-4'
        } ${
          isAnimating ? 'animate-slideUpBounce' : ''
        }`}
        style={{ imageRendering: 'pixelated' }}
        onClick={handlePeekClick}
      >
        <div 
          className="p-6 relative"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #d1d5db 31px, #d1d5db 32px)',
            backgroundSize: '100% 32px',
            minHeight: '100%'
          }}
        >
          {/* Red vertical margin line - behind content */}
          <div className="absolute top-0 bottom-0 left-16 w-0.5 bg-red-400 opacity-50 z-0"></div>
          
          {/* Notepad binding holes */}
          <div className="absolute top-6 left-0 right-0 flex justify-around px-12 z-10">
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
          </div>

          {/* Peek Header - shown when peeking */}
          {isPeeking && (
            <div className="relative z-10 pl-12 pt-8 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  📊 Negotiation Feedback
                </h2>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  👆 Click to expand
                </p>
              </div>
            </div>
          )}

          {/* Full Content - shown when expanded */}
          {!isPeeking && (
          <div className="relative z-10 pl-12">
            {/* Header */}
            <div className="mb-8 mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                📊 Negotiation Feedback
              </h2>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                Review your performance and learn from your mistakes
              </p>
            </div>

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

            {/* Close Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="bg-gray-800 hover:bg-gray-900 text-yellow-50 font-bold py-3 px-8 border-4 border-gray-900 shadow-lg transition-colors"
                style={{ fontFamily: 'Stardew Valley, monospace', imageRendering: 'pixelated' }}
              >
                Close
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TipsScreen
