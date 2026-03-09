import { Search, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const emojiCategories = {
    'Emojis': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
    'Personas': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦵', '🦿', '🦶', '👣', '👂', '🦻', '👃', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸'],
    'Animales': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐋', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'],
    'Comida': ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🍍', '🥝', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊'],
    'Actividades': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🤼', '🤼‍♂️', '🤼‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️', '🤺', '🤾', '🤾‍♂️', '🤾‍♀️', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏇', '🧘', '🧘‍♂️', '🧘‍♀️', '🏄', '🏄‍♂️', '🏄‍♀️', '🏊', '🏊‍♂️', '🏊‍♀️', '🤽', '🤽‍♂️', '🤽‍♀️', '🚣', '🚣‍♂️', '🚣‍♀️', '🧗', '🧗‍♂️', '🧗‍♀️', '🚵', '🚵‍♂️', '🚵‍♀️', '🚴', '🚴‍♂️', '🚴‍♀️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🤹‍♂️', '🤹‍♀️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🪗'],
    'Objetos': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💎', '📌', '📍', '🧮']
};

const categoryIcons = {
    'Emojis': '😊',
    'Personas': '👋',
    'Animales': '🐶',
    'Comida': '🍎',
    'Actividades': '⚽',
    'Objetos': '💡'
};

const EmojiPicker = ({ onEmojiSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Emojis');
    const [searchQuery, setSearchQuery] = useState('');
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const pickerHeight = 420; // Ajustado para ser más preciso
            const pickerWidth = 350;
            const margin = 12;

            let top = rect.top - pickerHeight - margin;
            let left = rect.left;

            // Si no hay espacio arriba, mostrar abajo
            if (top < margin) {
                top = rect.bottom + margin;
            }

            // Asegurar que no se salga por abajo
            if (top + pickerHeight > window.innerHeight - margin) {
                // Si tampoco cabe abajo, forzar a estar lo más visible posible
                top = Math.max(margin, window.innerHeight - pickerHeight - margin);
            }

            // Asegurar que no se salga por la derecha
            if (left + pickerWidth > window.innerWidth - margin) {
                left = window.innerWidth - pickerWidth - margin;
            }

            // Asegurar que no se salga por la izquierda
            if (left < margin) {
                left = margin;
            }

            setPickerPosition({ top, left });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    const handleEmojiClick = (emoji) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    };

    const allEmojis = Object.values(emojiCategories).flat();
    const filteredEmojis = searchQuery
        ? allEmojis.filter(emoji => emoji.includes(searchQuery) || searchQuery.length < 2).slice(0, 100)
        : null;

    const renderPicker = () => {
        if (!isOpen) return null;

        return createPortal(
            <>
                <div className="emoji-picker-overlay" onClick={() => setIsOpen(false)} />
                <div
                    className="emoji-picker-popover"
                    style={{
                        top: `${pickerPosition.top}px`,
                        left: `${pickerPosition.left}px`,
                        position: 'fixed' // Usamos fixed porque está en el portal a nivel de body
                    }}
                >
                    <div className="emoji-picker-header">
                        <div className="emoji-search-container">
                            <Search size={16} className="emoji-search-icon" />
                            <input
                                type="text"
                                className="emoji-search-input"
                                placeholder="Buscar emojis"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="emoji-categories-nav">
                            {Object.keys(emojiCategories).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setSearchQuery('');
                                    }}
                                    className={`emoji-category-btn ${activeCategory === category && !searchQuery ? 'active' : ''}`}
                                    title={category}
                                >
                                    {categoryIcons[category]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="emoji-picker-content">
                        {searchQuery ? (
                            <>
                                <div className="emoji-section-title">Resultados</div>
                                <div className="emoji-grid">
                                    {allEmojis.filter(e => searchQuery ? true : true).slice(0, 100).map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="emoji-item"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="emoji-section-title">{activeCategory}</div>
                                <div className="emoji-grid">
                                    {emojiCategories[activeCategory].map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="emoji-item"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>,
            document.body
        );
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                ref={buttonRef}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                style={{
                    background: isOpen ? 'rgba(99, 102, 241, 0.2)' : 'none',
                    border: 'none',
                    color: isOpen ? 'var(--primary)' : 'var(--primary-light)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Añadir emoji"
            >
                <Smile size={20} />
            </button>
            {renderPicker()}
        </div>
    );
};

export default EmojiPicker;
