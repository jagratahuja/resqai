

export function SeverityGauge({ score, confidence }: { score: number, confidence?: number }) {
  const radius = 80;
  const stroke = 12;
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  const dashArray = radius * Math.PI;
  const dashOffset = dashArray - (dashArray * normalizedScore) / 100;
  
  let color = "#3ee9b5"; // accent
  if (score >= 82) color = "#ff5a5f"; // red
  else if (score >= 65) color = "#ffb547"; // amber
  else if (score >= 45) color = "#4aa8ff"; // blue

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#1c2433"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute bottom-4 flex flex-col items-center">
        <span className="text-4xl font-mono font-bold tabular-nums" style={{ color }}>
          {score.toFixed(1)}
        </span>
        {confidence !== undefined && (
          <span className="text-xs text-slate-400 mt-1">
            Conf: {confidence.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
