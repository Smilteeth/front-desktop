/**
 * API Service for Courses and Lessons
 *    Aqui se maneja las llamadas a la api
 */

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

// Interfaz para preguntas
export interface Question {
  questionId: number
  question: string
  answers: {
    questionId: number
    answer: string
    isCorrect: boolean
  }[]
}

// Configuración base de la API
const API_BASE_URL = 'https://smiltheet-api.rafabeltrans17.workers.dev/api'

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
    const authToken = localStorage.getItem('authToken')

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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
  getAllCourses: async (page: number = 1, limit: number = 10): Promise<CoursesApiResponse> => {
    return apiRequest<CoursesApiResponse>(`/course?page=${page}&limit=${limit}`)
  },

  getCourseById: async (courseId: number): Promise<CourseWithLessons> => {
    return apiRequest<CourseWithLessons>(`/course/${courseId}`)
  },

  getActiveCourses: async (page: number = 1, limit: number = 10): Promise<Course[]> => {
    const response = await courseService.getAllCourses(page, limit)
    return response.items.filter(course => course.isActive)
  },

  searchCourses: async (searchTerm: string, page: number = 1, limit: number = 10): Promise<Course[]> => {
    const courses = await courseService.getActiveCourses(page, limit)
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  },

  getLessonById: async (courseId: number, lessonId: number): Promise<Lesson | null> => {
    const course = await courseService.getCourseById(courseId)
    return course.lessons.find(lesson => lesson.lessonId === lessonId && lesson.isActive) || null
  },

  getActiveLessons: async (courseId: number): Promise<Lesson[]> => {
    const course = await courseService.getCourseById(courseId)
    return course.lessons.filter(lesson => lesson.isActive)
  },

  validateCourse: async (courseId: number): Promise<boolean> => {
    try {
      const course = await courseService.getCourseById(courseId)
      return course.isActive
    } catch {
      return false
    }
  },

  validateLesson: async (courseId: number, lessonId: number): Promise<boolean> => {
    try {
      const lesson = await courseService.getLessonById(courseId, lessonId)
      return lesson !== null && lesson.isActive
    } catch {
      return false
    }
  },

  // Obtener preguntas para una lección
  getQuestionsForLesson: async (lessonId: number): Promise<Question[]> => {
    return apiRequest<Question[]>(`/course/question/${lessonId}`)
  },

  // Obtener nombre del niño
  getChildName: async (childId: number): Promise<string> => {
    const response = await apiRequest<{ name: string }>(`/child/id/${childId}`)
    return response.name
  },

  // Obtener monedas del niño
  getChildCoins: async (childId: number): Promise<number> => {
    const response = await apiRequest<{ correctAnswers: number }>(`/transaction/${childId}`)
    return response.correctAnswers
  },

  // Enviar respuestas correctas (transacción)
  submitCorrectAnswers: async (childId: number, amount: number): Promise<void> => {
    await apiRequest(`/transaction`, {
      method: 'POST',
      body: JSON.stringify({ childId, amount })
    })
  }
}

// Servicio para manejo de errores
export const errorHandler = {
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

  logError: (context: string, error: unknown): void => {
    console.error(`Error in ${context}:`, error)
  }
}

// Servicio para preguntas (opcional)
export const quizService = {
  getQuestionsForLesson: async (lessonId: number): Promise<Question[]> => {
    return courseService.getQuestionsForLesson(lessonId)
  }
}

