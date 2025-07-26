"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "../assets/css/Registro.module.css" // Importa los estilos como un objeto
import logoUleam from "../assets/img/Logouleam.png"
import { validateRegisterForm } from "../Validators/RegistroValidacion.js"
import { registerUser } from "../Services/RegistroServicios.js"
import { ArrowLeft, Eye, EyeOff } from "lucide-react" // Importa los iconos de flecha y ojo

function Registro() {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: false,
  })

  // Estado para errores
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: "",
    general: "",
  })

  // Estado para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estado para el proceso de registro
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate() // Usa useNavigate para la navegación

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }))
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Limpiar errores previos
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      terms: "",
      general: "",
    })

    try {
      // Validar formulario
      const validationResult = validateRegisterForm(formData)
      if (validationResult.hasError) {
        setErrors((prev) => ({
          ...prev,
          ...validationResult.errors,
        }))
        setIsSubmitting(false)
        return
      }

      // Registrar usuario
      const registerResult = registerUser(formData)
      if (registerResult.success) {
        // Registro exitoso
        alert(`¡Registro exitoso! Bienvenido ${registerResult.user.fullName}`)
        // Limpiar formulario
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          role: "",
          terms: false,
        })
        // Redireccionar al login después de 2 segundos
        setTimeout(() => {
          navigate("/login") // Usa navigate en lugar de window.location.href
        }, 2000)
      } else {
        // Error en el registro
        if (registerResult.field && registerResult.field !== "general") {
          setErrors((prev) => ({
            ...prev,
            [registerResult.field]: registerResult.message,
          }))
        } else {
          setErrors((prev) => ({
            ...prev,
            general: registerResult.message,
          }))
        }
      }
    } catch (error) {
      console.error("Error durante el registro:", error)
      setErrors((prev) => ({
        ...prev,
        general: "Error inesperado. Por favor, inténtalo de nuevo.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar botón de volver
  const handleBackClick = (e) => {
    e.preventDefault()
    navigate("/") // Usa navigate en lugar de window.location.href
  }

  // Alternar visibilidad de contraseñas
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
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
      <main className={styles.registerMain}>
        <div className={styles.registerContainer}>
          <div className={styles.registerCard}>
            <div className={styles.registerHeader}>
              <h2>Crear cuenta</h2>
              <p className={styles.registerSubtitle}>Regístrate para acceder al sistema de trabajos de titulación</p>
            </div>

            {/* Mensaje de error general */}
            {errors.general && (
              <div className={styles.errorBanner}>
                <span className={styles.errorIcon}>⚠️</span>
                <span className={styles.errorText}>{errors.general}</span>
              </div>
            )}

            <form className={styles.registerForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Nombres</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Ingresa tus nombres"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span className={styles.errorMessage}>{errors.firstName}</span>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Apellidos</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Ingresa tus apellidos"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span className={styles.errorMessage}>{errors.lastName}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span className={styles.errorMessage}>{errors.email}</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="username">Nombre de usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Crea un nombre de usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span className={styles.errorMessage}>{errors.username}</span>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Contraseña</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Crea una contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      title="Mostrar/ocultar contraseña"
                      onClick={() => togglePasswordVisibility("password")}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <span className={styles.errorMessage}>{errors.password}</span>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      title="Mostrar/ocultar contraseña"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <span className={styles.errorMessage}>{errors.confirmPassword}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role">Tipo de usuario</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="student">Estudiante</option>
                  {/* Solo estudiantes pueden registrarse públicamente */}
                </select>
                <span className={styles.errorMessage}>{errors.role}</span>
              </div>

              <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span className={styles.checkmark} />
                  Acepto los{" "}
                  <a href="#" className={styles.termsLink}>
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#" className={styles.termsLink}>
                    política de privacidad
                  </a>
                </label>
                <span className={styles.errorMessage}>{errors.terms}</span>
              </div>

              <button type="submit" className={styles.registerBtn} disabled={isSubmitting}>
                <span>{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}</span>
              </button>
            </form>

            <div className={styles.registerFooter}>
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className={styles.loginLink}>
                  Inicia sesión aquí
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

export default Registro
