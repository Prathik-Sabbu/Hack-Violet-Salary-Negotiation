function FinalOffer({ playerData, currentOffer }) {
  const salaryIncrease = currentOffer - (playerData?.currentSalary || 0)
  const increasePercent = playerData?.currentSalary
    ? ((salaryIncrease / playerData.currentSalary) * 100).toFixed(1)
    : 0

  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-2 gap-4 text-left">
        <div>
          <p className="text-sm text-gray-500">Starting Salary</p>
          <p className="text-xl font-bold text-gray-800">
            ${(playerData?.currentSalary || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Final Offer</p>
          <p className="text-xl font-bold text-green-600">
            ${currentOffer.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Target Range</p>
          <p className="text-lg font-medium text-gray-700">
            ${(playerData?.targetRange?.min || 0).toLocaleString()} - ${(playerData?.targetRange?.max || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Increase</p>
          <p className={`text-xl font-bold ${salaryIncrease > 0 ? 'text-green-600' : salaryIncrease < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {salaryIncrease >= 0 ? '+' : ''}{increasePercent}%
            <span className="text-sm font-normal ml-1">
              (${salaryIncrease >= 0 ? '+' : ''}{salaryIncrease.toLocaleString()})
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinalOffer
