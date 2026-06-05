# Key Prompts

最后更新：2026-06-05 11:53 +08:00

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

## 2026-06-03 Skill Routing Rules 拆分规则维护

- 技能路由规则新增不是单条录入，而是按启用路由要素组合拆分生成多条规则。
- Skill Routing Rules 查询条件使用当前启用路由要素多选、Target Skill Queue、Status，不使用 Keyword / Rule ID 作为查询框；启用路由要素下拉不提供 All / Empty，空选择即不限制。
- Skill Routing Rules 列表展示 Rule ID、当前启用路由要素独立列、Target Skill Queue、Updated Date、Updated By、Status、Actions。
- Batch Add 下方表应展示 `Duplicate Routing Rules`，只展示当前选择组合中已存在的重复规则；新组合仍正常创建，但不在重复规则表中展示。
- 普通规则状态只展示 Enabled / Disabled；空路由要素展示为空，不显示 `ANY`。
- 单行 Edit 只能修改 Target Skill Queue 和 Status；Status 使用短胶囊 switch + Enabled/Disabled 文案，不使用下拉框；Priority 仅保留为内部默认值，不在页面展示。
- 多字段规则表格如启用横向滚动，Actions / 操作列必须固定在右侧，横向滚动只作用于非操作列。

## 2026-06-04 Channel Type And Channel Management Refactor

- UI pages, menus, modal titles, field labels, buttons, validation messages, and mock display text must use English.
- `Channel Type` is an engineering-defined and license-controlled dictionary / field template, not a business-maintained runtime form builder.
- `Channel` is the concrete access configuration. If Email server, port, protocol, or security differs, create separate Email channels under the Email channel type.
- `Channel Account` is one or more official service accounts under a Channel. If Instagram shares one access configuration but has multiple official accounts, keep one Instagram Channel and add multiple accounts.
- `Channels` must not allow business users to add or delete channels. It may edit Media Type, Status, concrete technical access parameters, Business Config, and Account Management.
- `Access Accounts` standalone menu is removed; accounts are managed inside `Channels > Account Management`.
- `Media Service Rule Plans` menu is removed; business service configuration is managed inside `Channels > Business Config`.
- Queue configuration belongs to `Skill Queues`, not Media Service Rule Plans.

## 2026-06-03 Working Time Plans 印尼排班口径

- 本项目暂按印尼单国家场景处理，`Working Time Plans` 不展示或维护 `timezone`；后续如扩展多国家/多时区，再把时区加回工作时间方案层。
- `Working Time Plans` 只维护自定义方案，不维护真实 `Default 24x7` 记录。
- `Skill Queues` 的 `Work Time Plan` 非必填；空值必须在列表、详情和弹框中明确显示为 `Default 24x7`，不能让用户误以为空白漏配。
- 弹框必须分为 Basic Info、Work Schedule、Ramadan Work Schedule、Holiday Schedule、Special Working Plan。
- 列表字段当前为 Plan ID、Plan Name、Description、Updated Date、Updated By、Status、Actions；Work Schedule 和 Ramadan Period 不在列表展示。
- 弹框分区仍保留普通卡片容器；排班行本身不要每行外边框、卡片背景或横向分隔线。
- Work/Ramadan/Holiday/Special 的 Add 按钮放在分区标题右上角；按钮文案使用 `Add`，不使用 `Add Row`；Ramadan 未启用时不显示 Add。
- 多行排班只第一行显示字段名，后续行不重复显示字段名。
- Holiday Schedule 不展示 `Closed` / `Closed All Day` 开关；字段为 Start Date、End Date、Holiday Name、Start、End。Holiday 表示非工作覆盖，全天非工作可用 `00:00-23:59` 表达。
- Working Time Plans 弹框底部只展示优先级：`Priority: Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule.`；不要在该页解释 Skill Queue 未选择方案时的 `Default 24x7`。
- Holiday / Special 排班行列宽使用 `150px 150px minmax(360px, 1fr) 120px 120px 30px`，让 Holiday Name / Reason 吃掉剩余空间，使 Start/End 时间列与 Work/Ramadan 排班行对齐。
- Ramadan、Holiday、Special 的日期字段使用 AntD DatePicker，避免浏览器原生日期控件跟随系统语言显示中文。
- Ramadan Work Schedule 放在 Work Schedule 后面；一个方案配置一个 Ramadan date range，日期段下配置工作日多选和时间范围，支持 Copy from Work Schedule。
- 运行时优先级口径：未选择工作时间方案时直接 Default 24x7；选择自定义方案后按 Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule 判断；已选择方案但不命中工作规则时为非工作时间。
- Holiday Schedule 表示非工作覆盖；Special Working Plan 表示临时开工、加班或节假日营业等最高优先级覆盖。
- 自定义方案至少需要一条 Work Schedule；Ramadan 启用后必须配置日期段和 Ramadan 工作时间；日期、时间范围必须合法。
- 被 Skill Queue 引用的 Working Time Plan 不能直接删除，只能先解除引用或禁用。

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

## 2026-05-25 Live Chat 新接入可见性与已读状态

- Live Chat 新 active session 进入时，workspace `Live Chat` tab 必须短闪约 5 秒；即使当前已经停留在 Live Chat tab，也要闪烁。
- Live Chat 客户列表新客户接入时，active 和 inactive 客户项的 flash 样式应一致，使用浅 amber 背景、细边框/内阴影，不改变行高、头像或筛选器布局。
- Conversation header 中客户姓名旁边的实时 timer 必须随 SLA 状态变色：normal 灰色，warning amber，breach red；图标和时间文字一起变色。
- 点击/激活某个 Live Chat customer 后，该 session 的 unread badge 必须清零；坐席发送消息后继续保持已读。
- 已读状态需要存入 `appStore.readLiveChatSessionIds`，不能只放在 LiveChatPage 本地 state，因为切到 BankApp Demo / WhatsApp Demo 时 LiveChatPage 会卸载。
- End Service、Sign Out、AUX 或关闭 Live Chat 时应清理对应 active session timing 和已读状态。
- SLA marker 的白色边框保持 `1px`，避免收起态头像右下角标识过厚。

## 2026-05-25 Live Chat 闪烁范围与 SLA 颜色

