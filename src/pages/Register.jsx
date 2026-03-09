import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles, User, Mail, Lock, CheckCircle } from "lucide-react";
import Logo from "../components/Logo";
import { registerWithEmail, loginWithGoogle } from "../services/authService";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError("El nombre completo es requerido");
            return false;
        }
        if (!formData.email.trim()) {
            setError("El correo electrónico es requerido");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Ingresa un correo electrónico válido");
            return false;
        }
        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await registerWithEmail(formData.email, formData.password);
            navigate("/feed");
        } catch (err) {
            let errorMessage = "Error al crear la cuenta";
            if (err.code === "auth/email-already-in-use") {
                errorMessage = "Este correo ya está registrado";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "Correo electrónico inválido";
            } else if (err.code === "auth/weak-password") {
                errorMessage = "La contraseña es muy débil";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            navigate("/feed");
        } catch (err) {
            setError("Error al registrarse con Google");
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        "Acceso a publicaciones académicas exclusivas",
        "Conexión con investigadores de todo el mundo",
        "Herramientas de colaboración en tiempo real"
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
                        <span>Únete a la comunidad</span>
                    </div>
                    
                    <h1 className="hero-title">
                        Comienza tu viaje
                        <span className="gradient-text"> académico</span>
                        <br />
                        hoy mismo.
                    </h1>
                    
                    <p className="hero-description">
                        Forma parte de la red de investigadores más innovadora. Comparte tus 
                        descubrimientos, colabora en proyectos y expande tus horizontes científicos.
                    </p>

                    <div className="hero-benefits">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="benefit-icon">
                                    <CheckCircle size={18} />
                                </div>
                                <span>{benefit}</span>
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
                            <h2 className="form-title">Crear cuenta</h2>
                            <p className="form-subtitle">
                                Completa tus datos para unirte a la red académica
                            </p>
                        </div>

                        {/* Google Button */}
                        <button 
                            className="btn-google" 
                            onClick={handleGoogleRegister}
                            disabled={isLoading}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
                        <form onSubmit={handleRegister} className="login-form">
                            <div className={`input-wrapper ${focusedInput === 'fullName' ? 'focused' : ''}`}>
                                <label className="input-label">Nombre completo</label>
                                <div className="input-container">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedInput('fullName')}
                                        onBlur={() => setFocusedInput(null)}
                                        placeholder="Dr. María González"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={`input-wrapper ${focusedInput === 'email' ? 'focused' : ''}`}>
                                <label className="input-label">Correo electrónico</label>
                                <div className="input-container">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                        placeholder="nombre@universidad.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={`input-wrapper ${focusedInput === 'password' ? 'focused' : ''}`}>
                                <label className="input-label">Contraseña</label>
                                <div className="input-container">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        minLength={6}
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

                            <div className={`input-wrapper ${focusedInput === 'confirmPassword' ? 'focused' : ''}`}>
                                <label className="input-label">Confirmar contraseña</label>
                                <div className="input-container">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedInput('confirmPassword')}
                                        onBlur={() => setFocusedInput(null)}
                                        placeholder="Repite tu contraseña"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className={`btn-submit ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                <span className="btn-text">
                                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
                                </span>
                                <ArrowRight size={18} className="btn-icon" />
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="form-footer">
                            <p>
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="signup-link">Inicia sesión</Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges">
                        <span>Al registrarte, aceptas nuestros Términos y Política de Privacidad</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
