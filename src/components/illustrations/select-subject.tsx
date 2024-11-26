export function SelectSubjectIllustration() {
  return (
    <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Decorative background elements */}
      <path d="M40 40C40 20 60 20 80 20C100 20 120 40 140 40C160 40 180 20 200 20" stroke="#E0E7FF" strokeWidth="2" />
      <path d="M40 140C40 120 60 120 80 120C100 120 120 140 140 140C160 140 180 120 200 120" stroke="#E0E7FF" strokeWidth="2" />
      
      {/* Main content area with soft gradient */}
      <rect x="40" y="20" width="160" height="120" rx="8" fill="url(#select-gradient)" />
      
      {/* Book icon */}
      <path d="M70 50H90C92 50 94 48 94 46V44C94 42 92 40 90 40H70C68 40 66 42 66 44V46C66 48 68 50 70 50Z" fill="#60A5FA" />
      <path d="M75 40V50" stroke="white" strokeWidth="1" />
      <path d="M85 40V50" stroke="white" strokeWidth="1" />
      
      {/* Subject cards with hover effects */}
      <rect x="60" y="60" width="120" height="24" rx="4" fill="#60A5FA" fillOpacity="0.6">
        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
      </rect>
      
      <rect x="60" y="90" width="80" height="24" rx="4" fill="#34D399" fillOpacity="0.6">
        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </rect>
      
      {/* Add button with pulsing effect */}
      <circle cx="200" cy="40" r="16" fill="#4F46E5" fillOpacity="0.15">
        <animate attributeName="r" values="16;18;16" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="40" r="12" fill="#4F46E5" />
      <path d="M194 40H206M200 34V46" stroke="white" strokeWidth="2" strokeLinecap="round" />
      
      {/* Text indicators */}
      <text x="100" y="76" fill="#FFFFFF" fontSize="12" fontFamily="sans-serif">Mathematics</text>
      <text x="90" y="106" fill="#FFFFFF" fontSize="12" fontFamily="sans-serif">Science</text>
      
      <defs>
        <linearGradient id="select-gradient" x1="40" y1="20" x2="200" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0F7FF" />
          <stop offset="0.5" stopColor="#E8F0FF" />
          <stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}