- Live Chat 新 active session 的 tab flash 应覆盖整个 workspace tab item 背景范围，不只包住 `Live Chat (mm:ss)` 文字 label。
- PSTN / Voice Call / Video Call 的既有 interaction tab flash 继续保持原行为，不因 Live Chat tab 视觉优化而改变。
- Live Chat 客户列表 flash overlay 必须贴合整行 item 边界，使用 `inset: 0` 与 `border-radius: inherit`，避免出现中间小框。
- Live Chat SLA warning / breach 颜色需要在 tab duration、客户列表 duration、Conversation timer、SLA marker 和左侧 accent 中统一。
- 当前 Live Chat SLA token：warning `#f59e0b`，breach `#f04438`；不使用大面积红黄背景，只提升计时和提示边框识别度。

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
- 话务条 identification 右侧 divider 和 timer 左侧 divider 必须清晰一致，当前使用 1px `rgba(86, 122, 166, 0.52)`。
- `IVR` / `BankID` 标签和 timer label 统一为灰色 metadata 文本，号码和 timer value 统一为黑色 700 和 tabular nums；避免话务条一块粗一块细、一块灰一块黑。
- Settings 的 Toolbar display 选择控件必须使用项目自定义 segmented button 风格，视觉参考 BankApp Customer type，不使用 Ant Design 默认 `Segmented` 外观。
- Settings 弹框只保留一行 `Toolbar display` + 横向选择控件，不显示解释文案。
- `Icon Only` 模式下话务按钮应是统一 29px 方形，按钮图标和 More 图标放大到 14px；默认 `Icon + Text` 不受影响。
- More 菜单作为 Settings 入口，应按点击打开，不依赖 hover。

## 2026-05-25 交互页签与 Live Chat 计时/SLA/短闪

- 客户要求交互页签按来源展示名称和持续时间：PSTN 呼入显示 `PSTN (mm:ss)`，BankApp Voice 显示 `Voice Call (mm:ss)`，Video Call 显示 `Video Call (mm:ss)`。
- Live Chat 有 active session 时显示 `Live Chat (mm:ss)`，取当前 active sessions 中最长持续时间；无客户接入时只显示 `Live Chat`。
- 新交互进入且当前不在对应 workspace tab 时，tab 轻微短闪约 5 秒；不能改变 `inbound`、`video-call`、`live-chat` 等 tab key。
- Live Chat 客户列表也需要展示每个 active customer 的持续时间，格式为 `lastMessageTime · mm:ss`。
- Live Chat SLA 本阶段固定为 60 秒 warning、120 秒 breach；展开态用左侧细 accent 和 duration 颜色表达，收起态用渠道 icon 小角标表达。
- Live Chat 新客户进入列表时短闪约 5 秒；End Service 后移除该 session 的 runtime timing，没有 active sessions 时状态和 Live Chat tab duration 回到空态。
- `ConversationWorkspace` 的头部计时必须与客户列表和 workspace tab 使用同一份 runtime timing，不能各自 setInterval 单独计算。
- 本轮不做多路 PSTN 并发架构改造，不改 BankApp/WhatsApp/Video 客户侧流程，不重新开放 Webchat。

## 2026-05-25 Live Chat 计时与 Tab 视觉清理

- Workspace tab label 必须统一结构和视觉间距；Home、BankApp Demo、WhatsApp Demo、Live Chat、PSTN、Voice Call、Video Call 的图标与文字距离保持一致。
- BankApp / WhatsApp Live Chat 模拟客户接入时，tab、客户列表和 Conversation header 的运行计时从新接入 `00:00` 开始，不再用 mock `accessDuration` 回推。
- Live Chat 客户列表始终显示每个 active customer 的运行 duration，即使只有一个客户也显示，避免规则忽有忽无。
- Customer Information 中的 `accessDuration` 语义保留为客户从渠道接入、排队、转坐席成功前的静态耗时；展示上合并到渠道标签内，例如 `PSTN · 05:23`、`BankApp · 02:11`、`WhatsApp · 00:48`。
- Customer Information 不再额外显示独立时钟图标和单独 duration 文本，减少 Live Chat 页面里的重复时间感。
- Live Chat SLA warning 仍为 60 秒，但颜色应使用更明确的 amber/yellow；breach 仍为 120 秒红色。
- Hang Up 后保留旧弹屏并为新呼叫创建新弹屏 tab 的多 inbound 架构不放入 v0.5.6，后续单独规划 `v0.6.0`。

## 2026-05-25 多 Inbound 弹屏与通话 Tab 架构

- v0.6.0 覆盖 PSTN、BankApp Voice、BankApp Video：Hang Up 后当前弹屏 tab 保留，duration 停止并冻结；新呼叫进来时创建新的 workspace tab，不覆盖旧 tab。
- Live Chat 不纳入多 workspace tab 重构，继续保持固定 `Live Chat` tab 与多客户列表模式。
- 通话实例使用 `CallInteraction` 模型：`id`、`tabKey`、`kind`、`source`、`title`、`startedAt`、`endedAt`、`flashUntil`、`phase`。
- tab key 使用稳定递增格式：`call-1`、`call-2`、`call-3`。
- Running tab 显示实时 duration：`PSTN (00:12)`、`Voice Call (00:12)`、`Video Call (00:12)`；ended tab 冻结原标题和最终时长，不增加 `Ended` 文案。
- 当前 active call tab 在 Hang Up 前不可关闭；Hang Up 后变为可关闭。
- 话务条和右上角状态点只跟当前 active call 联动；旧 ended tab 被选中查看时，不回放旧通话状态，也不让状态点保持红色。
- `InboundPage` / `VideoCallPage` 必须接收 interaction source，不再读取全局单例 source，避免旧 tab 客户资料被新呼叫覆盖。
- OpenEye 浮窗和 BankApp Video desktop share 只绑定当前 active video interaction；ended video tab 不显示浮窗。
- 本轮仍只支持同一时间一路 active call，不支持多路电话/视频同时由话务条控制。

## 2026-05-25 通话接入阻塞提示

- 当前限制继续保持：电话、BankApp Voice、BankApp Video 同一时间只能有一路未挂断通话。
- 如果当前 PSTN / BankApp Voice / BankApp Video 还没有 Hang Up，再触发 PSTN 或普通 voice/video 接入，应显示可见提示，而不是静默无响应。
- PSTN 左侧菜单入口在被未挂断通话阻塞时显示顶部轻量提示：`Active call in progress. Please hang up before accepting another voice or video interaction.`。
- BankApp Voice / Video 在 `Connected -> Agent Workspace` handoff 前先检查当前未结束通话；被阻塞时停留在 BankApp 当前步骤，不调用 `requestBankAppVoiceCall()` / `requestBankAppVideoCall()`，不进入 `agent-workspace`。
- BankApp inline warning 文案：`Please hang up the current call before routing this interaction to Agent Workspace.`。
- BankApp Live Chat / WhatsApp Live Chat 不受该限制影响，仍可在固定 Live Chat tab 内接入。
- 本轮不新增多路同时 active call，也不改变 `CallInteraction` 多 tab 保留架构；只是让现有限制可见。

