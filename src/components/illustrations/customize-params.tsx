export function CustomizeParamsIllustration() {
  return (
    <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background with depth */}
      <rect x="40" y="20" width="160" height="120" rx="8" fill="url(#customize-gradient)" />
      
      {/* Difficulty slider */}
      <g>
        <text x="60" y="35" fill="#3B82F6" fontSize="10" fontFamily="sans-serif">Difficulty Level</text>
        <rect x="60" y="40" width="120" height="12" rx="6" fill="#93C5FD" fillOpacity="0.3" />
        <circle cx="160" cy="46" r="8" fill="#3B82F6">
          <animate attributeName="cx" values="160;165;160" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Question type selector */}
      <g>
        <text x="60" y="65" fill="#10B981" fontSize="10" fontFamily="sans-serif">Question Types</text>
        <rect x="60" y="70" width="120" height="12" rx="6" fill="#86EFAC" fillOpacity="0.3" />
        <circle cx="100" cy="76" r="8" fill="#10B981">
          <animate attributeName="cx" values="100;105;100" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
      </g>
      
      {/* Time limit */}
      <g>
        <text x="60" y="95" fill="#8B5CF6" fontSize="10" fontFamily="sans-serif">Time Limit</text>
        <rect x="60" y="100" width="120" height="12" rx="6" fill="#C4B5FD" fillOpacity="0.3" />
        <circle cx="140" cy="106" r="8" fill="#8B5CF6">
          <animate attributeName="cx" values="140;145;140" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
      </g>
      
      {/* Interactive elements */}
      <path d="M180 40L190 46L180 52" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <defs>
        <linearGradient id="customize-gradient" x1="40" y1="20" x2="200" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0F7FF" />
          <stop offset="0.5" stopColor="#F3F4FF" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}