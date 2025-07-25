/**
 * Validaciones para el formulario de login
 */

export function validateLoginForm(username, password) {
  const errors = {
    username: "",
    password: "",
  }
  let hasError = false

  // Validar username
  if (!username || username.trim() === "") {
    errors.username = "El nombre de usuario es requerido."
    hasError = true
  } else if (username.trim().length < 3) {
    errors.username = "El nombre de usuario debe tener al menos 3 caracteres."
    hasError = true
  }

  // Validar password
  if (!password || password.trim() === "") {
    errors.password = "La contraseña es requerida."
    hasError = true
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres."
    hasError = true
  }

  return {
    hasError,
    errors, 
  }
}