## 2026-05-25 Ready-aware 通话接入提示

- 仅提示“先挂机”不完整，因为 Hang Up 后坐席会进入 ACW / Not Ready，必须等坐席回 Ready 后才能接入新的电话、语音或视频。
- 新增统一 readiness：`available` 表示 Ready + Idle + 无未结束 call；`active-call` 表示当前仍有未挂断 voice/video；`not-ready` 表示没有未挂断 call 但坐席不是 Ready。
- PSTN / voice / video 被 `active-call` 阻塞时提示：`Active call in progress. Please hang up and wait until the agent is Ready before accepting another voice or video interaction.`
- PSTN / voice / video 被 `not-ready` 阻塞时提示：`Agent is not Ready. Please switch to Ready before accepting another voice or video interaction.`
- BankApp Voice / Video handoff 被 `active-call` 阻塞时提示：`Please hang up the current call and wait until the agent is Ready before routing this interaction to Agent Workspace.`
- BankApp Voice / Video handoff 被 `not-ready` 阻塞时提示：`Agent must be Ready before routing this interaction to Agent Workspace.`
- Answer 黄色按钮继续使用深色文字和图标；黄色底上白字对比不足，不作为本轮修改。

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



## 2026-06-02 Call Management 路由配置架构

- 用户要求按领导会议重新定义的架构实现 `Call Management > Routing Configuration`。
- 路由要素需要抽象管理，不把规则底层直接固化为 `要素1...要素10`；页面和发布索引可以物化展示。
- 本项目启用 VDN、接入站点、渠道、媒体类型、业务类型、语言；国家、接入账号、接入入口保留为可扩展要素但默认禁用。
- 会议示例从 `11=Channel` 开始但项目需要 VDN；本轮采用确定性编码 `10=VDN`，保留 `11-18` 原编码。
- 渠道与媒体不能只存在渠道表多选字段，必须拆出 `channel_media`；渠道媒体上配置并发、扫描模式、最小扫描间隔和渠道媒体扩展字段。
- 技能队列不强绑定 VDN；VDN 应作为路由规则条件匹配，以便技能队列复用。
- 技能路由规则保存启用要素组合和目标技能队列；目标技能队列不是唯一主键的一部分，唯一性由启用要素组合决定。
- 批量新增规则需要支持多要素多选、重复组合检测、是否覆盖重复规则、覆盖前展示原目标队列与现目标队列。
- 站点接入量管理按同一渠道 + 媒体下所有站点比例合计 100%；后续可扩展业务/语言覆盖维度。
- 所有业务 ID/code 必须显式编码或确定性生成，不能依赖数据库自增序列号；业务类型编码固定两位数字。

## 2026-06-02 Routing Config 拆分与 CRUD

- 用户明确否定旧的单页 tabs 方案，要求新增一级菜单 `Routing Config`，二级菜单进入具体配置页，避免把所有配置塞在一个页面里。
- `Call Management > Text Channel Settings` 保持不动；`Call Management` 不再承载 Routing Configuration 主页面。
- 旧 `/call-management/routing-configuration` 必须兼容，不失效，重定向到 `/routing-config/route-elements`。
- 每个配置页面都要是独立 `PageContainer + Table + Toolbar` 页面，并提供 Search / Add / View / Edit / Delete，而不是只有列表展示。
- CRUD 是前端 demo 本地状态，不接真实 API；刷新后恢复 mock。
- 站点页不再包含 `timezone`。本项目当前按印尼单国家场景处理，`Working Time Plans` 也暂不展示或维护 `timezone`；后续多国家/多时区再加回工作时间方案层。
- `Skill Routing Rules` 仍需支持批量新增：启用要素多选生成组合预览，重复组合展示原目标队列和现目标队列；勾选覆盖时更新目标技能队列/优先级，未勾选覆盖时阻止保存。
- 规则编辑只能修改目标技能队列、优先级和状态；要素条件不能直接改。

## 2026-06-02 路由要素配置页管理台样式

- 用户确认第一个菜单是路由要素管理，不是 VDN 管理。
- 路由要素管理字段固定为：`要素ID`、`要素名称`、`状态（启用/禁用）`。
- 用户后续要求 UI 使用英文；`Route Elements` 页面最终显示为 `Route Element Configuration`，字段为 `Element ID`、`Element Name`、`Status`。
- 查询区应按管理台数据列表维护习惯展示短字段：Keyword、Status；Search、Reset 贴近查询条件，Add 按钮独立靠右。
- Route Elements 的 `Keyword` 支持对 `Element ID` 和 `Element Name` 做多字段模糊搜索。
- Search 是查询区主操作，应使用有背景色的 primary 按钮；Reset 保持 secondary。
- 状态下拉框宽度应与搜索输入框一致。
- 列表底部应支持分页和每页条数，默认 20，支持 10 / 20 / 50 / 100；数据总数移动到底部分页区展示。
- Routing Config 数据列表字号和间距应贴近来电弹屏工作台密度，不能明显偏大。
- 新增弹框首次打开不能提前展示错误；只有点击保存后才显示实际校验错误。
- 弹框标题使用黑色，不使用蓝色；顶部标题栏应保留浅蓝渐变背景；查看态字段不使用额外输入框式背景；底部 footer 不应额外加背景色。
- Search / Reset 与弹框 Cancel / Save 等主操作按钮宽度需要统一。
- 状态字段优先使用短胶囊开关或 Enabled/Disabled badge，不使用过长 On/Off 样式。
- Source Entity、Display Order、Required、Allow ANY 等技术字段不应出现在首个路由要素配置列表和弹框中。

## 2026-06-02 Routing Config 状态展示统一

- 普通 Routing Config CRUD 页的状态展示统一使用业务语义 `Enabled / Disabled`，不在页面上混用 `Active / Disabled`。
- 内部数据值仍保留 `Active / Disabled`，避免扩大 mock、type、store 改动；页面层映射为 `Active -> Enabled`。
- 列表状态和详情状态使用同一套小尺寸 dot `RoutingConfigStatusBadge`。
- 新增/编辑状态使用短胶囊 `statusSwitch`，旁边显示当前状态文本 `Enabled` 或 `Disabled`。
- 搜索下拉状态使用 `All / Enabled / Disabled`，value 仍可为 `Active / Disabled`。
- `Draft`、`Replaced` 等生命周期状态仅用于 Skill Routing Rules 等规则页面，不应出现在普通主数据启停状态中。

