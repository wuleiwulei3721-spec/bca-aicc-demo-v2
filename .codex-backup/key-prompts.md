# Key Prompts

最后更新：2026-05-23 19:03 +08:00

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

## 2026-05-22 BankApp 客户侧接入演示

- 在 `codex/bankapp-channel-demo` 分支上新增 BankApp 客户侧模拟器，`main` 暂不受影响。
- 客户从 BankApp 内选择文字、语音或视频服务，再选择业务类型，AICC 展示路由过程，最后联动现有坐席工作台。
- 页面结构为 Customer BankApp 手机模拟器、AICC Routing timeline、Agent Desktop Outcome 三栏。
- 客户提供的 Haloapps 设计截图只作为素材来源，复制到 `public/screenshots/bankapp/` 后以 ASCII 文件名引用；页面可见命名统一为 `BankApp`，不显示 `Haloapps`。
- Text Chat 路径打开 Live Chat 并聚焦 BankApp 客户；Voice Call 路径触发现有 Inbound 来电；Video Call 路径触发现有 Video Call tab 与接听后视频浮窗。
- 第一版只做前端演示闭环，不接真实 BankApp、真实后端、真实消息网关或真实音视频协议。

## 2026-05-23 BankApp 演示交互简化重构

- BankApp Demo 当前方向改为“Customer BankApp 手机主导 + AICC Process rail 联动”，不再使用厚重的 Agent Desktop Outcome 面板。
- 页面主体左侧固定真实手机比例 `1320 / 2868`；手机旁放轻量 `AICC Process` 竖向步骤，解释当前客户身份、语言、渠道、业务和技能路由。
- 顶部控制只保留 `Customer Type`、`Language`、`Next Step`、`Reset`。
- Voice：`Voice Call -> Input Phone Number(Guest only) -> Select Business -> Confirm Business -> Calling Agent -> Connected -> PSTN / Voice Call`，坐席侧 Customer Information 渠道显示 `BankApp`。
- Video：`Video Call -> Input Phone Number(Guest only) -> Select Business -> Confirm Business -> Calling Agent -> Connected -> Video Call`，坐席侧 Customer Information 渠道显示 `BankApp`。
- Live Chat：Registered Customer 跳过 `Personal Information`，Guest 才进入 `Personal Information`；最终 `Chat Page -> Live Chat / Conversation`，坐席侧渠道显示 `BankApp`。
- `Select Business` 开始往后的页面必须由前端组件生成，便于后续改文案、语言、技能列表和业务类型。
- 接管前页面也应避免直接暴露旧品牌截图；页面可见命名统一为 `BankApp`，不显示 `Haloapps`。

## 2026-05-23 BankApp 浏览器批注调整

- 删除 BankApp Demo 页面顶部的 `Customer Simulator / BankApp Service Entry` 标题条。
- 去除 `Language` 控制和 AICC Process header 中的客户/语言摘要。
- 将 `Customer Type` 与 `Next Step` / `Reset` 移动到 AICC Process 面板内。
- AICC Process 面板不显示 `Business`、`Skill`、`Phone` 摘要，只保留当前渠道和步骤 rail。
- 渠道选择页按用户要求直接使用客户提供截图 `channel-selection.png`，Voice/Video/Livechat 三个渠道通过透明热区交互。
- 手机模拟器必须按截图比例显示，不能被视口高度压扁变宽。

## 2026-05-23 BankApp 手机放大与截图页补齐

- 手机框要按截图比例放大，高度基本撑满左侧展示面板。
- Voice/Video/Livechat 三个透明热区必须对齐截图中的真实菜单行，不能落到其它行。
- Customer Type、Next Step、Reset 在 AICC Process 内同一行展示；Customer Type 靠左，不占整行，操作按钮靠右。
- 渠道选择页、客户号码录入页、客户信息录入页都先用客户截图：
  - `channel-selection.png`
  - `voice-phone-number.png`
  - `text-login.png`
- 从 `Select Business` 开始继续使用 AICC 前端组件生成页面，便于后续改业务、技能和话术。

## 2026-05-23 BankApp 三张入口截图脱敏

- 外网演示版本不能暴露客户真实系统特征，BankApp Demo 的三张入口截图必须使用脱敏版。
- 保留原始截图文件，不删除、不覆盖；新增并引用：
  - `channel-selection-sanitized.png`
  - `voice-phone-number-sanitized.png`
  - `text-login-sanitized.png`
