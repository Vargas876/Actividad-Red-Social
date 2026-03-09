import Sidebar from "../components/Sidebar";

const ComingSoon = ({ title }) => {
    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-black)' }}>
            <div style={{ width: '275px', borderRight: '1px solid var(--border-color)', padding: '0 12px' }}>
                <Sidebar />
            </div>
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-white)' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>{title}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Esta sección está siendo investigada por nuestros científicos. ¡Pronto disponible!</p>
            </main>
        </div>
    );
};

export default ComingSoon;
