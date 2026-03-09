import { BarChart2, Edit3, Heart, MessageCircle, MoreHorizontal, Share, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteComment, deletePost, sharePost, subscribeToComments, toggleCommentLike, toggleLike, updateComment, updatePost, voteInPoll } from "../services/postService";
import Avatar from "./Avatar";
import EmojiPicker from "./EmojiPicker";

const PostCard = ({ post, onClick }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.contenido);
    const [editImages, setEditImages] = useState(post.images || []);
    const [showImageModal, setShowImageModal] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const isOwner = user?.uid === post.userId;
    const likes = post.likes || [];
    const hasLiked = likes.includes(user?.uid);
    const images = post.images || [];
    const poll = post.poll;
    const commentsCount = post.comments || 0;
    const shares = post.shares || 0;

    // Lógica de encuestas
    const pollVotes = poll?.votes || {};
    const totalVotes = Object.values(pollVotes).reduce((acc, voters) => acc + voters.length, 0);
    const userVotedOptionIndex = poll ? Object.keys(pollVotes).find(key => pollVotes[key].includes(user?.uid)) : -1;
    const hasVoted = userVotedOptionIndex !== -1 && userVotedOptionIndex !== undefined;

    const handleVote = async (optionIndex) => {
        if (!user) return;
        if (hasVoted) return;
        try {
            await voteInPoll(post.id, optionIndex, user.uid);
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    // Cargar comentarios cuando se abre la sección
    useEffect(() => {
        if (!showComments) return;

        setCommentsLoading(true);
        const unsubscribe = subscribeToComments(
            post.id,
            (newComments) => {
                setComments(newComments);
                setCommentsLoading(false);
            },
            (error) => {
                console.error("Error cargando comentarios:", error);
                setCommentsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [showComments, post.id]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return;
        try {
            if (post.isReply) {
                await toggleCommentLike(post.postId, post.id, user.uid);
            } else {
                await toggleLike(post.id, user.uid);
            }
        } catch (err) {
            console.error("Error dando like:", err);
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        try {
            await sharePost(post.id);
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            alert("Enlace copiado al portapapeles");
        } catch (err) {
            console.error("Error compartiendo:", err);
        }
    };

    const handleUpdate = async () => {
        if (!editContent.trim() && editImages.length === 0) return;
        try {
            if (post.isReply) {
                await updateComment(post.postId, post.id, editContent);
            } else {
                await updatePost(post.id, editContent, editImages);
            }
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating:", err);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        const msg = post.isReply ? "¿Seguro que quieres eliminar esta respuesta?" : "¿Seguro que quieres eliminar esta publicación?";
        if (window.confirm(msg)) {
            try {
                if (post.isReply) {
                    await deleteComment(post.postId, post.id);
                } else {
                    await deletePost(post.id);
                }
            } catch (err) {
                console.error("Error deleting:", err);
            }
        }
    };

    const handleCardClick = () => {
        const targetId = post.isReply ? post.postId : post.id;
        if (targetId) navigate(`/post/${targetId}`);
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        navigate(`/post/${post.id}`);
    };

    const removeEditImage = (index) => {
        setEditImages(prev => prev.filter((_, i) => i !== index));
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

    return (
        <div style={{
            maxWidth: '100%',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'background 0.2s'
        }}>
            {/* Post principal */}
            <div
                onClick={handleCardClick}
                style={{ display: 'flex', gap: '12px', padding: '16px' }}
            >
                {/* Avatar */}
                <Avatar
                    src={post.autorAvatar}
                    alt={post.autorNombre}
                    size="48px"
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, maxWidth: '100%' }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '8px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '4px',
                            minWidth: 0,
                            flex: 1
                        }}>
                            <span style={{
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                fontSize: '15px'
                            }}>
                                {post.autorNombre}
                            </span>
                            <span style={{
                                color: 'var(--text-muted)',
                                fontSize: '15px'
                            }}>
                                @{post.autorNombre?.toLowerCase().replace(/\s/g, '').substring(0, 15)}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>·</span>
                            <span style={{
                                color: 'var(--text-muted)',
                                fontSize: '15px'
                            }}>
                                {formatTime(post.fecha)}
                            </span>
                        </div>

                        {/* Botones de acción del header */}
                        <div
                            style={{ display: 'flex', gap: '4px', flexShrink: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isOwner && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                        e.currentTarget.style.color = 'var(--primary-light)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-muted)';
                                    }}
                                    title="Editar publicación"
                                >
                                    <Edit3 size={18} />
                                </button>
                            )}
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Más opciones"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Mostrar "Respondiendo a..." si es una respuesta */}
                    {post.isReply && (
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Respondiendo a una publicación académica
                        </div>
                    )}

                    {/* Contenido */}
                    {isEditing ? (
                        <div style={{ marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    style={{
                                        minHeight: '80px',
                                        marginBottom: '8px',
                                        padding: '12px',
                                        width: '100%',
                                        background: 'var(--bg-dark)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'var(--text-main)',
                                        resize: 'none',
                                        fontFamily: 'inherit',
                                        fontSize: '15px'
                                    }}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    right: '8px'
                                }}>
                                    <EmojiPicker onEmojiSelect={(emoji) => {
                                        setEditContent(prev => prev + emoji);
                                    }} />
                                </div>
                            </div>

                            {editImages.length > 0 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: editImages.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}>
                                    {editImages.map((img, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img
                                                src={img}
                                                alt={`Imagen ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <button
                                                onClick={() => removeEditImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    padding: '4px',
                                                    cursor: 'pointer',
                                                    color: 'white'
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '8px 16px',
                                        borderRadius: '20px'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    style={{
                                        background: 'var(--primary)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontWeight: 600
                                    }}
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                marginTop: '4px',
                                fontSize: '15px',
                                lineHeight: 1.5,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                color: 'var(--text-main)'
                            }}>
                                {post.contenido}
                            </div>

                            {images.length > 0 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '8px',
                                    marginTop: '12px',
                                    maxWidth: '100%',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}>
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowImageModal(index);
                                            }}
                                            style={{
                                                position: 'relative',
                                                cursor: 'pointer',
                                                aspectRatio: images.length === 1 ? '16/9' : '1/1',
                                                maxHeight: images.length === 1 ? '400px' : '200px',
                                                overflow: 'hidden',
                                                borderRadius: images.length === 1 ? '12px' : '8px'
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Imagen ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showImageModal !== null && (
                                <div
                                    style={{
                                        position: 'fixed',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.95)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 1000,
                                        padding: '20px'
                                    }}
                                    onClick={() => setShowImageModal(null)}
                                >
                                    <img
                                        src={images[showImageModal]}
                                        alt="Vista ampliada"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '90vh',
                                            borderRadius: '8px',
                                            objectFit: 'contain'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                        onClick={() => setShowImageModal(null)}
                                        style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            color: 'white'
                                        }}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            )}

                            {poll && poll.options && (
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginTop: '12px',
                                    border: '1px solid var(--border)',
                                    width: '100%',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {poll.options.map((option, index) => {
                                            const voters = pollVotes[index] || [];
                                            const voteCount = voters.length;
                                            const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                                            const isSelected = parseInt(userVotedOptionIndex) === index;

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => handleVote(index)}
                                                    style={{
                                                        position: 'relative',
                                                        padding: '12px 16px',
                                                        background: hasVoted ? 'transparent' : 'var(--bg-dark)',
                                                        borderRadius: '8px',
                                                        cursor: hasVoted ? 'default' : 'pointer',
                                                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        overflow: 'hidden',
                                                        minHeight: '44px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!hasVoted) {
                                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                                            e.currentTarget.style.background = 'var(--border)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!hasVoted) {
                                                            e.currentTarget.style.borderColor = 'var(--border)';
                                                            e.currentTarget.style.background = 'var(--bg-dark)';
                                                        }
                                                    }}
                                                >
                                                    {/* Barra de progreso */}
                                                    {hasVoted && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 0,
                                                            bottom: 0,
                                                            width: `${percentage}%`,
                                                            background: isSelected ? 'rgba(29, 155, 240, 0.2)' : 'rgba(113, 118, 123, 0.15)',
                                                            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            zIndex: 1
                                                        }} />
                                                    )}

                                                    <div style={{
                                                        position: 'relative',
                                                        zIndex: 2,
                                                        fontWeight: isSelected ? 'bold' : 'normal',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        {option}
                                                        {isSelected && <span style={{ color: 'var(--primary)' }}>✓</span>}
                                                    </div>

                                                    {hasVoted && (
                                                        <div style={{
                                                            position: 'relative',
                                                            zIndex: 2,
                                                            fontWeight: '500',
                                                            color: 'var(--text-main)',
                                                            fontSize: '14px'
                                                        }}>
                                                            {percentage}%
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{
                                        marginTop: '12px',
                                        fontSize: '13px',
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span>{totalVotes} votos</span>
                                        <span>•</span>
                                        <span>Encuesta de EduSocial</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer de acciones */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '12px',
                            maxWidth: '500px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCommentClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                padding: '6px',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                e.currentTarget.style.color = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                        >
                            <MessageCircle size={18} />
                            <span>{commentsCount || ''}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                padding: '6px',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                                e.currentTarget.style.color = '#10b981';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                        >
                            <Share size={18} />
                            <span>{shares || ''}</span>
                        </button>

                        <button
                            onClick={handleLike}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: hasLiked ? '#f91880' : 'var(--text-muted)',
                                background: hasLiked ? 'rgba(249, 24, 128, 0.1)' : 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                padding: '6px',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Heart
                                size={18}
                                fill={hasLiked ? "#f91880" : "none"}
                                color={hasLiked ? "#f91880" : "currentColor"}
                            />
                            <span>{likes.length || ''}</span>
                        </button>

                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--text-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '13px',
                                padding: '6px',
                                borderRadius: '50%'
                            }}
                        >
                            <BarChart2 size={18} />
                            <span>{Math.floor(Math.random() * 1000)}</span>
                        </button>

                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--error)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    padding: '6px',
                                    borderRadius: '50%',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PostCard;
