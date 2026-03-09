
const Avatar = ({ src, alt, size = "md", border = false }) => {
    const sizes = {
        sm: '32px',
        md: '48px',
        lg: '120px',
        xl: '150px'
    };

    const widthHeight = sizes[size] || size;

    return (
        <div style={{
            width: widthHeight,
            height: widthHeight,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-elevated)',
            border: border ? '2px solid var(--bg-dark)' : 'none',
            boxShadow: border ? '0 0 0 2px var(--primary)' : 'none',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <img
                src={src || `https://ui-avatars.com/api/?name=${alt || 'User'}&background=random&color=fff`}
                alt={alt || "Avatar"}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </div>
    );
};

export default Avatar;
