/**
 * Utilidades para manejo de administradores predefinidos
 */

// Credenciales de administrador predefinidas (en un sistema real, esto estaría en una base de datos segura)
const ADMIN_CREDENTIALS = {
  username: "admin_uleam",
  password: "Admin-uleam-2025",
  fullName: "Administrador del Sistema",
  email: "admin@uleam.edu.ec",
}

export function validateAdminCredentials(username, password) {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function getAdminInfo() {
  return {
    username: ADMIN_CREDENTIALS.username,
    fullName: ADMIN_CREDENTIALS.fullName,
    email: ADMIN_CREDENTIALS.email,
    role: "admin",
  }
}
