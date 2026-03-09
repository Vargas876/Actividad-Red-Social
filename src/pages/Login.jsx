import { ArrowRight, Eye, EyeOff, Globe, Shield, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { loginWithEmail, loginWithGoogle } from "../services/authService";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const navigate = useNavigate();

    // Animación de entrada
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            navigate("/feed");
        } catch (err) {
            console.error(err);
            setError("Error al iniciar sesión con Google");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await loginWithEmail(email, password);
            navigate("/feed");
        } catch (err) {
            console.error(err);
            let errorMessage = "Credenciales incorrectas o error de conexión";
            if (err.code === "auth/user-not-found") {
                errorMessage = "No existe una cuenta con este correo";
            } else if (err.code === "auth/wrong-password") {
                errorMessage = "Contraseña incorrecta";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "Correo electrónico no válido";
            } else if (err.code === "auth/too-many-requests") {
                errorMessage = "Demasiados intentos fallidos. Intenta más tarde.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Zap, text: "Colaboración en tiempo real" },
        { icon: Shield, text: "Seguridad de nivel empresarial" },
        { icon: Globe, text: "Red global de investigadores" },
    ];

    return (
        <div className="framer-login">
            {/* Background Effects */}
            <div className="framer-bg">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className={`framer-container ${isVisible ? 'visible' : ''}`}>
                {/* Left Side - Hero */}
                <div className="framer-hero">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Plataforma Académica</span>
                    </div>

                    <h1 className="hero-title">
                        El centro de la
                        <span className="gradient-text"> inteligencia</span>
                        <br />
                        colectiva.
                    </h1>

                    <p className="hero-description">
                        Conecta con investigadores de todo el mundo. Comparte tus hallazgos,
                        colabora en tiempo real y expande las fronteras del conocimiento.
                    </p>

                    <div className="hero-features">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="feature-icon">
                                    <feature.icon size={18} />
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">50K+</span>
                            <span className="stat-label">Investigadores</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-value">120+</span>
                            <span className="stat-label">Países</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-value">1M+</span>
                            <span className="stat-label">Publicaciones</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="framer-form-section">
                    <div className="form-card">
                        {/* Header */}
                        <div className="form-header">
                            <div className="logo-mark">
                                <Logo size={48} color="#f8fafc" />
                            </div>
                            <h2 className="form-title">Bienvenido de nuevo</h2>
                            <p className="form-subtitle">
                                Ingresa tus credenciales para acceder a tu cuenta
                            </p>
                        </div>

                        {/* Google Button */}
                        <button
                            className="btn-google"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Continuar con Google</span>
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">o</span>
                            <div className="divider-line"></div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleEmailLogin} className="login-form">
                            <div className={`input-wrapper ${focusedInput === 'email' ? 'focused' : ''}`}>
                                <label className="input-label">Correo electrónico</label>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                        placeholder="nombre@universidad.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={`input-wrapper ${focusedInput === 'password' ? 'focused' : ''}`}>
                                <div className="label-row">
                                    <label className="input-label">Contraseña</label>
                                    <a href="#" className="forgot-link">¿Olvidaste?</a>
                                </div>
                                <div className="input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`btn-submit ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                <span className="btn-text">
                                    {isLoading ? 'Entrando...' : 'Entrar a la plataforma'}
                                </span>
                                <ArrowRight size={18} className="btn-icon" />
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="form-footer">
                            <p>
                                ¿No tienes una cuenta?{' '}
                                <Link to="/register" className="signup-link">Crea una gratis</Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges">
                        <span>Respaldado por</span>
                        <div className="badge-dots">
                            <div className="badge-dot"></div>
                            <div className="badge-dot"></div>
                            <div className="badge-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
