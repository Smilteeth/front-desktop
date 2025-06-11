import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../styles/quiz.module.css'

interface Question {
  questionText: string
  options: string[]
  correctAnswer: string
}

const LessonQuiz: React.FC = () => {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [coinsEarned, setCoinsEarned] = useState(0)

  // Datos de prueba
  const mockQuestions: Question[] = [
    {
      questionText: '¿Cuál es la capital de Francia?',
      options: ['Madrid', 'París', 'Berlín', 'Lisboa'],
      correctAnswer: 'París'
    },
    {
      questionText: '¿Cuánto es 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4'
    },
    {
      questionText: '¿Cuál es el océano más grande del mundo?',
      options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
      correctAnswer: 'Pacífico'
    },
    {
      questionText: '¿Quién escribió "Cien años de soledad"?',
      options: [
        'Gabriel García Márquez',
        'Mario Vargas Llosa',
        'Jorge Luis Borges',
        'Pablo Neruda'
      ],
      correctAnswer: 'Gabriel García Márquez'
    }
  ]

  // codigo para obtener preguntas reales
  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     try {
  //       const q = await quizService.getQuestionsForLesson(lessonId)
  //       setQuestions(q)
  //     } catch (error) {
  //       console.error('Error fetching questions:', error)
  //     }
  //   }

  //   fetchQuestions()
  // }, [lessonId])

  // Carga simulada
  useEffect(() => {
    setQuestions(mockQuestions)
    // Calcular monedas ganadas basadas en el número de preguntas
    setCoinsEarned(mockQuestions.length * 10) // 10 monedas por pregunta correcta
  }, [])

  const currentQuestion = questions[currentIndex]

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOptionChange = (option: string) => {
    setSelectedOption(option)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSubmit = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      // Aquí iría el POST a la API para guardar las monedas ganadas
      /*
      try {
        await apiService.addCoins(coinsEarned)
      } catch (error) {
        console.error('Error al guardar las monedas:', error)
      }
      */
      setShowResult(true)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleExit = () => {
    navigate(`/courses`)
  }

  if (questions.length === 0) {
    return <p>Cargando preguntas...</p>
  }

  if (showResult) {
    return (
      <div className={styles['quiz-container']}>
        <h1>¡Quiz completado!</h1>
        <div className={styles.result}>
          <p className={styles.score}>
            Puntuación: {score} de {questions.length}
          </p>
          <p className={styles.coins}>¡Ganaste {coinsEarned} monedas!</p>
        </div>
        <button className={styles['exit-button']} onClick={handleExit}>
          Volver a la lección
        </button>
      </div>
    )
  }

  return (
    <div className={styles['quiz-container']}>
      <h1>Quiz</h1>
      <div className={styles['question']}>
        <div className={styles['indication']}>
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
        <p>{currentQuestion.questionText}</p>
      </div>
      <div className={styles['options']}>
        {currentQuestion.options.map((opt) => (
          <label key={opt}>
            <input
              type="radio"
              name="option"
              value={opt}
              checked={selectedOption === opt}
              onChange={() => handleOptionChange(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      <button className={styles['submit-button']} onClick={handleSubmit} disabled={!selectedOption}>
        {currentIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
      </button>
    </div>
  )
}

export default LessonQuiz
