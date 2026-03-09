import { BarChart3, Image, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import Avatar from "./Avatar";
import EmojiPicker from "./EmojiPicker";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showPoll, setShowPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleEmojiSelect = (emoji) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + emoji + content.substring(end);
            setContent(newContent);
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        } else {
            setContent(prev => prev + emoji);
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 4) {
            alert("Máximo 4 imágenes");
            return;
        }
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setSelectedImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handlePollToggle = () => {
        setShowPoll(!showPoll);
        if (showPoll) setPollOptions(["", ""]);
    };

    const updatePollOption = (index, value) => {
        setPollOptions(prev => {
            const newOptions = [...prev];
            newOptions[index] = value;
            return newOptions;
        });
    };

    const addPollOption = () => {
        if (pollOptions.length < 4) setPollOptions(prev => [...prev, ""]);
    };

    const removePollOption = (index) => {
        if (pollOptions.length > 2) {
            setPollOptions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && selectedImages.length === 0) return;

        setLoading(true);
        try {
            const imageUrls = await Promise.all(
                selectedImages.map(async (img) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(img.file);
                    });
                })
            );

            const poll = showPoll && pollOptions.some(opt => opt.trim())
                ? { options: pollOptions.filter(opt => opt.trim()), votes: {} }
                : null;

            await createPost(
                content,
                user.uid,
                user.displayName || user.email,
                user.photoURL,
                imageUrls,
                poll
            );

            setContent("");
            setSelectedImages([]);
            setShowPoll(false);
            setPollOptions(["", ""]);

            if (onPostCreated) onPostCreated();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al publicar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg-dark)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '50%'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Avatar */}
                        <Avatar
                            src={user?.photoURL}
                            alt={user?.displayName || user?.email}
                            size="48px"
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                placeholder="¿Qué está pasando?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--text-main)',
                                    fontSize: '20px',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    lineHeight: 1.5
                                }}
                            />

                            {/* Poll */}
                            {showPoll && (
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    marginBottom: '12px',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Crear encuesta</span>
                                        <button type="button" onClick={handlePollToggle} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                    {pollOptions.map((option, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder={`Opción ${index + 1}`}
                                                value={option}
                                                onChange={(e) => updatePollOption(index, e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px 14px',
                                                    background: 'var(--bg-dark)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-main)',
                                                    outline: 'none',
                                                    fontSize: '14px'
                                                }}
                                            />
                                            {pollOptions.length > 2 && (
                                                <button type="button" onClick={() => removePollOption(index)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}>
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {pollOptions.length < 4 && (
                                        <button type="button" onClick={addPollOption} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '13px' }}>
                                            + Añadir opción
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Images preview */}
                            {selectedImages.length > 0 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: selectedImages.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}>
                                    {selectedImages.map((img, index) => (
                                        <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                                            <img src={img.preview} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '28px',
                                                    height: '28px',
                                                    cursor: 'pointer',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: '1px solid var(--border)',
                                paddingTop: '12px'
                            }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={iconButtonStyle}
                                    >
                                        <Image size={20} />
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />

                                    <button type="button" onClick={handlePollToggle} style={{ ...iconButtonStyle, color: showPoll ? 'var(--primary)' : 'var(--primary-light)' }}>
                                        <BarChart3 size={20} />
                                    </button>

                                    {/* Emoji Selector */}
                                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <button
                                        type="submit"
                                        disabled={loading || (!content.trim() && selectedImages.length === 0)}
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 24px',
                                            borderRadius: '20px',
                                            fontWeight: 700,
                                            fontSize: '15px',
                                            cursor: loading || (!content.trim() && selectedImages.length === 0) ? 'not-allowed' : 'pointer',
                                            opacity: loading || (!content.trim() && selectedImages.length === 0) ? 0.5 : 1
                                        }}
                                    >
                                        {loading ? '...' : 'Publicar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const iconButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--primary-light)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
};

export default CreatePostModal;
