import { Mail, Search, Settings } from "lucide-react";
import Avatar from "../components/Avatar";
import EmojiPicker from "../components/EmojiPicker";
import Sidebar from "../components/Sidebar";

const Messages = () => {
    const chats = [
        {
            name: 'Dra. Helena',
            handle: 'helena_bio',
            avatar: 'https://i.pravatar.cc/150?u=helena',
            status: 'online',
            lastMessage: '¿Pudiste revisar el paper que te envié?',
            time: '2h'
        },
        {
            name: 'Grupo de Investigación IA',
            handle: 'ia_team_group',
            avatar: 'https://i.pravatar.cc/150?u=group',
            status: 'offline',
            lastMessage: 'Reunión mañana a las 10:00 AM vía Meet',
            time: '5h'
        },
        {
            name: 'Marcos Tech',
            handle: 'marcos_ia',
            avatar: 'https://i.pravatar.cc/150?u=marcos',
            status: 'online',
            lastMessage: 'El despliegue fue un éxito total.',
            time: '1d'
        },
        {
            name: 'Soporte EduSocial',
            handle: 'edusocial_help',
            avatar: 'https://i.pravatar.cc/150?u=support',
            status: 'offline',
            lastMessage: 'Tu reporte ha sido procesado correctamente.',
            time: '2d'
        },
        {
            name: 'Ana Sofía',
            handle: 'anasofia_m',
            avatar: 'https://i.pravatar.cc/150?u=ana',
            status: 'online',
            lastMessage: '¡Felicidades por tu nueva publicación!',
            time: '3d'
        },
        {
            name: 'Carlos Científico',
            handle: 'carlos_c',
            avatar: 'https://i.pravatar.cc/150?u=carlos',
            status: 'offline',
            lastMessage: '¿Te unes al congreso el próximo mes?',
            time: '4d'
        },
        {
            name: 'Lab de Robótica',
            handle: 'robotic_lab',
            avatar: 'https://i.pravatar.cc/150?u=robot',
            status: 'online',
            lastMessage: 'Estamos configurando el nuevo brazo mecánico.',
            time: '5d'
        }
    ];

    return (
        <div className="feed-layout" style={{ gridTemplateColumns: 'auto 1fr' }}>
            <Sidebar />
            <main className="main-content" style={{ maxWidth: 'none', display: 'flex' }}>
                {/* Columna de Chats */}
                <div style={{
                    width: '380px',
                    borderRight: '1px solid var(--border)',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Mensajes</h2>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Settings size={20} cursor="pointer" />
                            <Mail size={20} cursor="pointer" />
                        </div>
                    </header>

                    <div className="search-container" style={{ margin: '0 16px 16px' }}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar mensajes"
                            className="search-input"
                        />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {chats.map((chat, i) => (
                            <div key={i} style={{
                                padding: '16px',
                                display: 'flex',
                                gap: '12px',
                                cursor: 'pointer',
                                borderLeft: i === 0 ? '4px solid var(--primary)' : '4px solid transparent',
                                background: i === 0 ? 'rgba(29, 155, 240, 0.05)' : 'transparent',
                                transition: 'background 0.2s'
                            }}
                                onMouseEnter={(e) => i !== 0 && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                onMouseLeave={(e) => i !== 0 && (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{ position: 'relative' }}>
                                    <Avatar src={chat.avatar} alt={chat.name} size="48px" />
                                    {chat.status === 'online' && (
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#00ba7c', borderRadius: '50%', border: '2px solid var(--bg-dark)' }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{chat.time}</div>
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {chat.lastMessage}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Columna de conversación activa */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <header style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 10, 15, 0.75)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar src={chats[0].avatar} alt={chats[0].name} size="36px" />
                            <div style={{ lineHeight: 1.2 }}>
                                <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-main)' }}>{chats[0].name}</div>
                                <div style={{ color: '#00ba7c', fontSize: '13px', fontWeight: 500 }}>En línea</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Search size={20} cursor="pointer" color="var(--text-muted)" />
                            <InfoIcon size={20} cursor="pointer" color="var(--primary)" />
                        </div>
                    </header>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ alignSelf: 'center', padding: '20px', textAlign: 'center' }}>
                            <Avatar src={chats[0].avatar} alt={chats[0].name} size="64px" />
                            <h3 style={{ marginTop: '12px', fontSize: '18px', fontWeight: 800 }}>{chats[0].name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>@{chats[0].handle}</p>
                            <p style={{ marginTop: '12px', fontSize: '14px' }}>Se unió en Octubre 2023 · 1,240 seguidores</p>
                            <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />
                        </div>

                        <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '70%', fontSize: '15px', color: 'var(--text-main)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                            Hola! He estado revisando los avances del proyecto de investigación. Los resultados de la simulación cuántica son prometedores.
                        </div>
                        <div style={{ alignSelf: 'flex-end', background: 'var(--primary)', color: 'white', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '70%', fontSize: '15px', fontWeight: 500, boxShadow: '0 4px 12px var(--primary-glow)' }}>
                            ¡Excelente! Me alegra escucharlo. ¿Pudiste revisar el paper que te envié sobre la corrección de errores?
                        </div>
                        <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '70%', fontSize: '15px', color: 'var(--text-main)' }}>
                            Sí, justo en eso estoy. La sección 3 es brillante. Te enviaré mis notas en un momento. 🚀
                        </div>
                    </div>

                    <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg-dark)' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '20px' }} title="Media">🖼️</span>
                            <EmojiPicker onEmojiSelect={(emoji) => {
                                const input = document.getElementById('message-input');
                                if (input) {
                                    const start = input.selectionStart;
                                    const end = input.selectionEnd;
                                    const val = input.value;
                                    input.value = val.substring(0, start) + emoji + val.substring(end);
                                    input.focus();
                                    input.setSelectionRange(start + emoji.length, start + emoji.length);
                                }
                            }} />
                            <input
                                id="message-input"
                                type="text"
                                placeholder="Escribe un mensaje"
                                style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '8px', width: '100%', outline: 'none', fontSize: '15px' }}
                            />
                            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '20px' }} title="Enviar">🚀</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const MailIcon = ({ size, cursor }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const InfoIcon = ({ size, cursor, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;

export default Messages;
