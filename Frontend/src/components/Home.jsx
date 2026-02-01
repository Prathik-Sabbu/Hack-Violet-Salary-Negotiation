function Home({ onStartGame, onNewGame, hasSavedData }) {
  return (
    <>
      <style>
        {`
          @keyframes logoPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 1.0;
            }
          }
          .logo-pulse {
            animation: logoPulse 2s ease-in-out infinite;
          }
        `}
      </style>
      <div 
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating coin/money icons could go here */}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-2 p-4">
          {/* Game Logo */}
          <div className="mb-1">
            <img 
              src="/game_logo.png" 
              alt="Know Your Worth" 
              className="w-full h-auto logo-pulse"
              style={{ 
                imageRendering: 'pixelated', 
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
                maxWidth: '700px',
                maxHeight: '400px'
              }}
            />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-80">
          <button
            onClick={onStartGame}
            className="relative bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 px-8 border-4 border-white shadow-lg transition-all transform hover:scale-105 active:scale-95"
            style={{ 
              fontFamily: 'vt323-regular-webfont, monospace',
              fontSize: '1.5rem',
              imageRendering: 'pixelated',
              boxShadow: '0 8px 0 rgba(0, 0, 0, 0.3), 0 12px 20px rgba(0, 0, 0, 0.4)'
            }}
          >
            {hasSavedData ? '▶ CONTINUE GAME' : '▶ START GAME'}
          </button>

          <button
            onClick={onNewGame}
            className="relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 border-4 border-white shadow-lg transition-all transform hover:scale-105 active:scale-95"
            style={{ 
              fontFamily: 'vt323-regular-webfont, monospace',
              fontSize: '1.5rem',
              imageRendering: 'pixelated',
              boxShadow: '0 8px 0 rgba(0, 0, 0, 0.3), 0 12px 20px rgba(0, 0, 0, 0.4)'
            }}
          >
            ✨ NEW GAME
          </button>
        </div>

        {/* Subtitle */}
        <div className="text-center">
          <p 
            className="text-white text-lg opacity-90"
            style={{ 
              fontFamily: 'vt323-regular-webfont, monospace',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Master the art of salary negotiation
          </p>
        </div>
      </div>

      {/* Footer credit */}
      <div className="absolute bottom-2 text-center">
        <p 
          className="text-white text-sm opacity-75"
          style={{ 
            fontFamily: 'vt323-regular-webfont, monospace',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          A Hackathon Project
        </p>
      </div>
    </div>
    </>
  )
}

export default Home
