import { Link } from "react-router-dom"
import styles from "../assets/css/Index.module.css" // Importa los estilos como un objeto
import logoUleam from "../assets/img/Logouleam.png"
import principal from "../assets/img/imagenprincipal.png"

function Index() {
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
      {/* Barra de navegación */}
      <nav className={styles.navbar}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <div className={styles.navLogo}>
            <img src={logoUleam || "/placeholder.svg"} alt="ULEAM Logo" />
            <div className={styles.navLogoText}>
              <span className={styles.universityName}>Uleam</span>
              <span className={styles.universityFullname}>ELOY ALFARO DE MANABÍ</span>
            </div>
          </div>
          <div className={styles.authOptions}>
            <Link to="/login" className={`${styles.authLink} ${styles.login}`}>
              Iniciar Sesión
            </Link>
            <Link to="/registro" className={`${styles.authLink} ${styles.login}`}>
              Registrarse
            </Link>
          </div>
        </div>
      </nav>
      {/* Contenido principal */}
      <main>
        <section className={styles.heroSection}>
          <div className={`${styles.container} ${styles.heroContainer}`}>
            <div className={styles.welcomeText}>
              <h1>Gestiona tu Trabajo de Titulación de forma Digital</h1>
              <p className={styles.subtitle}>
                Plataforma integral que simplifica todo el proceso académico de trabajos finales, desde la propuesta
                hasta la defensa
              </p>
              <div className={styles.heroActions}>
                 <Link to="/login" className={`${styles.ctaButton} ${styles.primary}`}>
                 Comenzar Ahora
                 </Link>
                <a href="#proceso" className={`${styles.ctaButton} ${styles.secondary}`}>
                  Ver Proceso
                </a>
              </div>
            </div>
            <div className={styles.illustrationContainer}>
              <img className={styles.illustration} src={principal || "/placeholder.svg"} alt="Ilustración" />
            </div>
          </div>
        </section>
        {/* Proceso de Titulación */}
        <section id="proceso" className={styles.processSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Proceso de Titulación</h2>
            <div className={styles.processTimeline}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>Selección de Tema</h3>
                  <p>Propón tu tema de investigación y recibe aprobación de tu tutor</p>
                </div>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>Desarrollo del Trabajo</h3>
                  <p>Sube tus avances, recibe retroalimentación y mejora continuamente</p>
                </div>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>Seguimiento de Avances</h3>
                  <p>Monitorea tu progreso y cumple con todas las entregas programadas</p>
                </div>
              </div>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3>Finalización y Defensa</h3>
                  <p>Completa tu trabajo y prepárate para la defensa final</p>
                </div>
              </div>
            </div>
          </div>
        </section>
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

export default Index