- 渠道选择脱敏图顶部品牌显示 `BANK 1`，只保留 `Voice Call`、`Video Call`、`Live Chat` 三个服务入口清晰可见；其它服务、底部导航、登录入口和系统特征弱化。
- 号码录入和客户信息录入脱敏图保留表单/弹窗大概形态，具体手机号、账号、客户资料和敏感文案用遮挡线表现。
- `src/mock/bankapp.ts` 只切换三张入口图路径；`Select Business` 及后续 AICC 页面继续保持组件化，不改其它界面。
- 如果以后更换脱敏图，必须保持图片尺寸比例不变，并重新检查 Voice/Video/Livechat 热区位置。

## 2026-05-23 BankApp 三渠道业务页截图脱敏

- Voice、Video、Livechat 三个渠道的 `Select Business` 和 `Confirm Business` 页面都要使用客户提供截图风格，但必须打码脱敏。
- 业务选择页新增并引用：
  - `voice-business-selection-sanitized.png`
  - `video-business-selection-sanitized.png`
  - `livechat-business-selection-sanitized.png`
- 业务确认页新增并引用：
  - `voice-business-confirm-sanitized.png`
  - `video-business-confirm-sanitized.png`
  - `livechat-business-confirm-sanitized.png`
- 脱敏原则：保留手机比例、顶部栏、宫格/弹窗形态；客户真实品牌、产品名、账号和可识别系统特征替换为 BANK 1 或通用服务类别。
- `Select Business` 保留透明业务热区，点击业务卡片进入 `Confirm Business`。
- `Confirm Business` 保留 No / Yes 透明热区，No 返回业务选择，Yes 进入 `Calling Agent`。
- 业务选择/确认之后的呼叫、连接、聊天、服务结束页面继续由前端组件生成。

## 2026-05-23 BankApp 渠道标识与条件步骤修正

- BankApp voice/video 转坐席后，Customer Information 卡片里的渠道图标必须是 BankApp 移动端图标，文字必须显示 `BankApp`。
- 普通 `Channel Simulation > Video Call` 不能因为 BankApp Video 改动而显示 BankApp，应继续显示 `Video Call` 渠道。
- Live Chat 流程只有 Guest 才需要 `Personal Information`；Registered Customer 选择 Live Chat 后直接进入 `Select Business`。
- Video Call 的客户侧 connected 通话界面运行时引用 `public/screenshots/bankapp/video-connected-new.png` 图片资源；该文件必须直接使用用户提供的视频通话截图原图，不绘制、不脱敏。
- 渠道选择脱敏图中的 `Voice Call`、`Video Call`、`Live Chat` 字体需要足够大，保证演示时客户能看清。

## 2026-05-23 BankApp Live Chat 排队与聊天截图

- 文字渠道的 `Connecting to Agent` / 排队步骤使用 `public/screenshots/bankapp/livechat-queue.png` 图片资源。
- 文字渠道的 `Chat Page` 步骤使用 `public/screenshots/bankapp/livechat-chat.png` 图片资源。
- 用户说明这两张文字渠道截图已经处理过，可以直接使用，不需要再脱敏。
- 该调整只影响 BankApp Demo 客户侧手机画面，不改变坐席端 Live Chat 工作台、Conversation mock 或消息网关逻辑。

## 2026-05-23 BankApp 附件原图与 Service Closed

- Live Chat 排队页和聊天页必须直接使用用户已处理附件原图，不允许前端重新绘制或二次脱敏。
- `public/screenshots/bankapp/livechat-queue.png` 和 `public/screenshots/bankapp/livechat-chat.png` 是从用户附件提取并落盘的原图。
- `public/screenshots/bankapp/service-closed.png` 是用户提供的满意度评价截图原图，Voice / Video / Live Chat 三条路径最终 `Service Closed` 都使用这张图。
- BankApp 演示触发坐席电话、视频或文字 workspace 时，后台打开对应 tab，但保持当前 `BankApp Demo` 激活页以展示客户侧满意度评价终态。
- 如果后续用户再次要求“截图直接用”，优先从用户附件或指定本地文件直接落盘引用，不要重绘。

## 2026-05-23 BankApp Video Connected 原图

