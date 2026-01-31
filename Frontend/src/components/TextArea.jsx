function TextArea({ 
  gameState, 
  isLoading, 
  playerMessage, 
  setPlayerMessage, 
  handleSubmit
}) {
  // Only render when it's player's turn and not loading
  if (gameState !== 'player_typing' || isLoading) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="bg-white border-4 border-gray-800 p-3 shadow-xl">
        {/* Message composer with inline send button */}
        <div className="relative">
          <textarea
            value={playerMessage}
            onChange={(e) => setPlayerMessage(e.target.value)}
            placeholder="Message to Shlok..."
            className="w-full p-2 pr-[4.5rem] bg-gray-50 border-2 border-gray-300 text-gray-900 text-base resize-none focus:outline-none focus:border-purple-500 focus:bg-white placeholder-purple-400 leading-relaxed"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              imageRendering: 'pixelated'
            }}
            rows={2}
            autoFocus
          />
          {/* Inline pixel-style send button */}
          <button
            type="submit"
            disabled={!playerMessage.trim()}
            className="absolute right-[1.125rem] bottom-1.5 w-9 h-9 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed border-2 border-gray-800 flex items-center justify-center transition-all"
            style={{ imageRendering: 'pixelated' }}
            title="Send message"
          >
            {/* Pixel-style arrow icon */}
            <img 
              src="/send_icon_white_pixel_transparent.png" 
              alt="Send" 
              className="w-6 h-6"
              style={{ imageRendering: 'pixelated' }}
            />
          </button>
        </div>
        
        
      </div>
    </form>
  );
}

export default TextArea;