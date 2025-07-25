/**
 * Validaciones para el formulario de registro
 */

// Validación completa del formulario
export function validateRegisterForm(formData) {
  const errors = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: ""
  }
  let hasError = false

  // Validar nombres
  const firstNameValidation = validateFirstName(formData.firstName)
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message
    hasError = true
  }

  // Validar apellidos
  const lastNameValidation = validateLastName(formData.lastName)
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message
    hasError = true
  }

  // Validar email
  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message
    hasError = true
  }

  // Validar username
  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message
    hasError = true
  }

  // Validar password
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message
    hasError = true
  }

  // Validar confirmación de password
  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message
    hasError = true
  }

  // Validar rol
  const roleValidation = validateRole(formData.role)
  if (!roleValidation.isValid) {
    errors.role = roleValidation.message
    hasError = true
  }

  // Validar términos y condiciones
  const termsValidation = validateTerms(formData.terms)
  if (!termsValidation.isValid) {
    errors.terms = termsValidation.message
    hasError = true
  }

  return {
    hasError,
    errors
  }
}

// Validaciones individuales
export function validateFirstName(firstName) {
  if (!firstName || firstName.trim() === "") {
    return { isValid: false, message: "Los nombres son requeridos" }
  }
  
  if (firstName.trim().length < 2) {
    return { isValid: false, message: "Los nombres deben tener al menos 2 caracteres" }
  }
  
  if (firstName.trim().length > 50) {
    return { isValid: false, message: "Los nombres no pueden exceder 50 caracteres" }
  }
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName.trim())) {
    return { isValid: false, message: "Los nombres solo pueden contener letras y espacios" }
  }
  
  return { isValid: true, message: "" }
}

export function validateLastName(lastName) {
  if (!lastName || lastName.trim() === "") {
    return { isValid: false, message: "Los apellidos son requeridos" }
  }
  
  if (lastName.trim().length < 2) {
    return { isValid: false, message: "Los apellidos deben tener al menos 2 caracteres" }
  }
  
  if (lastName.trim().length > 50) {
    return { isValid: false, message: "Los apellidos no pueden exceder 50 caracteres" }
  }
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName.trim())) {
    return { isValid: false, message: "Los apellidos solo pueden contener letras y espacios" }
  }
  
  return { isValid: true, message: "" }
}

export function validateEmail(email) {
  if (!email || email.trim() === "") {
    return { isValid: false, message: "El correo electrónico es requerido" }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Formato de correo electrónico inválido" }
  }
  
  if (email.trim().length > 100) {
    return { isValid: false, message: "El correo electrónico es demasiado largo" }
  }
  
  return { isValid: true, message: "" }
}

export function validateUsername(username) {
  if (!username || username.trim() === "") {
    return { isValid: false, message: "El nombre de usuario es requerido" }
  }
  
  if (username.trim().length < 3) {
    return { isValid: false, message: "El nombre de usuario debe tener al menos 3 caracteres" }
  }
  
  if (username.trim().length > 20) {
    return { isValid: false, message: "El nombre de usuario no puede exceder 20 caracteres" }
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return { isValid: false, message: "El nombre de usuario solo puede contener letras, números y guiones bajos" }
  }
  
  if (/^[0-9]/.test(username.trim())) {
    return { isValid: false, message: "El nombre de usuario no puede comenzar con un número" }
  }
  
  return { isValid: true, message: "" }
}

export function validatePassword(password) {
  if (!password || password.trim() === "") {
    return { isValid: false, message: "La contraseña es requerida" }
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "La contraseña debe tener al menos 6 caracteres" }
  }
  
  if (password.length > 50) {
    return { isValid: false, message: "La contraseña no puede exceder 50 caracteres" }
  }
  
  // Opcional: validación de complejidad
  if (!/(?=.*[a-zA-Z])/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos una letra" }
  }
  
  return { isValid: true, message: "" }
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return { isValid: false, message: "Debe confirmar la contraseña" }
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: "Las contraseñas no coinciden" }
  }
  
  return { isValid: true, message: "" }
}

export function validateRole(role) {
  if (!role || role.trim() === "") {
    return { isValid: false, message: "Debe seleccionar un tipo de usuario" }
  }
  
  const validRoles = ['student', 'teacher', 'admin']
  if (!validRoles.includes(role)) {
    return { isValid: false, message: "Tipo de usuario inválido" }
  }
  
  return { isValid: true, message: "" }
}

export function validateTerms(terms) {
  if (!terms) {
    return { isValid: false, message: "Debe aceptar los términos y condiciones" }
  }
  
  return { isValid: true, message: "" }
}