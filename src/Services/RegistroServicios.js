/**
 * Servicios para gestión de usuarios
 */
import { 
  saveUser, 
  findUserByUsername, 
  findUserByEmail, 
  isUsernameAvailable, 
  isEmailAvailable 
} from '../Utils/RegistroStorage'

// Registrar un nuevo usuario
export function registerUser(userData) {
  try {
    // Verificar disponibilidad de username
    if (!isUsernameAvailable(userData.username)) {
      return {
        success: false,
        message: 'El nombre de usuario ya está en uso',
        field: 'username'
      }
    }

    // Verificar disponibilidad de email
    if (!isEmailAvailable(userData.email)) {
      return {
        success: false,
        message: 'El correo electrónico ya está registrado',
        field: 'email'
      }
    }

    // Guardar el nuevo usuario
    const newUser = saveUser(userData)
    
    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    }
  } catch (error) {
    console.error('Error en registerUser:', error)
    return {
      success: false,
      message: 'Error interno del servidor. Inténtalo de nuevo.',
      field: 'general'
    }
  }
}

// Verificar disponibilidad de username en tiempo real
export function checkUsernameAvailability(username) {
  try {
    if (!username || username.trim().length < 3) {
      return {
        available: false,
        message: 'El username debe tener al menos 3 caracteres'
      }
    }

    const available = isUsernameAvailable(username)
    return {
      available,
      message: available ? 'Nombre de usuario disponible' : 'Nombre de usuario no disponible'
    }
  } catch (error) {
    console.error('Error al verificar username:', error)
    return {
      available: false,
      message: 'Error al verificar disponibilidad'
    }
  }
}

// Verificar disponibilidad de email en tiempo real
export function checkEmailAvailability(email) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return {
        available: false,
        message: 'Formato de email inválido'
      }
    }

    const available = isEmailAvailable(email)
    return {
      available,
      message: available ? 'Correo electrónico disponible' : 'Correo electrónico ya registrado'
    }
  } catch (error) {
    console.error('Error al verificar email:', error)
    return {
      available: false,
      message: 'Error al verificar disponibilidad'
    }
  }
}

// Obtener información de un usuario por username
export function getUserByUsername(username) {
  try {
    const user = findUserByUsername(username)
    if (!user) {
      return {
        found: false,
        message: 'Usuario no encontrado'
      }
    }

    return {
      found: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return {
      found: false,
      message: 'Error al buscar usuario'
    }
  }
}

// Obtener información de un usuario por email
export function getUserByEmail(email) {
  try {
    const user = findUserByEmail(email)
    if (!user) {
      return {
        found: false,
        message: 'Usuario no encontrado'
      }
    }

    return {
      found: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return {
      found: false,
      message: 'Error al buscar usuario'
    }
  }
}