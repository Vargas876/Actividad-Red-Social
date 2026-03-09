import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    collectionGroup,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const postsCollection = collection(db, "posts");

// Crear post con soporte para imágenes
export const createPost = async (content, userId, authorNombre, authorAvatar, images = [], poll = null) => {
    try {
        await addDoc(postsCollection, {
            contenido: content,
            userId: userId,
            autorNombre: authorNombre,
            autorAvatar: authorAvatar || `https://ui-avatars.com/api/?name=${authorNombre}&background=random`,
            fecha: serverTimestamp(),
            likes: [],
            images: images || [],
            comments: 0,
            shares: 0,
            poll: poll
        });
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const updatePost = async (postId, newContent, images = null) => {
    try {
        const postRef = doc(db, "posts", postId);
        const updateData = {
            contenido: newContent,
            fechaEdicion: serverTimestamp()
        };
        if (images !== null) {
            updateData.images = images;
        }
        await updateDoc(postRef, updateData);
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef);
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

export const toggleLike = async (postId, userId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const postData = postSnap.data();
            const likes = postData.likes || [];

            if (likes.includes(userId)) {
                await updateDoc(postRef, {
                    likes: arrayRemove(userId)
                });
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion(userId)
                });
            }
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
};

// ==================== COMENTARIOS ====================

// Agregar comentario a un post
export const addComment = async (postId, userId, authorNombre, authorAvatar, content) => {
    try {
        const commentsCollection = collection(db, "posts", postId, "comments");

        // Crear el comentario
        await addDoc(commentsCollection, {
            contenido: content,
            userId: userId,
            autorNombre: authorNombre,
            autorAvatar: authorAvatar || `https://ui-avatars.com/api/?name=${authorNombre}&background=random`,
            fecha: serverTimestamp(),
            likes: []
        });

        // Incrementar contador de comentarios
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            const currentComments = postSnap.data().comments || 0;
            await updateDoc(postRef, {
                comments: currentComments + 1
            });
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

// Obtener comentarios de un post en tiempo real
export const subscribeToComments = (postId, callback, onError) => {
    const commentsCollection = collection(db, "posts", postId, "comments");
    const q = query(commentsCollection, orderBy("fecha", "desc"));

    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(comments);
    }, (error) => {
        console.error("Error in subscribeToComments:", error);
        if (onError) onError(error);
    });
};

// Obtener comentarios una sola vez
export const getComments = async (postId) => {
    try {
        const commentsCollection = collection(db, "posts", postId, "comments");
        const q = query(commentsCollection, orderBy("fecha", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting comments:", error);
        throw error;
    }
};

// Dar like a un comentario
export const toggleCommentLike = async (postId, commentId, userId) => {
    try {
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        const commentSnap = await getDoc(commentRef);

        if (commentSnap.exists()) {
            const commentData = commentSnap.data();
            const likes = commentData.likes || [];

            if (likes.includes(userId)) {
                await updateDoc(commentRef, {
                    likes: arrayRemove(userId)
                });
            } else {
                await updateDoc(commentRef, {
                    likes: arrayUnion(userId)
                });
            }
        }
    } catch (error) {
        console.error("Error toggling comment like:", error);
        throw error;
    }
};

export const updateComment = async (postId, commentId, newContent) => {
    try {
        if (!postId) throw new Error("postId is required to update a comment");
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        await updateDoc(commentRef, {
            contenido: newContent,
            fechaEdicion: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
};

export const deleteComment = async (postId, commentId) => {
    try {
        if (!postId) throw new Error("postId is required to delete a comment");
        const commentRef = doc(db, "posts", postId, "comments", commentId);
        await deleteDoc(commentRef);

        // Reducir contador de comentarios del post padre
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            const currentComments = postSnap.data().comments || 0;
            await updateDoc(postRef, {
                comments: Math.max(0, currentComments - 1)
            });
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

// ==================== SUSCRIPCIONES ====================

export const subscribeToPosts = (callback, onError) => {
    const q = query(postsCollection, orderBy("fecha", "desc"));
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    }, (error) => {
        console.error("Error in subscribeToPosts:", error);
        if (onError) onError(error);
    });
};

export const subscribeToMyPosts = (userId, callback, onError) => {
    const q = query(postsCollection, where("userId", "==", userId), orderBy("fecha", "desc"));
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    }, (error) => {
        console.error("Error in subscribeToMyPosts:", error);
        if (onError) onError(error);
    });
};

export const subscribeToLikedPosts = (userId, callback, onError) => {
    // Query solo posts que tienen el userId en su array de likes
    const q = query(postsCollection, where("likes", "array-contains", userId), orderBy("fecha", "desc"));

    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(posts);
    }, (error) => {
        console.error("Error in subscribeToLikedPosts:", error);
        if (onError) onError(error);
    });
};

// ==================== RESPUESTAS (COMMENTS BY USER) ====================

export const subscribeToUserReplies = (userId, callback, onError) => {
    const q = query(
        collectionGroup(db, "comments"),
        where("userId", "==", userId),
        orderBy("fecha", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const replies = snapshot.docs.map(doc => ({
            id: doc.id,
            postId: doc.ref.parent.parent?.id,
            ...doc.data(),
            isReply: true // Bandera para que PostList sepa que es un comentario
        }));
        callback(replies);
    }, (error) => {
        console.error("Error in subscribeToUserReplies:", error);
        if (onError) onError(error);
    });
};

// ==================== ACCIONES ====================

export const sharePost = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            const currentShares = postSnap.data().shares || 0;
            await updateDoc(postRef, {
                shares: currentShares + 1
            });
        }
    } catch (error) {
        console.error("Error sharing post:", error);
        throw error;
    }
};

export const voteInPoll = async (postId, optionIndex, userId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            const postData = postSnap.data();
            const poll = postData.poll;

            if (!poll) return;

            // Inicializar votes si no existe
            const votes = poll.votes || {};

            // Verificar si el usuario ya votó
            // Para simplificar, permitiremos cambiar el voto o simplemente no dejar votar de nuevo
            // En Twitter puedes ver resultados pero no cambiar. 
            // Buscaremos si el userId ya está en algún índice de votos
            let alreadyVoted = false;
            Object.values(votes).forEach(voters => {
                if (voters.includes(userId)) alreadyVoted = true;
            });

            if (alreadyVoted) return; // Opcional: podrías permitir cambiar voto

            const newVotes = { ...votes };
            if (!newVotes[optionIndex]) {
                newVotes[optionIndex] = [];
            }
            newVotes[optionIndex].push(userId);

            await updateDoc(postRef, {
                "poll.votes": newVotes
            });
        }
    } catch (error) {
        console.error("Error voting in poll:", error);
        throw error;
    }
};
