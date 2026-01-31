import { useState, useEffect } from 'react'
import { calculateTargetSalary } from '../services/api'
import { ACHIEVEMENT_BONUSES } from '../data/salaryData'

function PreNegotiationBrief({ playerData, onStartNegotiation }) {
  const [targetData, setTargetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

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
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <p className="text-gray-600">Calculating your target salary...</p>
        </div>
      </div>
    )
  }

  if (!targetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <p className="text-red-600">Error calculating salary. Please try again.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pre-Negotiation Brief
          </h1>
          <p className="text-gray-600">
            Know your worth before you negotiate
          </p>
        </div>

        {/* Salary Data Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Current Salary */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Your Current Salary</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(playerData.currentSalary)}
            </p>
          </div>

          {/* Market Rate */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-sm text-blue-600 mb-2">Market Average</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(playerData.marketRate)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              for {playerData.jobTitle}
            </p>
          </div>

          {/* Target Salary with Tooltip */}
          <div className="bg-green-50 rounded-lg p-6 text-center relative">
            <p className="text-sm text-green-600 mb-2">Your Target Range</p>
            <div 
              className="relative inline-block cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(targetData.targetRange[0])} - {formatCurrency(targetData.targetRange[1])}
              </p>
              <p className="text-xs text-gray-500 mt-1">
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
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Your Achievements
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {playerData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{achievement}</span>
                    </div>

                    {ACHIEVEMENT_BONUSES[achievement] && (
                      <span className="text-sm text-green-600 ml-4 whitespace-nowrap">
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
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Your Profile
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Experience Level:</span>
                <span className="ml-2 font-semibold text-gray-800">{playerData.experienceLevel}</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-semibold text-gray-800">{playerData.location}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 italic">
              * Location data is for reference only and does not currently affect market rate calculations
            </div>
          </div>
        </div>

        {/* Negotiation Tips */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💡 Quick Negotiation Tips
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Lead with data and your accomplishments</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Stay confident - avoid words like "just," "maybe," or "sorry"</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Anchor your ask in the target range ({formatCurrency(targetData.targetRange[0])} - {formatCurrency(targetData.targetRange[1])})</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">4.</span>
                <span>Don't accept the first counter-offer - negotiate!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartNegotiation}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-200 shadow-lg text-lg"
        >
          Start Negotiation →
        </button>
      </div>
    </div>
  )
}

export default PreNegotiationBrief