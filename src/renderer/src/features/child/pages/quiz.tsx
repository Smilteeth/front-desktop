/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../styles/quiz.module.css'
import { courseService } from '../services/apiService'
import BackButton from '@renderer/components/backButton'

interface Question {
  questionId: number
  question: string
  answers: {
    questionId: number
    answer: string
    isCorrect: boolean
  }[]
}

const LessonQuiz: React.FC = () => {
  const navigate = useNavigate()
  const { lessonId } = useParams<{ lessonId: string }>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!lessonId) return
        const q = await courseService.getQuestionsForLesson(Number(lessonId))
        setQuestions(q)
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }
    fetchQuestions()
  }, [lessonId])

  const currentQuestion = questions[currentIndex]

  const handleOptionChange = (option: string) => {
    setSelectedOption(option)
  }

  const handleSubmit = () => {
    const correct = currentQuestion.answers.find(ans => ans.answer === selectedOption && ans.isCorrect)
    if (correct) {
      setScore(prev => prev + 1)
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
    } else {
      setShowResult(true)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleExit = () => {
    navigate(`/courses`)
  }

  if (questions.length === 0) {
    return (
      <div className={styles['quiz-container']}>
        <BackButton />
        <p>Cargando preguntas...</p>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className={styles['quiz-container']}>
        <BackButton />
        <h1>Quiz completado</h1>
        <div className={styles.result}>
          <p className={styles.score}>Puntuación: {score} de {questions.length}</p>
          <p className={styles.coins}>Ganaste {score} monedas</p>
        </div>
        <button className={styles['exit-button']} onClick={handleExit}>Volver a los cursos</button>
      </div>
    )
  }

  return (
    <div className={styles['quiz-container']}>
      <BackButton />
      <h1>Quiz</h1>
      <div className={styles['question']}>
        <div className={styles['indication']}>
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
        <p>{currentQuestion.question}</p>
      </div>
      <div className={styles['options']}>
        {currentQuestion.answers.map((opt) => (
          <label key={opt.answer}>
            <input
              type="radio"
              name="option"
              value={opt.answer}
              checked={selectedOption === opt.answer}
              onChange={() => handleOptionChange(opt.answer)}
            />
            {opt.answer}
          </label>
        ))}
      </div>
      <button
        className={styles['submit-button']}
        onClick={handleSubmit}
        disabled={!selectedOption}
      >
        {currentIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
      </button>
    </div>
  )
}

export default LessonQuiz

