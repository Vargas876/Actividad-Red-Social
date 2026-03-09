import PostCard from "../components/PostCard";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

const Bookmarks = () => {
    // Datos mock para visualización rápida
    const mockBookmarkedPosts = [
        {
            id: 'mock-1',
            autorNombre: 'Marcos Tech',
            autorAvatar: 'https://i.pravatar.cc/150?u=marcos',
            contenido: 'He recopilado una lista de los mejores recursos para aprender React 19 y Server Components. ¡Guardado obligatorio para cualquier desarrollador frontend!',
            fecha: { seconds: Date.now() / 1000 - 3600 },
            likes: Array(25).fill(1),
            comments: 12,
            shares: 4,
            images: []
        },
        {
            id: 'mock-2',
            autorNombre: 'Dra. Helena',
            autorAvatar: 'https://i.pravatar.cc/150?u=helena',
            contenido: 'Nuestro último paper sobre CRISPR-Cas9 ha sido aceptado en Nature Communications. Aquí les dejo un hilo con las conclusiones más importantes. 🧬🧵',
            fecha: { seconds: Date.now() / 1000 - 86400 },
            likes: Array(150).fill(1),
            comments: 45,
            shares: 20,
            images: ['https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800']
        },
        {
            id: 'mock-3',
            autorNombre: 'Ana Sofía',
            autorAvatar: 'https://i.pravatar.cc/150?u=ana',
            contenido: '¿Es posible una IA verdaderamente ética en un sistema capitalista? Mi última reflexión sobre el tema en el blog. 🧠✨',
            fecha: { seconds: Date.now() / 1000 - 172800 },
            likes: Array(89).fill(1),
            comments: 34,
            shares: 15,
            images: []
        },
        {
            id: 'mock-4',
            autorNombre: 'Lucía M.',
            autorAvatar: 'https://i.pravatar.cc/150?u=lucia',
            contenido: 'Anoche logré capturar la Nebulosa de Orión con mi nuevo telescopio. ¡La ciencia es hermosa! 🌌🔭',
            fecha: { seconds: Date.now() / 1000 - 259200 },
            likes: Array(342).fill(1),
            comments: 56,
            shares: 89,
            images: ['https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800']
        }
    ];

    return (
        <div className="feed-layout">
            <Sidebar />
            <main className="main-content">
                <header className="feed-header">
                    <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Guardados</h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>@usuario</p>
                </header>

                <div className="post-list">
                    {mockBookmarkedPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {mockBookmarkedPosts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 20px', maxWidth: '400px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '31px', fontWeight: 800, marginBottom: '12px', lineHeight: '36px' }}>Guarda posts para después</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No dejes que los buenos posts se te pierdan. Guárdalos aquí para volver a verlos pronto.</p>
                    </div>
                )}
            </main>
            <RightSidebar />
        </div>
    );
};

export default Bookmarks;
