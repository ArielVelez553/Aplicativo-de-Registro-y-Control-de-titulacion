import { getUsers, saveUser } from "../Utils/RegistroStorage"
import { validateAdminCredentials, getAdminInfo } from "../Utils/AdminStorage"

// Función para login de administrador
export function loginAdmin(username, password) {
  try {
    if (validateAdminCredentials(username, password)) {
      const adminInfo = getAdminInfo()
      const adminSession = {
        ...adminInfo,
        id: "admin-001",
        loginTime: new Date().toISOString(),
        cedula: "0000000000",
      }

      localStorage.setItem("userSession", JSON.stringify(adminSession))
      localStorage.setItem("token", "admin-jwt-token")
      return { ok: true, message: "Acceso de administrador exitoso", data: adminSession }
    } else {
      return { ok: false, message: "Credenciales de administrador inválidas" }
    }
  } catch (error) {
    console.error("Error durante el login de administrador:", error)
    return { ok: false, message: "Error durante el acceso de administrador" }
  }
}

// Función para crear profesor desde el panel de administrador
export function createTeacher(teacherData) {
  try {
    const newTeacher = {
      firstName: teacherData.firstName.trim(),
      lastName: teacherData.lastName.trim(),
      email: teacherData.email.trim().toLowerCase(),
      username: teacherData.username.trim().toLowerCase(),
      password: teacherData.password,
      role: "teacher",
      fullName: `${teacherData.firstName.trim()} ${teacherData.lastName.trim()}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      cedula: teacherData.cedula.trim(),
      specialization: teacherData.specialization || "",
      department: teacherData.department || "",
    }

    const result = saveUser(newTeacher)
    return { success: true, message: "Profesor creado exitosamente", teacher: result }
  } catch (error) {
    console.error("Error al crear profesor:", error)
    return { success: false, message: error.message || "Error al crear profesor" }
  }
}

// Función para obtener todos los profesores
export function getAllTeachers() {
  const users = getUsers()
  return users.filter((user) => user.role === "teacher")
}

// Función para obtener todos los estudiantes
export function getAllStudents() {
  const users = getUsers()
  return users.filter((user) => user.role === "student")
}
