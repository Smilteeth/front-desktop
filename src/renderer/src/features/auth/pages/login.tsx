import { useState, FormEvent } from 'react'
<<<<<<< HEAD
import { Link } from 'react-router-dom'
import heroImage from '@renderer/assets/images/dentalDesign.svg'
=======
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginCredentials } from '../types/authTypes'
import { validateEmail } from '@renderer/utils/validators'
import { isFormFilledService } from '../services/isFormFilled'
import heroImage from '@renderer/assets/images/dentalDesign.png'
>>>>>>> a4a7ab5f26c9375243372c71b90ed8a4ed4f2af6
import InputForm from '@renderer/components/inputForm'
import Button from '@renderer/components/button'
import styles from '../styles/login.module.css'

const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
<<<<<<< HEAD

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    try {
      // Inicio de sesión (simulado)
      console.log('Iniciando sesión con:', { email, password })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
=======
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loginError, setLoginError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setErrors({})
    setLoginError(null)

    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }

    const credentials: LoginCredentials = { email, password }

    try {
      const loginResult = await login(credentials)

      console.log('localStorage authToken:', localStorage.getItem('authToken'))
      console.log('localStorage authExpiration:', localStorage.getItem('authExpiration'))
      console.log('localStorage userType:', localStorage.getItem('userType'))

      if (loginResult.userType === 'DENTIST') {
        const isFormFilled = await isFormFilledService()
        if (isFormFilled.isFormFilled == false) {
          navigate('/formDentist')
          return
        }
        navigate('/dentistDashboard')
      } else if (loginResult.userType === 'FATHER') {
        navigate('/profile-selection')
      } else {
        setLoginError('Tipo de usuario no reconocido')
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'

      if (errorMessage.includes('Authentication failed: 400')) {
        setLoginError('Datos de login inválidos')
      } else if (errorMessage.includes('Authentication failed: 401')) {
        setLoginError('Correo o contraseña incorrectos')
      } else if (errorMessage.includes('Authentication failed: 403')) {
        setLoginError('Acceso denegado')
      } else if (errorMessage.includes('Authentication failed: 404')) {
        setLoginError('Usuario no encontrado')
      } else if (errorMessage.includes('Authentication failed: 500')) {
        setLoginError('Error del servidor. Intenta más tarde')
      } else if (
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('Failed to fetch')
      ) {
        setLoginError('Error de conexión. Verifica tu internet')
      } else if (errorMessage.includes('Tipo de usuario no reconocido')) {
        setLoginError('Tipo de usuario no reconocido')
      } else {
        setLoginError('Error de conexión. Verifica tu internet e inténtalo de nuevo')
      }
>>>>>>> a4a7ab5f26c9375243372c71b90ed8a4ed4f2af6
    }
  }

  return (
    <div className={styles.container}>
      {/* Sección hero/imagen */}
      <section className={styles.heroSection}>
        <img src={heroImage} alt="Ilustración dental" className={styles.heroImage} />
      </section>

      {/* Sección de formulario */}
      <section className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h1 className={styles.formTitle}>¡Bienvenido de nuevo!</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <InputForm
                label={'Correo electrónico'}
                name={'email'}
                type={'email'}
                value={email}
                placeholder={'Ingrese su correo electrónico'}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
              <InputForm
                label={'Contraseña'}
                name={'password'}
                type={'password'}
                value={password}
                placeholder={'Ingrese su contraseña'}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />

              <div className={styles.forgotPassword}>
                <Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>

            <div className={styles.actionGroup}>
              <Button name={'Iniciar sesión'} type={'submit'} />
              <p className={styles.registerPrompt}>
                ¿Aún no tienes cuenta?{' '}
                <Link to="/singup" className={styles.registerLink}>
                  <u>Crea una</u>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Login
