import { useState, useEffect } from 'react'

function InstructionScreen({ onClose }) {
  const [isAnimating, setIsAnimating] = useState(true)

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-0"
      onClick={handleBackdropClick}
    >
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
            {/* Header */}
            <div className="mb-8 mt-12 text-center">
              <h2
                className="text-3xl font-bold mb-2 text-purple-600"
                style={{ fontFamily: 'Stardew Valley, monospace' }}
              >
                How to Play
              </h2>
              <p
                className="text-gray-600 text-sm"
                style={{ fontFamily: 'Stardew Valley, monospace' }}
              >
                Master the art of salary negotiation
              </p>
            </div>

            {/* Game Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                🎯 Your Mission
              </h3>
              <div className="bg-white/80 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  You’re about to negotiate your salary with Shlok, the hiring manager. As a female employee, you’ll face a fast-moving manager who hides behind “policy,” budgets, and subtle double standards to justify keeping your pay low. Your goal is to secure the wage you deserve through strategic conversation, data-driven arguments, and professional communication. Know your worth!
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-gray-400 my-6"></div>

            {/* How It Works */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-4" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                📋 How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl mt-1">1.</span>
                  <div>
                    <p className="font-bold text-gray-900" style={{ fontFamily: 'Stardew Valley, monospace' }}>Review Your Brief</p>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      You'll see your current salary, market average, target range, and achievements. Use this information strategically!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl mt-1">2.</span>
                  <div>
                    <p className="font-bold text-gray-900" style={{ fontFamily: 'Stardew Valley, monospace' }}>Talk to Shlok</p>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      Type your responses in the text box at the bottom. Shlok will respond based on your communication style and strategy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl mt-1">3.</span>
                  <div>
                    <p className="font-bold text-gray-900" style={{ fontFamily: 'Stardew Valley, monospace' }}>Watch the Offers</p>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      The current offer displays at the top. Track your progress as you negotiate toward your target!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl mt-1">4.</span>
                  <div>
                    <p className="font-bold text-gray-900" style={{ fontFamily: 'Stardew Valley, monospace' }}>Reach Your Goal</p>
                    <p className="text-gray-700 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                      The negotiation ends when you reach your target, accept an offer, or the conversation ends. You'll receive feedback on your performance!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-gray-400 my-6"></div>

            {/* Pro Tips */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-purple-700 mb-4" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                💡 Pro Tips
              </h3>
              <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-800 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  • <strong>Use data:</strong> Reference market rates and your achievements
                </p>
                <p className="text-gray-800 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  • <strong>Stay professional:</strong> Be confident but respectful
                </p>
                <p className="text-gray-800 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  • <strong>Be specific:</strong> Vague requests lead to vague responses
                </p>
                <p className="text-gray-800 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  • <strong>Don't rush:</strong> Take time to craft thoughtful responses
                </p>
                <p className="text-gray-800 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  • <strong>Reopen brief:</strong> Click the 📋 Brief button anytime to review your information
                </p>
                <p className="text-gray-800 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                  • <strong>Browser zoom:</strong> Use <kbd style={{ padding: '2px 6px', border: '1px solid #ccc', borderRadius: '3px', backgroundColor: '#f7f7f7', fontFamily: 'monospace', fontSize: '0.85em', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Ctrl</kbd> + <kbd style={{ padding: '2px 6px', border: '1px solid #ccc', borderRadius: '3px', backgroundColor: '#f7f7f7', fontFamily: 'monospace', fontSize: '0.85em', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>+</kbd>/<kbd style={{ padding: '2px 6px', border: '1px solid #ccc', borderRadius: '3px', backgroundColor: '#f7f7f7', fontFamily: 'monospace', fontSize: '0.85em', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>−</kbd> to adjust text size
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 border-4 border-purple-800 shadow-lg transition-colors"
                style={{ fontFamily: 'Stardew Valley, monospace', imageRendering: 'pixelated' }}
              >
                Got it, let's start!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructionScreen
