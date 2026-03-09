import { Search, TrendingUp } from "lucide-react";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

const Explore = () => {
    const categories = ["Para ti", "Tendencias", "Noticias", "Ciencia", "Tecnología", "Humanidades"];

    const trendingTopics = [
        { topic: "Inteligencia Artificial", posts: "45.2K posts", category: "Tecnología" },
        { topic: "Cambio Climático", posts: "32.1K posts", category: "Ciencia" },
        { topic: "Computación Cuántica", posts: "12.8K posts", category: "Física" },
        { topic: "#EduSocial", posts: "28.4K posts", category: "Comunidad" },
        { topic: "Neurociencia", posts: "15.6K posts", category: "Medicina" },
        { topic: "Blockchain Académico", posts: "8.9K posts", category: "Tecnología" },
        { topic: "Energías Limpias", posts: "19.3K posts", category: "Sostenibilidad" },
        { topic: "Ética en Algoritmos", posts: "6.7K posts", category: "Filosofía" },
        { topic: "Exploración Espacial", posts: "54.1K posts", category: "Astronomía" },
        { topic: "Arqueología Digital", posts: "4.2K posts", category: "Historia" }
    ];

    return (
        <div className="feed-layout">
            <Sidebar />
            <main className="main-content">
                <header className="feed-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                    <div style={{ padding: '8px 16px', width: '100%', maxWidth: '600px' }}>
                        <div className="search-container" style={{ margin: 0, width: '100%' }}>
                            <Search size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Buscar en EduSocial"
                                className="search-input"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                    </div>
                </header>

                <div style={{ padding: '16px', position: 'relative' }}>
                    <div style={{
                        height: '240px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        marginBottom: '8px'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600"
                            alt="Featured"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 50%, transparent 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '24px'
                        }}>
                            <span style={{ fontSize: '14px', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '4px' }}>Ciencia · HOY</span>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>El futuro del aprendizaje profundo en la neurociencia computacional</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginTop: '8px' }}>
                        {categories.map((cat, i) => (
                            <button key={cat} style={{
                                flex: 1,
                                padding: '16px 8px',
                                background: 'none',
                                border: 'none',
                                color: i === 0 ? 'var(--text-main)' : 'var(--text-muted)',
                                fontWeight: i === 0 ? 700 : 500,
                                fontSize: '14px',
                                cursor: 'pointer',
                                position: 'relative',
                                whiteSpace: 'nowrap'
                            }}>
                                {cat}
                                {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp color="var(--primary)" /> Tendencias para ti
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {trendingTopics.map((item, i) => (
                            <div key={i} className="trend-item-large" style={{
                                padding: '16px',
                                borderBottom: '1px dotted var(--border)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '13px' }}>
                                    <span>{item.category} · Tendencia</span>
                                    <span>...</span>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '16px', margin: '4px 0', color: 'var(--text-main)' }}>{item.topic}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{item.posts}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

export default Explore;
