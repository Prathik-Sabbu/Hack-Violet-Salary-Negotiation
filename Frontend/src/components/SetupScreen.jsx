import { useState } from 'react'
import { SALARY_DATABASE, ACHIEVEMENT_BONUSES, EXPERIENCE_LEVELS, LOCATIONS } from '../data/salaryData'
import { getSalaryData } from '../services/apiClient'

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
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Desk Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-800 to-amber-900" style={{ boxShadow: 'inset 0 4px 0 rgba(139, 92, 46, 0.6)' }}></div>
      

      
      {/* Monitor Container */}
      <div className="relative z-10 flex flex-col items-center" style={{ maxWidth: '1100px', width: '95%' }}>
        {/* Monitor Frame with Pixel Art Style */}
        <div className="relative bg-gray-900 p-4 shadow-2xl" style={{ 
          border: '8px solid #2a2a2a',
          borderRadius: '4px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 0 4px #1a1a1a'
        }}>
          {/* Screen Content Area */}
          <div className="relative bg-[#c3d9ff]" style={{ 
            width: '1000px',
            height: '620px',
            border: '4px solid #000',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
          }}>
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-white shadow-lg w-full h-full overflow-hidden" style={{ border: '1px solid #c3c3c3' }}>
                {/* Gmail-style header */}
                <div className="bg-[#f5f5f5] border-b border-gray-300 px-4 py-2">
                  <h1 className="text-base font-normal text-gray-800">New Message</h1>
                </div>

        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Headers */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-4 py-2 border-b border-gray-200">
              <label className="text-sm text-gray-600 w-16">To:</label>
              <input
                type="text"
                value="Shlok"
                readOnly
                className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center px-4 py-2">
              <label className="text-sm text-gray-600 w-16">Subject:</label>
              <input
                type="text"
                value="Salary Discussion Request"
                readOnly
                className="flex-1 text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Email Body */}
          <div className="px-4 py-4">
            <p className="text-sm text-gray-700 mb-4">Dear Shlok,</p>
            <p className="text-sm text-gray-700 mb-4">
              I would like to discuss my compensation. Here are my details:
            </p>

            {/* Form fields in email body - 2 column layout for compactness */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Job Title: <span className="text-red-600">*</span>
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
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

              {/* Experience Level */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Experience Level: <span className="text-red-600">*</span>
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                  required
                  disabled={loading}
                >
                  <option value="">Select experience level...</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Location (State):
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
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

              {/* Current Salary */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Current Yearly Salary (USD): <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1 text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(e.target.value)}
                    placeholder="75000"
                    className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mb-4">
              <label className="block text-xs text-gray-600 mb-2">
                My Key Achievements:
              </label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {achievementsList.map(achievement => (
                  <label
                    key={achievement}
                    className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={achievements.includes(achievement)}
                      onChange={() => toggleAchievement(achievement)}
                      className="w-3 h-3"
                      disabled={loading}
                    />
                    <span className="text-gray-700 text-xs">{achievement}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-700 mt-4">
              Best regards
            </p>
          </div>

          {/* Gmail-style footer with Send button */}
          <div className="bg-[#f5f5f5] border-t border-gray-300 px-4 py-3 flex items-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4d90fe] hover:bg-[#357ae8] text-white text-sm font-bold py-2 px-6 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: '1px solid #3079ed' }}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
            <span className="text-xs text-gray-500 ml-4">
              {loading ? 'Preparing negotiation data...' : ''}
            </span>
          </div>
        </form>
              </div>
            </div>
          </div>
          
          {/* Monitor Brand Logo (Pixel Style) */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-green-500" style={{ boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)' }}></div>
          </div>
        </div>
        
        {/* Monitor Stand - Pixel Art Style */}
        <div className="flex flex-col items-center">
          {/* Neck */}
          <div className="w-8 h-12 bg-gradient-to-b from-gray-700 to-gray-800" style={{ 
            border: '2px solid #1a1a1a',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
          }}></div>
          
          {/* Base */}
          <div className="relative">
            <div className="w-48 h-6 bg-gradient-to-b from-gray-800 to-gray-900" style={{ 
              border: '3px solid #1a1a1a',
              borderRadius: '2px',
              boxShadow: '0 6px 12px rgba(0,0,0,0.6)'
            }}></div>
            {/* Base Details - Pixel Style */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 bg-gray-700"></div>
              <div className="w-2 h-2 bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen