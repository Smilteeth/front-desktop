// apiService.ts - Servicio centralizado para manejar llamadas a la API
// Interfaces
export interface Lesson {
  lessonId: number
  courseId: number
  name: string
  contentUrl: string
  duration: string
  creationDate: string
  lastModificationDate: string | null
  isActive: boolean
}

export interface Course {
  courseId: number
  name: string
  description: string
  creationDate: string
  isActive: boolean
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[]
}

export interface CoursesApiResponse {
  page: number
  limit: number
  totalPages: number
  items: Course[]
}

// Configuración base de la API
const API_BASE_URL = 'https://smiltheet-api.rafabeltrans17.workers.dev/api' // Ajusta según tu configuración


// Función helper para manejar respuestas de la API
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorMessage = `Error ${response.status}: ${response.statusText}`
    throw new Error(errorMessage)
  }

  const data = await response.json()
  return data as T
}

// Función helper para realizar peticiones con manejo de errores
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const authToken = localStorage.getItem('authToken') // obtener token

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}), // agregar la cabecera
        ...options?.headers
      },
      ...options
    })

    return await handleApiResponse<T>(response)
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error)
    throw error
  }
}


// Servicio de API para cursos
export const courseService = {
  // Obtener todos los cursos
  getAllCourses: async (page: number = 1, limit: number = 10): Promise<CoursesApiResponse> => {
    return apiRequest<CoursesApiResponse>(`/course?page=${page}&limit=${limit}`)
  },

  // Obtener un curso específico con sus lecciones
  getCourseById: async (courseId: number): Promise<CourseWithLessons> => {
    return apiRequest<CourseWithLessons>(`/course/${courseId}`)
  },

  // Obtener solo los cursos activos
  getActiveCourses: async (page: number = 1, limit: number = 10): Promise<Course[]> => {
    const response = await courseService.getAllCourses(page, limit)
    return response.items.filter(course => course.isActive)
  },

  // Buscar cursos por término
  searchCourses: async (searchTerm: string, page: number = 1, limit: number = 10): Promise<Course[]> => {
    const courses = await courseService.getActiveCourses(page, limit)
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  },

  // Obtener una lección específica
  getLessonById: async (courseId: number, lessonId: number): Promise<Lesson | null> => {
    const course = await courseService.getCourseById(courseId)
    return course.lessons.find(lesson => lesson.lessonId === lessonId && lesson.isActive) || null
  },

  // Obtener lecciones activas de un curso
  getActiveLessons: async (courseId: number): Promise<Lesson[]> => {
    const course = await courseService.getCourseById(courseId)
    return course.lessons.filter(lesson => lesson.isActive)
  },

  // Validar si un curso existe y está activo
  validateCourse: async (courseId: number): Promise<boolean> => {
    try {
      const course = await courseService.getCourseById(courseId)
      return course.isActive
    } catch {
      return false
    }
  },

  // Validar si una lección existe y está activa
  validateLesson: async (courseId: number, lessonId: number): Promise<boolean> => {
    try {
      const lesson = await courseService.getLessonById(courseId, lessonId)
      return lesson !== null && lesson.isActive
    } catch {
      return false
    }
  }
}

// Servicio para manejar errores de manera consistente
export const errorHandler = {
  // Mensajes de error amigables para el usuario
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return 'El contenido solicitado no se encontró'
      }
      if (error.message.includes('500')) {
        return 'Error del servidor. Intenta más tarde'
      }
      if (error.message.includes('Network')) {
        return 'Error de conexión. Verifica tu internet'
      }
      return error.message
    }
    return 'Ha ocurrido un error inesperado'
  },

  // Log de errores para debugging
  logError: (context: string, error: unknown): void => {
    console.error(`Error in ${context}:`, error)
  }
}
