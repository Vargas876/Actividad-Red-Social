import { ArrowLeft, Calendar, Link as LinkIcon, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');

    const { stats, randomLocation } = useMemo(() => {
        const locations = [
            "Bogotá, Colombia", "Medellín, Colombia", "Ciudad de México",
            "Madrid, España", "Buenos Aires, Argentina", "Santiago, Chile",
            "Lima, Perú", "Quito, Ecuador", "Barcelona, España", "Barcelona, Venezuela",
            "San José, Costa Rica", "Panamá", "Montevideo, Uruguay"
        ];

        // Usar el UID para que sea consistente por usuario
        const seed = user?.uid ? user.uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;

        return {
            stats: {
                following: (seed % 450) + 50,
                followers: (seed % 900) + 100
            },
            randomLocation: locations[seed % locations.length]
        };
    }, [user?.uid]);

    const tabs = [
        { id: 'posts', label: 'Posts' },
        { id: 'replies', label: 'Respuestas' },
        { id: 'highlights', label: 'Destacados' },
        { id: 'articles', label: 'Artículos' },
        { id: 'media', label: 'Multimedia' },
        { id: 'likes', label: 'Me gusta' }
    ];

    // Formatear fecha de unión
    const joinDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
        : 'Enero 2024';

    const joinDateDisplay = joinDate.charAt(0).toUpperCase() + joinDate.slice(1);

    return (
        <div className="feed-layout">
            <Sidebar />

            <main className="main-content">
                {/* Header sticky */}
                <header
                    className="feed-header"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                >
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
                        <h2 style={{ fontSize: '17px', fontWeight: 700 }}>{user?.displayName || "Mi Perfil"}</h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>0 posts</p>
                    </div>
                </header>

                {/* Banner de portada */}
                <div style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    position: 'relative',
                    zIndex: 1
                }} />

                {/* Info del perfil */}
                <div style={{ padding: '0 16px 16px', position: 'relative', zIndex: 2 }}>
                    {/* Avatar y botón editar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginTop: '-48px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            border: '4px solid var(--bg-dark)',
                            overflow: 'hidden',
                            background: 'var(--bg-card)',
                            flexShrink: 0,
                            position: 'relative'
                        }}>
                            <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=random`}
                                alt="Perfil"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center'
                                }}
                            />
                        </div>
                        <button
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-main)',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginBottom: '16px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            Editar perfil
                        </button>
                    </div>

                    {/* Nombre y username */}
                    <div style={{ marginBottom: '12px' }}>
                        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                            {user?.displayName || "Usuario"}
                        </h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                            @{user?.email?.split('@')[0] || "usuario"}
                        </p>
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.5 }}>
                        Estudiante e Investigador en EduSocial. Apasionado por la tecnología y la academia.
                    </p>

                    {/* Info adicional */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '12px',
                        color: 'var(--text-muted)',
                        fontSize: '15px'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={16} />
                            {randomLocation}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <LinkIcon size={16} />
                            <a href="#" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>link.com</a>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={16} />
                            Se unió en {joinDateDisplay}
                        </span>
                    </div>

                    {/* Following/Followers */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '14px' }}>
                            <strong>{stats.following}</strong> <span style={{ color: 'var(--text-muted)' }}>Siguiendo</span>
                        </button>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '14px' }}>
                            <strong>{stats.followers}</strong> <span style={{ color: 'var(--text-muted)' }}>Seguidores</span>
                        </button>
                    </div>
                </div>

                {/* Tabs - sticky */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border)',
                    overflowX: 'auto',
                    position: 'sticky',
                    top: '53px',
                    background: 'var(--bg-dark)',
                    zIndex: 5
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '16px 0',
                                background: 'none',
                                border: 'none',
                                color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                fontSize: '15px',
                                cursor: 'pointer',
                                position: 'relative',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '25%',
                                    right: '25%',
                                    height: '4px',
                                    background: 'var(--primary)',
                                    borderRadius: '2px'
                                }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Contenido según tab */}
                {activeTab === 'posts' && (
                    <>
                        <CreatePost />
                        <PostList filter="mine" />
                    </>
                )}
                {activeTab === 'replies' && (
                    <PostList filter="replies" userId={user?.uid} />
                )}
                {activeTab === 'highlights' && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>No hay destacados aún</p>
                    </div>
                )}
                {activeTab === 'articles' && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>No hay artículos</p>
                    </div>
                )}
                {activeTab === 'media' && (
                    <PostList filter="media" />
                )}
                {activeTab === 'likes' && (
                    <>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#3b82f6',
                            fontSize: '14px'
                        }}>
                            <span>🔒</span>
                            <span>Tus likes son privados. Solo tú los puedes ver</span>
                        </div>
                        <PostList filter="liked" />
                    </>
                )}
            </main>

            <RightSidebar />
        </div>
    );
};

export default Profile;
