"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import styles from "../assets/css/RegistrarTrabajo.module.css"
import logoUleam from "../assets/img/Logouleam.png"
import { Upload, FileText, XCircle, Download, BookText } from "lucide-react" // Importar iconos de Lucide React
import { getCurrentLoggedInUser, logoutUser } from "../Services/LoginServicios"
import {
  submitNewDocument,
  getAllDocuments,
  getDocumentsByStudentUsername,
  evaluateDocument,
  getDocumentStatus,
} from "../Services/RegistrarTrabajoServicios"
import { validateUploadForm, validateEvaluationForm } from "../Validators/RegistrarTrabajoValidacion"

function RegistrarTrabajo() {
  const navigate = useNavigate()
  const location = useLocation() // Hook para obtener la ruta actual
  const fileInputRef = useRef(null)

  const [currentUser, setCurrentUser] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    documentType: "",
    version: "",
    description: "",
  })
  const [uploadErrors, setUploadErrors] = useState({})
  const [selectedFile, setSelectedFile] = useState(null) // Stores the actual File object
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [filePreviewVisible, setFilePreviewVisible] = useState(false)

  const [documents, setDocuments] = useState([]) // All documents
  const [filteredDocuments, setFilteredDocuments] = useState([]) // Filtered for display

  // State for general messages (replacing alert)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null) // 'success' or 'error'

  // State for professor/admin evaluation
  const [selectedDocumentForEvaluation, setSelectedDocumentForEvaluation] = useState(null)
  const [evaluationFormData, setEvaluationFormData] = useState({
    comments: "",
    grade: "",
    decision: "",
    recommendations: "",
  })
  const [evaluationErrors, setEvaluationErrors] = useState({})
  const [isEvaluating, setIsEvaluating] = useState(false)

  const applyFilters = () => {
    // Implement filter logic here
    setFilteredDocuments(documents)
  }

  useEffect(() => {
    const user = getCurrentLoggedInUser()
    if (!user) {
      navigate("/login")
    } else {
      setCurrentUser(user)
      loadDocuments(user)
    }
  }, [navigate])

  useEffect(() => {
    applyFilters()
  }, [documents, currentUser]) // Re-apply filters when documents or user changes

  const loadDocuments = (user) => {
    let loadedDocs
    if (user && (user.role === "teacher" || user.role === "admin")) {
      loadedDocs = getAllDocuments()
      console.log("Documentos cargados (Profesor/Admin):", loadedDocs)
    } else if (user && user.role === "student") {
      loadedDocs = getDocumentsByStudentUsername(user.username)
      console.log("Documentos cargados (Estudiante):", loadedDocs)
    } else {
      loadedDocs = []
    }
    setDocuments(loadedDocs)
  }

  const handleUploadInputChange = (e) => {
    const { name, value } = e.target
    setUploadFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (uploadErrors[name]) {
      setUploadErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)
      setFileSize((file.size / 1024 / 1024).toFixed(2) + " MB")
      setFilePreviewVisible(true)
      setUploadErrors((prev) => ({ ...prev, file: "" })) // Clear file error
    } else {
      removeFile()
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileName("")
    setFileSize("")
    setFilePreviewVisible(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear the input value
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadErrors({})
    setMessage(null) // Clear previous messages

    const validationResult = validateUploadForm(uploadFormData, selectedFile)
    if (validationResult.hasError) {
      setUploadErrors(validationResult.errors)
      setIsUploading(false)
      setMessage("Por favor, corrige los errores en el formulario de subida.")
      setMessageType("error")
      console.error("Errores de validación de subida:", validationResult.errors)
      return
    }

    // Read file as Base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const fileContentBase64 = event.target.result.split(",")[1] // Get base64 content
      const dataToSubmit = {
        ...uploadFormData,
        studentUsername: currentUser.username, // Link to the current student
        title: "Trabajo sin propuesta", // Placeholder, ideally link to a proposal title
        fileName: fileName,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileContentBase64: fileContentBase64,
      }

      const result = submitNewDocument(dataToSubmit)
      if (result.success) {
        setMessage(result.message)
        setMessageType("success")
        setUploadFormData({
          documentType: "",
          version: "",
          description: "",
        })
        removeFile() // Clear selected file
        loadDocuments(currentUser) // Reload documents
      } else {
        setMessage(`Error: ${result.message}`)
        setMessageType("error")
      }
      setIsUploading(false)
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000) // Clear message after 5 seconds
    }
    reader.onerror = (error) => {
      console.error("Error reading file:", error)
      setUploadErrors((prev) => ({ ...prev, file: "Error al leer el archivo." }))
      setMessage("Error al leer el archivo para subir.")
      setMessageType("error")
      setIsUploading(false)
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
    reader.readAsDataURL(selectedFile) // Read file as Data URL (Base64)
  }

  const handleLogout = (e) => {
    e.preventDefault()
    logoutUser()
    navigate("/login")
  }

  const handleViewDocumentForEvaluation = (docId) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      setSelectedDocumentForEvaluation(doc)
      setEvaluationFormData({
        comments: doc.comments || "",
        grade: doc.grade || "",
        decision: getDocumentStatus(doc), // Pre-select current status
        recommendations: doc.recommendations || "",
      })
      setEvaluationErrors({})
      setMessage(null) // Clear any general messages when opening evaluation form
      setMessageType(null)
    }
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
    setMessage(null) // Clear previous messages

    const validationResult = validateEvaluationForm(evaluationFormData)
    if (validationResult.hasError) {
      setEvaluationErrors(validationResult.errors)
      setIsEvaluating(false)
      setMessage("Por favor, corrige los errores en el formulario de evaluación.")
      setMessageType("error")
      console.error("Errores de validación de evaluación:", validationResult.errors)
      return
    }

    const { comments, grade, decision, recommendations } = evaluationFormData
    const result = evaluateDocument(
      selectedDocumentForEvaluation.id,
      grade ? Number.parseFloat(grade) : null,
      comments,
      recommendations,
      currentUser.fullName || currentUser.username,
      decision,
    )

    if (result.success) {
      // Clear selected document and reload documents first, then show message
      setSelectedDocumentForEvaluation(null)
      loadDocuments(currentUser)
      setMessage(result.message)
      setMessageType("success")
    } else {
      setMessage(`Error: ${result.message}`)
      setMessageType("error")
    }
    setIsEvaluating(false)
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000) // Clear message after 5 seconds
  }

  const handleCancelEvaluation = () => {
    setSelectedDocumentForEvaluation(null)
    setEvaluationFormData({ comments: "", grade: "", decision: "", recommendations: "" })
    setEvaluationErrors({})
    setMessage(null) // Clear messages on cancel
    setMessageType(null)
  }

  const handleDownloadDocument = (fileContentBase64, fileName, fileType) => {
    if (!fileContentBase64) {
      setMessage("No hay contenido de archivo para descargar.")
      setMessageType("error")
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
      return
    }
    const link = document.createElement("a")
    link.href = `data:${fileType};base64,${fileContentBase64}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Aprobado":
        return styles.approved
      case "Aprobado con Observaciones":
        return styles.approvedWithObservations
      case "Requiere Corrección":
        return styles.requiresCorrection
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
            <Link to="/interfazprincipal" className={styles.navLink}>
              Inicio
            </Link>
            <Link to="/opciontema" className={styles.navLink}>
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
          {/* General Message Display */}
          {message && (
            <div
              className={`${styles.infoBanner} ${messageType === "error" ? styles.errorBanner : styles.successBanner}`}
            >
              <p>{message}</p>
            </div>
          )}

          {/* Sección de Subida de Avance (Solo para estudiantes) */}
          {currentUser?.role === "student" && (
            <section className={styles.card}>
              <h2>Subir Nuevo Avance</h2>
              <form className={styles.uploadForm} onSubmit={handleUploadSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="document-type">Tipo de Entrega</label>
                    <select
                      id="document-type"
                      name="documentType"
                      value={uploadFormData.documentType}
                      onChange={handleUploadInputChange}
                      className={uploadErrors.documentType ? styles.error : ""}
                      disabled={isUploading}
                    >
                      <option value="">Selecciona el tipo</option>
                      <option value="propuesta">Propuesta Inicial</option>
                      <option value="marco-teorico">Marco Teórico</option>
                      <option value="metodologia">Metodología</option>
                      <option value="desarrollo">Desarrollo/Implementación</option>
                      <option value="resultados">Resultados y Análisis</option>
                      <option value="conclusiones">Conclusiones</option>
                      <option value="documento-final">Documento Final</option>
                    </select>
                    <span className={styles.errorMessage}>{uploadErrors.documentType}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="version">Versión del Documento</label>
                    <input
                      type="text"
                      id="version"
                      name="version"
                      placeholder="ej: v1.0, v2.1"
                      value={uploadFormData.version}
                      onChange={handleUploadInputChange}
                      className={uploadErrors.version ? styles.error : ""}
                      disabled={isUploading}
                    />
                    <span className={styles.errorMessage}>{uploadErrors.version}</span>
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="description">Descripción del Avance</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Describe los cambios, mejoras o nuevo contenido incluido en esta entrega..."
                    value={uploadFormData.description}
                    onChange={handleUploadInputChange}
                    className={uploadErrors.description ? styles.error : ""}
                    disabled={isUploading}
                  ></textarea>
                  <span className={styles.errorMessage}>{uploadErrors.description}</span>
                </div>

                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    id="document-file"
                    name="document-file"
                    accept=".pdf,.doc,.docx"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <span className={styles.errorMessage}>{uploadErrors.file}</span>

                  <div className={styles.uploadArea} onClick={() => !isUploading && fileInputRef.current?.click()}>
                    <div className={styles.uploadContent}>
                      <Upload className={styles.uploadIcon} size={32} />
                      <p className={styles.uploadText}>Arrastra tu archivo aquí o haz clic para seleccionar</p>
                      <p className={styles.uploadSubtext}>Formatos permitidos: PDF, DOC, DOCX (máx. 15MB)</p>
                    </div>
                  </div>

                  {filePreviewVisible && (
                    <div className={styles.filePreview}>
                      <div className={styles.fileInfo}>
                        <FileText className={styles.fileIcon} size={20} />
                        <div className={styles.fileDetails}>
                          <span className={styles.fileName}>{fileName}</span>
                          <span className={styles.fileSize}>{fileSize}</span>
                        </div>
                        <button type="button" className={styles.removeFile} onClick={removeFile} disabled={isUploading}>
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={isUploading}>
                  {isUploading ? "Enviando..." : "Enviar Documento para Revisión"}
                </button>
              </form>
            </section>
          )}

          {/* Tabla de Documentos Subidos (Visible para todos) */}
          <section className={styles.card}>
            <h2>{currentUser?.role === "student" ? "Mis Documentos Subidos" : "Documentos Recibidos"}</h2>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Versión</th>
                    <th>Estudiante</th>
                    <th>Fecha Envío</th>
                    <th>Estado</th>
                    <th>Calificación</th>
                    <th>Evaluador</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4">
                        No hay documentos para mostrar.
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.id}</td>
                        <td>{doc.documentType}</td>
                        <td>{doc.version}</td>
                        <td>{doc.studentUsername}</td>
                        <td>{new Date(doc.dateSubmitted).toLocaleDateString()}</td>
                        <td>
                          <span className={`${styles.status} ${getStatusClass(getDocumentStatus(doc))}`}>
                            {getDocumentStatus(doc)}
                          </span>
                        </td>
                        <td>{doc.grade !== null ? doc.grade : "N/A"}</td>
                        <td>{doc.evaluator || "Pendiente"}</td>
                        <td>
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleDownloadDocument(doc.fileContentBase64, doc.fileName, doc.fileType)}
                            disabled={!doc.fileContentBase64}
                            title="Descargar Documento"
                          >
                            <Download size={16} />
                          </button>
                          {isTeacherOrAdmin && (
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleViewDocumentForEvaluation(doc.id)}
                              title="Evaluar Documento"
                            >
                              <BookText size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sección de Panel de Evaluación (Solo para profesores/administradores) */}
          {isTeacherOrAdmin && (
            <section className={`${styles.card} ${styles.professorSection}`}>
              <h2>Panel de Evaluación - Profesor</h2>

              {selectedDocumentForEvaluation ? (
                <div className={styles.evaluationForm} key={selectedDocumentForEvaluation.id}>
                  {" "}
                  {/* Added key here */}
                  <h3>Evaluar Documento: {selectedDocumentForEvaluation.fileName}</h3>
                  <div className={styles.selectedProposal}>
                    <p>
                      <strong>ID Documento:</strong> {selectedDocumentForEvaluation.id}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {selectedDocumentForEvaluation.documentType}
                    </p>
                    <p>
                      <strong>Versión:</strong> {selectedDocumentForEvaluation.version}
                    </p>
                    <p>
                      <strong>Estudiante:</strong> {selectedDocumentForEvaluation.studentUsername}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {selectedDocumentForEvaluation.description}
                    </p>
                  </div>
                  <form className={styles.gradingForm} onSubmit={handleEvaluationSubmit}>
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
                          placeholder="8.5"
                          value={evaluationFormData.grade}
                          onChange={handleEvaluationInputChange}
                          className={evaluationErrors.grade ? styles.error : ""}
                          disabled={isEvaluating}
                        />
                        <span className={styles.errorMessage}>{evaluationErrors.grade}</span>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="decision">Estado de Evaluación</label>
                        <select
                          id="decision"
                          name="decision"
                          value={evaluationFormData.decision}
                          onChange={handleEvaluationInputChange}
                          className={evaluationErrors.decision ? styles.error : ""}
                          disabled={isEvaluating}
                        >
                          <option value="">Seleccionar estado</option>
                          <option value="Aprobado">Aprobado</option>
                          <option value="Aprobado con Observaciones">Aprobado con Observaciones</option>
                          <option value="Requiere Corrección">Requiere Corrección</option>
                          <option value="Rechazado">Rechazado</option>
                        </select>
                        <span className={styles.errorMessage}>{evaluationErrors.decision}</span>
                      </div>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="comments">Comentarios y Retroalimentación</label>
                      <textarea
                        id="comments"
                        name="comments"
                        rows="6"
                        placeholder="Proporciona comentarios detallados sobre el trabajo..."
                        value={evaluationFormData.comments}
                        onChange={handleEvaluationInputChange}
                        className={evaluationErrors.comments ? styles.error : ""}
                        disabled={isEvaluating}
                      ></textarea>
                      <span className={styles.errorMessage}>{evaluationErrors.comments}</span>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="recommendations">Recomendaciones para Próxima Entrega</label>
                      <textarea
                        id="recommendations"
                        name="recommendations"
                        rows="4"
                        placeholder="Indica qué aspectos debe trabajar el estudiante..."
                        value={evaluationFormData.recommendations}
                        onChange={handleEvaluationInputChange}
                        className={evaluationErrors.recommendations ? styles.error : ""}
                        disabled={isEvaluating}
                      ></textarea>
                      <span className={styles.errorMessage}>{evaluationErrors.recommendations}</span>
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
              ) : (
                <div className={styles.infoBanner}>
                  <h3>Seleccione un documento para evaluar</h3>
                  <p>Utilice la tabla de arriba para elegir un documento y visualizar su panel de evaluación aquí.</p>
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

export default RegistrarTrabajo