## 2026-06-02 Routing Config 管理台工具栏标准

- Route Elements 的管理台样式已确认可作为普通配置菜单标准。
- 普通 Routing Config CRUD 页应统一使用表格上方工具栏，而不是把 Add 放在页面标题右侧。
- 工具栏结构：左侧查询条件，紧跟 `Search` / `Reset`；右侧独立 `Add`。
- 无专门查询条件的普通页面使用 `Keyword` 搜索框 + `Search` / `Reset` + 右侧 `Add`。
- `Keyword` 表示多字段模糊搜索，不是单一字段；Route Elements 当前匹配 `Element ID`、`Element Name`；VDN 当前匹配 `VDN ID`、`VDN Name`、`Platform VDN ID`；Sites 当前匹配 `Site ID`、`Site Name`。
- Route Elements、VDN 与 Sites 这类主数据页查询条件优先使用 `Keyword + Status`，Status 下拉为 `All / Enabled / Disabled`。
- Search 是 primary，Reset 是 secondary，Add 是 primary。
- 工具栏输入框、下拉框、Search/Reset/Add 按钮高度必须一致，当前标准为 32px。
- 普通 Routing Config CRUD 弹框 footer 的 Cancel / Save / Delete 按钮与外部 Search / Reset 按钮同宽同高，当前标准为 82px x 32px。
- 列表总数和每页条数放到底部分页区，不放在查询行。
- Routing Config 二级配置页左上角只显示当前菜单名称，不显示 `Routing Config` eyebrow、说明文案或标题右侧操作。
- 页面说明如后续确实需要，应放在帮助提示或文档中，不放在页面标题区。

## 2026-06-02 VDN 管理字段规范

- `VDN` 管理字段包括 `VDN ID`、`VDN Name`、`Platform VDN ID`、`Description`、`Status`。
- `VDN ID`、`VDN Name`、`Platform VDN ID` 都是必填字段。
- VDN 新增/编辑弹框中 `Platform VDN ID` 与 `Status` 同行展示，避免 textarea 造成行高错位。
- VDN `Description` 使用共享 CRUD 字段的 `fullWidth` 能力，独占整行展示，输入框宽度应比普通单列字段更宽。

## 2026-06-02 Sites 管理字段规范

- `Sites` 管理页不显示顶部 timezone 提示。
- `Sites` 管理页不展示 `Country` / `Country Code` 字段；内部可以暂时保留默认 `countryCode` 以兼容现有 mock/type。
- `Sites` 列表字段包括 `Site ID`、`Site Name`、`Owner`、`Owner Phone`、`Address`、`Status`。
- `Sites` 新增/编辑弹框字段包括 `Site ID`、`Site Name`、`Address`、`Owner Name`、`Owner Phone`、`Status`。

## 2026-06-02 Channels 管理字段规范

- `Channels` 列表字段包括 `Channel ID`、`Channel Name`、`Media Type`、`Max Concurrent Calls`、`Min Scan Interval (s)`、`Status`。
- 页面展示和维护的 `Channel ID` 使用非序列数字编码；当前实现保留内部 `channelCode` 作为路由规则、接入账号、接入入口等引用键，避免扩大引用迁移风险。
- 渠道名称按本轮口径覆盖 13 个：Phone、Haloapp、webchat、WhatsApp、Email、Instagram、LinkedIn、Facebook、X、Tik Tok、YouTube、AppStore、playstore。
- 媒体类型为多选：Phone 仅 Voice；Haloapp 和 webchat 包含 Voice / Video / Text；其它渠道仅 Text。
- 默认 `Max Concurrent Calls` 为 50，默认 `Min Scan Interval Seconds` 为 30。
- Channels 查询区使用 `Keyword + Media Type + Status`：Keyword 同时匹配 `Channel ID` 和 `Channel Name`，Media Type 为多选下拉，Status 为 `All / Enabled / Disabled`。

## 2026-06-02 Routing Config 菜单精简

- `Routing Config` 二级菜单删除 `Channel Media`、`Media Types`、`Languages`、`Access Entries`，对应页面和路由也删除，不保留隐藏直达页。
- 底层 `mediaTypes`、`languageTypes`、`channelMediaSettings`、`accessEntries` mock/store 数据暂时保留，供下拉、路由规则候选值和内部 mock 关系继续使用。
- `Access Accounts` 保留，因为会议中的账号配置含义是：同一渠道可配置多个账号，并且不同渠道账号字段不同；例如邮箱账号需要服务器地址等字段，Instagram/WhatsApp 账号需要外部账号和回调等字段。
- `Access Accounts` 的渠道差异字段不再用 `Channel-specific Config` 文本域展示，改为按 Channel 动态展示结构化字段。
- `Access Entries` 当前不作为独立菜单展示；如后续需要维护 DNIS、邮箱地址、App 入口等接入入口，可重新引入或并入 Access Accounts。

## 2026-06-03 Routing Config 二级菜单英文名称与顺序

- `Routing Config` 路由 path 保持英文和现状，不因菜单改名而变更，避免旧链接失效。
- 左侧二级菜单顺序和页面左上角标题统一为：
  1. `Route Elements`
  2. `VDN`
  3. `Access Sites`
  4. `Channels`
  5. `Media Service Rule Plans`
  6. `Business Types`
  7. `Skill Queues`
  8. `Access Accounts`
  9. `Site Access Volume`
  10. `Skill Routing Rules`
  11. `Working Time Plans`
- 页面标题、弹框标题和管理台字段名统一使用英文；页面标题与左侧二级菜单名称保持一致。

## 2026-06-02 Business Types 管理字段规范

- `Business Types` 查询区使用 `Keyword + Status`。
- `Keyword` 同时匹配 `Business Type ID` 和 `Business Name`，placeholder 为 `Business Type ID / Name`。
- `Business Types` 列表只展示 `Business Type ID`、`Business Name`、`Status` 和操作列，不展示 `Project`。
- 新增/编辑弹框不展示 `Project Code`；内部 `projectCode` 暂时固定默认 `BANK1`，用于保持项目范围唯一性。

## 2026-06-02 Site Access Volume 管理字段规范

