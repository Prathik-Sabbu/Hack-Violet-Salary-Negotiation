function ShlokText({ gameState, currentShlokText }) {
  // Only render when Shlok is speaking or player is typing
  if (gameState !== 'shlok_speaking' && gameState !== 'player_typing') {
    return null;
  }

  return (
    <div className="speech-bubble mb-4 w-full">
      <span className="font-bold text-purple-700" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.25rem' }}>Shlok:</span>
      <p className="mt-1 text-gray-800" style={{ fontFamily: 'vt323-regular-webfont, monospace', fontSize: '1.155rem' }}>
        {currentShlokText}
        {gameState === 'shlok_speaking' && (
          <span className="animate-blink">|</span>
        )}
      </p>
    </div>
  );
}

export default ShlokText;
