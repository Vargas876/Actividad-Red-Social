import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Sincroniza los datos del usuario autenticado con la colección 'usuarios' en Firestore.
 * Requerimiento del taller: usuarios (colección) -> userId (documento) -> nombre, email.
 */
export const syncUserToFirestore = async (user) => {
    if (!user) return;

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // Crear documento si no existe
        await setDoc(userRef, {
            nombre: user.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`,
            fechaRegistro: new Date().toISOString()
        });
    } else {
        // Actualizar datos si han cambiado (opcional)
        await updateDoc(userRef, {
            email: user.email,
            ultimaConexion: new Date().toISOString()
        });
    }
};

export const getUserData = async (userId) => {
    const userRef = doc(db, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};