- `public/screenshots/bankapp/video-connected-new.png` 已替换为用户本轮提供的视频通话截图原图；`video-connected.png` 仍是同内容副本，但不作为当前运行时路径。
- 该图片不需要脱敏处理，也不允许前端重新绘制。
- BankApp Video 的 `Connected` 步骤必须直接显示这张图。

## 2026-05-24 BankApp Voice Calling / Connected 原图

- `public/screenshots/bankapp/voice-calling.png` 是用户本轮提供的 Voice `Calling Agent` 附件原图。
- `public/screenshots/bankapp/voice-connected.png` 是用户本轮提供的 Voice `Connected` 附件原图。
- 这两张图片不需要脱敏处理，也不允许前端重新绘制。
- BankApp Voice 的 `Calling Agent`、`Connected` 和从坐席工作台切回 BankApp Demo 后的 `Agent Workspace` 客户侧画面必须直接显示这两张图中的对应 connected/calling 资源。

## 2026-05-24 BankApp Video Calling / Connected 原图

- BankApp Video 的 `Calling Agent` 步骤必须复用 `public/screenshots/bankapp/voice-calling.png`，即和 Voice 第四步使用同一张 calling 原图。
- `public/screenshots/bankapp/video-connected.png` 已覆盖为用户本轮提供的 Video `Connected` 附件原图。
- 运行时 `bankAppScreenshotSources.videoConnected` 指向 `public/screenshots/bankapp/video-connected-new.png`；该文件是同一张用户附件原图的新文件名副本，用于规避浏览器或 dev server 继续缓存旧同名资源。
- 该图片不需要脱敏处理，也不允许前端重新绘制。
- Video `Connected` 的既有 screen share 演示控件本轮保持不变；如果后续客户要求纯截图展示，再单独移除叠加控件。

## 2026-05-23 BankApp 步骤开发方标识

- BankApp 右侧 AICC Process rail 的步骤名称后要显示开发方标识；手机区标题行已在 2026-05-24 顶部信息减负中取消重复显示。
- `Choose Channel`、`Input Phone Number`、`Personal Information`、`Service Closed` 后显示 `BANK1`。
- 其它步骤后显示 `Netinfo`，包括 `Select Business`、`Confirm Business`、`Calling Agent`、`Connected`、`Chat Page`。
- 该标识用于演示说明页面由谁开发，不改变实际路由、坐席联动或截图引用。

## 2026-05-23 WhatsApp Demo 四步截图流程

- WhatsApp 接入的 `WhatsApp Demo` 要去除 `Customer Type` 控件。
- WhatsApp Demo 流程后续已调整为 5 步：进入客服聊天页面并要求转坐席、业务选择、排队并接入坐席进行沟通、查看坐席 Live Chat 工作台、服务结束进行满意度评价。
- WhatsApp Demo 的每一步流程标签都显示 `Bank1`，不再沿用 BankApp 的 `BANK1` / `Netinfo` 分工标识。
- 用户本轮提供的 4 张 WhatsApp 截图已经脱敏，必须直接落盘引用，不重新绘制。
- 当前落盘路径为：
  - `public/screenshots/whatsapp/chat-request.png`
  - `public/screenshots/whatsapp/business-selection.png`
  - `public/screenshots/whatsapp/agent-chat.png`
  - `public/screenshots/whatsapp/satisfaction-rating.png`
- WhatsApp Demo 第三步后点击下一步会切到 `Live Chat` 坐席工作台，并聚焦 WhatsApp mock session `live-chat-001`。
- 切回 WhatsApp Demo 时页面状态不能刷新，必须保留在 `View Agent Workspace`，再点击下一步才进入满意度评价。
- WhatsApp Demo 的 AICC Process rail 只显示已到达步骤；后续步骤不要提前显示，点击下一步后再显示当前步骤。

## 2026-05-24 BankApp Demo 同步坐席工作台策略

