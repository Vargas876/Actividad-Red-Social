import { doc, onSnapshot } from "firebase/firestore";
import { ArrowLeft, BarChart2, Heart, MessageCircle, MoreHorizontal, Share, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import CommentCard from "../components/CommentCard";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { deletePost, sharePost, subscribeToComments, toggleLike, voteInPoll } from "../services/postService";

const actionButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
};

const hoverGreen = (e) => {
    e.currentTarget.style.color = '#10b981';
    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
};

const resetHover = (e) => {
    e.currentTarget.style.color = 'var(--text-muted)';
    e.currentTarget.style.background = 'transparent';
};

// Componente del contenido del post en detalle
const PostDetailContent = ({ post }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isOwner = user?.uid === post.userId;
    const likes = post.likes || [];
    const hasLiked = likes.includes(user?.uid);
    const images = post.images || [];
    const poll = post.poll;

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
            // El componente se actualizará solo si hay un listener en tiempo real o si recargamos.
            // En PostDetail se usa getDoc una vez. Deberíamos considerar onSnapshot aquí también.
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleLike = async () => {
        if (!user) return;
        try {
            await toggleLike(post.id, user.uid);
        } catch (err) {
            console.error("Error dando like:", err);
        }
    };

    const handleShare = async () => {
        try {
            await sharePost(post.id);
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            alert("Enlace copiado al portapapeles");
        } catch (err) {
            console.error("Error compartiendo:", err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
            try {
                await deletePost(post.id);
                navigate("/feed");
            } catch (err) {
                console.error(err);
            }
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border)'
        }}>
            {/* Header con avatar y nombre */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Avatar
                        src={post.autorAvatar}
                        alt={post.autorNombre}
                        size="48px"
                    />
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>{post.autorNombre}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>@{post.autorNombre?.toLowerCase().replace(/\s/g, '').substring(0, 15)}</p>
                    </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Contenido */}
            <div style={{ fontSize: '21px', lineHeight: 1.5, color: 'var(--text-main)', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                {post.contenido}
            </div>

            {/* Imágenes */}
            {images.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                    gap: '2px',
                    marginBottom: '16px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)'
                }}>
                    {images.map((img, index) => (
                        <div key={index} style={{ aspectRatio: images.length === 1 ? 'auto' : '1/1' }}>
                            <img
                                src={img}
                                alt={`Imagen ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Encuesta */}
            {poll && poll.options && (
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: '1px solid var(--border)',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
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
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span>{totalVotes} votos</span>
                        <span>•</span>
                        <span>Encuesta de EduSocial</span>
                    </div>
                </div>
            )}

            {/* Fecha */}
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                {formatTime(post.fecha)} · <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>EduSocial</span> Academic
            </p>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border)',
                marginBottom: '12px'
            }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{post.likes?.length || 0}</strong> Me gusta
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{post.comments || 0}</strong> Respuestas
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{post.shares || 0}</strong> Compartidos
                </span>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 0' }}>
                <button style={actionButtonStyle} title="Comentar">
                    <MessageCircle size={22} />
                </button>
                <button style={actionButtonStyle} onClick={handleShare} onMouseEnter={hoverGreen} onMouseLeave={resetHover} title="Compartir">
                    <Share size={22} />
                </button>
                <button
                    style={{ ...actionButtonStyle, color: hasLiked ? '#f11c82' : 'var(--text-muted)' }}
                    onClick={handleLike}
                    title="Me gusta"
                    onMouseEnter={(e) => !hasLiked && (e.currentTarget.style.color = '#f11c82', e.currentTarget.style.background = 'rgba(241, 28, 130, 0.1)')}
                    onMouseLeave={(e) => !hasLiked && (e.currentTarget.style.color = 'var(--text-muted)', e.currentTarget.style.background = 'transparent')}
                >
                    <Heart size={22} fill={hasLiked ? "#f11c82" : "none"} />
                </button>
                <button
                    style={actionButtonStyle}
                    title="Estadísticas"
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)', e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)', e.currentTarget.style.background = 'transparent')}
                >
                    <BarChart2 size={22} />
                </button>
                {isOwner && (
                    <button
                        style={{ ...actionButtonStyle, color: 'var(--error)' }}
                        onClick={handleDelete}
                        title="Eliminar"
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        <Trash2 size={22} />
                    </button>
                )}
            </div>
        </div>
    );
};

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    // Suscribirse al post para cambios en tiempo real (likes, votos, etc)
    useEffect(() => {
        if (!postId) return;

        const postRef = doc(db, "posts", postId);
        const unsubscribe = onSnapshot(postRef, (doc) => {
            if (doc.exists()) {
                setPost({ id: doc.id, ...doc.data() });
                setLoading(false);
            } else {
                navigate("/feed");
            }
        }, (error) => {
            console.error("Error en onSnapshot del post:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [postId, navigate]);

    // Suscribirse a comentarios
    useEffect(() => {
        if (!postId) return;

        const unsubscribe = subscribeToComments(
            postId,
            (newComments) => {
                setComments(newComments);
            },
            (error) => {
                console.error("Error cargando comentarios:", error);
            }
        );

        return () => unsubscribe();
    }, [postId]);

    if (loading) {
        return (
            <div className="feed-layout">
                <Sidebar />
                <main className="main-content">
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Cargando...
                    </div>
                </main>
                <RightSidebar />
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="feed-layout">
            <Sidebar />

            <main className="main-content">
                {/* Header */}
                <header className="feed-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border)',
                    padding: '8px 16px'
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Publicación</h2>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {post.comments || 0} respuestas
                        </span>
                    </div>
                </header>

                <div className="post-detail-scrollable" style={{ height: 'calc(100vh - 54px)', overflowY: 'auto' }}>
                    {/* Post Original */}
                    <PostDetailContent post={post} />

                    {/* Formulario de respuesta estilo Twitter */}
                    <div style={{ borderBottom: '1px solid var(--border)' }}>
                        <CreatePost
                            postId={postId}
                            replyTo={post.autorNombre}
                            compact={true}
                            onPostCreated={() => {
                                // Los comentarios se actualizan vía suscripción
                            }}
                        />
                    </div>

                    {/* Lista de respuestas */}
                    <div>
                        {comments.length === 0 ? (
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                borderBottom: '1px solid var(--border)'
                            }}>
                                <p style={{ fontSize: '15px' }}>Aún no hay respuestas</p>
                                <p style={{ fontSize: '13px', marginTop: '4px' }}>Sé el primero en responder</p>
                            </div>
                        ) : (
                            comments.map(comment => (
                                <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                    postId={postId}
                                />
                            ))
                        )}
                    </div>
                </div>
            </main>

            <RightSidebar />
        </div>
    );
};

export default PostDetail;
