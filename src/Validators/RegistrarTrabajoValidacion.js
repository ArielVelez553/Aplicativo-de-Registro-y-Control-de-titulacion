/**
 * Validaciones para el formulario de subida de trabajo y el formulario de evaluación.
 */

export function validateUploadForm(formData, file) {
  const errors = {
    documentType: "",
    version: "",
    description: "",
    file: "",
  }
  let hasError = false

  // Validar Tipo de Entrega
  if (!formData.documentType || formData.documentType.trim() === "") {
    errors.documentType = "Debe seleccionar un tipo de entrega."
    hasError = true
  }

  // Validar Versión del Documento
  if (!formData.version || formData.version.trim() === "") {
    errors.version = "Debe ingresar la versión del documento."
    hasError = true
  } else if (formData.version.trim().length < 2) {
    errors.version = "La versión debe tener al menos 2 caracteres."
    hasError = true
  }

  // Validar Descripción del Avance
  if (!formData.description || formData.description.trim() === "") {
    errors.description = "Debe ingresar una descripción del avance."
    hasError = true
  } else if (formData.description.trim().length < 15) {
    errors.description = "La descripción debe tener al menos 15 caracteres."
    hasError = true
  }

  // Validar el archivo
  if (!file) {
    errors.file = "Debe seleccionar un archivo para subir."
    hasError = true
  } else {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      errors.file = "Formato de archivo no permitido. Solo PDF, DOC, DOCX."
      hasError = true
    }
    const maxSizeMB = 15
    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.file = `El archivo excede el tamaño máximo permitido (${maxSizeMB}MB).`
      hasError = true
    }
  }

  return {
    hasError,
    errors,
  }
}

export function validateEvaluationForm(formData) {
  const errors = {
    comments: "",
    grade: "",
    decision: "",
    recommendations: "",
  }
  let hasError = false

  // Validar Comentarios de Evaluación
  if (!formData.comments || formData.comments.trim() === "") {
    errors.comments = "Los comentarios de evaluación son requeridos."
    hasError = true
  } else if (formData.comments.trim().length < 15) {
    errors.comments = "Los comentarios deben tener al menos 15 caracteres."
    hasError = true
  }

  // Validar Calificación (obligatoria si la decisión no es "Requiere Corrección")
  if (
    formData.decision !== "Requiere Corrección" &&
    (formData.grade === null ||
      formData.grade === "" ||
      isNaN(formData.grade) ||
      Number.parseFloat(formData.grade) < 0 ||
      Number.parseFloat(formData.grade) > 10)
  ) {
    errors.grade = "La calificación debe ser un número entre 0 y 10."
    hasError = true
  }

  // Validar Estado de Evaluación (decisión)
  if (!formData.decision || formData.decision.trim() === "") {
    errors.decision = "Debe seleccionar un estado de evaluación."
    hasError = true
  }

  // Validar Recomendaciones (opcional, pero si existe, debe tener un mínimo de caracteres)
  if (
    formData.recommendations &&
    formData.recommendations.trim().length > 0 &&
    formData.recommendations.trim().length < 15
  ) {
    errors.recommendations = "Las recomendaciones deben tener al menos 15 caracteres si se ingresan."
    hasError = true
  }

  return {
    hasError,
    errors,
  }
}