- `Site Access Volume` 新增时先选择 `Channel`。
- 系统根据 `Channels` 菜单中该渠道配置的 `mediaTypes` 自动展开媒体分组；例如 Haloapp 展开 Voice / Video / Text。
- 每个媒体分组都列出 Sites 菜单里的所有站点，并用输入框设置接入话务量比例。
- `Site Access Volume` 新增弹框顶部 `Channel` 下拉框不能撑满弹框，应与其它管理台弹框控件宽度一致。
- `Site Access Volume` Add 弹框里，已经存在接入量配置的渠道必须置灰禁选；新增默认选择第一个未配置渠道，已有渠道调整走 Edit。
- 媒体分组标题只显示媒体名，例如 `Voice`、`Video`、`Text`，不要重复显示上方已选渠道。
- 站点比例录入采用纵向紧凑行布局，左侧只显示站点名称，右侧紧邻输入比例；不要重复显示站点 ID，也不要让站点名和输入框距离过远。
- 比例输入框需要显示 `%` 后缀，内部仍保存数值。
- 同一 `Channel + Media Type` 下所有站点比例合计必须为 100%。
- `Site Access Volume` 列表按媒体逐行展示，同一渠道的渠道相关列使用合并单元格。
- `Site Access Volume` 查询区使用 `Keyword + Media Type + Status`；Keyword 只匹配 Channel ID / Channel Code / Channel Name，Media Type 必须作为独立下拉筛选。
- 列表字段使用 `Channel ID`、`Channel Name`、`Media Type`、`Site Configuration`、`Status`、`Actions`。
- 列表不展示 `Total`，因为保存时不满 100% 不允许提交；`Total` 只作为新增/编辑弹框内的录入辅助。
- 列表不展示 `Ratio Group ID`，避免把内部生成编码暴露给业务用户。
- 列表中每个媒体一行展示该媒体的站点比例拼接文本，使用 ` | ` 分隔，例如 `Jakarta Site 34% | Surabaya Site 33% | Singapore DR Site 33%`。
- Haloapp 默认应在列表展示为 Voice / Video / Text 三行，渠道、状态和操作单元格合并显示；View/Edit 弹框内仍展示三组媒体下的站点比例。
- 新增和编辑保存都会为所选渠道的每个媒体生成或更新一条比例组；查看、编辑、删除在列表上按渠道维度操作。
- `Business Override` 和 `Language Override` 不再展示，也从 `SiteAccessRatioGroup` 类型中移除。

## 2026-06-03 Skill Queues 管理字段规范

- `Skill Queues` 查询区使用 `Keyword + VDN + Status`，其中 `VDN` 放在 `Status` 前。
- `Keyword` 同时匹配 `Skill ID`、`Platform Skill ID`、`Skill Name`；不要匹配状态，状态用独立 `Status` 下拉筛选。
- 列表字段包含 `Skill ID`、`Platform Skill ID`、`Skill Name`、`VDN`、`Work Time Plan`、`Max Queue Size`、`Queue Timeout`、`Supports Video`、`Agents`、`Status`、`Actions`。
- `VDN` 是技能队列维护字段，选项来自 `VDN配置` 主数据；新增/编辑时为必填单选下拉，列表展示 VDN 名称。
- 被技能队列引用的 VDN 不能直接删除；`VDN配置` 删除保护需要检查技能队列引用。
- Skill Queues 表格不要强制横向滚动；列宽应保持管理台紧凑密度。
- `Work Time Plan` 列表和弹框下拉展示工作时间方案名称，不直接展示方案编码；未选择方案时展示 `Default 24x7`。
- `Supports Video` 使用 `No / Yes`，默认 `No`。
- `Max Queue Size` 默认 `60`，范围 `1-60000`，单位按字段语义展示为 `items`。
- `Queue Timeout` 默认 `100`，范围 `0-10000`，单位按字段语义展示为 `sec`。
- 弹框中除 `Work Time Plan` 外的可维护字段保持必填；`Platform Skill ID` 需要保存校验，`Work Time Plan` 空值表示 `Default 24x7`。
- `Assigned Agents` 不是输入字段；弹框中只读禁用展示。
- 弹框不展示 `Queue Prompts`；新增记录使用默认 prompt，编辑记录保留原 prompt。
- `Routing Method` 不在列表和弹框展示；`SkillQueue` 类型和 mock 数据不再保留 `routingMethod` 字段。
- CRUD 弹框内普通输入框、下拉框和带单位数字输入框高度必须一致。

## 2026-06-03 管理台页面顶部版式标准

- 使用 `PageContainer` 的管理台/配置页顶部必须紧凑，不要保留大块空白标题区。
- 页面标题字号应明显小于 `BANK 1` Logo；当前标准为 16px / 22px / 700。
- `PageContainer` header 当前标准：min-height 28px，title 下方间距 10px。
- 页面内容顶部 padding 当前标准：顶部 8px，左右和底部 12px。
- `PageContainer` body gap 当前标准：12px。
- 如果未来某个页面确实需要更大的标题区，应新增显式 variant，而不是回退全局管理台标准。

## 2026-06-03 Access Accounts 动态渠道字段

- `Access Accounts` 采用账号列表维护，不采用按渠道卡片分组。
- `Phone` 不属于官方账号配置，不出现在 Access Accounts 的 Channel 下拉；Phone 仍保留在 Channels 中。
- 账号页不维护机器人/人工入口 ID、支持媒体类型等非账号属性。
- 列表展示 `Account ID`、`Account Name`、`Channel`、`External Account ID`、`Secret Ref`、`Status`、`Actions`；不展示 `Key Config`。
- 查询区为 `Keyword + Channel + Status`。
- 新增/编辑弹框按 Channel 动态展示结构化字段，去掉 `Channel-specific Config` 自由文本域。
- `AccessAccount.extensionConfig` 为结构化对象；密钥、token、private key、password 只保存 secret reference，不保存原文。
- Access Accounts mock 应覆盖除 `Phone` 外的所有渠道示例：Haloapp、webchat、WhatsApp、Email、Instagram、LinkedIn、Facebook、X、Tik Tok、YouTube、AppStore、playstore。

## 2026-06-03 Skill Routing Rules 管理台统一