- BankApp Demo 也要采用 WhatsApp Demo 的“当前步骤 -> 查看坐席工作台 -> 返回继续服务结束”策略。
- 适用范围为 BankApp 的全部接入方式：Voice、Video、Live Chat。
- BankApp 保留 `Customer Type`，继续支持 Registered / Guest 分支，不按 WhatsApp 规则移除。
- BankApp 新增的 `Agent Workspace` 步骤沿用现有开发责任口径显示 `Netinfo`，不改为全 `Bank1`。
- BankApp 的 AICC Process rail 也只显示已到达步骤，后续步骤点击 `Next Step` 后再显示。
- Voice 在 `Connected` 后进入 `Agent Workspace` 并激活 `PSTN / Voice Call`；Video 激活 `Video Call`；Live Chat 激活 `Live Chat` 并聚焦 BankApp 客户。
- 从坐席工作台切回 BankApp Demo 时，页面内容不能刷新，必须保留在 `Agent Workspace`，再点击下一步才进入 `Service Closed`。

## 2026-05-24 BankApp / WhatsApp 右侧流程区优化

- BankApp Demo 和 WhatsApp Demo 右侧 AICC Process 顶部控件要统一优化。
- BankApp 右侧同一行展示可点击 `Channel`、`Customer Type`、`Next Step`、`Reset`；Channel 支持 Voice / Video / Chat 切换，并在切换后重置流程。
- WhatsApp 右侧同一行只展示只读 `Channel: chat` 与 `Next Step` / `Reset`，不显示 `Customer Type`。
- 流程到最后一步后，`Next Step` 改为禁用的 `Completed`，`Reset` 保持为唯一重新开始入口。
- 步骤 rail 不再使用蓝色/绿色强状态图标，避免和 `Bank1` / `Netinfo` badge 混淆；改为中性简洁编号 marker 和箭头连接。
- WhatsApp Demo 第四步 `View Agent Workspace` 的开发方标签要从 `Bank1` 改为 `Netinfo`，其它 WhatsApp 步骤仍为 `Bank1`。

## 2026-05-24 WhatsApp Demo Channel 文案

- WhatsApp Demo 右侧 AICC Process 的只读 Channel 值显示为小写 `chat`。
- 该文案只影响 WhatsApp Demo 右侧控件展示，不改变左侧菜单、workspace tab、截图资源或坐席侧 WhatsApp 会话渠道。

## 2026-05-24 BankApp / WhatsApp 统一画布布局

- 领导反馈原左右独立布局让手机 App 与 AICC Process 像两个不相关内容块，需要改成一个统一大画布。
- BankApp Demo 和 WhatsApp Demo 要共用统一画布：统一边框、统一背景，手机 App 图片和 AICC Process 仍左右并排。
- `AICC Process` 是 App 图片旁边的解释/流程区，不覆盖到手机截图上，也不下置为单独流程页。
- 宽屏下需要收紧手机预览列和画布最大宽度，避免 App 图片与流程区距离过大；窄屏可上下排列但仍保持在同一个容器内。
- 本轮只调整布局和视觉归属感，不改变既有流程状态、坐席工作台跳转、Completed 结束态、`Bank1` / `Netinfo` badge 或截图资源。

## 2026-05-24 BankApp / WhatsApp 顶部信息减负

- BankApp Demo 和 WhatsApp Demo 不再显示统一画布顶部 `Customer Access Demo` 标题整块。
- 手机图片区域标题行只保留 `Customer BankApp` / `Customer WhatsApp`，不再在右上角重复显示当前步骤名称和 `Bank1` / `Netinfo` badge。
- 当前步骤、开发方 badge、Next/Reset 和 Completed 终态只在右侧 AICC Process 表达。
- 保留统一大画布、左右并排关系、右侧流程 rail 和所有客户侧/坐席侧跳转逻辑。

## 2026-05-24 BankApp Video 桌面共享流程修正

- BankApp Video 的桌面共享必须从坐席侧 OpenEye 浮窗发起，不再从 BankApp connected 手机页发起。
- OpenEye 挂机按钮上方显示英文 `Desktop Share` 按钮，仅适用于 `bankapp-video` 来源，按钮背景需要保持半透明。
- 点击 `Desktop Share` 后 OpenEye 画面切换为“选择共享程序”截图；点击截图内 `确定` 后才切回 BankApp Demo。
- BankApp Demo 切回后展示客户侧查看坐席共享画面，即 `video-screen-sharing.png`。
- BankApp Video 在 `Agent Workspace` 后新增 `Select Sharing Program` 与 `View Agent Screen Sharing` 两个步骤，标签均为 `Netinfo`。
- `openeye-share-selection.png` 必须直接使用用户附件一原图，不要绘制；`video-screen-sharing.png` 必须直接使用用户附件二原图，不要绘制。
- Voice、Live Chat、WhatsApp 和普通 Video Call 不应继承 BankApp Video 的桌面共享入口或新增步骤。
- Reset、Hang Up、关闭 Video Call tab、签出/AUX、非 BankApp Video 呼叫必须清理共享状态。

