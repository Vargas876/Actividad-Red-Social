import { BarChart3, Image, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addComment, createPost } from "../services/postService";
import Avatar from "./Avatar";
import EmojiPicker from "./EmojiPicker";

const CreatePost = ({ onPostCreated, replyTo = null, onCancel = null, compact = false, postId = null }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showPoll, setShowPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const { user } = useAuth();
    const isReply = !!postId;

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
            alert("Máximo 4 imágenes por publicación");
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
        if (showPoll) {
            setPollOptions(["", ""]);
        }
    };

    const updatePollOption = (index, value) => {
        setPollOptions(prev => {
            const newOptions = [...prev];
            newOptions[index] = value;
            return newOptions;
        });
    };

    const addPollOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions(prev => [...prev, ""]);
        }
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
            if (isReply && postId) {
                // Es un comentario/reply
                await addComment(
                    postId,
                    user.uid,
                    user.displayName || user.email,
                    user.photoURL,
                    content
                );
            } else {
                // Es un post normal
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
            }

            setContent("");
            setSelectedImages([]);
            setShowPoll(false);
            setPollOptions(["", ""]);

            if (onPostCreated) onPostCreated();
            if (onCancel) onCancel();
        } catch (err) {
            console.error(err);
            alert("Error al publicar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="create-post-container"
            style={{
                maxWidth: '100%',
                overflow: 'hidden',
                padding: compact ? '12px 16px' : '16px',
                borderBottom: '1px solid var(--border)'
            }}
        >
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <Avatar
                    src={user?.photoURL}
                    alt={user?.displayName || user?.email}
                    size={compact ? "40px" : "48px"}
                />

                <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                    {replyTo && (
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '13px',
                            marginBottom: '8px'
                        }}>
                            Respondiendo a <span style={{ color: 'var(--primary-light)' }}>@{replyTo}</span>
                        </p>
                    )}

                    <textarea
                        ref={textareaRef}
                        placeholder={compact ? "Escribe tu respuesta..." : "¿Qué está pasando?"}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={compact ? 2 : Math.max(3, content.split('\n').length)}
                        style={{
                            minHeight: compact ? '60px' : '100px',
                            maxHeight: '300px',
                            resize: 'none',
                            border: 'none',
                            outline: 'none',
                            fontSize: compact ? '18px' : '20px',
                            background: 'transparent',
                            color: 'var(--text-main)',
                            width: '100%',
                            fontFamily: 'inherit',
                            padding: '12px 0',
                            marginTop: '8px',
                            lineHeight: 1.5
                        }}
                    ></textarea>

                    {/* Preview de imágenes */}
                    {selectedImages.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: selectedImages.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                            gap: '8px',
                            marginTop: '12px',
                            marginBottom: '12px',
                            maxWidth: '100%',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}>
                            {selectedImages.map((img, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'relative',
                                        aspectRatio: selectedImages.length === 1 ? '16/9' : '1/1',
                                        maxHeight: selectedImages.length === 1 ? '250px' : '120px',
                                        overflow: 'hidden',
                                        borderRadius: selectedImages.length === 1 ? '12px' : '8px'
                                    }}
                                >
                                    <img
                                        src={img.preview}
                                        alt={`Preview ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '6px',
                                            right: '6px',
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

                    {/* Preview de encuesta */}
                    {showPoll && (
                        <div style={{
                            background: 'var(--bg-card)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '12px',
                            marginBottom: '12px',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>Crear encuesta</span>
                                <button onClick={handlePollToggle} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            {pollOptions.map((option, index) => (
                                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
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
                                        <button onClick={() => removePollOption(index)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {pollOptions.length < 4 && (
                                <button onClick={addPollOption} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '14px' }}>
                                    + Añadir opción
                                </button>
                            )}
                        </div>
                    )}

                    {/* Actions row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {/* Botón de Imagen */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
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
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                title="Añadir imagen"
                            >
                                <Image size={20} />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />

                            {/* Botón de Encuesta */}
                            <button
                                onClick={handlePollToggle}
                                style={{
                                    background: showPoll ? 'rgba(99, 102, 241, 0.2)' : 'none',
                                    border: 'none',
                                    color: showPoll ? 'var(--primary)' : 'var(--primary-light)',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Crear encuesta"
                            >
                                <BarChart3 size={20} />
                            </button>

                            {/* Botón de Emoji */}
                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '8px 16px',
                                        borderRadius: '20px'
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                className="post-btn-sm"
                                disabled={loading || (!content.trim() && selectedImages.length === 0)}
                                style={{
                                    opacity: loading || (!content.trim() && selectedImages.length === 0) ? 0.5 : 1,
                                    cursor: loading || (!content.trim() && selectedImages.length === 0) ? 'not-allowed' : 'pointer',
                                    padding: compact ? '6px 16px' : '8px 16px'
                                }}
                            >
                                {loading ? "Publicando..." : (compact ? "Responder" : "Publicar")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreatePost;