- `Skill Routing Rules` 业务结构不同于普通主数据 CRUD，因为它包含动态启用要素、多选组合展开、重复组合检测、覆盖保存和运行时索引。
- 页面视觉仍必须遵循管理台标准：顶部只显示页面名称，主区域使用紧凑查询栏、右侧主操作按钮、分页表格、统一状态 badge 和统一弹框样式。
- 主页面查询为启用路由要素多选 + `Target Skill Queue + Status`，不使用 `Keyword / Rule ID` 查询框；路由要素下拉不展示 All / Empty，右侧按钮为 `Batch Add`。
- 规则列表必须把每个启用要素拆成独立列展示，并展示 Updated Date / Updated By。
- 页面表格卡片不重复显示菜单名称，底部不展示 `Published Routing Rule Index`。
- `Batch Add Routing Rules` 不再常驻页面顶部，改为 `Batch Add` 弹框；弹框内启用要素一行一个多选下拉，并与目标技能队列分区展示。
- Batch Add 不展示 Priority、Overwrite checkbox、组合数量摘要或重复数量摘要；新增和覆盖仍使用内部默认 priority `70`。
- Batch Add 下方表格为 `Duplicate Routing Rules`，只展示重复拆分行：勾选框、启用要素值、Original Skill Queue、Target Skill Queue、Status；重复行默认全选，取消勾选的重复行保存时不覆盖，新行仍在保存时正常创建但不展示在该表。
- Batch Add 重复组合表头必须有全选 checkbox；默认示例应有多条重复组合，当前用 Jakarta / Surabaya / Singapore DR 三个站点展示。
- Batch Add 路由要素下拉只显示元素名称，不显示括号内元素 ID；技能队列也只显示技能名称，不显示技能 ID。
- Batch Add 弹框字段标签与输入框距离要紧凑，普通字段标签不加粗，仅分块标题加粗。
- Batch Add 重复表格不能超出弹框；当前按 5 个启用要素压缩列宽并取消横向 scroll。
- Batch Add 路由要素允许为空，不再提供或显示 `ANY`；空字符串表示“不限定该路由要素”。
- Batch Add 重复组合提示文案使用：`The following route combinations already exist. Selected rows will update the existing skill queue to the current target queue; unselected rows will remain unchanged.`
- View/Edit/Delete 中启用路由要素只读，Edit 只能修改 Target Skill Queue、Status；弹框使用普通管理台两列表单字段，不使用单独条件卡片区。
- Skill Routing Rules 查询工具栏应遵循普通管理台工具栏结构：左侧 `query-group` 包含启用路由要素、Target Skill Queue、Status、Search、Reset；`Batch Add` 作为右侧独立主操作按钮，不紧挨 Reset。
- `Published Routing Rule Index` 不在页面上展示；如后续需要说明运行时索引，应另行设计辅助入口。

## 2026-06-03 Route Elements 默认要素顺序

- `Route Elements` 默认只展示 8 个要素：Access Site、Channel、Media Type、Country、Language Type、Business Type、Access Account、Access Entry。
- 默认顺序按 `displayOrder` 固定为：Access Site = 1、Channel = 2、Media Type = 3、Country = 4、Language Type = 5、Business Type = 6、Access Account = 7、Access Entry = 8。
- Country、Access Account、Access Entry 默认 Disabled；其它默认 Enabled。
- VDN 不再作为默认 Route Element 展示，但 `VDN配置` 菜单和 VDN 主数据保留。
- `Skill Routing Rules` 只展示 `enabled === true && status === 'Active'` 的要素；禁用要素和 VDN 不出现在 Batch Add、Route Conditions、View/Edit 条件区或 Published Routing Rule Index。
- 默认 routingRules 不再包含 `factorCode: '10'` 的 VDN 条件。

## 2026-06-03 渠道媒体服务规则方案

- 不再把文字媒体业务规则直接塞进 `Channels` 页面；`Channels` 只维护渠道主数据和每个媒体引用的服务规则方案。
- 新增 `Media Service Rule Plans / 媒体服务规则配置`，当前先完整支持 `Text` 媒体；Voice / Video 只预留规则方案引用能力，页面显示 `Reserved / Not configured`。
- 新增 `ChannelMediaRuleBinding` 概念：每个 `Channel + Media Type` 最多绑定一个服务规则方案；Active 的 `Channel + Text` 必须绑定 Enabled Text rule plan。
- 2026-06-04 后，Text Media Rule Plan 分区更新为 Basic Info、Customer Service Configuration、Agent Service Configuration。
- Customer Service Configuration 包含 Access Configuration、Queue Configuration、Agent Opening / Ending Configuration、Customer No Reply Configuration、Agent No Reply Configuration。
- Agent Service Configuration 包含 Webchat Message Recall Limit 和 Agent No Reply Service Level。
- Text 默认业务值：接入并发 50 items、最小扫描间隔 30 sec、最大排队客户 20 customers、排队超时 10 min、客户超时前提醒 1 min、客户未回复超时 5 min、坐席未回复超时 120 sec、Webchat 撤回 120 sec、坐席 warning 60 sec、breach 120 sec。
- 所有字段标签和默认话术使用英文；支持变量 `{customerName}`、`{channelName}`、`{agentName}`、`{timeoutMinutes}`、`{reminderMinutes}`、`{estimatedWaitMinutes}`、`{workTime}`。
- `Media Service Rule Plans` 页面不再维护旧的每渠道 `Queue Alert / Recipients` 区块，也不再使用 `queueAlerts` / `TextMediaQueueAlertRule`；后续如需渠道差异，只在更明确的 Channel 绑定或规则引用层新增。
- 后续会废弃现有 `Call Management > Text Channel Settings`；本方案不复用旧页面、旧类型或旧交互。

## 2026-06-04 Media Service Rule Plans 文字媒体规则方案改造

- 本轮只改 `Routing Config > Media Service Rule Plans` 的 Text 规则方案新增/编辑/查看页；`Channels` 暂不改，继续只绑定并引用规则方案。
- `Basic Info` 保持 Plan ID、Plan Name、Media Type、Status、Description；Media Type 固定 `TEXT`。
- 必填话术覆盖：Access Success Welcome Message、Non-working Time Message、Queue Waiting Message、Queue Timeout Message、Assigned Agent Greeting、Agent End Reminder、Pre-timeout Reminder Message、Customer Timeout Notice、Agent Timeout Notice、Auto Response Message。
- 校验规则：所有数值必须大于 0；客户超时前提醒时间必须小于客户未回复超时；坐席未回复 warning 必须小于等于 breach；breach 必须小于等于坐席未回复超时；被 Channel Media Rule Binding 引用的规则方案不能删除。
- 发布/演示口径：Media Service Rule Plans 是文字媒体服务体验规则的主配置来源；Channels 后续只负责 Channel + Media Type 绑定规则方案，具体字段联动等下一步再改。

## 2026-06-04 Media Service Rule Plans 弹框临时中文确认口径

