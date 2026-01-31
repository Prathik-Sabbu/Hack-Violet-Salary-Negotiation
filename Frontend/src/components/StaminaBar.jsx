function StaminaBar({ currentRound, maxRounds }) {
  return (
    <div className="absolute top-4 right-4 bg-gray-900 rounded-lg px-6 py-3 shadow-lg z-20 border-2 border-gray-700">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-white uppercase tracking-wide">Stamina</span>
        <div className="relative w-48 h-6 bg-gray-800 rounded-full border-2 border-gray-600 overflow-hidden">
          {/* Stamina fill - decreases as rounds progress */}
          <div 
            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
              maxRounds - currentRound >= 4 ? 'bg-green-500' :
              maxRounds - currentRound === 3 ? 'bg-yellow-500' :
              maxRounds - currentRound === 2 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${((maxRounds - currentRound) / maxRounds) * 100}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
          {/* Segmentation marks */}
          {[...Array(maxRounds - 1)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-gray-900"
              style={{ left: `${((i + 1) / maxRounds) * 100}%` }}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-white min-w-[2rem]">
          {maxRounds - currentRound}/{maxRounds}
        </span>
      </div>
    </div>
  );
}

export default StaminaBar;
