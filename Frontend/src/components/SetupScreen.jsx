import { useState } from 'react'
import { SALARY_DATABASE, ACHIEVEMENT_BONUSES, EXPERIENCE_LEVELS, LOCATIONS } from '../data/salaryData'
import { getSalaryData } from '../services/api'

function SetupScreen({ onComplete }) {
  // State variables
  const [jobTitle, setJobTitle] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [location, setLocation] = useState('')
  const [currentSalary, setCurrentSalary] = useState('')
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get list of options for dropdowns
  const jobTitles = Object.keys(SALARY_DATABASE)
  const experienceLevels = Object.keys(EXPERIENCE_LEVELS)
  const locationsList = LOCATIONS
  const achievementsList = Object.keys(ACHIEVEMENT_BONUSES)

  // Handle achievement checkbox toggle
  const toggleAchievement = (achievement) => {
    if (achievements.includes(achievement)) {
      setAchievements(achievements.filter(a => a !== achievement))
    } else {
      setAchievements([...achievements, achievement])
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!jobTitle || !experienceLevel || !currentSalary) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Fetch salary data from backend
      const salaryData = await getSalaryData(jobTitle)
      
      // Adjust market rate based on experience level
      const experienceMultiplier = EXPERIENCE_LEVELS[experienceLevel]
      const adjustedMarketRate = Math.round(salaryData.marketRate * experienceMultiplier)
      
      // Pass data to parent component
      onComplete({
        jobTitle,
        experienceLevel,
        location: location || null,
        currentSalary: parseFloat(currentSalary),
        achievements,
        marketRate: adjustedMarketRate,
        salaryRange: salaryData.range
      })
    } catch (err) {
      setError('Failed to fetch salary data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Salary Negotiation Simulator
        </h1>
        <p className="text-gray-600 mb-8">
          Practice negotiating your salary with confidence
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <select
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Select your role...</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Select your experience level...</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (State) (optional)
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select your state...</option>
              {locationsList.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Current Salary Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Yearly Salary (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(e.target.value)}
                placeholder="75000"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Achievements Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Achievements (optional)
            </label>
            <div className="space-y-2">
              {achievementsList.map(achievement => (
                <label
                  key={achievement}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={achievements.includes(achievement)}
                    onChange={() => toggleAchievement(achievement)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    disabled={loading}
                  />
                  <span className="text-gray-700">{achievement}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Prepare for Negotiation →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SetupScreen