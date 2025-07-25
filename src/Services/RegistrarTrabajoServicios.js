import { getDocuments, saveDocument, updateDocument, findDocumentById } from "../Utils/RegistrarTrabajoStorage"

// Función para enviar un nuevo documento
export function submitNewDocument(documentData) {
  try {
    const newDocument = saveDocument(documentData)
    return {
      success: true,
      message: "Documento enviado exitosamente. Será revisado por un profesor.",
      document: newDocument,
    }
  } catch (error) {
    console.error("Error en submitNewDocument:", error)
    return {
      success: false,
      message: "Ocurrió un error al enviar el documento. Inténtalo de nuevo.",
    }
  }
}

// Función para obtener todos los documentos (para administradores/profesores)
export function getAllDocuments() {
  return getDocuments()
}

// Función para obtener los documentos de un estudiante específico
export function getDocumentsByStudentUsername(username) {
  const allDocuments = getDocuments()
  return allDocuments.filter((doc) => doc.studentUsername === username)
}

// Función para evaluar un documento
export function evaluateDocument(documentId, grade, comments, recommendations, evaluatorName, newStatus) {
  try {
    const document = findDocumentById(documentId)
    if (!document) {
      return { success: false, message: "Documento no encontrado." }
    }

    const updatedDocument = {
      ...document,
      grade: grade,
      comments: comments,
      recommendations: recommendations,
      status: newStatus,
      evaluator: evaluatorName,
      lastEvaluated: new Date().toISOString(),
    }

    updateDocument(updatedDocument)
    return { success: true, message: "Documento evaluado exitosamente.", document: updatedDocument }
  } catch (error) {
    console.error("Error en evaluateDocument:", error)
    return { success: false, message: "Ocurrió un error al evaluar el documento." }
  }
}

// Función para obtener el estado de un documento
export function getDocumentStatus(document) {
  // Define un orden de precedencia para los estados
  const statusOrder = ["Rechazado", "Aprobado", "Aprobado con Observaciones", "Requiere Corrección", "Pendiente"]

  // Si tiene un estado explícito, lo usa
  if (statusOrder.includes(document.status)) {
    return document.status
  }

  // Si no, y tiene comentarios o evaluador, se considera "En Revisión" (o un estado más específico si se introduce)
  if (document.comments || document.evaluator) {
    return "En Revisión" // Un estado intermedio que podría ser útil en el UI, aunque no esté en el HTML original
  }

  // Por defecto
  return "Pendiente"
}
