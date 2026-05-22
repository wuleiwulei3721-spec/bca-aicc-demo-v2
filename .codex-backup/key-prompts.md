# Key Prompts

最后更新：2026-05-22 18:55 +08:00

## 项目方向

- 创建一个企业级前端 Demo 工程，项目名称为 `bca-aicc-demo-v2`。
- 当前阶段禁止生成业务页面，只允许生成基础工程与通用布局。
- 使用 React、TypeScript、Vite、Ant Design、React Router、Zustand、Less。
- 构建银行 AICC 坐席工作台风格，而不是营销型页面。

## Inbound 工作台

- 创建 Inbound 电话来电弹屏页面，页面所有内容使用英文展示。
- 优化当前 Inbound 页面 UI，提升整体信息密度，像企业级银行 AICC 工作台。
- 页面采用三栏布局：客户信息与业务记录、CRM 工作区、Assistant 区域。
- Ready 状态触发 Incoming 后自动打开 Inbound tab。
- Inbound tab 可关闭。

## 状态机与工具条

- 重新实现顶部 Header 中的话务条与坐席状态逻辑。
- 严格按照真实 AICC 坐席状态机与话务状态机实现。
- Agent Toolbar 与 Agent State 分离。
- Toolbar 负责 Answer、Hold、Mute、Transfer、Hang Up、More。
- 坐席状态菜单负责 Ready、Not Ready、AUX、Sign Out。
- 增加 Agent Toolbar 与 Inbound 页面之间的联动逻辑。

## 功能弹窗

- 新增 Transfer Modal。
- 新增 Outbound Call Modal。
- 新增 Internal Chat Modal。
- 新增 Toolbar Settings Modal。
- 新增 Call Flow Detail Modal。
- 新增 Send Email Modal。

## 设计系统

- 正式建立统一 UI Design System 与公共组件体系。
- 后续 Online Chat、Video Call、Dashboard、Admin、Supervisor 等页面必须复用 Design System。

## 本地化与截图

- Demo Enhancement & Localization：Customer Verification、Ticketing History、Next Best Action 改为印尼语。
- CRM 与 Assistant 区域替换为真实系统截图，保持当前页面比例，不撑高布局。

## 2026-05-21 品牌与 Surface Hierarchy

- 系统可见品牌统一替换为 `BANK 1`，不允许出现旧品牌字样或 Logo。
- 适用范围包括 Header、页面标题、Browser Title、mock data、CRM 区域、Assistant 区域、tabs 和所有显示文案。
- 重新建立 Enterprise Workspace Surface Hierarchy：
  - L0 App Background。
  - L1 Workspace Surface。
  - L2 Card Surface。
  - L3 Modal Surface。
  - L4 Header / Active Surface。
- Modal 必须是轻量企业 Workspace 浮层，不要像独立页面；Header 降低高度，Header/Body/Section 通过浅背景、间距和轻 divider 区分。
- 避免大白框、大标题、重边框、灰蓝混乱、层级模糊和过强 UI 设计感。
- 旧 CRM/Assistant 截图含旧品牌内容，本轮停止加载公开截图，改为代码内 BANK 1 fallback；如恢复截图，必须先提供已脱敏资源。

## 2026-05-21 主 Workspace 视觉纠偏

- 当前版本 Workspace 视觉重构方向错误，必须先恢复主页面原有稳定视觉。
- 保留 `BANK 1` 品牌替换，不恢复旧品牌字样或 Logo。
- 恢复顶部蓝色渐变 Header、旧版 Workspace 背景、Customer Information 卡片层级、Toolbar 风格，以及 Ticketing History、Next Best Action、Customer Journey 等主页面卡片风格。
- 本轮不要继续优化或调整 Modal/Dialog；后续如需处理 Modal，需要另起明确需求。

## 2026-05-21 CRM/Assistant 截图恢复

- CRM 和 Assistant 区域必须优先显示客户提供的截图资源。
- 截图文件当前放置在 `public/screenshots/crm-workspace.jpg` 和 `public/screenshots/assistant-workspace.jpg`。
- 组件应保留截图加载失败时的代码 fallback，避免截图资源缺失导致空白。
- 截图必须完整等比放在对应面板内，不裁切、不变形、不拉伸或撑大页面布局。

