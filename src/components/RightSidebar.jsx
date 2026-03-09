import { Search, Settings } from "lucide-react";

const RightSidebar = () => {
    const trends = [
        { category: "Investigación · Tendencia", title: "Computación Cuántica", posts: "12.5K posts" },
        { category: "Academia · Tendencia", title: "#PaperPublished", posts: "8.2K posts" },
        { category: "Ciencia · Tendencia", title: "CRISPR-Cas9", posts: "5.1K posts" },
        { category: "Tecnología · Tendencia", title: "React 19", posts: "15.9K posts" },
    ];

    const suggestions = [
        { name: "Dr. Aristhène", username: "aristhene_ai", bio: "Investigador IA @ MIT", avatar: "https://i.pravatar.cc/150?u=aristhene" },
        { name: "Sarah Lab", username: "sarah_biotech", bio: "Entusiasta Biotecnología", avatar: "https://i.pravatar.cc/150?u=sarah" },
        { name: "Prof. Einstein", username: "albert_e", bio: "Física Teórica & Relatividad", avatar: "https://i.pravatar.cc/150?u=albert" },
        { name: "Tech Academy", username: "tech_edu", bio: "Cursos de vanguardia", avatar: "https://i.pravatar.cc/150?u=tech" },
        { name: "Marta Historiadora", username: "marta_past", bio: "Cronología de la humanidad", avatar: "https://i.pravatar.cc/150?u=marta" }
    ];

    return (
        <aside className="right-sidebar">
            <div className="search-container">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Buscar en la red..." className="search-input" />
            </div>

            <div className="sidebar-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 className="card-title">Tendencias Académicas</h2>
                    <Settings size={18} cursor="pointer" />
                </div>
                {trends.map((trend, index) => (
                    <div key={index} className="trend-item">
                        <span className="trend-category">{trend.category}</span>
                        <div className="trend-name">{trend.title}</div>
                        <span className="trend-posts">{trend.posts}</span>
                    </div>
                ))}
                <button className="show-more">Mostrar más</button>
            </div>

            <div className="sidebar-card">
                <h2 className="card-title">Sugerencias de Seguimiento</h2>
                {suggestions.map((user, index) => (
                    <div key={index} className="suggestion-item">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="avatar-sm"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`; }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="suggestion-name">{user.name}</div>
                            <div className="suggestion-username">@{user.username}</div>
                        </div>
                        <button className="follow-btn">Seguir</button>
                    </div>
                ))}
                <button className="show-more">Mostrar más</button>
            </div>

            <footer className="sidebar-footer">
                <nav>
                    <a href="#">Condiciones de Servicio</a>
                    <a href="#">Política de Privacidad</a>
                    <a href="#">Accesibilidad</a>
                    <a href="#">Información de anuncios</a>
                    <span>© 2026 Red Social Académica.</span>
                </nav>
            </footer>
        </aside>
    );
};

export default RightSidebar;