## 2026-05-24 客户远程演示状态机制

- 客户要求右上角坐席状态圆点不能只看坐席菜单状态，还要体现是否已有客户接入。
- Unsigned 显示灰色。
- Ready 且没有任何客户接入时显示绿色；绿色仅表示坐席已准备好但尚无电话、视频或文字客户互动。
- 电话、语音、视频、聊天等任一客户接入时显示红色忙碌；电话/视频从 Incoming 即算接入，直到 Hang Up。
- AUX / Not Ready / ACW 且无客户互动时显示黄色离开。
- Live Chat 登录后默认无客户接入，显示 `No active conversation` 空态。
- BankApp Live Chat 入口触发后才把 BankApp 客户 `live-chat-002` 加入 Live Chat active sessions。
- WhatsApp Demo 入口触发后才把 WhatsApp 客户 `live-chat-001` 加入 Live Chat active sessions。
- End Service 只关闭当前文字 active session；如果没有其它 active sessions，状态点回到绿色。
- Webchat mock 数据暂时保留但不可见，不显示 Webchat 客户或筛选项，直到后续新增 Webchat 入口。

## 2026-05-24 话务条 Incoming Identification

- 客户要求在话务条位置展示 incoming identification，让坐席确认接入来源来自 IVR 还是 Halo Apps / BankApp CTI。
- PSTN / IVR 呼入显示 `IVR: 08123456789`。
- BankApp Voice / Video 呼入显示脱敏后的 `BankID: 00012345`；不要使用 `BCAID`，避免出现 BCA 字样。
- 识别信息从 `Incoming` 阶段开始显示，`Talking`、`Hold`、`Mute` 继续显示，Hang Up 后隐藏。
- 只改话务条，不改 Customer Information 电话号码、Contact Management 或外呼申请按钮。
- BankApp / WhatsApp Live Chat 文字接入不显示 IVR/BankID，因为没有电话/视频话务条接入识别需求。

## 2026-05-24 话务条 Identification 样式与 Settings

- Incoming identification 固定放在动作按钮组最左侧；Incoming 时在 Answer 左侧，Talking/Hold/Mute 时在 Hold 左侧。
- 展示文案不加冒号：`IVR 08123456789`、`BankID 00012345`。
- 不使用背景框、边框或圆角 pill；只用纯文本和右侧竖线分隔，保持和状态时长一致的克制风格。
- 重新开放话务条 More > Settings。
- Settings 只保留 Toolbar display：`Icon + Text` / `Icon Only`，默认 `Icon + Text`。
- `Icon Only` 隐藏话务按钮文字，但保留图标、`aria-label` 和 `title`。
- 自动接听/振铃时长设置在 UI 中隐藏，默认 3 秒逻辑保留。

## 2026-05-23 版本与素材策略

- 后续按里程碑分支推进：`v0.3.0` BankApp 基线、`v0.3.1` 菜单与 WhatsApp、`v0.4.0` Video screen share、`v0.5.0` 客户远程演示优化。
- `main` 作为生产演示分支，合入后打 tag 冻结版本。
- 仓库内只保留脱敏或明确可分享素材；明显未脱敏或旧版原始截图已迁出 `public/screenshots/bankapp/`，避免误提交。
- `v0.3.1` 左侧菜单只显示 `Channel Simulation > PSTN / BankApp / WhatsApp`，普通 `Video Call` 和 `Live Chat` 菜单入口隐藏但底层能力保留。
- WhatsApp 模拟器当前已从初版 BankApp 复用壳升级为 WhatsApp 专用五步流程，默认 Live Chat，并在 handoff 时聚焦 WhatsApp mock session `live-chat-001`。
- `v0.4.0` Video screen share 是前端 demo-only 状态：BankApp Video connected 页 Start/Stop，OpenEye 浮窗同步显示共享预览，Hang Up/关闭 Video tab/Reset 清理状态。
- GitHub Actions CI 需要在 PR 到 `main` 或 push 到 `main` / `codex/**` 时运行 `npm ci`、`npm run lint`、`npm run build`。

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



