import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import Logo from "./Logo";

const Navbar = () => {
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Logo size={36} />
                    <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: '#1e293b' }}>EduSocial</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=random`}
                            alt="Avatar"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>{user?.displayName || user?.email}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px'
                        }}
                    >
                        <LogOut size={18} />
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
