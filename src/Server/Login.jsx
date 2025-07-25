"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "../assets/css/Login.module.css" // Importa los estilos como un objeto
import logoUleam from "../assets/img/Logouleam.png" // Asegúrate de que esta ruta sea correcta
import { validateLoginForm } from "../Validators/LoginValidacion.js"
import { loginUser, getRememberedUsername } from "../Services/LoginServicios.js"
import { ArrowLeft } from "lucide-react" // Importa el icono de flecha

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  })
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "", // Para errores generales de autenticación
  })
  const [isSubmitting, setIsSubmitting] = useState(false) // Para deshabilitar el botón durante el envío
  const navigate = useNavigate() // Usa useNavigate para la navegación

  // Efecto para cargar el usuario recordado al iniciar el componente
  useEffect(() => {
    const rememberedUser = getRememberedUsername()
    if (rememberedUser) {
      setFormData((prev) => ({
        ...prev,
        username: rememberedUser,
        remember: true,
      }))
    }
  }, [])

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Limpiar errores específicos o generales cuando el usuario empieza a escribir
    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }))
    }
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true) // Deshabilitar el botón
    // Limpiar errores previos
    setErrors({ username: "", password: "", general: "" })

    // 1. Validar formulario (campos vacíos, longitud, etc.)
    const validationResult = validateLoginForm(formData.username, formData.password)
    if (validationResult.hasError) {
      setErrors((prev) => ({
        ...prev,
        ...validationResult.errors,
      }))
      setIsSubmitting(false)
      return
    }

    // 2. Autenticar usuario usando el servicio
    const authResult = loginUser(formData.username, formData.password, formData.remember)
    if (authResult.success) {
      // Redireccionar a la página principal si el login es exitoso
      //alert(authResult.message) // Mensaje de éxito
      navigate("/interfazprincipal") // Usa navigate en lugar de window.location.href
    } else {
      // Mostrar error de autenticación
      if (authResult.field && authResult.field !== "general") {
        setErrors((prev) => ({
          ...prev,
          [authResult.field]: authResult.message,
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          general: authResult.message,
        }))
      }
    }
    setIsSubmitting(false) // Habilitar el botón de nuevo
  }

  // Manejar el botón de "Volver"
  const handleBackClick = (e) => {
    e.preventDefault()
    navigate("/") // Usa navigate en lugar de window.location.href
  }

  return (
    <div>
      {/* Barra superior */}
      <header className={styles.topHeader}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.windowControls}>
            <div className={`${styles.circle} ${styles.red}`} />
            <div className={`${styles.circle} ${styles.yellow}`} />
            <div className={`${styles.circle} ${styles.green}`} />
          </div>
        </div>
      </header>

      {/* Barra de navegación con título y logo */}
      <nav className={styles.navbar}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          {/* Izquierda: Botón Volver */}
          <div className={styles.backLink}>
            <Link to="/" className={styles.backBtn} title="Volver a la página anterior" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" /> {/* Icono de flecha */}
              {"Volver"}
            </Link>
          </div>

          {/* Centro: Título */}
          <div className={styles.navCenterContent}>
            <div className={styles.navTitle}>
              <h1>Software de trabajos de titulación</h1>
            </div>
          </div>

          {/* Derecha: Logo */}
          <div className={styles.navRightLogo}>
            <img src={logoUleam || "/placeholder.svg"} alt="ULEAM Logo" className={styles.logoImage} />
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className={styles.loginMain}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <h2>Inicio de sesión</h2>
              <p className={styles.loginSubtitle}>Accede a tu cuenta para gestionar trabajos de titulación</p>
            </div>
            {/* Mensaje de error general */}
            {errors.general && (
              <div className={styles.errorBanner}>
                <span className={styles.errorIcon}>⚠️</span>
                <span className={styles.errorText}>{errors.general}</span>
              </div>
            )}
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Ingresa tu nombre de usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span className={styles.errorMessage}>{errors.username}</span>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span className={styles.errorMessage}>{errors.password}</span>
              </div>
              <div className={styles.formOptions}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span className={styles.checkmark}></span>
                  Recordar sesión
                </label>
                <a href="#" className={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <button type="submit" className={styles.loginBtn} disabled={isSubmitting}>
                <span>{isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}</span>
              </button>
            </form>
            <div className={styles.loginFooter}>
              <p>
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className={styles.registerLink}>
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className={styles.divider} />
      {/* Pie de página */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>Universidad Laica Eloy Alfaro de Manabí</p>
          <p className={styles.copyright}>© 2025 - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}

export default Login
