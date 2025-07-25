/**
 * Utilidades para manejo de localStorage - Sistema de Trabajos de Titulación (Documentos)
 */
const DOCUMENTS_KEY = "titulacionDocuments"

// Obtener todos los documentos
export function getDocuments() {
  try {
    const documents = localStorage.getItem(DOCUMENTS_KEY)
    return documents ? JSON.parse(documents) : []
  } catch (error) {
    console.error("Error al obtener documentos:", error)
    return []
  }
}

// Guardar un nuevo documento
export function saveDocument(documentData) {
  try {
    const documents = getDocuments()
    const newDocument = {
      id: `DOC-${Date.now()}`, // ID único para el documento
      studentUsername: documentData.studentUsername, // Username del estudiante
      title: documentData.title, // Título del trabajo asociado (de la propuesta, si existe)
      documentType: documentData.documentType,
      version: documentData.version.trim(),
      description: documentData.description.trim(),
      fileName: documentData.fileName,
      fileSize: documentData.fileSize,
      fileType: documentData.fileType,
      fileContentBase64: documentData.fileContentBase64, // Contenido del archivo en Base64
      dateSubmitted: new Date().toISOString(),
      status: "Pendiente", // 'Pendiente', 'Aprobado', 'Aprobado con Observaciones', 'Requiere Corrección', 'Rechazado'
      grade: null,
      comments: null,
      recommendations: null,
      evaluator: null, // Nombre del profesor/admin que evaluó
      lastEvaluated: null,
    }

    documents.push(newDocument)
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents))
    return newDocument
  } catch (error) {
    console.error("Error al guardar documento:", error)
    throw new Error("Error al guardar documento")
  }
}

// Actualizar un documento existente
export function updateDocument(updatedDocument) {
  try {
    const documents = getDocuments()
    const index = documents.findIndex((d) => d.id === updatedDocument.id)
    if (index !== -1) {
      documents[index] = { ...documents[index], ...updatedDocument }
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents))
      return documents[index]
    }
    return null // Documento no encontrado
  } catch (error) {
    console.error("Error al actualizar documento:", error)
    throw new Error("Error al actualizar documento")
  }
}

// Buscar documento por ID
export function findDocumentById(id) {
  try {
    const documents = getDocuments()
    return documents.find((d) => d.id === id)
  } catch (error) {
    console.error("Error al buscar documento por ID:", error)
    return null
  }
}

// Limpiar todos los documentos (útil para desarrollo/testing)
export function clearAllDocuments() {
  try {
    localStorage.removeItem(DOCUMENTS_KEY)
    return true
  } catch (error) {
    console.error("Error al limpiar todos los documentos:", error)
    return false
  }
}
