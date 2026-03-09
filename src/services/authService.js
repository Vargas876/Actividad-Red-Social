import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { syncUserToFirestore } from "./userService";

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        await syncUserToFirestore(result.user);
        return result.user;
    } catch (error) {
        console.error("Error logging in with Google:", error);
        throw error;
    }
};

export const loginWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(result.user);
        return result.user;
    } catch (error) {
        console.error("Error logging in with email:", error);
        throw error;
    }
};

export const registerWithEmail = async (email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(result.user);
        return result.user;
    } catch (error) {
        console.error("Error registering with email:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
