/**
 * Servicios de autenticación usando localStorage
 */
import {
  findUserByUsername,
  setCurrentUser,
  getRememberedUser,
  handleRememberSession,
  clearCurrentUser,
  getCurrentUser,
} from "../Utils/RegistroStorage.js"


// Función principal para iniciar sesión
export function loginUser(username, password, remember = false) {
  try {
    // Buscar usuario en localStorage
    const user = findUserByUsername(username)
    
    if (!user) { 
      return {
        success: false,
        message: 'Usuario no encontrado. Por favor, regístrate.',
        field: 'username' // Indica que el error es del campo username
      }
    }

    // Verificar la contraseña
    if (user.password !== password) { // ¡IMPORTANTE! En un proyecto real, las contraseñas deben estar hasheadas y comparadas de forma segura.
      return {
        success: false,
        message: 'Contraseña incorrecta.',
        field: 'password' // Indica que el error es del campo password
      }
    }

    // Autenticación exitosa
    const userSession = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role, // Incluimos el rol para futuras expansiones
      loginTime: new Date().toISOString()
    }

    // Guardar el usuario actual en localStorage
    setCurrentUser(userSession)

    // Manejar la opción "Recordar sesión"
    handleRememberSession(remember, username)

    return {
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: userSession
    }
  } catch (error) {
    console.error('Error en loginUser:', error)
    return {
      success: false,
      message: 'Ocurrió un error inesperado durante el inicio de sesión. Inténtalo de nuevo.',
      field: 'general'
    }
  }
}

// Función para cerrar sesión
export function logoutUser() {
  clearCurrentUser()
  handleRememberSession(false) // Limpiar usuario recordado al cerrar sesión
  return {
    success: true,
    message: 'Sesión cerrada correctamente.'
  }
}

// Función para obtener el usuario actualmente logueado (útil para proteger rutas o mostrar info)
export function getCurrentLoggedInUser() {
  return getCurrentUser()
}

// Función para precargar el username si se marcó "Recordar sesión"
export function getRememberedUsername() {
  return getRememberedUser()
}