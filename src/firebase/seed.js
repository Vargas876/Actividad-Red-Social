
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const postsCollection = collection(db, "posts");

const USERS = [
    { name: 'Dr. Aristhène', handle: 'aristhene_ai', avatar: 'https://i.pravatar.cc/150?u=arist', bio: 'Investigador IA @ MIT', uid: 'user_1' },
    { name: 'Dra. Helena', handle: 'helena_bio', avatar: 'https://i.pravatar.cc/150?u=helena', bio: 'Doctora en Biotecnología', uid: 'user_2' },
    { name: 'Marcos Tech', handle: 'marcos_ia', avatar: 'https://i.pravatar.cc/150?u=marcos', bio: 'Ingeniero de Software', uid: 'user_3' },
    { name: 'Ana Sofía', handle: 'anasofia_m', avatar: 'https://i.pravatar.cc/150?u=ana', bio: 'Filósofa y Ética en IA', uid: 'user_4' },
    { name: 'Carlos Científico', handle: 'carlos_c', avatar: 'https://i.pravatar.cc/150?u=carlos', bio: 'Físico Cuántico', uid: 'user_5' },
    { name: 'Lab de Robótica', handle: 'robotic_lab', avatar: 'https://i.pravatar.cc/150?u=robot', bio: 'Innovación en robótica', uid: 'user_6' },
    { name: 'Lucía M.', handle: 'lucia_stars', avatar: 'https://i.pravatar.cc/150?u=lucia', bio: 'Astrofísica', uid: 'user_7' },
    { name: 'EduSocial Team', handle: 'edusocial', avatar: 'https://i.pravatar.cc/150?u=edu', bio: 'Cuenta oficial de la red', uid: 'user_8' },
    { name: 'Prof. Xavier', handle: 'xavier_pro', avatar: 'https://i.pravatar.cc/150?u=xavier', bio: 'Especialista en Genética', uid: 'user_9' },
    { name: 'Elena García', handle: 'eggarcia', avatar: 'https://i.pravatar.cc/150?u=elena', bio: 'Matemática Aplicada', uid: 'user_10' }
];

const POST_TEMPLATES = [
    "Increíble descubrimiento hoy en el laboratorio. Los resultados de la computación cuántica son prometedores. ⚛️",
    "¿Qué opinan sobre el uso de la IA en la revisión por pares? Abro hilo... 🧵",
    "Acabo de terminar de leer el último paper de DeepMind. El futuro se ve brillante.",
    "Buscando colaboradores para un nuevo proyecto sobre sostenibilidad y blockchain. ¡DM si te interesa!",
    "La ética en la inteligencia artificial no es negociable. Debemos construir sistemas transparentes.",
    "Hoy en el congreso de biotecnología se discutieron cosas fascinantes sobre CRISPR.",
    "A veces los experimentos fallan, pero ahí es donde ocurre el verdadero aprendizaje. 🧪",
    "¡Ya somos más de 10k investigadores en EduSocial! Gracias a todos por ser parte. 🚀",
    "Un recordatorio para todos los estudiantes: el descanso es parte del trabajo duro.",
    "Explorando nuevas fronteras en la astrofísica. Los datos del James Webb son una locura. 🌌",
    "¿Cuál es el libro que más ha influido en tu carrera académica? Los leo.",
    "Preparando la clase de mañana sobre algoritmos genéticos. ¡Me apasiona este tema!",
    "La interdisciplinariedad es la clave para resolver los problemas complejos de hoy.",
    "Publicar o morir es un mantra que debemos empezar a cuestionar en la academia.",
    "Hoy visitamos el nuevo centro de supercomputación. ¡Qué potencia!",
    "La educación abierta está cambiando el mundo. 🌍",
    "¿Teoría de cuerdas o gravedad cuántica de bucles?",
    "Nueva publicación aceptada en Nature. ¡Felicidad máxima!",
    "El impacto de la tecnología en la salud mental es un campo que requiere más estudio.",
    "¿Cómo gestionan su tiempo entre la investigación y la docencia?",
    "La ciencia no es solo datos, es curiosidad y perseverancia. ✨",
    "Debatamos: ¿Debería la IA tener derechos legales en el futuro?",
    "La visualización de datos es un arte en sí misma.",
    "Orgulloso de mis estudiantes de doctorado por su excelente presentación de hoy.",
    "La democratización del conocimiento es el pilar de EduSocial."
];

