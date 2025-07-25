"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom" // Import useLocation
import styles from "../assets/css/OpcionTema.module.css"
import logoUleam from "../assets/img/Logouleam.png"
import { Search, Edit } from "lucide-react"
import { getCurrentLoggedInUser, logoutUser } from "../Services/LoginServicios"
import {
  submitNewProposal,
  getAllProposals,
  getProposalsByStudentUsername,
  evaluateProposal,
  getProposalStatus,
} from "../Services/TrabajoTitulacionServicios"
import { validateProposalForm } from "../Validators/TrabajoTitulacionValidacion"

function OpcionTema() {
  const navigate = useNavigate()
  const location = useLocation() // Initialize useLocation
  const [currentUser, setCurrentUser] = useState(null)
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false)
  const [proposalFormData, setProposalFormData] = useState({
    studentName: "",
    cedula: "",
    career: "",
    semester: "",
    title: "",
    area: "",
    modalidad: "",
    resumen: "",
    justificacion: "",
  })
  const [proposalErrors, setProposalErrors] = useState({})
  const [proposals, setProposals] = useState([])
  const [filteredProposals, setFilteredProposals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCareer, setFilterCareer] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  // State for teacher/admin evaluation
  const [selectedProposalForEvaluation, setSelectedProposalForEvaluation] = useState(null)
  const [evaluationFormData, setEvaluationFormData] = useState({
    comments: "",
    grade: "",
    decision: "",
  })
  const [evaluationErrors, setEvaluationErrors] = useState({})
  const [isEvaluating, setIsEvaluating] = useState(false)

  useEffect(() => {
    const user = getCurrentLoggedInUser()
    if (!user) {
      navigate("/login") // Redirigir si no hay usuario logueado
    } else {
      setCurrentUser(user)
      // NO precargar studentName y cedula aquí para permitir edición manual
      // Solo asegurar que el studentUsername esté disponible para la propuesta
      setProposalFormData((prev) => ({
        ...prev,
        // studentName y cedula se dejarán vacíos o se llenarán manualmente por el usuario
        // Si necesitas el username del estudiante para el guardado, asegúrate de que esté en currentUser
      }))
      loadProposals()
    }
  }, [navigate])

  // Este useEffect se encarga de aplicar los filtros cada vez que cambian las propuestas,
  // los términos de búsqueda o los filtros de carrera/estado.
  useEffect(() => {
    console.log("Aplicando filtros. Propuestas totales:", proposals.length)
    applyFilters()
  }, [proposals, searchTerm, filterCareer, filterStatus, currentUser]) // Dependencias actualizadas

  const loadProposals = () => {
    const allProposals = getAllProposals()
    console.log("Propuestas cargadas desde localStorage:", allProposals)
    setProposals(allProposals)
  }

  const applyFilters = () => {
    let currentProposals = proposals

    // Si es estudiante, solo mostrar sus propias propuestas
    if (currentUser && currentUser.role === "student") {
      currentProposals = getProposalsByStudentUsername(currentUser.username)
      console.log("Filtrando por estudiante. Propuestas del estudiante:", currentProposals)
    }

    const tempFiltered = currentProposals.filter((proposal) => {
      const matchesSearch =
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.studentName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCareer = filterCareer === "" || proposal.career === filterCareer

      const proposalCurrentStatus = getProposalStatus(proposal)
      const matchesStatus = filterStatus === "" || proposalCurrentStatus === filterStatus

      return matchesSearch && matchesCareer && matchesStatus
    })
    console.log("Propuestas filtradas para mostrar:", tempFiltered)
    setFilteredProposals(tempFiltered)
  }

  const handleProposalInputChange = (e) => {
    const { name, value } = e.target
    setProposalFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar errores al escribir
    if (proposalErrors[name]) {
      setProposalErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleProposalSubmit = (e) => {
    e.preventDefault()
    setIsSubmittingProposal(true)
    setProposalErrors({})

    const validationResult = validateProposalForm(proposalFormData)
    if (validationResult.hasError) {
      setProposalErrors(validationResult.errors)
      setIsSubmittingProposal(false)
      console.error("Errores de validación:", validationResult.errors)
      return
    }

    // Añadir el username del estudiante a la propuesta
    // Es crucial que el studentUsername se obtenga del currentUser para vincular la propuesta
    const proposalDataWithUser = {
      ...proposalFormData,
      studentUsername: currentUser.username, // Asegúrate de que esto siempre venga del usuario logueado
    }

    console.log("Datos de la propuesta a enviar:", proposalDataWithUser)

    const result = submitNewProposal(proposalDataWithUser)
    if (result.success) {
      alert(result.message)
      // Resetear el formulario, pero no precargar studentName y cedula
      setProposalFormData({
        studentName: "",
        cedula: "",
        career: "",
        semester: "",
        title: "",
        area: "",
        modalidad: "",
        resumen: "",
        justificacion: "",
      })
      loadProposals() // Recargar la lista de propuestas para que se muestre la nueva
    } else {
      alert(`Error: ${result.message}`)
    }
    setIsSubmittingProposal(false)
  }

  const handleLogout = (e) => {
    e.preventDefault()
    logoutUser()
    navigate("/login")
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    navigate("/interfazprincipal")
  }

  const handleViewProposalForEvaluation = (proposalId) => {
    const proposal = proposals.find((p) => p.id === proposalId)
    setSelectedProposalForEvaluation(proposal)
    setEvaluationFormData({
      comments: proposal.comments || "",
      grade: proposal.grade || "",
      decision: getProposalStatus(proposal), // Pre-seleccionar la decisión actual si existe
    })
    setEvaluationErrors({})
  }

  const handleEvaluationInputChange = (e) => {
    const { name, value } = e.target
    setEvaluationFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (evaluationErrors[name]) {
      setEvaluationErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleEvaluationSubmit = (e) => {
    e.preventDefault()
    setIsEvaluating(true)
    setEvaluationErrors({})

    const { comments, grade, decision } = evaluationFormData
    let hasEvalError = false
    const newEvalErrors = {}

    if (!comments || comments.trim() === "") {
      newEvalErrors.comments = "Los comentarios de evaluación son requeridos."
      hasEvalError = true
    }
    // La calificación es opcional si la decisión es "En Revisión"
    if (
      decision !== "En Revisión" &&
      (!grade || isNaN(grade) || Number.parseFloat(grade) < 0 || Number.parseFloat(grade) > 10)
    ) {
      newEvalErrors.grade = "La calificación debe ser un número entre 0 y 10 si no es 'En Revisión'."
      hasEvalError = true
    }
    if (!decision || decision.trim() === "") {
      newEvalErrors.decision = "Debe seleccionar una decisión."
      hasEvalError = true
    }

    if (hasEvalError) {
      setEvaluationErrors(newEvalErrors)
      setIsEvaluating(false)
      return
    }

    // Determinar el estado final basado en la decisión seleccionada
    let finalStatus = decision
    let finalGrade = grade ? Number.parseFloat(grade) : null

    // Si la decisión es "Aprobado" o "Rechazar", la calificación es obligatoria y determina el estado
    if (decision === "Aprobado") {
      finalStatus = "Aprobado"
    } else if (decision === "Rechazar") {
      finalStatus = "Rechazado"
    } else if (decision === "En Revisión") {
      finalStatus = "En Revisión"
      finalGrade = null // Si está en revisión, la calificación no es final
    }

    const result = evaluateProposal(
      selectedProposalForEvaluation.id,
      finalGrade,
      comments,
      currentUser.fullName || currentUser.username, // Nombre del tutor/admin
      finalStatus, // Pasar el estado final determinado por la decisión
    )

    if (result.success) {
      alert(result.message)
      setSelectedProposalForEvaluation(null) // Cerrar formulario de evaluación
      loadProposals() // Recargar la lista de propuestas
    } else {
      alert(`Error: ${result.message}`)
    }
    setIsEvaluating(false)
  }

  const handleCancelEvaluation = () => {
    setSelectedProposalForEvaluation(null)
    setEvaluationFormData({ comments: "", grade: "", decision: "" })
    setEvaluationErrors({})
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Aprobado":
        return styles.approved
      case "Rechazado":
        return styles.rejected
      case "En Revisión":
        return styles.reviewing
      case "Pendiente":
      default:
        return styles.pending
    }
  }

  const isTeacherOrAdmin = currentUser && (currentUser.role === "teacher" || currentUser.role === "admin")

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

      {/* Contenido principal */}
      <main>
        <div className={styles.container}>
          {/* Encabezado de página */}
          <div className={styles.pageHeader}>
            <h1>Selección de Tema de Tesis</h1>
            <p>Registra tu propuesta de trabajo de titulación para revisión y aprobación</p>
          </div>

          {/* Información importante */}
          <div className={styles.infoBanner}>
            <h3>Asignación Automática de Tutor</h3>
            <p>
              Una vez que tu propuesta sea aprobada, se te asignará automáticamente un tutor especializado en tu área de
              investigación.
            </p>
          </div>

          {/* Formulario de propuesta (solo para estudiantes) */}
          {currentUser?.role === "student" && (
            <section className={styles.card}>
              <h2>Nueva Propuesta de Tema</h2>
              <form onSubmit={handleProposalSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="studentName">Nombre del Estudiante</label>
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      placeholder="Ingresa tu nombre completo"
                      value={proposalFormData.studentName}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal} // Habilitado para edición manual
                    />
                    <span className={styles.errorMessage}>{proposalErrors.studentName}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cedula">Cédula de Identidad</label>
                    <input
                      type="text"
                      id="cedula"
                      name="cedula"
                      placeholder="1234567890"
                      value={proposalFormData.cedula}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal} // Habilitado para edición manual
                    />
                    <span className={styles.errorMessage}>{proposalErrors.cedula}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="career">Carrera</label>
                    <select
                      id="career"
                      name="career"
                      value={proposalFormData.career}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    >
                      <option value="">Selecciona tu carrera</option>
                      <option value="Ing. Sistemas">Ing. Sistemas</option>
                      <option value="Ing. TI">Ing. TI</option>
                      <option value="Ing. Software">Ing. Software</option>
                      <option value="Ing. Redes">Ing. Redes</option>
                      <option value="Ing. Ciberseguridad">Ing. Ciberseguridad</option>
                    </select>
                    <span className={styles.errorMessage}>{proposalErrors.career}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="semester">Semestre Actual</label>
                    <select
                      id="semester"
                      name="semester"
                      value={proposalFormData.semester}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    >
                      <option value="">Selecciona semestre</option>
                      <option value="Octavo Semestre">Octavo Semestre</option>
                      <option value="Noveno Semestre">Noveno Semestre</option>
                      <option value="Décimo Semestre">Décimo Semestre</option>
                    </select>
                    <span className={styles.errorMessage}>{proposalErrors.semester}</span>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="title">Título Propuesto del Trabajo</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Escribe el título de tu propuesta de tesis"
                      value={proposalFormData.title}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    />
                    <span className={styles.errorMessage}>{proposalErrors.title}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="area">Área de Especialización</label>
                    <select
                      id="area"
                      name="area"
                      value={proposalFormData.area}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    >
                      <option value="">Selecciona el área</option>
                      <option value="Desarrollo Web">Desarrollo Web</option>
                      <option value="Desarrollo Móvil">Desarrollo Móvil</option>
                      <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                      <option value="Ciberseguridad">Ciberseguridad</option>
                      <option value="Redes y Comunicaciones">Redes y Comunicaciones</option>
                      <option value="Bases de Datos">Bases de Datos</option>
                    </select>
                    <span className={styles.errorMessage}>{proposalErrors.area}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="modalidad">Modalidad de Titulación</label>
                    <select
                      id="modalidad"
                      name="modalidad"
                      value={proposalFormData.modalidad}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    >
                      <option value="">Selecciona modalidad</option>
                      <option value="Tesis de Investigación">Tesis de Investigación</option>
                      <option value="Proyecto de Desarrollo">Proyecto de Desarrollo</option>
                      <option value="Sistematización de Experiencias">Sistematización de Experiencias</option>
                      <option value="Propuesta de Solución">Propuesta de Solución</option>
                    </select>
                    <span className={styles.errorMessage}>{proposalErrors.modalidad}</span>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="resumen">Resumen de la Propuesta</label>
                    <textarea
                      id="resumen"
                      name="resumen"
                      placeholder="Describe brevemente tu propuesta de investigación..."
                      value={proposalFormData.resumen}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    ></textarea>
                    <span className={styles.errorMessage}>{proposalErrors.resumen}</span>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="justificacion">Justificación Tecnológica</label>
                    <textarea
                      id="justificacion"
                      name="justificacion"
                      placeholder="Explica la importancia tecnológica de tu propuesta..."
                      value={proposalFormData.justificacion}
                      onChange={handleProposalInputChange}
                      disabled={isSubmittingProposal}
                    ></textarea>
                    <span className={styles.errorMessage}>{proposalErrors.justificacion}</span>
                  </div>
                </div>

                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={isSubmittingProposal}>
                  {isSubmittingProposal ? "Enviando..." : "Enviar Propuesta"}
                </button>
              </form>
            </section>
          )}

          {/* Tabla de propuestas con filtros (visible para todos) */}
          <section className={styles.card}>
            <h2>Estado de Propuestas Registradas</h2>

            {/* Filtros de búsqueda */}
            <div className={styles.filtersContainer}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Buscar por título o estudiante..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className={styles.searchBtn}>
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <div className={styles.filterOptions}>
                <select
                  className={styles.filterSelect}
                  value={filterCareer}
                  onChange={(e) => setFilterCareer(e.target.value)}
                >
                  <option value="">Todas las carreras</option>
                  <option value="Ing. Sistemas">Ing. Sistemas</option>
                  <option value="Ing. TI">Ing. TI</option>
                  <option value="Ing. Software">Ing. Software</option>
                  <option value="Ing. Redes">Ing. Redes</option>
                  <option value="Ing. Ciberseguridad">Ing. Ciberseguridad</option>
                </select>
                <select
                  className={styles.filterSelect}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Estudiante</th>
                    <th>Título</th>
                    <th>Carrera</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Tutor</th>
                    {isTeacherOrAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredProposals.length === 0 ? (
                    <tr>
                      <td colSpan={isTeacherOrAdmin ? 8 : 7} className="text-center py-4">
                        No hay propuestas para mostrar.
                      </td>
                    </tr>
                  ) : (
                    filteredProposals.map((proposal) => (
                      <tr key={proposal.id}>
                        <td>{proposal.id}</td>
                        <td>{proposal.studentName}</td>
                        <td>{proposal.title}</td>
                        <td>{proposal.career}</td>
                        <td>{new Date(proposal.dateSubmitted).toLocaleDateString()}</td>
                        <td>
                          <span className={`${styles.status} ${getStatusClass(getProposalStatus(proposal))}`}>
                            {getProposalStatus(proposal)}
                          </span>
                        </td>
                        <td>{proposal.tutor || "Pendiente"}</td>
                        {isTeacherOrAdmin && (
                          <td>
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleViewProposalForEvaluation(proposal.id)}
                            >
                              <Edit className="h-4 w-4" /> Ver/Evaluar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sección para profesores/administradores */}
          {isTeacherOrAdmin && (
            <section className={styles.card}>
              <h2>Panel del Profesor/Administrador</h2>
              <div className={styles.infoBanner}>
                <h3>Bienvenido, {currentUser?.fullName || currentUser?.username}</h3>
                <p>Aquí puede revisar y evaluar las propuestas de temas.</p>
              </div>

              {/* Formulario de evaluación */}
              {selectedProposalForEvaluation && (
                <div className={styles.evaluationForm}>
                  <h3>Evaluación de Propuesta</h3>
                  <div className={styles.selectedProposal}>
                    <p>
                      <strong>ID:</strong> {selectedProposalForEvaluation.id}
                    </p>
                    <p>
                      <strong>Título:</strong> {selectedProposalForEvaluation.title}
                    </p>
                    <p>
                      <strong>Estudiante:</strong> {selectedProposalForEvaluation.studentName}
                    </p>
                  </div>

                  <form onSubmit={handleEvaluationSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="comments">Comentarios de Evaluación</label>
                      <textarea
                        id="comments"
                        name="comments"
                        placeholder="Ingrese sus comentarios..."
                        value={evaluationFormData.comments}
                        onChange={handleEvaluationInputChange}
                        disabled={isEvaluating}
                      ></textarea>
                      <span className={styles.errorMessage}>{evaluationErrors.comments}</span>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="grade">Calificación (0-10)</label>
                        <input
                          type="number"
                          id="grade"
                          name="grade"
                          min="0"
                          max="10"
                          step="0.1"
                          placeholder="0.0 - 10.0"
                          value={evaluationFormData.grade}
                          onChange={handleEvaluationInputChange}
                          disabled={isEvaluating}
                        />
                        <span className={styles.errorMessage}>{evaluationErrors.grade}</span>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="decision">Decisión</label>
                        <select
                          id="decision"
                          name="decision"
                          value={evaluationFormData.decision}
                          onChange={handleEvaluationInputChange}
                          disabled={isEvaluating}
                        >
                          <option value="">Seleccione una opción</option>
                          <option value="Aprobado">Aprobar Propuesta</option>
                          <option value="Rechazar">Rechazar Propuesta</option>
                          <option value="En Revisión">Solicitar Revisión</option>
                        </select>
                        <span className={styles.errorMessage}>{evaluationErrors.decision}</span>
                      </div>
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.secondary}`}
                        onClick={handleCancelEvaluation}
                        disabled={isEvaluating}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={isEvaluating}>
                        {isEvaluating ? "Enviando..." : "Enviar Evaluación"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}
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

export default OpcionTema
