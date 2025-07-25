/**
 * Utilidades para manejo de localStorage - Sistema de Registro y Login
 */

const USERS_KEY = 'registeredUsers'
const REMEMBERED_USER_KEY = 'rememberedUser'
const CURRENT_USER_KEY = 'currentUser' // Clave para el usuario actualmente logueado

// --- Funciones para la gestión de usuarios registrados ---

// Obtener todos los usuarios registrados
export function getUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return []
  }
}

// Guardar un nuevo usuario
export function saveUser(userData) {
  try {
    const users = getUsers()
    const newUser = {
      id: Date.now(), // ID único basado en timestamp
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim().toLowerCase(),
      username: userData.username.trim().toLowerCase(),
      password: userData.password, // ¡IMPORTANTE! En producción esto debería estar hasheado
      role: userData.role,
      fullName: `${userData.firstName.trim()} ${userData.lastName.trim()}`,
      createdAt: new Date().toISOString(),
      isActive: true
    }
    
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return newUser
  } catch (error) {
    console.error('Error al guardar usuario:', error)
    throw new Error('Error al guardar usuario')
  }
}

// Buscar usuario por username
export function findUserByUsername(username) {
  try {
    const users = getUsers()
    return users.find(user => user.username.toLowerCase() === username.toLowerCase())
  } catch (error) {
    console.error('Error al buscar usuario por username:', error)
    return null
  }
}

// Buscar usuario por email
export function findUserByEmail(email) {
  try {
    const users = getUsers()
    return users.find(user => user.email.toLowerCase() === email.toLowerCase())
  } catch (error) {
    console.error('Error al buscar usuario por email:', error)
    return null
  }
}

// Verificar si username está disponible
export function isUsernameAvailable(username) {
  return !findUserByUsername(username)
}

// Verificar si email está disponible
export function isEmailAvailable(email) {
  return !findUserByEmail(email)
}

// --- Funciones para la gestión de la sesión actual ---

// Guardar el usuario actualmente logueado
export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  } catch (error) {
    console.error('Error al guardar usuario actual:', error)
  }
}

// Obtener el usuario actualmente logueado
export function getCurrentUser() {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
    return null
  }
}

// Limpiar el usuario actualmente logueado
export function clearCurrentUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
  } catch (error) {
    console.error('Error al limpiar usuario actual:', error)
  }
}

// --- Funciones para la gestión de "Recordar sesión" ---

// Manejar la opción "Recordar sesión"
export function handleRememberSession(remember, username) {
  try {
    if (remember) {
      localStorage.setItem(REMEMBERED_USER_KEY, username)
    } else {
      localStorage.removeItem(REMEMBERED_USER_KEY)
    }
  } catch (error) {
    console.error('Error al manejar recordar sesión:', error)
  }
}

// Obtener el usuario recordado
export function getRememberedUser() {
  try {
    return localStorage.getItem(REMEMBERED_USER_KEY)
  } catch (error) {
    console.error('Error al obtener usuario recordado:', error)
    return null
  }
}

// --- Funciones de utilidad general ---

// Limpiar todos los usuarios (útil para desarrollo/testing)
export function clearAllUsers() {
  try {
    localStorage.removeItem(USERS_KEY)
    localStorage.removeItem(REMEMBERED_USER_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
    return true
  } catch (error) {
    console.error('Error al limpiar todos los datos:', error)
    return false
  }
}

// Obtener estadísticas de usuarios (ejemplo)
export function getUserStats() {
  try {
    const users = getUsers()
    return {
      total: users.length,
      students: users.filter(user => user.role === 'student').length,
      teachers: users.filter(user => user.role === 'teacher').length,
      admins: users.filter(user => user.role === 'admin').length,
      active: users.filter(user => user.isActive).length
    }
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return { total: 0, students: 0, teachers: 0, admins: 0, active: 0 }
  }
}