## 2026-05-21 Live Chat 实时文字聊天

- 新增实时文字聊天功能，客户可通过 WhatsApp、Haloapps、webchat 等文字渠道联系坐席。
- 坐席点击右上角 `Sign In` 后具备接收实时聊天渠道客户的技能；签入后 Home 旁增加固定 `Live Chat` tab，且不可关闭。
- Live Chat 页面应基于语音来电弹屏内容扩展，必须复用现有 Inbound/InteractionWorkspace 组件，不复制一整套代码。
- Live Chat 页面在原三栏左侧增加类似微信客户端的客户列表；客户列表要支持收起/展开，右侧继续保持 Customer Information、CRM workspace、Assistant 三栏。

## 2026-05-22 Live Chat Conversation 页签

- 在 Live Chat 的 CRM 工作区中，`CRM` 右侧新增固定不可关闭的 `Conversation` tab。
- `Conversation` tab 顶部左侧显示当前客户名称，右侧提供 `Transfer` 与 `End Service` 操作；`Invite` 已从顶部移除。
- `End Service` 点击后必须二次确认是否结束服务，确认后关闭当前客户会话。
- `Conversation` tab 中部展示客户与其它坐席的历史会话记录，并随左侧客户列表选中客户联动切换。
- `Conversation` tab 下方提供发送信息框，底部包含表情、文件和发送按钮。

## 2026-05-22 Conversation Transfer 文案与操作

- Conversation 顶部 `Transfer` 使用共享 `TransferModal` 的 `conversation` 变体。
- Conversation Transfer 弹框不显示 `Transfer Number` 页签，只显示 `Transfer Agent` 与 `Transfer Skill`。
- `Transfer Agent` 默认只显示 `Request Transfer`、`Request Conference` 和更多下箭头；下拉菜单提供 `Force Transfer`、`Force Conference`。
- 文字渠道邀请语义在 Transfer 弹框内统一为 `Conference`，不再使用 `Invite` 作为 Agent 行动作文案。
- 话务条 Transfer 弹框保持原 `Consult` / `Transfer` / `Conference` 与三页签行为。
- 话务条 Transfer 弹框的 `Consult` / `Transfer` / `Conference` 必须保持同一行，不允许因为 Conversation 专用动作收纳影响 call 变体。

## 上下文恢复

- 停止继续修复 UI/sidebar/cache，改为从 rollout session 文件恢复开发上下文。
- 从现在开始为当前项目建立长期开发上下文管理机制。
- 避免未来因为 sidebar 丢失、session 消失、切换账号、Codex UI bug 导致开发上下文丢失。
- 每次完成页面、需求、架构、接口或重要 prompt 修改后，自动更新 `PROJECT_CONTEXT.md` 和 `DEV_LOG.md`。
- 每次重大修改后，在 `.codex-backup/` 生成 context snapshot、当前 TODO、当前页面状态。

## 项目级 AI 开发规则

- 创建 `AGENTS.md`，让未来所有 Codex 会话自动继承项目开发规范，而不是只存在当前聊天上下文。
- 任何新 Codex 会话进入当前项目时，必须先阅读 `AGENTS.md`、`PROJECT_CONTEXT.md`、`DEV_LOG.md`，再开始开发。
- 以后每次修改页面、组件、接口、prompt、完成功能或修复 bug，必须自动更新 `PROJECT_CONTEXT.md` 和 `DEV_LOG.md`。
- 每次重大修改后，必须在 `.codex-backup/` 自动生成 context snapshot、当前 TODO、当前页面状态。
- 如果 session、sidebar、history 丢失，或更换账号、Codex UI 异常，必须优先扫描 `.codex/sessions` rollout，恢复项目上下文并更新 `PROJECT_CONTEXT.md`，而不是重新从零分析项目。
- 重大修改后的输出必须总结修改内容、影响范围、风险点和 TODO。



