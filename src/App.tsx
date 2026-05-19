import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { antdTheme } from './styles/theme'

function App() {
  return (
    <ConfigProvider locale={enUS} theme={antdTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
