import { Bell, Bookmark, Hash, Home, LogOut, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import Avatar from "./Avatar";
import CreatePostModal from "./CreatePostModal";
import Logo from "./Logo";

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navItems = [
        { icon: <Home size={26} />, label: "Inicio", path: "/feed" },
        { icon: <Hash size={26} />, label: "Explorar", path: "/explore" },
        { icon: <Bell size={26} />, label: "Notificaciones", path: "/notifications" },
        { icon: <Mail size={26} />, label: "Mensajes", path: "/messages" },
        { icon: <Bookmark size={26} />, label: "Guardados", path: "/bookmarks" },
        { icon: <User size={26} />, label: "Perfil", path: "/profile" },
    ];

    return (
        <>
            <aside className="sidebar">
                <div className="logo-container">
                    <Logo size={32} color="#f8fafc" />
                </div>

                <nav>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <button
                        className="post-button-large"
                        style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Publicar
                    </button>

                    {user && (
                        <div
                            style={{
                                padding: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                marginTop: 'auto',
                                transition: 'background 0.2s'
                            }}
                            className="nav-link"
                            onClick={handleLogout}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Avatar src={user.photoURL} alt={user.displayName || user.email} size="40px" />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.displayName || 'Usuario'}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    @{user.email?.split('@')[0]}
                                </div>
                            </div>
                            <LogOut size={18} />
                        </div>
                    )}
                </nav>
            </aside>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default Sidebar;
