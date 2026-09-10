import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { RouterProvider } from 'react-router-dom'
import { OperationFeedbackProvider } from './contexts/operationFeedback'
import { router } from './routes'
import { antdTheme } from './styles/theme'

function App() {
  return (
    <ConfigProvider locale={enUS} theme={antdTheme}>
      <OperationFeedbackProvider>
        <RouterProvider router={router} />
      </OperationFeedbackProvider>
    </ConfigProvider>
  )
}

export default App
