import { ApiOutlined, RobotOutlined } from '@ant-design/icons'
import { BaseTabs } from '../../../components'
import { EmbeddedPlaceholder } from './EmbeddedPlaceholder'

export function AssistantPanel() {
  return (
    <div className="inbound-right-panel">
      <BaseTabs
        className="inbound-assistant-tabs"
        defaultActiveKey="assistant"
        items={[
          {
            key: 'assistant',
            label: (
              <span>
                <RobotOutlined />
                Assistant
              </span>
            ),
            children: (
              <EmbeddedPlaceholder label="Come from Agent Assistant" />
            ),
          },
          {
            key: 'connection',
            label: (
              <span>
                <ApiOutlined />
                Connection
              </span>
            ),
            children: (
              <EmbeddedPlaceholder label="Come from Agent Assistant" />
            ),
          },
        ]}
        variant="assistant"
      />
    </div>
  )
}
