import { BarChart2, Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat, Share } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toggleCommentLike } from "../services/postService";
import Avatar from "./Avatar";

const CommentCard = ({ comment, postId }) => {
    const { user } = useAuth();
    const isOwner = user?.uid === comment.userId;
    const likes = comment.likes || [];
    const hasLiked = likes.includes(user?.uid);

    const handleLike = async () => {
        if (!user) return;
        try {
            await toggleCommentLike(postId, comment.id, user.uid);
        } catch (err) {
            console.error("Error dando like al comentario:", err);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    // Estilo base para botones de acción
    const actionButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: '13px',
        padding: '8px',
        borderRadius: '50%',
        transition: 'all 0.2s'
    };

    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'background 0.2s'
        }}>
            {/* Avatar */}
            <Avatar
                src={comment.autorAvatar}
                alt={comment.autorNombre}
                size="40px"
            />

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '15px' }}>
                            {comment.autorNombre}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                            @{comment.autorNombre?.toLowerCase().replace(/\s/g, '').substring(0, 15) || 'usuario'}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>·</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                            {formatTime(comment.fecha)}
                        </span>
                    </div>

                    {/* Botones derecha */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '50%'
                            }}
                        >
                            <Share size={16} />
                        </button>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '50%'
                            }}
                        >
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                </div>

                {/* Texto */}
                <p style={{
                    color: 'var(--text-main)',
                    fontSize: '15px',
                    lineHeight: 1.5,
                    marginTop: '2px',
                    wordBreak: 'break-word'
                }}>
                    {comment.contenido}
                </p>

                {/* Acciones - Estilo Twitter */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    maxWidth: '425px'
                }}>
                    {/* Comentar */}
                    <button
                        style={actionButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#3b82f6';
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <MessageCircle size={18} />
                        <span></span>
                    </button>

                    {/* Retweet */}
                    <button
                        style={actionButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#10b981';
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Repeat size={18} />
                        <span></span>
                    </button>

                    {/* Like */}
                    <button
                        onClick={handleLike}
                        style={{
                            ...actionButtonStyle,
                            color: hasLiked ? '#f91880' : 'var(--text-muted)'
                        }}
                        onMouseEnter={(e) => {
                            if (!hasLiked) {
                                e.currentTarget.style.color = '#f91880';
                                e.currentTarget.style.background = 'rgba(249, 24, 128, 0.1)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = hasLiked ? '#f91880' : 'var(--text-muted)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Heart size={18} fill={hasLiked ? "#f91880" : "none"} color={hasLiked ? "#f91880" : "currentColor"} />
                        <span style={{ fontWeight: hasLiked ? 'bold' : 'normal' }}>{likes.length > 0 ? likes.length : ''}</span>
                    </button>

                    {/* Views */}
                    <button
                        style={actionButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#3b82f6';
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <BarChart2 size={18} />
                        <span>{Math.floor(Math.random() * 50 + 1)}K</span>
                    </button>

                    {/* Bookmark y Share */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            style={actionButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#3b82f6';
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Bookmark size={18} />
                        </button>
                        <button
                            style={actionButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#3b82f6';
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Share size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