- 仅 `Routing Config > Media Service Rule Plans` 弹框临时中文化；列表页、左侧菜单、路由路径和 `Channels` 结构不改。
- 中文范围覆盖 Add/Edit/View/Delete 弹框标题、分区、字段、单位、按钮、校验、删除保护提示和 Text rule plan 默认话术。
- 弹框布局参考 `Working Time Plans`：白色块状 section，基础信息、客户服务配置、坐席服务配置为顶层块，具体配置项为轻量子块。
- 数字输入框保持约 160px；相关数字参数与提示语按同行展示，尤其是排队、客户未回复和坐席未回复配置。
- 本轮为中文确认版本，不是最终对外英文版；中文确认无误后必须另起一轮转回英文。

## 2026-06-04 Media Service Rule Plans 变量插入与语音视频参数口径

- 变量入口使用字段右上角 `插入变量` 下拉，不再展示顶部全局 `可用变量` 条，避免用户误以为所有变量适用于所有话术。
- `插入变量` 仅在 Add/Edit 可编辑状态显示；View/Delete 不显示。
- 字段变量范围：
  - 接入成功欢迎语：`{customerName}`、`{channelName}`。
  - 非人工服务时间提示语：`{workTime}`。
  - 排队提示语：`{estimatedWaitMinutes}`。
  - 分配坐席成功问候语：`{customerName}`、`{agentName}`、`{timeoutMinutes}`。
  - 坐席挂断提醒：`{customerName}`、`{agentName}`。
  - 未回复超时前提醒：`{reminderMinutes}`。
  - 未回复超时客户提醒：`{customerName}`。
  - 未回复超时坐席提醒：`{customerName}`、`{timeoutMinutes}`。
  - 排队超时提示语、自动回复内容暂不显示变量入口。
- 变量插入按 textarea 最近光标或选区插入；没有光标记录时追加到话术末尾。
- Media Service Rule Plans 弹框内数字单位使用本弹框 scoped 的小号轻量文本，不使用 `InputNumber addonAfter`；项目其它通用 CRUD 数字字段是否保留 `addonAfter` 另行处理。
- Voice / Video 参数判断：
  - 可共用：接入并发、最小扫描间隔、非服务时间提示、最大排队人数、排队提示、排队超时、排队超时提示、接入/欢迎提示。
  - 可共用但需改名：坐席未回复 warning/breach 可转为坐席接听/响应 SLA；坐席未回复超时可转为坐席接听超时或会话响应超时。
  - 不适合直接共用：Webchat 消息撤回、文字客户未回复自动关闭、文字坐席未回复自动回复。
  - Voice 后续应单独考虑：IVR/等待音、振铃超时、无人接听回流、放弃呼叫提示、回拨配置。
  - Video 后续应单独考虑：视频等待室提示、摄像头/麦克风提示、视频接入超时、重连超时、转文字/语音兜底。

## 2026-06-04 Media Service Rule Plans 语音视频简化配置口径

- 本轮 Voice / Video 第一版只在 `Media Service Rule Plans` 中维护接入配置，不做排队、等待室、重连、回拨、坐席服务配置、SLA、Webchat 撤回或底层音视频技术参数。
- Add 弹框 Media Type 可选：`文字媒体`、`语音媒体`、`视频媒体`；Edit/View 媒体类型锁定不可改。
- Text 保持当前完整配置不变。
- Voice 展示：基础信息、客户服务配置 > 接入配置；字段为接入并发呼叫数、接入最小扫描间隔、接入成功欢迎语。
- Video 展示：基础信息、客户服务配置 > 接入配置；字段为接入并发视频数、接入最小扫描间隔、接入成功欢迎语。
- Voice / Video 只校验方案ID、方案名称、接入并发、接入最小扫描间隔、接入成功欢迎语；不校验 Text 专属字段。
- 当前实现复用 `MediaServiceRulePlan` 的现有扁平字段；Voice / Video 隐藏的 Text 字段保留默认值但不展示、不校验。

## 2026-06-04 客户预览发布屏蔽范围

- 本次客户预览发布保留主工作台、Channel Simulation、PSTN、BankApp、WhatsApp、Voice / Video handoff、正式 Live Chat 和 Design System。
- `Call Management` 和 `Routing Config` 两个一级菜单暂不对客户展示，因为相关管理功能尚未完成。
- 屏蔽必须同时覆盖左侧菜单入口和 URL 直达；`/call-management`、`/call-management/*`、`/routing-config`、`/routing-config/*` 都应回到 `/`。
- 未完成管理功能源码、mock、store 和类型文件不删除，后续继续开发时可恢复菜单和路由。
- 本次发布目标为 Vercel Preview URL，不直接发布 Production。

## 2026-06-04 客户 Production 发布口径

- 用户确认本地客户发布版本没问题后，将隐藏管理菜单的发布分支合入 `main`，由 Vercel Production 给客户访问。
- Production 客户版本继续隐藏 `Call Management` 与 `Routing Config`，同时 `/call-management/*` 和 `/routing-config/*` 回到 `/`。
- 发布后本地继续开发分支为 `codex/text-channel-config-settings`；该分支保留管理菜单入口，用于继续完成未完成的管理配置功能。
- 不删除未完成管理功能源码、mock、store 或类型，只通过发布分支/生产分支的菜单和路由屏蔽客户可见入口。

## 2026-06-04 Production 发布后本地开发分支口径

- `main` 是客户 Production 隐藏版，已经发布到客户可访问地址。
- 当前本地继续开发分支为 `codex/text-channel-config-settings`，该分支需要显示 `Call Management` 和 `Routing Config`。
- 本地开发分支恢复 `/call-management/text-channel-settings`、`/call-management/routing-configuration` 和 `/routing-config/*` 直达路由，方便继续完成管理配置功能。
- 后续再发布给客户前，必须重新确认是否需要隐藏这两个管理菜单；不要直接把本地开发开放状态误发到 Production。

## 2026-06-05 Call Management 全局控制配置口径

- `Call Management` 使用英文子菜单 `Global Control Configuration`，位于 `Text Channel Settings` 上方；直达路由为 `/call-management/global-control-configuration`。
- 页面 UI 文案使用英文，不使用中文字段标签或中文按钮。
- 页面用于前端 demo 配置全局坐席/媒体控制项，不接真实话务状态机、后端接口或 Production 客户隐藏版。
- 默认配置：应答方式为自动应答，应答时长 3 秒；签入后状态为就绪；自动取消话后整理态时长 5 秒；久不操作界面自动签出 30 分钟，提前预警 10 分钟；文字媒体最大服务数 3 个。
- 展示分组：应答配置放应答方式和应答时长；签入与话后整理放签入后状态和 ACW 自动取消；久不操作控制放自动签出和提前预警；文字媒体容量单独一行。
- 交互规则：应答方式为手动应答时隐藏应答时长；所有数字必须大于 0；久不操作提前预警时长必须小于自动签出时长。
- 当前本地开发分支显示该菜单；客户 Production `main` 仍隐藏 `Call Management` 和 `Routing Config`。

