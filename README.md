# 🎓 EduSocial - Red Social Académica

EduSocial es una plataforma de interacción académica diseñada para facilitar el intercambio de conocimientos, reflexiones y recursos entre estudiantes. Desarrollada como parte de un taller práctico de bases NoSQL con Firebase, la aplicación combina una estética moderna y profesional con una arquitectura serverless robusta y segura.

## 🚀 Enlace del Proyecto
**Demo en vivo:** [https://eco-signal-449402-s3.web.app](https://eco-signal-449402-s3.web.app)

---

## 👥 Integrantes del Equipo
*   **Juan Vargas**
*   **Julian Venadia**
*   **Camilo Niño**

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
*   **Acceso Multimodal**: Inicio de sesión mediante Google Auth y Correo/Contraseña.
*   **Aislamiento de Datos**: Implementación estricta de **Firebase Security Rules**. Cada usuario tiene control total y exclusivo sobre la edición y eliminación de su propio contenido.
*   **Rutas Protegidas**: Navegación segura que garantiza que solo usuarios autenticados accedan al ecosistema académico.

### 📝 Interacción y Contenido
*   **Feed Dinámico**: Visualización de publicaciones en tiempo real.
*   **Sistema de Posts Versátil**: Soporte para texto, carga de múltiples imágenes y creación de encuestas interactivas.
*   **Micro-interacciones**: Sistema de "Me gusta" (Likes) y visualización de visualizaciones.
*   **Respuestas Académicas**: Hilos de comentarios integrados para debates profundos.

### 👤 Perfil y Personalización
*   **Gestión de Perfil**: Visualización detallada de la actividad del usuario (Posts y Respuestas).
*   **Sincronización Automática**: Los datos de perfil (nombre, email, avatar) se sincronizan dinámicamente con la colección de usuarios en Firestore.

---

## 🛠️ Stack Tecnológico
*   **Frontend**: React.js + Vite
*   **Estilos**: CSS3 Moderno (Glassmorphism, CSS Variables, Orbes Animados)
*   **Base de Datos**: Firebase Firestore (NoSQL Documental)
*   **Autenticación**: Firebase Authentication
*   **Hosting**: Firebase Hosting
*   **Iconos**: Lucide React

---

## 📂 Modelo de Datos (Firestore)
Cumpliendo con los requerimientos técnicos del taller, la estructura se basa en:

*   **usuarios**: `{userId} -> { nombre, email, photoURL, fechaRegistro }`
*   **posts**: `{postId} -> { contenido, fecha, userId, autorNombre, likes[], images[], comments, poll }`
*   **comentarios (subcolección)**: `{postId}/comments/{commentId} -> { contenido, userId, autorNombre, likes[], fecha }`

---

## 🔧 Instalación y Desarrollo Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [url-del-repositorio]
    cd RedSocial
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crear un archivo `.env` en la raíz con las credenciales de Firebase:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    ```

4.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```

---

## 📦 Despliegue
Para desplegar la aplicación a producción:
```bash
npm run build
npx firebase-tools deploy --only hosting,firestore
```

---

## ⚖️ Licencia
Este proyecto fue desarrollado con fines académicos. Todos los derechos reservados a sus respectivos autores.
