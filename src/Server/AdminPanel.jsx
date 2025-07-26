"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../assets/css/AdminPanel.module.css"
import { loginAdmin, createTeacher, getAllTeachers, getAllStudents } from "../Services/AdminServicios"

function AdminPanel() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [activeTab, setActiveTab] = useState("teachers")
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])

  // Formulario simplificado para profesor (igual que estudiante)
  const [teacherFormData, setTeacherFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [teacherErrors, setTeacherErrors] = useState({})
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // Verificar si ya hay una sesión de administrador activa
    const userSession = localStorage.getItem("userSession")
    if (userSession) {
      const session = JSON.parse(userSession)
      if (session.role === "admin") {
        setIsLoggedIn(true)
        loadData()
      }
    }
  }, [])

  const loadData = () => {
    setTeachers(getAllTeachers())
    setStudents(getAllStudents())
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    if (loginError) setLoginError("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError("")

    const result = loginAdmin(loginData.username, loginData.password)
    if (result.ok) {
      setIsLoggedIn(true)
      loadData()
    } else {
      setLoginError(result.message)
    }
    setIsLoggingIn(false)
  }

  // Modificar handleLogout para que solo cierre la sesión del admin
  const handleLogout = () => {
    // Solo limpiar la sesión de admin, no redirigir
    localStorage.removeItem("userSession")
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setLoginData({ username: "", password: "" })
    // No usar navigate, solo resetear el estado
  }

  const handleTeacherInputChange = (e) => {
    const { name, value } = e.target
    setTeacherFormData((prev) => ({ ...prev, [name]: value }))
    if (teacherErrors[name]) {
      setTeacherErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCreateTeacher = (e) => {
    e.preventDefault()
    setIsCreatingTeacher(true)
    setTeacherErrors({})
    setSuccessMessage("")

    // Validación básica (igual que el registro de estudiante)
    const errors = {}
    if (!teacherFormData.firstName.trim()) errors.firstName = "El nombre es requerido"
    if (!teacherFormData.lastName.trim()) errors.lastName = "El apellido es requerido"
    if (!teacherFormData.email.trim()) errors.email = "El email es requerido"
    if (!teacherFormData.username.trim()) errors.username = "El username es requerido"
    if (!teacherFormData.password.trim()) errors.password = "La contraseña es requerida"
    if (!teacherFormData.confirmPassword.trim()) errors.confirmPassword = "Debe confirmar la contraseña"
    if (teacherFormData.password !== teacherFormData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (Object.keys(errors).length > 0) {
      setTeacherErrors(errors)
      setIsCreatingTeacher(false)
      return
    }

    // Crear profesor con los datos básicos + cédula generada automáticamente
    const teacherDataToSubmit = {
      firstName: teacherFormData.firstName,
      lastName: teacherFormData.lastName,
      email: teacherFormData.email,
      username: teacherFormData.username,
      password: teacherFormData.password,
      cedula: `PROF${Date.now()}`, // Generar cédula automática para profesores
    }

    const result = createTeacher(teacherDataToSubmit)
    if (result.success) {
      setSuccessMessage(result.message)
      setTeacherFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      })
      loadData() // Recargar la lista de profesores
    } else {
      setTeacherErrors({ general: result.message })
    }
    setIsCreatingTeacher(false)
  }

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <div className={styles.adminContainer}>
          <div className={styles.adminContent}>
            <div className={styles.adminHeader}>
              <h1 className={styles.adminTitle}>Panel de Administrador</h1>
              <p className={styles.adminSubtitle}>Sistema de Trabajos de Titulación - ULEAM</p>
            </div>

            <div className={styles.tabContent}>
              <h2>Acceso de Administrador</h2>
              <p style={{ marginBottom: "20px", color: "var(--light-text)" }}>
                Ingrese las credenciales de administrador para acceder al panel de control.
              </p>

              <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Usuario de Administrador</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    disabled={isLoggingIn}
                    placeholder="Ingrese usuario de administrador"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    disabled={isLoggingIn}
                    placeholder="Ingrese contraseña de administrador"
                  />
                </div>

                {loginError && (
                  <div className={styles.errorMessage} style={{ marginBottom: "15px" }}>
                    {loginError}
                  </div>
                )}

                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={isLoggingIn}>
                  {isLoggingIn ? "Verificando..." : "Acceder"}
                </button>
              </form>

              {/* REMOVIDO: Las credenciales de prueba por seguridad */}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <div className={styles.adminContainer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Cerrar Sesión
        </button>

        <div className={styles.adminContent}>
          <div className={styles.adminHeader}>
            <h1 className={styles.adminTitle}>Panel de Administrador</h1>
            <p className={styles.adminSubtitle}>Gestión de Usuarios - Sistema de Trabajos de Titulación</p>
          </div>

          <div className={styles.adminTabs}>
            <button
              className={`${styles.tabButton} ${activeTab === "teachers" ? styles.active : ""}`}
              onClick={() => setActiveTab("teachers")}
            >
              Gestión de Profesores
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "students" ? styles.active : ""}`}
              onClick={() => setActiveTab("students")}
            >
              Ver Estudiantes
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "teachers" && (
              <div>
                <h2>Crear Nuevo Profesor</h2>

                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <form onSubmit={handleCreateTeacher} className={styles.createTeacherForm}>
                  {/* Formulario simplificado igual que el registro de estudiante */}
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">Nombres</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Ingresa los nombres"
                        value={teacherFormData.firstName}
                        onChange={handleTeacherInputChange}
                        disabled={isCreatingTeacher}
                      />
                      <span className={styles.errorMessage}>{teacherErrors.firstName}</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">Apellidos</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Ingresa los apellidos"
                        value={teacherFormData.lastName}
                        onChange={handleTeacherInputChange}
                        disabled={isCreatingTeacher}
                      />
                      <span className={styles.errorMessage}>{teacherErrors.lastName}</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Ingresa el correo electrónico"
                      value={teacherFormData.email}
                      onChange={handleTeacherInputChange}
                      disabled={isCreatingTeacher}
                    />
                    <span className={styles.errorMessage}>{teacherErrors.email}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Crea un nombre de usuario"
                      value={teacherFormData.username}
                      onChange={handleTeacherInputChange}
                      disabled={isCreatingTeacher}
                    />
                    <span className={styles.errorMessage}>{teacherErrors.username}</span>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="password">Contraseña</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Crea una contraseña"
                        value={teacherFormData.password}
                        onChange={handleTeacherInputChange}
                        disabled={isCreatingTeacher}
                      />
                      <span className={styles.errorMessage}>{teacherErrors.password}</span>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword">Confirmar contraseña</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirma la contraseña"
                        value={teacherFormData.confirmPassword}
                        onChange={handleTeacherInputChange}
                        disabled={isCreatingTeacher}
                      />
                      <span className={styles.errorMessage}>{teacherErrors.confirmPassword}</span>
                    </div>
                  </div>

                  {teacherErrors.general && (
                    <div className={styles.errorMessage} style={{ marginBottom: "15px" }}>
                      {teacherErrors.general}
                    </div>
                  )}

                  <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={isCreatingTeacher}>
                    {isCreatingTeacher ? "Creando..." : "Crear Profesor"}
                  </button>
                </form>

                <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Profesores Registrados</h3>
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Nombre Completo</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Fecha de Creación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                            No hay profesores registrados
                          </td>
                        </tr>
                      ) : (
                        teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td>{teacher.fullName}</td>
                            <td>{teacher.username}</td>
                            <td>{teacher.email}</td>
                            <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <h2>Estudiantes Registrados</h2>
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Nombre Completo</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Fecha de Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                            No hay estudiantes registrados
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.fullName}</td>
                            <td>{student.username}</td>
                            <td>{student.email}</td>
                            <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
