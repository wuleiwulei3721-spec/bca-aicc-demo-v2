import {
  ApartmentOutlined,
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
  extension: string
  password: string
  username: string
}

const initialFormState: LoginFormState = {
  extension: '',
  password: '',
  username: '',
}

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [formState, setFormState] =
    useState<LoginFormState>(initialFormState)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!username) {
      setErrorMessage('User Name is required.')
      return
    }

    if (!password) {
      setErrorMessage('Password is required.')
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
        password: '',
      }))
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
