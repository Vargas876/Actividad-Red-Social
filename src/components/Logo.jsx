const Logo = ({ size = 40, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="4" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Rounded Background with Gradient */}
        <rect width="120" height="120" rx="32" fill="url(#logoGradient)" />

        {/* Abstract Academic Symbol */}
        <g filter="url(#shadow)">
            {/* Top of Cap / Square Diamond */}
            <path
                d="M60 35L95 52.5L60 70L25 52.5L60 35Z"
                fill="white"
            />
            {/* Body of Cap */}
            <path
                d="M35 57.5V70C35 70 45 80 60 80C75 80 85 70 85 70V57.5L60 70L35 57.5Z"
                fill="white"
                fillOpacity="0.9"
            />
            {/* Academic Tassel Decoration */}
            <circle cx="95" cy="52.5" r="4" fill="#60a5fa" />
            <path
                d="M95 52.5V75"
                stroke="#60a5fa"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <rect x="92" y="75" width="6" height="8" rx="2" fill="#60a5fa" />
        </g>

        {/* Subtle Inner Glow/Highlight */}
        <path
            d="M30 20C50 15 80 15 100 25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.2"
        />
    </svg>
);

export default Logo;
