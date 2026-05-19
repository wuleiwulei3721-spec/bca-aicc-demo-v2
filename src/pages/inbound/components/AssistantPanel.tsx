import { ApiOutlined, RobotOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import { EmbeddedPlaceholder } from './EmbeddedPlaceholder'

export function AssistantPanel() {
  return (
    <div className="inbound-right-panel">
      <Tabs
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
      />
    </div>
  )
}
