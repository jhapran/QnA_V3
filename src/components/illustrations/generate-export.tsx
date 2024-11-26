export function GenerateExportIllustration() {
  return (
    <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background with paper texture effect */}
      <rect x="40" y="20" width="160" height="120" rx="8" fill="url(#generate-gradient)" />
      <path d="M60 30H180" stroke="#E0E7FF" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M60 50H180" stroke="#E0E7FF" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M60 70H180" stroke="#E0E7FF" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* Document icon */}
      <rect x="100" y="40" width="40" height="50" rx="4" fill="#F0F7FF" stroke="#4F46E5" strokeWidth="2" />
      <path d="M110 50H130" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
      <path d="M110 60H120" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
      
      {/* Download arrow with animation */}
      <g>
        <path 
          d="M120 65V85M110 75L120 85L130 75" 
          stroke="#4F46E5" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Progress indicator */}
      <g>
        <rect x="80" y="100" width="80" height="8" rx="4" fill="#E0E7FF" />
        <rect x="80" y="100" width="60" height="8" rx="4" fill="url(#progress-gradient)">
          <animate attributeName="width" values="0;60" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>
      
      {/* Status text */}
      <text x="120" y="120" fill="#4F46E5" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Generating...</text>
      
      <defs>
        <linearGradient id="generate-gradient" x1="40" y1="20" x2="200" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F5F7FF" />
        </linearGradient>
        
        <linearGradient id="progress-gradient" x1="80" y1="104" x2="140" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}