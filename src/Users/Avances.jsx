"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import styles from "../assets/css/Avances.module.css"
import logoUleam from "../assets/img/Logouleam.png"
import { Search, Download, MessageSquare } from "lucide-react"
import { getCurrentLoggedInUser, logoutUser } from "../Services/LoginServicios"
import { getAllProposals, getProposalStatus } from "../Services/TrabajoTitulacionServicios"
import {
  getAllDocuments,
  getDocumentsByStudentUsername,
  getDocumentStatus,
} from "../Services/RegistrarTrabajoServicios"

function Avances() {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentUser, setCurrentUser] = useState(null)
  const [allProposals, setAllProposals] = useState([])
  const [allDocuments, setAllDocuments] = useState([])
  const [filteredItems, setFilteredItems] = useState([]) // Combined and filtered items for the table
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Define las 7 etapas del proyecto, vinculadas a los 'documentType' de RegistrarTrabajo
  const projectStages = [
    { id: "propuesta", name: "Propuesta Inicial", date: "15 Mayo 2025" },
    { id: "marco-teorico", name: "Marco Teórico", date: "28 Mayo 2025" }, // Puede ser v1 o v2
    { id: "metodologia", name: "Metodología y Diseño", date: "15 Junio 2025" },
    { id: "desarrollo", name: "Desarrollo e Implementación", date: "15 Julio 2025" },
    { id: "resultados", name: "Resultados y Análisis", date: "15 Agosto 2025" },
    { id: "conclusiones", name: "Conclusiones", date: "15 Septiembre 2025" },
    { id: "documento-final", name: "Documento Final", date: "15 Octubre 2025" },
  ]

  useEffect(() => {
    const user = getCurrentLoggedInUser()
    if (!user) {
      navigate("/login")
    } else {
      setCurrentUser(user)
      loadData(user)
    }
  }, [navigate])

  useEffect(() => {
    combineAndFilterItems()
  }, [allProposals, allDocuments, searchTerm, filterType, filterStatus, currentUser])

  const loadData = (user) => {
    setAllProposals(getAllProposals())
    setAllDocuments(getAllDocuments())
  }

  const combineAndFilterItems = () => {
    let combined = []

    if (currentUser?.role === "student") {
      // Para estudiantes, solo mostrar sus documentos
      combined = getDocumentsByStudentUsername(currentUser.username).map((doc) => ({
        ...doc,
        itemType: "document", // Añadir un identificador de tipo
        displayTitle: doc.fileName,
        displayStatus: getDocumentStatus(doc),
        displayGrade: doc.grade !== null ? doc.grade : "-",
        displayEvaluator: doc.evaluator || "Pendiente",
      }))
    } else {
      // Para profesores/administradores, combinar todas las propuestas y todos los documentos
      const proposalsMapped = allProposals.map((prop) => ({
        ...prop,
        itemType: "proposal",
        displayTitle: prop.title,
        displayStatus: getProposalStatus(prop),
        displayGrade: prop.grade !== null ? prop.grade : "-",
        displayEvaluator: prop.tutor || "Pendiente",
        documentType: "propuesta", // Asignar un tipo de documento para el filtro
      }))

      const documentsMapped = allDocuments.map((doc) => ({
        ...doc,
        itemType: "document",
        displayTitle: doc.fileName,
        displayStatus: getDocumentStatus(doc),
        displayGrade: doc.grade !== null ? doc.grade : "-",
        displayEvaluator: doc.evaluator || "Pendiente",
      }))

      combined = [...proposalsMapped, ...documentsMapped]
    }

    // Aplicar filtros
    const tempFiltered = combined.filter((item) => {
      const matchesSearch =
        item.displayTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.evaluator?.toLowerCase().includes(searchTerm.toLowerCase())

      // El filtro por tipo ahora considera 'itemType' (proposal/document) y 'documentType' (propuesta, marco-teorico, etc.)
      const matchesType =
        filterType === "all" ||
        (filterType === "proposal" && item.itemType === "proposal") ||
        (filterType === "document" && item.itemType === "document") ||
        item.documentType === filterType

      const matchesStatus = filterStatus === "all" || item.displayStatus === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })

    setFilteredItems(tempFiltered)
  }

  const handleLogout = (e) => {
    e.preventDefault()
    logoutUser()
    navigate("/login")
  }

  const handleDownload = (item) => {
    if (item.itemType === "document" && item.fileContentBase64) {
      const link = document.createElement("a")
      link.href = `data:${item.fileType};base64,${item.fileContentBase64}`
      link.download = item.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert(`No se puede descargar el elemento "${item.displayTitle}".`)
    }
  }

  const handleViewFeedback = (item) => {
    let feedbackMessage = `Comentarios para "${item.displayTitle}" (${item.itemType === "proposal" ? "Propuesta de Tema" : "Documentos de Avance"}):\n\n`
    if (item.comments) {
      feedbackMessage += `Comentarios: ${item.comments}\n`
    }
    if (item.recommendations) {
      feedbackMessage += `Recomendaciones: ${item.recommendations}\n`
    }
    if (!item.comments && !item.recommendations) {
      feedbackMessage += "No hay comentarios ni recomendaciones disponibles."
    }
    alert(feedbackMessage)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Aprobado":
        return styles.approved
      case "Rechazado":
        return styles.rejected
      case "En Revisión":
        return styles.reviewing
      case "Aprobado con Observaciones":
        return styles.approvedWithObservations
      case "Requiere Corrección":
        return styles.requiresCorrection
      case "Pendiente":
      default:
        return styles.pending
    }
  }

  const getTimelineStatus = (stageId) => {
    if (!currentUser || currentUser.role !== "student") {
      return { status: "upcoming", grade: null } // Solo para estudiantes
    }

    // Buscar la última propuesta o documento del estudiante para esta etapa
    const relevantItems = [
      ...allProposals.filter((prop) => prop.studentUsername === currentUser.username && prop.modalidad === stageId),
      ...allDocuments.filter((doc) => doc.studentUsername === currentUser.username && doc.documentType === stageId),
    ].sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()) // Ordenar por fecha descendente

    const latestItem = relevantItems.length > 0 ? relevantItems[0] : null

    if (latestItem) {
      const itemStatus =
        latestItem.itemType === "proposal" ? getProposalStatus(latestItem) : getDocumentStatus(latestItem)
      const itemGrade = latestItem.grade !== null ? `${latestItem.grade}/10` : null

      switch (itemStatus) {
        case "Aprobado":
        case "Aprobado con Observaciones":
          return { status: "completed", grade: itemGrade }
        case "Rechazado":
        case "Requiere Corrección":
          return { status: "revision", grade: itemGrade }
        case "En Revisión":
        case "Pendiente":
          return { status: "pending", grade: null }
        default:
          return { status: "upcoming", grade: null }
      }
    }

    return { status: "upcoming", grade: null } // Si no hay entregas para esta etapa
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
            <Link to="/interfazprincipal" className={styles.navLink}>
              Inicio
            </Link>
            <Link to="/opciontema" className={styles.navLink}>
              Selección de Tema
            </Link>
            <Link to="/registrartrabajo" className={styles.navLink}>
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
          {/* Cronograma de entregas (Solo para estudiantes) */}
          {currentUser?.role === "student" && (
            <div className={styles.card}>
              <h2>Cronograma de Entregas</h2>
              <div className={styles.timeline}>
                {projectStages.map((stage) => {
                  const statusInfo = getTimelineStatus(stage.id)
                  return (
                    <div key={stage.id} className={`${styles.timelineItem} ${styles[statusInfo.status]}`}>
                      <div className={styles.timelineContent}>
                        <h3>{stage.name}</h3>
                        <p>{stage.date}</p>
                        <span className={`${styles.statusPill} ${styles[statusInfo.status]}`}>
                          {statusInfo.status === "completed" && statusInfo.grade
                            ? `Completado - ${statusInfo.grade}`
                            : statusInfo.status === "revision" && statusInfo.grade
                              ? `Requiere Corrección - ${statusInfo.grade}`
                              : statusInfo.status === "pending"
                                ? "En Progreso"
                                : "Próximamente"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Historial de documentos (Para todos, pero contenido filtrado por rol) */}
          <div className={styles.card}>
            <h2>Historial de Documentos</h2>

            {/* Filtros de documentos */}
            <div className={styles.documentsFilter}>
              <div className={styles.filterGroup}>
                <label htmlFor="filter-type">Filtrar por tipo:</label>
                <select id="filter-type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">Todos los documentos</option>
                  {isTeacherOrAdmin && <option value="proposal">Propuesta de Tema</option>}
                  <option value="document">Documentos de Avance</option>
                  <option value="propuesta">Propuesta Inicial</option>
                  <option value="marco-teorico">Marco Teórico</option>
                  <option value="metodologia">Metodología</option>
                  <option value="desarrollo">Desarrollo/Implementación</option>
                  <option value="resultados">Resultados y Análisis</option>
                  <option value="conclusiones">Conclusiones</option>
                  <option value="documento-final">Documento Final</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="filter-status">Filtrar por estado:</label>
                <select id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Todos los estados</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Aprobado con Observaciones">Aprobado con Observaciones</option>
                  <option value="Requiere Corrección">Requiere Corrección</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Pendiente">Pendiente de Revisión</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>

              <div className={`${styles.filterGroup} ${styles.searchGroup}`}>
                <input
                  type="text"
                  id="search-docs"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className={styles.searchBtn}>
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.documentsTable}>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Tipo</th>
                    <th>Versión</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Calificación</th>
                    <th>Estudiante</th>
                    <th>Profesor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4">
                        No hay elementos para mostrar.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td className={styles.docName}>{item.displayTitle}</td>
                        <td>{item.itemType === "proposal" ? "Propuesta de Tema" : item.documentType}</td>
                        <td>{item.version || "v1.0"}</td>
                        <td>{new Date(item.dateSubmitted).toLocaleDateString()}</td>
                        <td>
                          <span className={`${styles.status} ${getStatusClass(item.displayStatus)}`}>
                            {item.displayStatus}
                          </span>
                        </td>
                        <td>{item.displayGrade}</td>
                        <td>{item.studentUsername}</td>
                        <td>{item.displayEvaluator}</td>
                        <td className={styles.actionsCell}>
                          {item.itemType === "document" && (
                            <button
                              className={styles.tableAction}
                              onClick={() => handleDownload(item)}
                              title="Descargar"
                              disabled={!item.fileContentBase64}
                            >
                              <Download size={16} />
                            </button>
                          )}
                          <button
                            className={styles.tableAction}
                            onClick={() => handleViewFeedback(item)}
                            title="Ver comentarios"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

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

export default Avances
