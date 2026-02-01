import { useState, useEffect } from 'react'
import { calculateTargetSalary, initializeChat } from '../services/apiClient'
import { ACHIEVEMENT_BONUSES } from '../data/salaryData'

function PreNegotiationBrief({ playerData, onClose }) {
  const [targetData, setTargetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const [targetGoal, setTargetGoal] = useState('')

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!targetGoal || Number(targetGoal) <= 0) {
      alert('Please enter a valid target salary')
      return
    }

    try {
      await initializeChat({
        startingSalary: playerData.currentSalary,
        jobTitle: playerData.jobTitle,
        marketAverage: playerData.marketRate,
        targetGoal: Number(targetGoal),
      })

      onClose({ ...playerData, targetGoal: Number(targetGoal) })
    } catch (err) {
      console.error('Failed to initialize chat:', err)
      alert('Failed to start negotiation. Please try again.')
    }
  }

  useEffect(() => {
    const fetchTargetSalary = async () => {
      try {
        const result = await calculateTargetSalary(
          playerData.marketRate,
          playerData.achievements,
          playerData.currentSalary
        )
        setTargetData(result)
      } catch (err) {
        console.error('Failed to calculate target:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTargetSalary()
  }, [playerData])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-yellow-50 border-8 border-gray-800 p-8">
          Calculating your target salary...
        </div>
      </div>
    )
  }

  if (!targetData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-yellow-50 border-8 border-gray-800 p-8 text-red-700">
          Error calculating salary.
        </div>
      </div>
    )
  }

  const bonusPercentage = (targetData.bonusPercentage * 100).toFixed(0)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-yellow-50 border-8 border-gray-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-4 relative" style={{ imageRendering: 'pixelated' }}>
        
        {/* Red vertical margin line */}
        <div className="absolute top-0 bottom-0 left-16 w-0.5 bg-red-400 opacity-50 z-0"></div>
        {/* Binding holes */}
        <div className="absolute top-6 left-0 right-0 flex justify-around px-12 z-10">
          <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
          <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
          <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-gray-600"></div>
        </div>

        <div
          className="p-6 relative z-10 pl-12"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 31px, #d1d5db 31px, #d1d5db 32px)',
            backgroundSize: '100% 32px',
            minHeight: '100%',
          }}
        >
          {/* Header */}
          <div className="text-center mb-6 border-b-4 border-gray-800 pb-4 mt-12">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              Pre-Negotiation Brief
            </h1>
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Stardew Valley, monospace' }}>
              Know your worth before you negotiate
            </p>
          </div>

          {/* Salary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border-4 border-gray-800 p-4 text-center">
              <p className="text-sm">Your Current Salary</p>
              <p className="text-xl font-bold">{formatCurrency(playerData.currentSalary)}</p>
            </div>

            <div className="bg-blue-100 border-4 border-gray-800 p-4 text-center">
              <p className="text-sm">Market Average</p>
              <p className="text-xl font-bold">{formatCurrency(playerData.marketRate)}</p>
              <p className="text-xs">for {playerData.jobTitle}</p>
            </div>

            <div
              className="bg-green-100 border-4 border-gray-800 p-4 text-center relative cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <p className="text-sm">Your Target Range</p>
              <p className="text-xl font-bold">
                {formatCurrency(targetData.targetRange[0])} – {formatCurrency(targetData.targetRange[1])}
              </p>
              <p className="text-xs text-gray-600">+{bonusPercentage}% for achievements</p>

              {showTooltip && (
                <div className="absolute z-10 w-72 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl left-1/2 -translate-x-1/2 -top-2 -translate-y-full">
                  <div className="font-semibold mb-2 text-green-300">Calculation Breakdown</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>{targetData.calculation.baseType}</span>
                      <span>{formatCurrency(targetData.calculation.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between text-green-300">
                      <span>Achievement Bonus</span>
                      <span>+{formatCurrency(targetData.calculation.bonusAmount)}</span>
                    </div>
                    <hr className="border-gray-700" />
                    <div className="flex justify-between font-bold">
                      <span>Target</span>
                      <span>{formatCurrency(targetData.calculation.targetSalary)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          {playerData.achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">Your Achievements</h3>
              <div className="bg-white border-4 border-gray-800 p-4">
                <ul className="space-y-2">
                  {playerData.achievements.map((a, i) => (
                    <li key={i} className="flex justify-between">
                      <span>✓ {a}</span>
                      {ACHIEVEMENT_BONUSES[a] && (
                        <span className="font-bold text-green-700">
                          +{(ACHIEVEMENT_BONUSES[a] * 100).toFixed(0)}%
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Profile */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">Your Profile</h3>
            <div className="bg-white border-4 border-gray-800 p-4 grid grid-cols-2 gap-4 text-sm">
              <div><strong>Experience:</strong> {playerData.experienceLevel}</div>
              <div><strong>Location:</strong> {playerData.location || 'N/A'}</div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-2">💡 Quick Negotiation Tips</h3>
            <div className="bg-yellow-100 border-4 border-gray-800 p-4 text-sm space-y-2">
              <p>1. Lead with data and accomplishments</p>
              <p>2. Avoid hedging language</p>
              <p>3. Anchor in your range ({formatCurrency(targetData.targetRange[0])} – {formatCurrency(targetData.targetRange[1])})</p>
              <p>4. Never accept the first counter</p>
            </div>
          </div>

          {/* Target Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Your Target Salary Goal (USD) *</label>
              <input
                type="number"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder={targetData.targetRange[1]}
                className="w-full px-4 py-2 border-4 border-gray-800"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 border-4 border-gray-800"
            >
              Got it, let’s negotiate!
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default PreNegotiationBrief
