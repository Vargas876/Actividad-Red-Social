import { Bell, Heart, Repeat, Settings, UserPlus } from "lucide-react";
import Avatar from "../components/Avatar";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

const Notifications = () => {
    const notifications = [
        {
            type: 'like',
            user: { name: 'Dra. Helena', handle: 'helena_bio', avatar: 'https://i.pravatar.cc/150?u=helena' },
            content: 'le gustó tu publicación sobre Computación Cuántica',
            time: '2m'
        },
        {
            type: 'mention',
            user: { name: 'Marcos Tech', handle: 'marcos_ia', avatar: 'https://i.pravatar.cc/150?u=marcos' },
            content: 'te mencionó en un comentario: "@usuario increíble hallazgo!"',
            time: '15m'
        },
        {
            type: 'follow',
            user: { name: 'Lab de Robótica', handle: 'robotic_lab', avatar: 'https://i.pravatar.cc/150?u=robot' },
            content: 'empezó a seguirte',
            time: '1h'
        },
        {
            type: 'repost',
            user: { name: 'Carlos Científico', handle: 'carlos_c', avatar: 'https://i.pravatar.cc/150?u=carlos' },
            content: 'compartió tu artículo sobre Energías Renovables',
            time: '3h'
        },
        {
            type: 'like',
            user: { name: 'Ana Sofía', handle: 'anasofia_m', avatar: 'https://i.pravatar.cc/150?u=ana' },
            content: 'le gustó tu respuesta en el hilo de IA Ética',
            time: '5h'
        },
        {
            type: 'follow',
            user: { name: 'Prof. Xavier', handle: 'xavier_pro', avatar: 'https://i.pravatar.cc/150?u=xavier' },
            content: 'empezó a seguirte',
            time: '12h'
        },
        {
            type: 'mention',
            user: { name: 'Elena García', handle: 'eggarcia', avatar: 'https://i.pravatar.cc/150?u=elena' },
            content: 'te citó en su publicación: "Como bien dice @usuario, la ética es clave..."',
            time: '1d'
        },
        {
            type: 'like',
            user: { name: 'Lucía M.', handle: 'lucia_stars', avatar: 'https://i.pravatar.cc/150?u=lucia' },
            content: 'le gustó tu foto del telescopio',
            time: '1d'
        },
        {
            type: 'follow',
            user: { name: 'EduSocial Team', handle: 'edusocial', avatar: 'https://i.pravatar.cc/150?u=edu' },
            content: 'te dio la bienvenida a la plataforma mejorada',
            time: '2d'
        }
    ];

    return (
        <div className="feed-layout">
            <Sidebar />
            <main className="main-content">
                <header className="feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Notificaciones</h2>
                    <Settings size={20} cursor="pointer" />
                </header>

                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                    <button style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, position: 'relative' }}>
                        Todas
                        <div style={{ position: 'absolute', bottom: 0, left: '30%', right: '30%', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                    </button>
                    <button style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Verificadas
                    </button>
                    <button style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Menciones
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {notifications.map((notif, i) => (
                        <div key={i} style={{
                            padding: '16px',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ marginTop: '0px', width: '32px', display: 'flex', justifyContent: 'center' }}>
                                {notif.type === 'like' && <Heart size={22} fill="#f91880" color="#f91880" />}
                                {notif.type === 'mention' && <Bell size={22} color="var(--primary)" />}
                                {notif.type === 'follow' && <UserPlus size={22} color="var(--primary)" />}
                                {notif.type === 'repost' && <Repeat size={22} color="#00ba7c" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <Avatar src={notif.user.avatar} alt={notif.user.name} size="32px" />
                                <div style={{ marginTop: '8px', fontSize: '15px' }}>
                                    <strong style={{ color: 'var(--text-main)' }}>{notif.user.name}</strong>
                                    <span style={{ color: 'var(--text-main)', marginLeft: '4px' }}>{notif.content}</span>
                                    <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>· {notif.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

export default Notifications;
