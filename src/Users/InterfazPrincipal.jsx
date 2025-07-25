"use client"

import { Link, useNavigate, useLocation } from "react-router-dom" // Import useLocation
import styles from "../assets/css/InterfazPrincipal.module.css"
import logoUleam from "../assets/img/Logouleam.png"
import imagenPrincipal from "../assets/img/imagenprincipal.png"
import { logoutUser } from "../Services/LoginServicios"
// Se eliminan los imports de useState, useEffect, getAllDocuments, getDocumentStatus

function InterfazPrincipal() {
  const navigate = useNavigate()
  const location = useLocation() // Initialize useLocation

  const handleLogout = (e) => {
    e.preventDefault()
    logoutUser()
    navigate("/login")
  }

  return (
    <div>
      <header className={styles.topHeader}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.windowControls}>
            <div className={`${styles.circle} ${styles.red}`} />
            <div className={`${styles.circle} ${styles.yellow}`} />
            <div className={`${styles.circle} ${styles.green}`} />
          </div>
        </div>
      </header>
      <nav className={styles.navbar}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <div className={styles.navLogo}>
            <img src={logoUleam || "/placeholder.svg"} alt="ULEAM Logo" />
            <div className={styles.navLogoText}>
              <span className={styles.universityName}>Uleam</span>
              <span className={styles.universityFullname}>ELOY ALFARO DE MANABÍ</span>
            </div>
          </div>
          <div className={styles.navMenu}>
            <Link
              to="/interfazprincipal"
              className={`${styles.navLink} ${location.pathname === "/interfazprincipal" ? styles.active : ""}`}
            >
              Inicio
            </Link>
            <Link
              to="/opciontema"
              className={`${styles.navLink} ${location.pathname === "/opciontema" ? styles.active : ""}`}
            >
              Selección de Tema
            </Link>
            <Link
              to="/registrartrabajo"
              className={`${styles.navLink} ${location.pathname === "/registrartrabajo" ? styles.active : ""}`}
            >
              Registrar Trabajo
            </Link>
            <Link
              to="/avances"
              className={`${styles.navLink} ${location.pathname === "/avances" ? styles.active : ""}`}
            >
              Avances
            </Link>
            <Link to="#" className={`${styles.navLink} ${styles.logout}`} onClick={handleLogout}>
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <section className={styles.heroSection}>
          <div className={`${styles.container} ${styles.heroContainer}`}>
            <div className={styles.welcomeText}>
              <h1>Bienvenido al sistema de Registro y Control de Trabajos de Titulación</h1>
              <p className={styles.subtitle}>Plataforma integral para la gestión académica de trabajos finales</p>
            </div>
            <div className={styles.illustrationContainer}>
              <img className={styles.illustration} src={imagenPrincipal || "/placeholder.svg"} alt="Ilustración" />
            </div>
          </div>
        </section>
        {/* Se ha eliminado la sección de estadísticas */}
      </main>
      <div className={styles.divider} />
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>Universidad Laica Eloy Alfaro de Manabí</p>
          <p className={styles.copyright}>© 2025 - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}

export default InterfazPrincipal