const COMMENT_TEMPLATES = [
    "¡Excelente aporte! Muy relevante para mi investigación actual.",
    "Totalmente de acuerdo con tu punto de vista. Saludos desde el laboratorio.",
    "¿Tienes el enlace al paper completo? Me interesaría mucho leerlo.",
    "Interesante reflexión. Yo añadiría que también hay que considerar el factor ético.",
    "¡Felicidades por ese logro! El trabajo duro siempre da sus frutos.",
    "Esto cambia mucho la perspectiva que teníamos hasta ahora. Gracias por compartir.",
    "Muy buen hilo, me ha servido mucho para aclarar conceptos.",
    "¿Has probado a aplicar esto en entornos de producción real?",
    "Me encanta ver cómo avanza la comunidad científica en EduSocial.",
    "Justo estaba pensando en esto mismo esta mañana. ¡Vaya coincidencia!",
    "Brillante. Simplemente brillante. 👏",
    "¿Planeas hacer algún webinar sobre este tema pronto?",
    "Ojalá hubiéramos tenido estas herramientas hace 10 años. ¡Qué progreso!",
    "Me guardo este post para más tarde, información muy valiosa.",
    "¿Qué metodología usaste para obtener esos resultados?",
    "Increíble. La tecnología no deja de sorprenderme cada día."
];

const IMAGES = [
    "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=800",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    null, null, null, null, null // 50% chance of no image
];

export const seedDatabase = async () => {
    console.log("Iniciando limpieza y carga de datos...");

    try {
        // 1. Limpiar posts existentes
        const querySnapshot = await getDocs(postsCollection);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log("Base de datos de posts limpiada.");

        // 2. Crear 100 posts
        let count = 0;
        const totalToSeed = 100;

        for (let i = 0; i < totalToSeed; i++) {
            const user = USERS[Math.floor(Math.random() * USERS.length)];
            const content = POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)];
            const img = IMAGES[Math.floor(Math.random() * IMAGES.length)];

            // Generar una fecha aleatoria en las últimas 48 horas
            const randomHoursAgo = Math.floor(Math.random() * 48);
            const date = new Date(Date.now() - (randomHoursAgo * 60 * 60 * 1000));

            const postRef = await addDoc(postsCollection, {
                contenido: content,
                userId: user.uid,
                autorNombre: user.name,
                autorAvatar: user.avatar,
                autorHandle: user.handle, // Asegurar que tenga handle
                fecha: date,
                likes: Array.from({ length: Math.floor(Math.random() * 200) }, (_, i) => `user_${Math.floor(Math.random() * 500)}`),
                images: img ? [img] : [],
                comments: 0, // Se actualizará después de crear los comentarios
                shares: Math.floor(Math.random() * 30),
                poll: Math.random() > 0.85 ? {
                    options: ['Muy de acuerdo', 'De acuerdo', 'En desacuerdo', 'Nose/No responde'],
                    votes: {
                        0: Array.from({ length: Math.floor(Math.random() * 20) }, (_, i) => `voter_0_${i}`),
                        1: Array.from({ length: Math.floor(Math.random() * 20) }, (_, i) => `voter_1_${i}`),
                        2: Array.from({ length: Math.floor(Math.random() * 20) }, (_, i) => `voter_2_${i}`),
                        3: Array.from({ length: Math.floor(Math.random() * 20) }, (_, i) => `voter_3_${i}`)
                    }
                } : null
            });

            // 3. Crear entre 1 y 5 comentarios para cada post
            const numComments = Math.floor(Math.random() * 5) + 1;
            const commentsCollection = collection(db, "posts", postRef.id, "comments");

            for (let j = 0; j < numComments; j++) {
                const commenter = USERS[Math.floor(Math.random() * USERS.length)];
                const commentContent = COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)];

                await addDoc(commentsCollection, {
                    contenido: commentContent,
                    userId: commenter.uid,
                    autorNombre: commenter.name,
                    autorAvatar: commenter.avatar,
                    fecha: new Date(date.getTime() + (Math.random() * 3600000)), // Comentario después del post
                    likes: Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => `user_${Math.floor(Math.random() * 500)}`)
                });
            }

            // Actualizar el contador de comentarios en el post
            await updateDoc(doc(db, "posts", postRef.id), {
                comments: numComments
            });

            count++;
            if (count % 10 === 0) console.log(`${count} posts creados con sus comentarios...`);
        }
        console.log("Siembra de 100 posts completada exitosamente.");
    } catch (e) {
        console.error("Error en el proceso de siembra:", e);
        throw e;
    }
};
