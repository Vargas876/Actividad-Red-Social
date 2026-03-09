import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToLikedPosts, subscribeToMyPosts, subscribeToPosts, subscribeToUserReplies } from "../services/postService";
import PostCard from "./PostCard";

const PostList = ({ filter = 'all', userId = null }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Determinar qué usuario usar para los filtros
    const targetUserId = userId || user?.uid;

    useEffect(() => {
        setLoading(true);
        setError(null);
        let unsubscribe;

        const handleError = (err) => {
            console.error("Error cargando posts:", err);
            setError(err);
            setLoading(false);
        };

        const handleSuccess = (newPosts) => {
            setPosts(newPosts);
            setLoading(false);
        };

        if (filter === 'mine' && targetUserId) {
            // Posts del usuario
            unsubscribe = subscribeToMyPosts(targetUserId, handleSuccess, handleError);
        } else if (filter === 'liked' && targetUserId) {
            // Posts a los que el usuario dio like
            unsubscribe = subscribeToLikedPosts(targetUserId, handleSuccess, handleError);
        } else if (filter === 'media' && targetUserId) {
            // Posts con imágenes del usuario
            unsubscribe = subscribeToMyPosts(targetUserId, (allPosts) => {
                const mediaPosts = allPosts.filter(post =>
                    post.images && post.images.length > 0
                );
                handleSuccess(mediaPosts);
            }, handleError);
        } else if (filter === 'replies' && targetUserId) {
            unsubscribe = subscribeToUserReplies(targetUserId, handleSuccess, handleError);
        } else {
            // Todos los posts
            unsubscribe = subscribeToPosts(handleSuccess, handleError);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [filter, targetUserId, user]);

    if (error) {
        const isIndexError = error.code === 'failed-precondition' || error.message?.includes('index');
        return (
            <div style={{
                padding: '20px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid var(--error)',
                borderRadius: '12px',
                margin: '20px'
            }}>
                <h3 style={{ color: 'var(--error)', marginBottom: '8px' }}>Error al cargar posts</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-white)' }}>
                    {isIndexError
                        ? "Firebase requiere un índice compuesto para filtrar tus publicaciones. Por favor, haz clic en el enlace de la consola del navegador para crearlo."
                        : error.message}
                </p>
                {isIndexError && (
                    <div style={{ marginTop: '12px', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                        Nota: La creación del índice puede tardar unos minutos en completarse.
                    </div>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="post-card" style={{ opacity: 0.5, padding: '16px', display: 'flex', gap: '12px' }}>
                        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }}></div>
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{ height: '14px', width: '30%', marginBottom: '12px', borderRadius: '4px' }}></div>
                            <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Mensajes vacíos según el filtro
    const getEmptyMessage = () => {
        switch (filter) {
            case 'mine':
                return {
                    title: "Aún no has publicado nada",
                    description: "¡Comparte tus ideas y descubrimientos con la comunidad!"
                };
            case 'liked':
                return {
                    title: "No has dado like a ninguna publicación",
                    description: "Explora el feed y dale like a las publicaciones que te interesen."
                };
            case 'media':
                return {
                    title: "No hay contenido multimedia",
                    description: "Tus publicaciones con imágenes aparecerán aquí."
                };
            case 'replies':
                return {
                    title: "No has respondido a nada",
                    description: "Tus respuestas a otras publicaciones aparecerán aquí."
                };
            default:
                return {
                    title: "No hay nada que ver aquí... por ahora",
                    description: "Empieza a seguir a otros investigadores o publica tus propios avances."
                };
        }
    };

    if (posts.length === 0) {
        const emptyMsg = getEmptyMessage();
        return (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                    {emptyMsg.title}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>{emptyMsg.description}</p>
            </div>
        );
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default PostList;