## 2026-06-05 Call Management 示忙原因维护口径

- `Call Management` 使用英文子菜单 `Busy Reason Management`，直达路由为 `/call-management/busy-reasons`。
- 页面 UI 文案使用英文；列表字段为 ID、Busy Reason、Default、Status、Remark、Updated Date、Updated By、Actions。
- 查询条件：Keyword（匹配 ID / Busy Reason / Remark）、Default、Status。
- 当前页面仅支持编辑已有记录，不提供 Add、View、Delete 入口；Actions 只保留 Edit。
- `Default` 表示系统默认示忙原因，只能唯一；保存某条为默认时，其它示忙原因必须自动取消默认。
- `Status` 只有 Enabled / Disabled；只有 Enabled 状态的示忙原因才显示在右上角坐席状态菜单的 AUX 选项中。
- `AgentStatus` 支持动态 `AUX - ${reasonName}`，不再只允许写死的 `AUX - Ibadah` / `AUX - Makan`。
- 当前为前端 demo store，刷新后恢复 mock；默认 mock 为 Ibadah 默认启用、Makan 启用、Training 禁用，以及 Extension 1 至 Extension 7 七条禁用备用原因。

## 2026-06-05 Skill Queues 排队配置弹框口径

- `Routing Config > Skill Queues` 的排队配置是从媒体服务规则中迁移后的主要维护入口。
- Add/Edit/View 弹框应分为 `Basic Information` 和 `Queue Configuration` 两块；排队相关配置单独放在下方 `Queue Configuration`。
- `Queue Configuration` 展示顺序：
  - `Non-working Time Message` 单独一行。
  - `Max Queue Customers` 与 `Queue Waiting Message` 同行。
  - `Queue Timeout` 与 `Queue Timeout Message` 同行。
- 提示语字段使用和 `Channels > Business Config` 一致的字段级 `Insert Variable` 下拉；Add/Edit 显示，View 不显示。
- 当前变量口径：
  - `Non-working Time Message`：`{workTime}`。
  - `Queue Waiting Message`：`{estimatedWaitMinutes}`。
  - `Queue Timeout Message`：`{customerName}`。
- 变量插入应写入当前 textarea 光标或选区位置；没有光标记录时追加到文本末尾。

## 2026-06-05 Phone Business Config 异常工作时间方案口径

- `Routing Config > Channels > Business Config` 中，只有 Phone 渠道的 Voice 配置显示 `Exception Working Time Plan`。
- 该字段对应中文需求“异常情况工作时间方案”，保存为 `ChannelMediaBusinessConfig.exceptionWorkTimePlanCode`。
- 下拉选项复用 `Working Time Plans`，并包含 `Default 24x7` 空值选项。
- Phone mock 默认使用 `WTP_BANK_HOURS`，页面显示 `Bank Working Hours`。
- Haloapp、Webchat、WhatsApp、Email、Instagram 等非 Phone 渠道不显示该字段。
- 当前只是前端 demo 配置字段，不接真实异常场景判定；后续需要定义何种异常情况使用该工作时间方案。

## 2026-06-05 Skill Queues Work Time Plan 预览口径

- `useRoutingLookups().workTimeOptions` 已经包含 `Default 24x7` 空值选项；`SkillQueuesPage` 不要再额外 prepend `Default 24x7`。
- `Default 24x7` 表示 `workTimePlanCode: ''`，没有真实 Working Time Plan 记录，因此不显示 `Preview`。
- 非空 `workTimePlanCode` 必须能在 `workingTimePlans` 中找到对应方案，才显示 `Preview` 按钮。
- `Preview` 打开只读 `View Working Time Plan` 弹框，展示 Basic Info、Work Schedule、Ramadan Work Schedule、Holiday Schedule、Special Working Plan 和优先级提示。
- `Preview` 不负责编辑、保存或删除 Working Time Plan；关闭后应回到原 Skill Queue 弹框上下文。

## 2026-06-05 Phone Exception Work Time Plan 预览口径

- Working Time Plan 新增 `WTP_3_WRONG_INPUT_ZH / 连续3次输入有误-中文`，用于 Phone 异常场景“连续 3 次输入有误”的中文服务窗口 demo。
- Phone 渠道 VOICE Business Config 默认选中 `WTP_3_WRONG_INPUT_ZH`，字段为 `exceptionWorkTimePlanCode`。
- `Channels > Business Config > Exception Working Time Plan` 也必须直接使用 `useRoutingLookups().workTimeOptions`，不要额外 prepend `Default 24x7`。
- `Default 24x7` 空值不显示 `Preview`；`Bank Working Hours`、`连续3次输入有误-中文` 等真实方案显示 `Preview`。
- `Preview` 复用只读 `View Working Time Plan` 弹框，不在 Channel Business Config 内直接编辑 Working Time Plan。

## 2026-06-05 客户 AUX 发布与 VDN / Access Sites 状态 UI 口径

- 客户可见 AUX 示忙原因选择弹框已合入并推送 `main`，触发 Vercel Production；客户版本仍隐藏 `Call Management` 与 `Routing Config`。
- Production 右上角签入后只显示一个 `AUX` 入口；点击后弹框列出启用示忙原因，默认选中启用默认项，确认后状态变为 `AUX - {reasonName}`。
- 后续 Routing Config 调整从本地管理分支继续，不混入客户 AUX 发布分支。
- `Routing Config > VDN` 和 `Routing Config > Access Sites` 本轮只从 UI 移除 `Status`：列表列、查询条件、Add/Edit/View 弹框字段都不显示。
- VDN / Access Sites 的内部类型与 mock 仍保留 `status`，新增/编辑保存默认写 `Active`，避免影响 Skill Queues、Site Access Volume、Skill Routing Rules 引用。

## 2026-06-05 Skill Queues 状态 UI 口径

- `Routing Config > Skill Queues` 也先从 UI 移除 `Status`。
- Skill Queues 列表不显示 Status 列，查询区不显示 Status 下拉，Add/Edit/View 弹框不显示 Status 控件。
- `SkillQueue.status` 类型和 mock 暂时保留，新增/编辑保存默认写 `Active`，避免影响 Skill Routing Rules 引用。
- 该调整只属于本地管理菜单分支，不应直接发布给客户。
