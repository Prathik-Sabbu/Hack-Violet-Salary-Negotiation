import { useState, useEffect } from 'react'
import { calculateTargetSalary } from '../services/apiClient'
import { ACHIEVEMENT_BONUSES } from '../data/salaryData'

function PreNegotiationBrief({ playerData, onClose }) {
  const [targetData, setTargetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  // Handle click outside to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  useEffect(() => {
    // Calculate target salary when component loads
    const fetchTargetSalary = async () => {
      try {
        const result = await calculateTargetSalary(
          playerData.marketRate,
          playerData.achievements,
          playerData.currentSalary
        )
        setTargetData(result)
      } catch (error) {
        console.error('Failed to calculate target:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTargetSalary()
  }, [playerData])

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-yellow-50 border-8 border-gray-800 shadow-2xl p-8" style={{ imageRendering: 'pixelated' }}>
          <p className="text-gray-800" style={{ fontFamily: 'Stardew Valley, monospace' }}>Calculating your target salary...</p>
        </div>
      </div>
    )
  }

  if (!targetData) {
    return (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-yellow-50 border-8 border-gray-800 shadow-2xl p-8" style={{ imageRendering: 'pixelated' }}>
          <p className="text-red-700 font-bold" style={{ fontFamily: 'Stardew Valley, monospace' }}>Error calculating salary. Please try again.</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const bonusPercentage = (targetData.bonusPercentage * 100).toFixed(0)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-yellow-50 border-8 border-gray-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-4 relative" 
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
          {/* Red vertical margin line - behind content */}
          <div className="absolute top-0 bottom-0 left-16 w-0.5 bg-red-400 opacity-50 z-0"></div>
          
          {/* Notepad binding holes */}
          <div className="absolute top-6 left-0 right-0 flex justify-around px-12 z-10">
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
          </div>
        
        {/* Header */}
        <div className="text-center mb-6 mt-8 pt-4 border-b-4 border-gray-800 pb-4 relative z-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>
            Pre-Negotiation Brief
          </h1>
          <p className="text-gray-700 text-sm" style={{ fontFamily: 'Stardew Valley, monospace' }}>
            Know your worth before you negotiate
          </p>
        </div>

        {/* Salary Data Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6 relative z-10">
          {/* Current Salary */}
          <div className="bg-white border-4 border-gray-800 p-4 text-center" style={{ imageRendering: 'pixelated' }}>
            <p className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>Your Current Salary</p>
            <p className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              {formatCurrency(playerData.currentSalary)}
            </p>
          </div>

          {/* Market Rate */}
          <div className="bg-blue-100 border-4 border-gray-800 p-4 text-center" style={{ imageRendering: 'pixelated' }}>
            <p className="text-sm text-blue-700 mb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>Market Average</p>
            <p className="text-xl font-bold text-blue-800" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              {formatCurrency(playerData.marketRate)}
            </p>
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              for {playerData.jobTitle}
            </p>
          </div>

          {/* Target Salary with Tooltip */}
          <div className="bg-green-100 border-4 border-gray-800 p-4 text-center relative" style={{ imageRendering: 'pixelated' }}>
            <p className="text-sm text-green-700 mb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>Your Target Range</p>
            <div 
              className="relative inline-block cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <p className="text-xl font-bold text-green-800" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                {formatCurrency(targetData.targetRange[0])} - {formatCurrency(targetData.targetRange[1])}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                +{bonusPercentage}% for achievements
              </p>
              
              {/* Hover Tooltip */}
              {showTooltip && (
                <div className="absolute z-10 w-72 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="text-xs font-semibold mb-2 text-green-300">Calculation Breakdown:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>{targetData.calculation.baseType}:</span>
                      <span className="font-mono">{formatCurrency(targetData.calculation.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between text-green-300">
                      <span>Achievement Bonus ({bonusPercentage}%):</span>
                      <span className="font-mono">+{formatCurrency(targetData.calculation.bonusAmount)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-1 mt-1"></div>
                    <div className="flex justify-between font-semibold">
                      <span>Target (mid-point):</span>
                      <span className="font-mono">{formatCurrency(targetData.calculation.targetSalary)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Range (±5%):</span>
                      <span className="font-mono">{formatCurrency(targetData.targetRange[0])} - {formatCurrency(targetData.targetRange[1])}</span>
                    </div>
                  </div>
                  {/* Triangle pointer */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Your Achievements */}
        {playerData.achievements.length > 0 && (
          <div className="mb-6 relative z-10">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              Your Achievements
            </h3>
            <div className="bg-white border-4 border-gray-800 p-4" style={{ imageRendering: 'pixelated' }}>
              <ul className="space-y-2">
                {playerData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">✓</span>
                      <span className="text-gray-800" style={{ fontFamily: 'Stardew Valley, monospace', fontSize: '0.9rem' }}>{achievement}</span>
                    </div>

                    {ACHIEVEMENT_BONUSES[achievement] && (
                      <span className="text-sm text-green-700 ml-4 whitespace-nowrap font-bold" style={{ fontFamily: 'Stardew Valley, monospace' }}>
                        +{(ACHIEVEMENT_BONUSES[achievement] * 100).toFixed(0)}%
                      </span>
                    )}  
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Profile Summary */}
        <div className="mb-6 relative z-10">
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>
            Your Profile
          </h3>
          <div className="bg-white border-4 border-gray-800 p-4" style={{ imageRendering: 'pixelated' }}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-700" style={{ fontFamily: 'Stardew Valley, monospace' }}>Experience Level:</span>
                <span className="ml-2 font-bold text-gray-800" style={{ fontFamily: 'Stardew Valley, monospace' }}>{playerData.experienceLevel}</span>
              </div>
              <div>
                <span className="text-gray-700" style={{ fontFamily: 'Stardew Valley, monospace' }}>Location:</span>
                <span className="ml-2 font-bold text-gray-800" style={{ fontFamily: 'Stardew Valley, monospace' }}>{playerData.location}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              * Location data is for reference only
            </div>
          </div>
        </div>

        {/* Negotiation Tips */}
        <div className="mb-6 relative z-10">
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-800 pb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>
            💡 Quick Negotiation Tips
          </h3>
          <div className="bg-yellow-100 border-4 border-gray-800 p-4" style={{ imageRendering: 'pixelated' }}>
            <ul className="space-y-2 text-sm text-gray-800">
              <li className="flex items-start">
                <span className="font-bold mr-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>1.</span>
                <span style={{ fontFamily: 'Stardew Valley, monospace' }}>Lead with data and your accomplishments</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>2.</span>
                <span style={{ fontFamily: 'Stardew Valley, monospace' }}>Stay confident - avoid words like "just," "maybe," or "sorry"</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>3.</span>
                <span style={{ fontFamily: 'Stardew Valley, monospace' }}>Anchor your ask in the target range ({formatCurrency(targetData.targetRange[0])} - {formatCurrency(targetData.targetRange[1])})</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>4.</span>
                <span style={{ fontFamily: 'Stardew Valley, monospace' }}>Don't accept the first counter-offer - negotiate!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 border-4 border-gray-800 transition-all text-lg active:translate-y-1 relative z-10"
          style={{ fontFamily: 'Stardew Valley, monospace', imageRendering: 'pixelated' }}
        >
          Got it, let's negotiate!
        </button>
        </div>
      </div>
    </div>
  )
}

export default PreNegotiationBrief