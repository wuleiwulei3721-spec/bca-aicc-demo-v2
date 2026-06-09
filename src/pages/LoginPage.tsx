import {
  ApartmentOutlined,
  KeyOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Input } from 'antd'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseButton } from '../components'
import { useAuthStore } from '../store'

interface LoginFormState {
  captcha: string
  extension: string
  password: string
  username: string
}

const initialFormState: LoginFormState = {
  captcha: '',
  extension: '',
  password: '',
  username: '',
}

function createCaptchaCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [formState, setFormState] =
    useState<LoginFormState>(initialFormState)
  const [captchaCode, setCaptchaCode] = useState(createCaptchaCode)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const refreshCaptcha = () => {
    setCaptchaCode(createCaptchaCode())
    setFormState((current) => ({
      ...current,
      captcha: '',
    }))
  }

  const updateFormField = (key: keyof LoginFormState, value: string) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }))
    setErrorMessage('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const username = formState.username.trim()
    const password = formState.password
    const extension = formState.extension.trim()
    const captcha = formState.captcha.trim()

    if (!username) {
      setErrorMessage('User Name is required.')
      return
    }

    if (!password) {
      setErrorMessage('Password is required.')
      return
    }

    if (!captcha) {
      setErrorMessage('PIN is required.')
      return
    }

    if (captcha !== captchaCode) {
      setErrorMessage('PIN is incorrect. Please enter the displayed code.')
      refreshCaptcha()
      return
    }

    setIsSubmitting(true)
    const result = login({
      extension,
      password,
      username,
    })
    setIsSubmitting(false)

    if (!result.ok) {
      setErrorMessage(result.message)
      setFormState((current) => ({
        ...current,
        captcha: '',
        password: '',
      }))
      setCaptchaCode(createCaptchaCode())
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <main className="aicc-login-page">
      <section className="aicc-login-visual" aria-label="BANK 1 login brand">
        <div className="aicc-login-visual__brand">BANK 1</div>
        <img
          alt=""
          aria-hidden="true"
          className="aicc-login-illustration"
          src="/screenshots/login-illustration.svg"
        />
      </section>

      <section className="aicc-login-card" aria-label="AICC login form">
        <div className="aicc-login-card__header">
          <span>Omni Channel AI Contact Center</span>
          <h1>Login</h1>
        </div>

        <form className="aicc-login-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <Alert
              className="aicc-login-form__alert"
              message={errorMessage}
              showIcon
              type="error"
            />
          )}

          <Input
            autoComplete="username"
            className="aicc-login-form__input"
            placeholder="User Name"
            prefix={<UserOutlined />}
            size="large"
            value={formState.username}
            onChange={(event) =>
              updateFormField('username', event.target.value)
            }
          />
          <Input.Password
            autoComplete="current-password"
            className="aicc-login-form__input"
            placeholder="Password"
            prefix={<LockOutlined />}
            size="large"
            value={formState.password}
            onChange={(event) =>
              updateFormField('password', event.target.value)
            }
          />
          <Input
            autoComplete="off"
            className="aicc-login-form__input"
            placeholder="EXT"
            prefix={<ApartmentOutlined />}
            size="large"
            value={formState.extension}
            onChange={(event) =>
              updateFormField('extension', event.target.value)
            }
          />
          <div className="aicc-login-form__captcha-row">
            <Input
              autoComplete="off"
              className="aicc-login-form__input"
              inputMode="numeric"
              maxLength={6}
              placeholder="PIN"
              prefix={<KeyOutlined />}
              size="large"
              value={formState.captcha}
              onChange={(event) =>
                updateFormField('captcha', event.target.value)
              }
            />
            <button
              aria-label={`Current PIN ${captchaCode}. Click to refresh PIN`}
              className="aicc-login-form__captcha"
              type="button"
              onClick={refreshCaptcha}
            >
              <span>{captchaCode}</span>
            </button>
          </div>

          <BaseButton
            block
            className="aicc-login-form__submit"
            htmlType="submit"
            loading={isSubmitting}
            variant="primary"
          >
            Login
          </BaseButton>
        </form>
      </section>
    </main>
  )
}
