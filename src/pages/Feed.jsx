import { LayoutGrid, User } from "lucide-react";
import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

const Feed = () => {
    const [filter, setFilter] = useState('all'); // 'all' or 'mine'

    return (
        <div className="feed-layout">
            <Sidebar />

            <main className="main-content">
                <header className="feed-header">
                    <h2>Inicio</h2>
                </header>

                <CreatePost />

                {/* Tabs Switcher - X style but with academic icons */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                    <button
                        className={`tab-item-x ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: filter === 'all' ? 'var(--text-white)' : 'var(--text-muted)',
                            fontWeight: filter === 'all' ? 700 : 500,
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LayoutGrid size={18} />
                            Feed Global
                        </div>
                        {filter === 'all' && <div style={{ position: 'absolute', bottom: 0, left: '0', right: '0', height: '4px', background: 'var(--accent-blue)', borderRadius: '2px' }} />}
                    </button>
                    <button
                        className={`tab-item-x ${filter === 'mine' ? 'active' : ''}`}
                        onClick={() => setFilter('mine')}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: filter === 'mine' ? 'var(--text-white)' : 'var(--text-muted)',
                            fontWeight: filter === 'mine' ? 700 : 500,
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <User size={18} />
                            Mis Publicaciones
                        </div>
                        {filter === 'mine' && <div style={{ position: 'absolute', bottom: 0, left: '0', right: '0', height: '4px', background: 'var(--accent-blue)', borderRadius: '2px' }} />}
                    </button>
                </div>

                <PostList filter={filter} />
            </main>

            <RightSidebar />
        </div>
    );
};

export default Feed;
