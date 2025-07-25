/**
 * Validaciones para el formulario de propuesta de trabajo de titulación
 */

export function validateProposalForm(formData) {
  const errors = {
    studentName: "",
    cedula: "",
    career: "",
    semester: "",
    title: "",
    area: "",
    modalidad: "",
    resumen: "",
    justificacion: "",
  }
  let hasError = false

  // Validar Nombre del Estudiante
  if (!formData.studentName || formData.studentName.trim() === "") {
    errors.studentName = "Debe ingresar el nombre del estudiante."
    hasError = true
  } else if (formData.studentName.trim().length < 3) {
    errors.studentName = "El nombre debe tener al menos 3 caracteres."
    hasError = true
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.studentName.trim())) {
    errors.studentName = "El nombre solo puede contener letras y espacios."
    hasError = true
  }

  // Validar Cédula de Identidad
  if (!formData.cedula || formData.cedula.trim() === "") {
    errors.cedula = "Debe ingresar la cédula de identidad."
    hasError = true
  } else if (!/^\d{10}$/.test(formData.cedula.trim())) {
    errors.cedula = "La cédula debe tener 10 dígitos numéricos."
    hasError = true
  }

  // Validar Carrera
  if (!formData.career || formData.career.trim() === "") {
    errors.career = "Debe seleccionar una carrera."
    hasError = true
  }

  // Validar Semestre Actual
  if (!formData.semester || formData.semester.trim() === "") {
    errors.semester = "Debe seleccionar el semestre actual."
    hasError = true
  }

  // Validar Título Propuesto del Trabajo
  if (!formData.title || formData.title.trim() === "") {
    errors.title = "Debe ingresar el título propuesto del trabajo."
    hasError = true
  } else if (formData.title.trim().length < 10) {
    errors.title = "El título debe tener al menos 10 caracteres."
    hasError = true
  }

  // Validar Área de Especialización
  if (!formData.area || formData.area.trim() === "") {
    errors.area = "Debe seleccionar el área de especialización."
    hasError = true
  }

  // Validar Modalidad de Titulación
  if (!formData.modalidad || formData.modalidad.trim() === "") {
    errors.modalidad = "Debe seleccionar la modalidad de titulación."
    hasError = true
  }

  // Validar Resumen de la Propuesta
  if (!formData.resumen || formData.resumen.trim() === "") {
    errors.resumen = "Debe ingresar el resumen de la propuesta."
    hasError = true
  } else if (formData.resumen.trim().length < 15) {
    // CAMBIO AQUÍ: de 50 a 15
    errors.resumen = "El resumen debe tener al menos 15 caracteres."
    hasError = true
  }

  // Validar Justificación Tecnológica
  if (!formData.justificacion || formData.justificacion.trim() === "") {
    errors.justificacion = "Debe ingresar la justificación tecnológica."
    hasError = true
  } else if (formData.justificacion.trim().length < 15) {
    // CAMBIO AQUÍ: de 50 a 15
    errors.justificacion = "La justificación debe tener al menos 15 caracteres."
    hasError = true
  }

  return {
    hasError,
    errors,
  }
}

// Validaciones individuales (pueden ser útiles para validación en tiempo real si se desea)
export function validateStudentName(name) {
  if (!name || name.trim() === "") return { isValid: false, message: "Los nombres son requeridos." }
  if (name.trim().length < 3) return { isValid: false, message: "El nombre debe tener al menos 3 caracteres." }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim()))
    return { isValid: false, message: "El nombre solo puede contener letras y espacios." }
  return { isValid: true, message: "" }
}

export function validateCedula(cedula) {
  if (!cedula || cedula.trim() === "") return { isValid: false, message: "La cédula es requerida." }
  if (!/^\d{10}$/.test(cedula.trim())) return { isValid: false, message: "La cédula debe tener 10 dígitos numéricos." }
  return { isValid: true, message: "" }
}

export function validateTitle(title) {
  if (!title || title.trim() === "") return { isValid: false, message: "El título es requerido." }
  if (title.trim().length < 10) return { isValid: false, message: "El título debe tener al menos 10 caracteres." }
  return { isValid: true, message: "" }
}

export function validateTextarea(text, fieldName) {
  if (!text || text.trim() === "") return { isValid: false, message: `El ${fieldName} es requerido.` }
  if (text.trim().length < 15) return { isValid: false, message: `El ${fieldName} debe tener al menos 15 caracteres.` } // CAMBIO AQUÍ: de 50 a 15
  return { isValid: true, message: "" }
}

export function validateSelect(value, fieldName) {
  if (!value || value.trim() === "")
    return { isValid: false, message: `Debe seleccionar una opción para ${fieldName}.` }
  return { isValid: true, message: "" }
}

export function validateEmail(email) {
  if (!email || email.trim() === "") return { isValid: false, message: "El email es requerido." }
  if (!/\S+@\S+\.\S+/.test(email.trim())) return { isValid: false, message: "El email debe tener un formato válido." }
  return { isValid: true, message: "" }
}

export function validateUsername(username) {
  if (!username || username.trim() === "") return { isValid: false, message: "El username es requerido." }
  if (username.trim().length < 3) return { isValid: false, message: "El username debe tener al menos 3 caracteres." }
  return { isValid: true, message: "" }
}

export function validatePassword(password) {
  if (!password || password.trim() === "") return { isValid: false, message: "El password es requerido." }
  if (password.trim().length < 6) return { isValid: false, message: "El password debe tener al menos 6 caracteres." }
  return { isValid: true, message: "" }
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === "")
    return { isValid: false, message: "Debe confirmar el password." }
  if (password !== confirmPassword) return { isValid: false, message: "El password y la confirmación deben coincidir." }
  return { isValid: true, message: "" }
}

export function validateRole(role) {
  if (!role || role.trim() === "") return { isValid: false, message: "Debe seleccionar un rol." }
  return { isValid: true, message: "" }
}

export function validateTerms(terms) {
  if (!terms || terms.trim() === "") return { isValid: false, message: "Debe aceptar los términos y condiciones." }
  return { isValid: true, message: "" }
}
