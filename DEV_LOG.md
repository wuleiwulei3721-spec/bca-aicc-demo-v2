# BANK 1 AICC Demo V2 - 开发日志

最后更新：2026-06-10 10:08 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`

## 记录规则

每次重要修改都要新增日志，至少记录：

- 修改时间。
- 修改页面或文件。
- 修改原因。
- 修改结果。
- 回滚说明。
- 当前风险点。

重要修改包括：完成页面、完成需求、修改架构、修改接口、修改 mock 数据结构、修改关键 prompt、修复关键 bug、调整部署或恢复机制。

## 日志

### 2026-06-10 10:08 +08:00 - 调整正式 Live Chat 客户预览文案

修改页面或文件：

- `src/mock/inbound.ts`
- `src/pages/inbound/components/liveChat2QuickReplies.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-10-1008.md`
- `.codex-backup/current-todo-2026-06-10-1008.md`
- `.codex-backup/page-state-2026-06-10-1008.md`

修改原因：

- 用户需要调整文字弹屏，也就是正式 `Live Chat` 页面内容，并通过 Vercel Preview 发布给客户查看。
- 当前 `codex/admin-config-latest` 有内部管理分支改动且不适合直接发布，因此本轮从干净 `main` worktree 创建客户预览分支 `codex/livechat-copy-update`。

修改结果：

- `liveChat2Sessions` 更新为客户预览版脱敏银行演示场景，覆盖 WhatsApp 卡片解锁、Haloapps 设备绑定、Webchat 网点预约、信用卡分期、补卡配送和 Paylater 还款历史。
- Quick Replies 默认短语更新为 BANK 1 客服检查记录、提交服务请求、建单跟进、验证和安全提醒口径。
- 未修改旧版 `LiveChatPage.tsx`、路由、store、类型或内部管理分支 `codex/admin-config-latest`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning 和 plugin timing 提示。
- `git diff --check` 通过。
- 本地 Chrome CDP smoke check 通过：`/login` 使用 `888888 / 888888` 登录，右上角选择 `Voice + Digital` 后打开正式 `Live Chat`；默认 Current 客户展示新的卡片解锁和客户主动结束话术；Quick Replies 展示新的 BANK 1 客服与安全提醒短语；Message Record 侧栏可打开；页面未显示 `Routing Config`。

回滚说明：

- 可按文件恢复 `src/mock/inbound.ts` 与 `src/pages/inbound/components/liveChat2QuickReplies.ts` 中本轮文案改动；无需数据库迁移或类型回滚。

当前风险点：

- 本轮由 AI 根据客户预览目标拟定演示文案，仍需客户最终确认业务语气、语言口径和具体场景是否符合实际演示。

### 2026-06-09 19:36 +08:00 - 强化 Log Out 确认按钮 hover 样式

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1936.md`
- `.codex-backup/current-todo-2026-06-09-1936.md`
- `.codex-backup/page-state-2026-06-09-1936.md`

修改原因：

- 用户反馈系统 `Log Out` 二次确认弹框里的 `Log Out` 按钮 hover 样式不明显。

修改结果：

- `Confirm Log Out` 的确认按钮增加 `aicc-logout-confirm__ok` 专用 class。
- 仅针对该按钮加强 hover 样式：更深红色背景/边框、外圈红色光晕、阴影和轻微上移。
- 增加更清晰的 `focus-visible` 轮廓；不影响媒体 `Sign Out` 确认弹框或其它全局 danger 按钮。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP smoke check 通过：`Confirm Log Out` 弹框确认按钮带有 `aicc-logout-confirm__ok` class；hover 后背景从默认白底红边变为深红底，出现红色光晕、阴影并轻微上移。

回滚说明：

- 如需回滚，可删除 `BasicLayout.tsx` 中 `okButtonProps.className`，并删除 `index.less` 中 `.aicc-logout-confirm__ok*` 样式块。

当前风险点：

- 本轮仅调整 hover/focus 视觉，不改变登出确认逻辑、auth session 清理或媒体状态重置。

### 2026-06-09 19:07 +08:00 - 登录页去掉 PIN 并增加退出确认

修改页面或文件：

- `src/pages/LoginPage.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1907.md`
- `.codex-backup/current-todo-2026-06-09-1907.md`
- `.codex-backup/page-state-2026-06-09-1907.md`

修改原因：

- 客户反馈登录页面不要 PIN。
- 客户要求媒体 `Sign Out` 和系统 `Log Out` 都需要二次确认，避免误操作。

修改结果：

- 登录页移除 PIN 输入、验证码显示、点击验证码刷新逻辑和对应样式。
- 登录校验改为只校验 User Name、Password，EXT 保持可选；demo LDAP 账号仍为 `888888 / 888888`。
- 媒体 `Sign Out` 点击后弹出 `Confirm Sign Out`，确认后才回到 `Unsigned`；取消不改变坐席状态。
- 系统红色 `Log Out` 点击后弹出 `Confirm Log Out`，确认后才清除 auth session、重置媒体状态并回到 `/login`；取消不登出。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP smoke check 通过：`/login` 只显示 User Name、Password、EXT，不再显示 PIN/captcha；`888888 / 888888` 无 PIN 登录成功进入 `/`。
- 本地 Chrome CDP smoke check 通过：媒体 `Sign Out` 弹出 `Confirm Sign Out`；点击 `Cancel` 不改变签入模式，点击 `Sign Out` 后回到 `Unsigned` 且停留 `/`。
- 本地 Chrome CDP smoke check 通过：系统 `Log Out` 弹出 `Confirm Log Out`；点击 `Cancel` 停留 `/`，点击 `Log Out` 后回到 `/login`；重新登录后 `/design-system` 可访问。

回滚说明：

- 如需恢复登录 PIN，可恢复 `LoginPage.tsx` 中的 captcha state、PIN 输入、captcha 按钮和 `index.less` 中 `.aicc-login-form__captcha*` 样式。
- 如需取消二次确认，可把 `AgentProfileArea.tsx` 中 `sign-out` 分支恢复为直接 `onStatusChange('Unsigned')`，并把 `BasicLayout.tsx` 的 `handleLogout` 恢复为直接调用 `updateAgentStatus`、`logout` 和 `navigate('/login')`。

当前风险点：

- 当前只是前端 demo 交互调整；真实 LDAP / SSO 登录页是否保留验证码或其它风控项，需要以后按客户安全策略接后端。

### 2026-06-09 11:50 +08:00 - 登录账号与验证码口径调整

修改页面或文件：

- `src/pages/LoginPage.tsx`
- `src/mock/auth.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1150.md`
- `.codex-backup/current-todo-2026-06-09-1150.md`
- `.codex-backup/page-state-2026-06-09-1150.md`

修改原因：

- 用户要求验证码按设计图改为 6 位数字。
- 用户要求点击验证码本身即可刷新，不再需要右侧独立刷新按钮。
- 用户要求 demo 登录账号和密码都简化为 6 个 8。

修改结果：

- `createCaptchaCode()` 改为生成随机 6 位数字，PIN 输入 `maxLength` 改为 6。
- 登录页移除独立刷新按钮，只保留验证码图片按钮；点击验证码按钮刷新 PIN 并清空 PIN 输入。
- 验证码行样式改为 `PIN input + captcha` 两列布局，captcha 宽度调整为适配 6 位数字。
- Demo LDAP 账号从 `admin / 888888` 改为 `888888 / 888888`，session 中 username / LDAP DN / SSO subject 同步改为 `888888`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP smoke check 通过：验证码显示 6 位数字；点击验证码后刷新为另一组 6 位数字且 PIN 输入被清空；页面不存在独立 `Refresh PIN` 按钮。
- 本地 Chrome CDP smoke check 通过：`admin / 888888` 加正确 PIN 登录失败并停留 `/login`；`888888 / 888888` 加正确 PIN 登录成功进入 `/` 且坐席仍为 `Unsigned`。

回滚说明：

- 如需回滚，可把 `createCaptchaCode()` 恢复为 5 位、PIN `maxLength` 恢复为 5，把独立刷新按钮和三列 captcha 样式恢复；`src/mock/auth.ts` 可恢复为 `admin / 888888`。

当前风险点：

- 当前 demo 账号过于简单，仅用于客户演示；真实系统仍应由 LDAP / SSO 后端控制账号、密码和安全策略。

### 2026-06-09 11:46 +08:00 - 登录页视觉与 Header Log Out 尺寸微调

修改页面或文件：

- `src/pages/LoginPage.tsx`
- `src/styles/index.less`
- `public/screenshots/login-illustration.svg`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1146.md`
- `.codex-backup/current-todo-2026-06-09-1146.md`
- `.codex-backup/page-state-2026-06-09-1146.md`

修改原因：

- 用户反馈右上角红色系统退出按钮太大，应与旁边状态下拉按钮一样大小。
- 用户反馈登录页左侧插画如无法还原，可用前序 UI 图中的视觉方向做图；同时 BANK 1 logo 位置偏下，应放到左上角。

修改结果：

- `Log Out` 红色电源按钮尺寸从 38x38 调整为桌面 26x26、移动端 24x24，与状态下拉按钮一致。
- 登录页左侧从 CSS 拼接图形改为实际图片资源 `/screenshots/login-illustration.svg`，视觉方向贴近 UI mock 中拼图、坐席人物、植物和灯泡的插画。
- 登录页 BANK 1 logo 改为固定在视口左上角，桌面位置为 left 28px / top 26px。
- 登录页移动端 padding 与 logo 定位同步调整，避免 logo 和登录卡重叠。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP 视觉 smoke check 通过：`/login` 中 BANK 1 位于 left 28 / top 26；左侧图片 natural size 为 620x360 并正常加载。
- 本地 Chrome CDP 视觉 smoke check 通过：登录后 Header 状态下拉按钮与红色 `Log Out` 按钮均为 26x26。

回滚说明：

- 如需回滚，可恢复 `LoginPage.tsx` 中原 CSS 插画节点，删除 `/screenshots/login-illustration.svg`，并恢复 `.aicc-login-illustration*` 原 CSS；Header 按钮可恢复为 38x38。

当前风险点：

- 本轮未能直接从聊天附件中裁切原 UI 图片，因为附件没有作为仓库文件存在；当前使用本地 SVG 视觉资产复刻该方向。若后续用户提供原图文件，可替换 `/screenshots/login-illustration.svg` 为真实裁切图。

### 2026-06-09 11:27 +08:00 - 系统 Log Out 独立按钮与 Sign In 分组菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1127.md`
- `.codex-backup/current-todo-2026-06-09-1127.md`
- `.codex-backup/page-state-2026-06-09-1127.md`

修改原因：

- 用户确认 UI 提供的系统级 `Log Out` 应放在右上角并与坐席状态下拉并列，避免和媒体签入/签出混用。
- 用户希望签入模式选择和 AUX 示忙原因一样按分类呈现，不使用图标。
- 本轮浏览器验证时发现 `Voice only` 阻止 WhatsApp live chat handoff 的 warning 被 livechat 条件隐藏，需要补齐可见提示。

修改结果：

- `AgentProfileArea` 不再接收系统 logout 回调，下拉菜单只负责媒体状态。
- 未签入时头像下拉显示 `Sign In` 分组，下面是纯文字 `Voice only`、`Digital only`、`Voice + Digital`。
- 签入后头像下拉显示当前模式、`AUX` 分组、启用示忙原因和媒体 `Sign Out`，不再包含 `Log Out`。
- `BasicLayout` 在头像状态下拉右侧新增红色电源按钮，点击后清除 auth session、重置媒体状态并返回 `/login`。
- `BankAppDemoPage` 的 handoff warning 对 live chat 也可见，`Voice only` 阻止 WhatsApp/BankApp live chat handoff 时会展示明确提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP smoke check 通过：未登录访问 `/` 重定向 `/login`；错误 PIN 和错误密码都停留登录页并显示对应错误；`admin / 888888` 加正确 PIN 进入 `/` 且坐席仍为 `Unsigned`。
- 本地 Chrome CDP smoke check 通过：未签入下拉显示 `Sign In` 分组和三个纯文字模式，菜单 icon count 为 0，菜单内不出现 `Log Out`。
- 本地 Chrome CDP smoke check 通过：选择 `Digital only` 后 Header 第二行显示 `PBK BSB | Digital only`，signed-in 下拉显示 `Sign Out` 但不显示 `Log Out`；`Sign Out` 只回到 `Unsigned` 并停留 `/`。
- 本地 Chrome CDP smoke check 通过：右上角红色 `Log Out` 返回 `/login` 并重新渲染登录表单。
- 本地 Chrome CDP smoke check 通过：`Digital only` 阻止 PSTN 并显示 voice/video 技能不匹配提示；`Voice + Digital` 允许 PSTN；认证后 `/design-system` 可访问。
- 本地 Chrome CDP smoke check 通过：`Voice only` 阻止 WhatsApp live chat handoff，并显示 `Current sign-in mode is Voice only...` warning。

回滚说明：

- 如需回滚，可把 `Log Out` 菜单项恢复到 `AgentProfileArea`，移除 `BasicLayout` 中的独立红色按钮和对应样式；把 unsigned 菜单恢复为平铺的 `Sign in - ...` 项；如不需要 live chat warning 修复，可恢复 `BankAppDemoPage` 中 handoff warning 对 livechat 的隐藏条件。

当前风险点：

- 这是前端 demo auth/session 行为，真实系统级退出后续仍需接后端 session/token 失效接口。
- Header 右侧按钮已做本地 headless DOM smoke；仍建议在目标演示分辨率下人工确认按钮间距和截图视觉一致。

### 2026-06-09 11:20 +08:00 - Transfer / Outbound 坐席列表去掉状态筛选

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/mock/transfer.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-09-1120.md`
- `.codex-backup/current-todo-2026-06-09-1120.md`
- `.codex-backup/page-state-2026-06-09-1120.md`

修改原因：

- 用户要求在转坐席弹框和外呼弹框的坐席 tab 中去掉状态查询条件，并把列表中的坐席状态统一展示为 Ready。

修改结果：

- `Transfer > Transfer Agent` 查询区去掉 Status 下拉，只保留 Keyword 和 Skill Queue。
- `Outbound Call > Call Agent` 查询区去掉 Status 下拉，只保留 Keyword 和 Skill Queue。
- `transferAgents` mock 中原 `Talking` / `Not Ready` 状态统一改为 `Ready`，两个弹框列表 Status 列均展示 Ready。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP smoke check 通过：`Outbound Call > Call Agent` 不显示 `All status`，6 行坐席状态全部为 `Ready`。
- 本地 Chrome CDP smoke check 通过：通话态 `Transfer > Transfer Agent` 不显示 `All status`，6 行坐席状态全部为 `Ready`。

回滚说明：

- 如需回滚，可恢复两个弹框中的 `statusFilter` 状态、Status Select 和过滤条件，并把 `transferAgents` mock 中对应坐席状态恢复为 `Talking` / `Not Ready`。

当前风险点：

- 这是前端 demo mock 口径；真实系统如果后续要按坐席实时状态筛选，需要从后端实时坐席状态服务恢复状态筛选能力。

### 2026-06-09 11:13 +08:00 - 新增登录页与媒体技能签入模式

修改页面或文件：

- `src/pages/LoginPage.tsx`
- `src/components/AuthRouteGuards.tsx`
- `src/routes.tsx`
- `src/types/auth.ts`
- `src/mock/auth.ts`
- `src/store/authStore.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1113.md`
- `.codex-backup/current-todo-2026-06-09-1113.md`
- `.codex-backup/page-state-2026-06-09-1113.md`

修改原因：

- 客户要求在 UI mockup 中看到登录页，并从登录到技能选择准备 AICC 与 CRM 应用之间的 SSO 工作流口径。
- 用户确认 demo 账号使用 `admin / 888888`，EXT 可选，验证码随机生成；真实程序口径是 AICC 调用 BCA LDAP，失败错误由 LDAP 返回后在 AICC 展示。
- 用户进一步确认技能选择不应放在登录页，而应在登录后的坐席签入时选择，以兼容监控/Supervisor 等不需要 voice/digital 技能的角色；签入方式采用头像下拉直接选择。

修改结果：

- 新增 `/login` 公共登录页，视觉沿用 BANK 1 蓝色 mock 方向，包含 User Name、Password、EXT、PIN/captcha、刷新验证码和错误提示。
- 新增 demo LDAP auth mock 与 `authStore`：成功返回用户 profile、角色权限和 CRM SSO-ready metadata；只把 session/profile metadata 写入 `sessionStorage`，不保存密码。
- 所有业务路由通过 `RequireAuth` 保护；未登录访问 `/`、`/design-system`、`/call-management/*` 会重定向 `/login`，已登录访问 `/login` 会重定向 `/`。
- 登录成功后进入 `/`，坐席仍为 `Unsigned`；右上角下拉显示 `Sign in - Voice only`、`Sign in - Digital only`、`Sign in - Voice + Digital`。
- 签入后右上角第二行显示 `PBK BSB · {mode}`，下拉顶部显示当前 mode；`Sign Out` 只退出媒体签入状态，`Log Out` 清除 auth session 并回到 `/login`。
- `appStore` 新增 `agentServiceMode`、digital readiness 与 voice/video readiness；`Digital only` 拦截 PSTN / voice / video handoff，`Voice only` 拦截 Live Chat handoff，`Voice + Digital` 保持现有流程可用。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 dev server：`http://127.0.0.1:5173/login` 返回 200。
- Headless Chrome smoke check 通过：未登录访问 `/` 重定向 `/login`；错误 PIN 展示错误并停留登录页；错误密码展示 LDAP mock 错误并停留登录页；`admin / 888888` 加正确 PIN 进入 `/` 且坐席仍为 `Unsigned`；未签入下拉显示三种签入方式；`Digital only` 拦截 PSTN 并展示技能不匹配提示；`Voice + Digital` 可打开 PSTN；认证后 `/design-system` 可访问。

回滚说明：

- 如需回滚登录能力，可移除 `/login`、`AuthRouteGuards`、`authStore`、`mock/auth`、`types/auth`，把 `routes.tsx` 恢复为直接挂载 `BasicLayout`；把 `AgentProfileArea` 未签入菜单恢复为单个 `Sign In`，并删除 `agentServiceMode` / digital readiness / skill mismatch 文案。

当前风险点：

- 当前 LDAP、角色权限、CRM SSO metadata 都是前端 demo mock，不接真实 BCA LDAP、真实 CRM SSO 或后端 session。
- Auth session 只保存在 `sessionStorage`，刷新保留、关闭标签页清除；后续接真实服务时需要改为后端 token/session 策略。
- Headless Chrome 中 WhatsApp Demo 的 `Next Step` 未推进到 handoff 点，未能从 UI 自动验证 `Voice only` 阻止 Live Chat；代码路径已在 `BankAppDemoPage` 的 livechat handoff 前读取 `digitalHandoffReadiness` 并显示对应提示，建议人工再走一次 WhatsApp/BankApp Live Chat handoff。

### 2026-06-09 10:52 +08:00 - AUX 下拉改为分组标题和纯文字原因项

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1052.md`
- `.codex-backup/current-todo-2026-06-09-1052.md`
- `.codex-backup/page-state-2026-06-09-1052.md`

修改原因：

- 用户反馈 signed-in AUX 下拉中所有原因都使用同一个图标，容易造成每个原因都需要配置图标的误解。
- 本轮选择让 `AUX` 作为分类标题，原因项只显示文字，不在管理台增加图标维护字段。

修改结果：

- `AgentProfileArea` signed-in 菜单中增加不可点击的 `AUX` group title。
- 启用示忙原因仍按 `BR001` 到 `BR020` 顺序展示，但不再带 `CoffeeOutlined` 图标。
- `No enabled AUX reason` 仍显示在 `AUX` 分组下，保持 disabled。
- Sign Out / Log Out 继续保留原动作图标。
- 新增本地菜单样式，使 `AUX` 分组标题更轻量，原因项左侧按普通文字菜单对齐。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- 本地 Chrome CDP smoke check 通过：未签入菜单显示服务签入项和 `Log Out`；签入后菜单显示 `AUX` group title，group title role 为 `presentation`，点击 group title 不切换状态；9 个原因项 icon count 为 0；点击 `Break` / `Keperluan Pribadi` 后状态仍分别切换为 `AUX - Break` / `AUX - Keperluan Pribadi`。

回滚说明：

- 如需回滚，可把 `AgentProfileArea` 中的 `AUX` group item 改回原因项平铺，并恢复原因项 `CoffeeOutlined` icon；同时删除本轮新增的 group title 样式。

当前风险点：

- Busy Reason 仍是前端 demo store，不接真实后端；刷新浏览器后恢复 mock 默认值。
- 如果客户之后要求每个原因有不同图标，需要另行扩展配置字段和管理台，不建议当前版本提前增加。

### 2026-06-09 10:10 +08:00 - 恢复 AUX 直接下拉并新增 Busy Reason Management

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/call-management/BusyReasonManagementPage.tsx`
- `src/pages/call-management/index.ts`
- `src/mock/busyReasons.ts`
- `src/store/callManagementStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-09-1010.md`
- `.codex-backup/current-todo-2026-06-09-1010.md`
- `.codex-backup/page-state-2026-06-09-1010.md`

修改原因：

- 客户反馈不喜欢 AUX 新弹框，认为之前直接下拉选择示忙原因更快。
- 售前提供客户现有 AUX 截图，用户确认前两项 `AUX`、`Aux New Updated` 不作为业务示忙原因，其余原因按客户原文保留。

修改结果：

- 移除右上角 `Select AUX Reason` 弹框流程，signed-in 头像菜单直接显示启用示忙原因，点击原因立即切换为 `AUX - {reasonName}`。
- `busyReasons` mock 更新为 20 条：前 9 条 `Break`、`Istirahat`、`Job Routine`、`Keagamaan`、`Keperluan Pribadi`、`Meeting/Coaching`、`Special Assignment`、`Toilet`、`Yoga` 为 Enabled；`Extension 1-11` 为 Disabled 备用；Default 全部为 No。
- 新增 `Call Management > Busy Reason Management`，支持 Keyword / Default / Status 查询和 Edit 维护；不提供 Add/Delete。
- `callManagementStore` 增加 `upsertBusyReason` / `resetBusyReasons`，管理页编辑会立即影响坐席 AUX 下拉；刷新后恢复 mock 默认值。
- `Routing Config` 继续隐藏并直达回首页。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仅保留既有 Vite chunk size warning。
- `git diff --check` 通过，仅有 Windows CRLF 换行提示。
- 本地 Chrome CDP smoke check 通过：`/` 正常加载；未签入头像菜单只显示 `Sign In`；签入后菜单显示 9 个启用原因和 `Sign Out`，不显示 `AUX`、`Aux New Updated`、`Extension 1-11` 或 `Select AUX Reason`；点击 `Break` / `Keperluan Pribadi` 后状态分别切换为 `AUX - Break` / `AUX - Keperluan Pribadi`。
- 本地 Chrome CDP smoke check 通过：`/call-management/busy-reasons` 显示 20 条示忙原因；BR001-BR009 为 Enabled，BR010-BR020 为 Disabled，Default 全部为 No；页面无 Add/Delete；编辑 BR001 为 Disabled 后 AUX 下拉不再显示 `Break`，编辑 BR010 为 Enabled 后 AUX 下拉显示 `Extension 1`。
- 本地 Chrome CDP smoke check 通过：`/call-management/verification-rules` 与 `/call-management/text-channel-settings` 正常加载，`/routing-config/channel-types` 回到 `/`。

回滚说明：

- 如需回滚，可恢复 `AgentProfileArea` 中的单个 `AUX` 入口、`Select AUX Reason` 弹框、原 `Ibadah/Makan` mock 数据，并移除 `BusyReasonManagementPage` 路由和菜单入口。

当前风险点：

- Busy Reason 仍是前端 demo store，不接真实后端；刷新浏览器后恢复 mock 默认值。
- 客户截图中的原因名称按原文保留，若后续客户提供正式字典，应以正式字典替换当前 mock。

### 2026-06-06 16:35 +08:00 - 简化验证规则达成展示并开放 Call Management 验证规则配置页

修改页面或文件：

- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/call-management/index.ts`
- `src/pages/call-management/VerificationRulesPage.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-06-1635.md`
- `.codex-backup/current-todo-2026-06-06-1635.md`
- `.codex-backup/page-state-2026-06-06-1635.md`

修改原因：

- 用户要求验证弹窗去掉业务类型后的长统计串，把“需要 5 个正确，其中 1 必填、2 动态、2 静态”的达成情况合并为颜色/进度区分。
- 当前没有客户可看的验证规则配置页，用户确认配置入口应放在 `Call Management`，不是 `Routing Config`；`Routing Config` 继续隐藏。

修改结果：

- 验证弹窗顶部只保留 `Channel Type`、紧凑 `Business Type` 和轻量状态 badge，不再展示 `Correct 0/5 · Wrong 0/3 · Skip 0 · In Progress`。
- 规则区展示 `Need N correct`、Mandatory / Dynamic / Static / Alternative / Layering / Special 彩色达成块，以及弱提示 `Wrong x/y`；删除重复的 remaining 说明。
- 新增 `VerificationRule.status` 与 `needLayering`，规则只读取 enabled 配置。
- `verificationRules` 从 mock clone 到 `appStore`，新增 `updateVerificationRule` / `resetVerificationRules`；坐席验证弹窗和配置页共用同一份前端 demo store。
- 左侧菜单开放 `Call Management`，二级包含 `Verification Rules` 和 `Text Channel Settings`；`/call-management` 默认进入 `/call-management/verification-rules`，`/routing-config/*` 继续回到 `/`。
- 新增 `VerificationRulesPage`，列表按 `Verification Channel Type + Business Type` 展示规则，View/Edit 弹窗可配置渠道类型、业务类型、启停、答对阈值、各题组 required count、错答上限、layering 和 Question Set；配置页不展示标准答案或答案来源。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser check `/call-management/verification-rules`：页面正常打开，表格字段 `Channel Type`、`Business Type`、`Required Rule`、`Question Set`、`Max Wrong`、`Layering`、`Status`、`Actions` 均可见。
- Browser check `/call-management/text-channel-settings`：页面正常打开。
- Browser check `/call-management`：自动跳转到 `/call-management/verification-rules`。
- Browser check `/routing-config`：继续重定向到 `/`，未展示 Routing Config 内容。
- Browser check `/call-management/verification-rules`：`Edit phone-perbankan` 弹窗可打开，能看到配置字段；弹窗未出现 `Demo answer` 或 `Source`。
- Browser check `/design-system`：页面正常加载；console 仅有既有 Ant Design `destroyOnClose` deprecation warning。

回滚说明：

- 如需回滚本轮配置页，可移除 `VerificationRulesPage` 路由和菜单入口，把 `/call-management/*` 恢复为重定向 `/`；将 `CustomerInformationCard` 改回直接读取 mock `verificationRules`。
- 如需回滚弹窗视觉，可恢复长统计串和旧 rule bar 样式，但应保留上一轮“不展示答案/来源”和“单题可改”的业务口径，除非用户明确要求回退。

当前风险点：

- `Call Management > Verification Rules` 当前仅为前端 demo store，不接真实后端，刷新后恢复 mock 默认值。
- 本轮浏览器插件可以验证配置页、路由和 DOM 内容，但在当前会话中 Sign In 下拉与截图 CDP 控制不稳定，未能完整从 UI 触发 PSTN 验证弹窗复查；代码已通过 lint/build，且源码确认坐席弹窗读取同一份 `verificationRules` store。仍需人工在本地页面走一次 `Sign In -> PSTN -> Verify` 验证规则块和配置改动联动。
- 生产环境答案来源、后端匹配方式、验证记录落库和错答处置仍待客户确认。

### 2026-06-06 15:47 +08:00 - 简化 Customer Verification Assist 坐席操作弹窗

修改页面或文件：

- `src/pages/inbound/components/CustomerVerificationModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-06-1547.md`
- `.codex-backup/current-todo-2026-06-06-1547.md`
- `.codex-backup/page-state-2026-06-06-1547.md`

修改原因：

- 用户反馈验证页面内容过多、规则和进度占用高度过高、业务类型下拉框过高、问题行显示答案和来源不适合坐席侧。
- 用户指出坐席误点后不应通过重置整次验证来处理，因为实际业务中不可能要求客户重新回答全部问题。

修改结果：

- 弹窗顶部改为一行紧凑信息栏，包含 `Channel Type`、`Business Type` 和 `Correct/Wrong/Skip/Status` 摘要。
- 规则和进度合并为一条轻量 rule bar；详细规则 notes 收进问号 popover，不再常驻展示。
- 题目行只展示序号、题目分组、问题文本和操作按钮；不再展示 `Demo answer`、`Source` 或答案来源。
- 单题状态支持覆盖修改：坐席可把同一题从 `Wrong` 改为 `Correct`，或从 `Skip` 改为其它状态，统计会实时更新。
- 错答达到上限后仍允许在 Apply 前修正单题；错答数降回上限以下后恢复进行中状态。
- `Reset Progress` 改为低优先级 `Clear All`，仅用于坐席主动清空整次验证进度。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：PSTN `Verify` 弹窗顶部为紧凑信息栏，规则文本按 `Mandatory, Dynamic, Static` 顺序展示，弹窗中 `Demo answer` 和 `Source` 计数为 0。
- Browser smoke check `/`：第一题先点 `Wrong` 再点 `Correct`，统计从 `Wrong 1/3` 变为 `Wrong 0/3`，`Correct` 增加，无需 `Clear All`。
- Browser smoke check `/`：第二题先点 `Skip` 再点 `Correct`，`Skip` 回到 0，统计正确更新。
- Browser smoke check `/`：错答 3 次后出现 `Apply Failed`，随后把一题改为 `Correct`，状态回到 `In Progress` 且 `Apply Failed` 消失。
- Browser smoke check `/`：满足 `Phone + Perbankan` 通过条件后 `Apply Verified` 可用。
- Browser smoke check `/`：BankApp Voice 未 PIN 时显示紧凑 `PIN required` 和 `Send PIN Verification`，不加载题库；客户侧提交 PIN 后坐席侧加载 `HaloApp Registered` 紧凑题库。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚本轮简化，可恢复 `CustomerVerificationModal` 中旧的 metrics、requirements、notes 和 answer/source 渲染；同时恢复题目操作在通过/失败后禁用，以及 footer 文案 `Reset Progress`。

当前风险点：

- 本轮只调整坐席侧验证弹窗展示和前端状态覆盖逻辑，不改变 mock 规则、不接真实答案校验服务。
- `answer` / `answerSource` 仍保留在 mock/type 中作为后续接口讨论材料，但生产是否允许前端持有标准答案仍需客户确认。

### 2026-06-06 14:55 +08:00 - 实现客户身份验证动态题库 Demo

修改页面或文件：

- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/store/appStore.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-06-1455.md`
- `.codex-backup/current-todo-2026-06-06-1455.md`
- `.codex-backup/page-state-2026-06-06-1455.md`

修改原因：

- 用户要求把固定 10 问客户身份验证升级为动态题库 demo，按验证渠道类型和启用业务类型加载题库与规则。
- 用户补充 BankApp 是脱敏名，客户真实含义为 HaloApp；HaloApp 客户接入坐席后，坐席先发送 PIN 输入页，客户在 App 中输入 4 位 PIN 后再继续问题验证。

修改结果：

- 新增验证渠道类型、业务类型、题目分组和验证规则类型；mock 规则覆盖 `Phone + Perbankan`、`HaloApp Registered + Perbankan`、`Phone + Kartu Kredit`、`HaloApp Registered + Kartu Kredit`、`HaloApp Registered + Paylater`。
- Customer Information 的 `Verify` 弹窗升级为 Customer Verification Assist，展示渠道类型、业务类型、规则摘要、题目分组、demo answer、answer source、剩余达标条件和自动通过/失败状态。
- 坐席可切换本次业务类型；切换后题库和答题进度重置。`Correct / Wrong / Skip` 按一次验证会话累计，必问题计入总答对数，`Skip` 不计错也不计对，错答达到上限后进入失败状态。
- BankApp/HaloApp 入口增加 `Send PIN Verification` 演示链路；坐席发送后客户侧 BankApp Demo 展示 4 位 PIN 输入页，客户提交后坐席侧渠道类型切为 `HaloApp Registered` 并加载已登录规则。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：Sign In 后 Live Chat 默认入口仍出现；PSTN Customer Information、Refresh identity、Edit contact、Verify 与 IVR Menu 入口仍可见。
- Browser smoke check `/`：PSTN `Verify` 默认显示 `PSTN / Phone + Perbankan`，答对 1 mandatory + 2 dynamic + 2 static 后 `Apply Verified` 可用并把客户状态改为 `Verified`。
- Browser smoke check `/`：同一次验证会话错答 3 次后 `Apply Failed` 可用，题目操作进入禁用状态。
- Browser smoke check `/`：BankApp Voice 接入后验证弹窗先显示 `HaloApp Unregistered` 和 PIN 前置要求；发送 PIN 后客户侧 BankApp Demo 显示 PIN 输入页，提交后坐席侧重新打开验证弹窗显示 `HaloApp Registered`。
- Browser smoke check `/`：在 HaloApp Registered 验证弹窗切换业务类型到 `Paylater` 后，题库和规则重置为 Paylater demo 规则。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚，可恢复 `CustomerVerificationModal` 为固定 `verificationQuestions` 渲染，移除 `verificationRules` / `verificationBusinessTypes` mock 与新增验证类型，删除 `appStore` 中 BankApp PIN 状态和 `BankAppDemoPage` PIN 输入页；`CustomerInformationCard` 恢复为只传固定问题列表。

当前风险点：

- 当前仅为前端 demo mock，不接真实 CRM、Card Link、CardPack、Base24、HaloApp 登录态接口或后端验证服务。
- Demo 阶段会显示标准答案，生产是否允许坐席看到答案需要客户确认。
- HaloApp PIN 成功后的规则等同性、其它已认证入口是否减免题数、`Berurut` 是否强制顺序、错答 3 次后的处置、验证记录落库和特殊场景触发条件仍待客户确认。

### 2026-06-05 20:07 +08:00 - 修复 Live Chat Current 清空后的右侧空态

修改页面或文件：

- `src/store/appStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-2007.md`
- `.codex-backup/current-todo-2026-06-05-2007.md`
- `.codex-backup/page-state-2026-06-05-2007.md`

修改原因：

- 用户反馈正式文字弹屏在坐席关闭所有 Current 客户后，右侧应无客户关联内容，并应恢复“当前暂无客户接入”类提示。
- 根因是 `LiveChat2Page` 在 Current 没有客户时仍会 fallback 到 `historySessions[0]`，导致右侧继续显示历史客户详情。

修改结果：

- `setLiveChatTabOpen(true)` 在干净签入周期内默认预设两个 Current 客户：`livechat2-001` 服务中，`livechat2-005` 客户主动挂机待坐席关闭。
- `LiveChat2Page` 的当前客户选择改为按 Current / History 视图隔离：Current 只选当前服务列表，History 只选历史列表。
- Current 清空后右侧显示 `No current Live Chat customers` 与新接入提示，不再渲染旧 Customer Information / Conversation / Assistant 客户上下文。
- `LiveChat2CustomerPanel` 在展开态下为 Current / History 空列表增加轻量空态提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：Sign In 后打开 Live Chat，Current 默认显示 2 个客户，`livechat2-005` 显示客户主动挂机状态和 `Close`。
- Browser smoke check `/`：关闭 `livechat2-005` 后 Current 变为 1、History 变为 2，右侧自动回到剩余服务中客户。
- Browser smoke check `/`：对剩余服务中客户执行 End Service 并 Confirm 后，Current 变为 0、History 变为 3，左侧显示 `No current conversations`，右侧显示 `No current Live Chat customers`，不再显示客户详情工作台。
- Browser smoke check `/`：切换到 History 后可看到 3 条历史记录，并可展示历史客户详情。
- Browser smoke check `/design-system`：页面正常加载。
- Browser smoke check 新 WhatsApp route：已打开 WhatsApp Demo 并确认入口存在，但自动化未完整推进到 Agent Workspace；此路径保留为人工复查 TODO。

回滚说明：

- 如需回滚，可恢复 `setLiveChatTabOpen(true)` 不预设默认 session，并恢复 `LiveChat2Page` 旧的 `serviceSessions -> historySessions` fallback 选择逻辑；同时移除客户列表空态 DOM 与 `.livechat2-customer-panel__empty` 样式。

当前风险点：

- 默认双客户是前端 demo seed，不接真实文字渠道队列；同一签入周期内坐席关闭所有 Current 客户后不会自动回补默认客户，需新路由接入或重新签入后重新出现默认场景。

### 2026-06-05 19:34 +08:00 - 优化客户卡片最后菜单提示文案与底部布局

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1934.md`
- `.codex-backup/current-todo-2026-06-05-1934.md`
- `.codex-backup/page-state-2026-06-05-1934.md`

修改原因：

- 用户反馈 `Last IVR Menu` 作为客户卡片内可见标签偏长，并希望优化底部接入标签、最后菜单、验证状态和验证按钮四个元素的摆放。

修改结果：

- 可见标签从 `Last IVR Menu` 缩短为 `Menu`，减少对最后菜单值的横向挤压。
- 最后菜单值继续展示最后一级 IVR 菜单，长文案单行省略。
- `title` 和 `aria-label` 保留完整语义：`Last IVR menu: ...`。
- 第二行 route hint 显式撑满宽度，使用固定短标签列和剩余菜单值列；不改变点击渠道图标打开完整 Call Flow Detail 的交互。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：PSTN Customer Information 第二行显示短标签 `Menu` 和最后一级菜单名，DOM 中不再出现可见 `Last IVR Menu`。
- Browser smoke check `/`：PSTN 菜单值的 `title` / `aria-label` 保留 `Last IVR menu: ...` 完整语义。
- Browser smoke check `/`：点击 PSTN 渠道标签仍打开完整 `Call Flow Detail`；身份刷新 `Paste` / `Confirm` 仍正常。
- Browser smoke check `/`：BankApp Voice 显示 `Menu`；Live Chat 和 BankApp Video / Video Call 不显示菜单行。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚，可将 `CustomerInformationCard` 中的可见标签恢复为 `Last IVR Menu`，并恢复 `.aicc-customer-info__route-hint` 的 grid 列宽；不会影响身份刷新、IVR 显示开关或 Call Flow Detail。

当前风险点：

- 本轮只优化文案与布局，不改变静态 `callFlowDetail.ivrJourney` 数据来源。

### 2026-06-05 19:21 +08:00 - 客户卡片新增最后 IVR 菜单提示

修改页面或文件：

- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1921.md`
- `.codex-backup/current-todo-2026-06-05-1921.md`
- `.codex-backup/page-state-2026-06-05-1921.md`

修改原因：

- 用户希望坐席在 Customer Information 卡片中一眼看到客户最后进入的 IVR 菜单，不需要先点击渠道图标打开完整 Call Flow Detail。
- 当前客户卡片底部第一行已有渠道/接入时长、验证状态和 Verify，直接塞入长菜单会挤压现有操作。

修改结果：

- `CustomerInformationPanel` 新增可选 `accessRouteHintNode` 插槽，在现有 access strip 下方渲染第二行轻量提示。
- `CustomerInformationCard` 仅对 `Phone` 或包含 `Voice` 的语音/IVR 渠道展示该提示；Live Chat / Video 不展示。
- 提示内容从现有 `callFlowDetail.ivrJourney` 最后一项 `nodeName` 读取，显示为 `Last IVR Menu` + 最后一级菜单名。
- 长菜单名单行省略，`title` 保留完整文案；点击现有渠道图标仍打开完整 `Call Flow Detail`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：PSTN Customer Information 第一行仍显示 `PSTN 05:23`、验证状态和 `Verify`，第二行显示 `Last IVR Menu` 与最后一级菜单。
- Browser smoke check `/`：点击 PSTN 渠道图标仍打开完整 `Call Flow Detail`，包含 IVR Journey 三个节点和 Transfer History。
- Browser smoke check `/`：PSTN 身份刷新 `Paste` 仍填入 `00000078987`，`Confirm` 后客户信息、Customer Journey 和 Ticketing History 刷新。
- Browser smoke check `/`：BankApp Voice Customer Information 显示 `BankApp 00:12` 和 `Last IVR Menu`。
- Browser smoke check `/`：Live Chat 不显示 `Last IVR Menu`；BankApp Video / Video Call 不显示 `Last IVR Menu`。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚，可移除 `accessRouteHintNode` prop、`CustomerInformationCard` 中的 route hint 生成逻辑，以及 `.aicc-customer-info__route-*` 样式；不会影响身份刷新、接入时长修复或 Call Flow Detail 弹框。

当前风险点：

- 本轮先复用静态 `callFlowDetail.ivrJourney`，不同通话实例不会展示不同 IVR path；后续接后端或多实例 IVR mock 时应把路径数据下沉到具体 interaction/customer 级别。

### 2026-06-05 19:04 +08:00 - 修复正式 Live Chat 客户卡接入时长持续计时

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/store/appStore.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1904.md`
- `.codex-backup/current-todo-2026-06-05-1904.md`
- `.codex-backup/page-state-2026-06-05-1904.md`

修改原因：

- 用户反馈 Customer Information 客户卡片里的接入时长在持续计时；该字段业务含义应为客户转人工成功前耗时，接入坐席后应冻结。
- 根因是正式 `LiveChat2Page` 将 `activeSession.elapsedSeconds` 格式化后覆盖到 `customer.accessDuration`，把服务时长误显示到客户卡片渠道标签中；`createLiveChat2HandoffSession()` 还会把 handoff 客户的接入时长重置为 `00:00`。

修改结果：

- `LiveChat2Page` 不再向 `InteractionWorkspace` 传入 `accessDuration: formatDuration(activeSession.elapsedSeconds)`，Customer Information 直接使用 `activeSession.customer.accessDuration`。
- `appStore.createLiveChat2HandoffSession()` 保留来源 session 的 `customer.accessDuration`，新接入实例不再重置为 `00:00`。
- Workspace tab、Live Chat 客户列表、Conversation header、SLA / 未回复计时继续使用 `elapsedSeconds` 服务计时，不影响服务中时长展示。
- PSTN / Voice / Video 未修改，继续使用各自静态 `accessDuration`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：签入后打开 Live Chat，Customer Information 渠道接入时长来自客户 mock 静态字段，服务时长仍在 Live Chat tab / Conversation 中继续展示。
- Browser smoke check `/design-system`：页面可正常加载。

回滚说明：

- 如需回滚，可在 `LiveChat2Page.tsx` 恢复对 `activeSession.elapsedSeconds` 的 `accessDuration` 覆盖，并在 `createLiveChat2HandoffSession()` 中恢复 `accessDuration: '00:00'`；但会重新出现客户卡片接入时长随服务计时增长的问题。

当前风险点：

- 本轮修复只区分前端 mock 数据中的接入耗时和服务耗时；后续接真实后端时仍需保证接口字段语义一致。

### 2026-06-05 18:52 +08:00 - 修复客户信息右上角图标 hover 背景内不居中

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1852.md`
- `.codex-backup/current-todo-2026-06-05-1852.md`
- `.codex-backup/page-state-2026-06-05-1852.md`

修改原因：

- 用户反馈 Customer Information 右上角图标不在 hover 背景正中。

修改结果：

- 统一 Customer Information header action 的布局盒：
  - `.aicc-base-card__header-extra` 使用 `min-height: 22px`，匹配 22px action button。
  - `.aicc-customer-info__header-actions` 增加 `line-height: 0`。
  - `.aicc-customer-info__edit-button` 清除默认 `padding`。
  - `.aicc-customer-info__edit-button .anticon` 使用 inline-flex 居中。
- 保留身份刷新和编辑联系方式两个图标，以及现有 Customer ID 浮层位置修复。

验证：

- Browser 打开 `/`，签入后触发 PSTN，验证 `Refresh customer identity` 与 `Edit contact` 两个按钮均存在。
- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。

回滚说明：

- 如需回滚本轮居中修复，可恢复 `.aicc-base-card__header-extra` 高度、移除 header actions line-height / button padding / icon inline-flex 调整；但会重新出现 hover 背景内图标视觉不居中的风险。

当前风险点：

- 本轮仅修 header action 视觉对齐，不修改身份刷新业务逻辑。

### 2026-06-05 18:45 +08:00 - 修复客户 ID 浮层偏左进入菜单范围

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1845.md`
- `.codex-backup/current-todo-2026-06-05-1845.md`
- `.codex-backup/page-state-2026-06-05-1845.md`

修改原因：

- 用户反馈 Customer ID 身份刷新浮层偏左，整体进入左侧菜单范围。

修改结果：

- 将身份刷新 Popover 从 `bottomRight` 调整为 `bottom`，避免浮层以图标右边对齐后大幅向左展开。
- 将 `.aicc-identity-refresh-popover` 宽度从 `250px` 收窄为 `224px`。
- 保留 Customer Information 右上角两个图标：`Refresh customer identity` 与 `Edit contact`。
- 未修改身份刷新 mock、Paste/Confirm 逻辑或客户数据刷新流程。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser 打开 `/`，签入后触发 PSTN，验证 `Refresh customer identity` 与 `Edit contact` 两个按钮均存在。
- Browser 打开身份刷新浮层，读取 AntD Popover 定位为 `left: 489.322px`，左侧菜单宽度为 `220px`，确认浮层不在左侧菜单范围内。
- Browser 验证 `Paste` 仍自动填入 `00000078987`，`Confirm` 后客户信息、Customer Journey 与 Ticketing History 仍正常刷新；Confirm 后 Popover 不可见。

回滚说明：

- 如需回滚位置修复，可将 Popover placement 恢复为 `bottomRight`，并将 `.aicc-identity-refresh-popover` 宽度恢复为 `250px`；但会重新出现浮层偏左风险。

当前风险点：

- 本轮只修浮层位置，不修改真实剪贴板或后端 CRM 查询能力。

### 2026-06-05 18:36 +08:00 - 来电弹屏新增客户身份刷新并修复右上角双图标裁剪

修改页面或文件：

- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerJourneyCard.tsx`
- `src/pages/inbound/components/TicketingHistoryCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1836.md`
- `.codex-backup/current-todo-2026-06-05-1836.md`
- `.codex-backup/page-state-2026-06-05-1836.md`

修改原因：

- 用户要求在客户可见发布分支上新增客户身份更新能力，用于朋友电话呼入导致客户身份未加载时，坐席从 CRM 查询并复制客户 ID 后手动刷新来电弹屏客户身份。
- 用户进一步指出编辑客户联系方式图标不能被身份刷新图标替换或隐藏，两个图标都必须放在 Customer Information 右上角。

修改结果：

- 从 `main` 创建发布隔离分支 `codex/customer-identity-refresh`。
- PSTN 初始客户改为 `Unidentified Customer`，Customer Journey 与 Ticketing History 初始显示未加载空态。
- 新增身份刷新演示 ID `00000078987` 与 `lookupCustomerIdentityRefresh()` mock 查询 helper；正确 ID 返回现有 Dimas 客户资料、旅程和工单。
- Customer Information 右上角新增身份刷新按钮；浮层包含 Customer ID 输入框、`Paste` 和 `Confirm`。
- `Paste` 不读取真实剪贴板，直接填入 `00000078987`，模拟坐席已复制客户 ID。
- 错误 ID 或空 ID 会在浮层内提示并保持浮层打开；正确 ID 确认后关闭浮层，并刷新当前工作台实例的 Customer Information、Customer Journey、Ticketing History。
- 修复 `.aicc-base-card__header-extra` 固定 `20px` 宽导致两个 header action 被裁剪的问题；身份刷新图标和原编辑联系方式图标现在同时显示在卡片右上角。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser 打开 `/`，签入后触发 PSTN，验证初始显示 `Unidentified Customer`、`Caller ID unavailable`、`Customer ID not loaded`，Journey / Ticketing 显示未加载空态。
- Browser 验证 Customer Information 右上角 `Refresh customer identity` 与 `Edit contact` 两个按钮均存在，各 1 个。
- Browser 输入错误 ID，验证显示 `No customer found for this ID.` 且浮层保持打开。
- Browser 点击 `Paste`，验证输入框自动填入 `00000078987`；点击 `Confirm` 后客户信息刷新为 Dimas，空态消失，Journey 与 Ticketing 数据出现。

回滚说明：

- 如需回滚本轮身份刷新功能，可恢复 `InboundPage.tsx` 使用 `inboundCustomer` 初始客户，移除 `InteractionWorkspace` 中 identity override 状态和 `CustomerInformationCard` 身份刷新浮层，删除新增 mock helper、类型和空态样式。
- 如只回滚双图标裁剪修复，恢复 `.aicc-base-card__header-extra` 的固定宽度即可，但会重新导致 Customer Information 右上角两个 action 被裁剪，不建议。

当前风险点：

- 身份查询是前端 mock，只支持固定 ID `00000078987`。
- `Paste` 是演示按钮，不读取真实剪贴板；这符合当前演示口径，但不是生产剪贴板集成。
- 刷新只更新左侧三张卡片，不自动更新已打开的 CRM 动态 tab。

### 2026-06-05 15:56 +08:00 - 客户分支新增 AUX 示忙原因选择弹框

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `src/types/agent.ts`
- `src/types/busyReason.ts`
- `src/types/index.ts`
- `src/mock/busyReasons.ts`
- `src/store/callManagementStore.ts`
- `src/store/index.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-05-1556.md`
- `.codex-backup/current-todo-2026-06-05-1556.md`
- `.codex-backup/page-state-2026-06-05-1556.md`

修改原因：

- 用户要求先清理无用本地分支，并在客户可发布基线上实现 AUX 改造。
- AUX 改造要求根据示忙原因配置，点击 AUX 后弹框列出启用状态的示忙原因，默认选中默认原因，确认后再切换坐席状态。
- 该功能后续要发布给客户，因此必须基于 `main` 的隐藏管理菜单版本开发，避免把本地 Call/Routing 管理菜单带出去。

修改结果：

- 删除了 5 个本地已合并旧分支：`codex/customer-preview-hide-admin-menus`、`codex/fix-toolbar-chat-modals`、`codex/livechat2-popup`、`codex/local-livechat2-integrated`、`codex/modal-review-fixes`；未删除远端分支。
- 从 `main` 创建客户安全分支 `codex/customer-aux-busy-reason-modal`。
- 新增客户分支最小 Busy Reason 类型、mock 和 store；mock 包含 `Ibadah` 默认启用、`Makan` 启用、`Training` 禁用、`Extension 1-7` 禁用。
- `AgentStatus` 改为支持动态 `AUX - ${string}`。
- 右上角头像菜单签入后显示单个 `AUX` 入口，不再直接显示 `AUX - Ibadah` / `AUX - Makan`。
- 点击 `AUX` 打开 `Select AUX Reason` 弹框，只展示启用原因；点击 `Confirm` 后调用现有 `onStatusChange` 切换为 `AUX - {reasonName}`。
- `Call Management` 与 `Routing Config` 菜单和直达路由保持隐藏。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser 打开 `/`，验证首页加载，左侧没有 `Call Management` 和 `Routing Config`。
- Browser 验证签出菜单只显示 `Sign In`；签入后菜单显示 `AUX` 和 `Sign Out`，不显示直接的 `AUX - Ibadah` / `AUX - Makan`。
- Browser 点击 `AUX`，验证弹框显示 `Select AUX Reason`，只列出 `Ibadah` 和 `Makan`，不显示 `Training` 或 `Extension 1-7`，原因项不显示额外说明文字。
- Browser 点击 `Confirm`，验证状态计时区显示 `AUX - Ibadah`，弹框关闭。
- Browser 打开 `/call-management/busy-reasons`，验证仍重定向回 `/`，没有暴露管理页面。
- `/design-system` HTTP 检查返回 200。

回滚说明：

- 如需回滚本轮 AUX 改造，可恢复 `AgentProfileArea.tsx` 中静态 `AUX - Ibadah` / `AUX - Makan` 菜单项，删除最小 Busy Reason 类型/mock/store 和相关导出，并移除本轮新增样式。
- 如需恢复旧本地分支，可从对应 commit 重新创建；本轮没有删除任何远端分支。

当前风险点：

- Busy Reason 数据在客户分支仍是前端 mock，不接后端或管理页面；后续如果要动态维护，需要单独接入后端或客户安全的配置来源。
- 当前 AUX 默认原因由 mock 中的 `isDefault` 决定；如果所有启用原因都没有默认值，则会选中启用列表第一条。

### 2026-06-04 12:29 +08:00 - 客户 Production 发布合入 main

修改页面或文件：

- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-1229.md`
- `.codex-backup/current-todo-2026-06-04-1229.md`
- `.codex-backup/page-state-2026-06-04-1229.md`

修改原因：

- 用户确认本地客户发布版本效果没问题，需要发布到客户可访问的正式版本，同时发布后本地切回开发分支继续做未完成管理菜单。

修改结果：

- `main` 已 fast-forward 合入 `codex/customer-preview-hide-admin-menus`。
- Production 版本保留主工作台和主演示路径，隐藏 `Call Management` 与 `Routing Config`，并禁用对应直达 URL。
- 未完成管理功能代码不删除，后续本地开发切回 `codex/text-channel-config-settings` 继续。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- 待推送 `main` 后确认 Vercel Production deployment 状态。

回滚说明：

- 如需回滚 Production，可将 `main` 回退到发布前 commit `7e651bc` 或重新部署上一版；回滚前应确认客户是否已经拿到新链接。

当前风险点：

- Production 部署是否客户可直接访问取决于 Vercel Production 设置；需要部署完成后检查 Production URL。

### 2026-06-04 12:10 +08:00 - 客户预览发布屏蔽未完成管理菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-1210.md`
- `.codex-backup/current-todo-2026-06-04-1210.md`
- `.codex-backup/page-state-2026-06-04-1210.md`

修改原因：

- 用户需要发布 Vercel Preview 给客户查看，但 `Call Management` 和 `Routing Config` 两块管理功能尚未完成，不能暴露给客户。

修改结果：

- 从左侧菜单移除 `Call Management` 与 `Routing Config` 两个一级菜单。
- `/call-management`、`/call-management/*`、`/routing-config`、`/routing-config/*` 全部重定向到 `/`，避免客户通过直达 URL 打开未完成页面。
- 保留相关页面源码、mock、store 和类型文件，不删除未完成功能，方便后续继续开发或恢复入口。
- 创建发布分支 `codex/customer-preview-hide-admin-menus`，目标为 Vercel Preview URL，不直接发布 Production。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown plugin timing 与 chunk size warning。
- Browser `http://127.0.0.1:5176/`：确认首页正常加载，展开侧栏后仅显示 Channel Simulation、Agent Center、Operations、Reports，不显示 `Call Management` 或 `Routing Config`。
- Browser `/design-system`：确认正常加载。
- Browser `/call-management/text-channel-settings` 与 `/routing-config/route-elements`：均重定向回 `/`，且未出现对应管理页内容。
- Browser smoke check：BankApp Demo、WhatsApp Demo、Sign In 后 Live Chat tab、Ready 状态下 PSTN 弹屏均可用。
- Git commit `421aa72 Prepare customer preview without admin menus` 已创建并推送到 `origin/codex/customer-preview-hide-admin-menus`。
- GitHub / Vercel status 显示 Preview deployment 成功；每次 push 会生成新的 per-commit Preview URL，应以 GitHub deployment status / Vercel 最新部署记录为准。
- 远端 Preview URL 在未登录浏览器中跳转到 Vercel login，未能完成远端页面内容 smoke check。

回滚说明：

- 如需恢复管理菜单，重新在 `BasicLayout` 接回 `Call Management` 与 `Routing Config` 菜单项，并在 `routes.tsx` 恢复对应页面路由。

当前风险点：

- 当前分支包含此前本地整合分支的大量未提交功能与备份文件；本轮不回滚这些历史改动，客户预览依赖当前工作区整体状态。
- Preview deployment 已生成，但当前受 Vercel 登录/Deployment Protection 限制；客户直接访问前需要调整 Vercel 访问保护或获取可公开访问的分享链接。

### 2026-06-04 11:16 +08:00 - Working Time Plans Holiday/Special Start 列对齐

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-1116.md`
- `.codex-backup/current-todo-2026-06-04-1116.md`
- `.codex-backup/page-state-2026-06-04-1116.md`

修改原因：

- 用户反馈 Holiday Name / Reason 输入框太短，导致 Holiday / Special 的 `Start` 时间列没有和 Ramadan Work Schedule 对齐。

修改结果：

- Holiday / Special 行 grid 从 `150px 150px 240px 120px 120px 30px` 改为 `150px 150px minmax(360px, 1fr) 120px 120px 30px`。
- Holiday Name / Reason 列改为弹性列，占用剩余空间；Start Date / End Date 仍为 150px，Start / End 仍为 120px。
- 未修改字段、校验、保存逻辑或 Working Time Plans 底部提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- 源码扫描确认 Holiday / Special grid 已更新为 `minmax(360px, 1fr)`。

回滚说明：

- 如需回滚，将 Holiday/Special grid 恢复为 `150px 150px 240px 120px 120px 30px`。

当前风险点：

- 仍需用户在浏览器中人工复查弹框内实际视觉对齐效果。

### 2026-06-04 11:02 +08:00 - Working Time Plans 提示与行宽调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-1102.md`
- `.codex-backup/current-todo-2026-06-04-1102.md`
- `.codex-backup/page-state-2026-06-04-1102.md`

修改原因：

- 用户指出 `Empty Skill Queue plan means Default 24x7` 语义不准确，实际是技能队列未引用工作时间方案时默认按 24x7 处理，不应放在 Working Time Plans 页面底部解释。
- 用户要求 Holiday Schedule 与 Special Working Plan 的时间控件宽度更接近 Ramadan Work Schedule，并缩短 Holiday Name / Reason 输入框。

修改结果：

- Working Time Plans 弹框底部提示只保留排班优先级：`Priority: Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule.`
- 移除 `Empty Skill Queue plan means Default 24x7.` 文案。
- Holiday / Special 行 grid 当时改为 `150px 150px 240px 120px 120px 30px`；后续 11:16 已修正为 `150px 150px minmax(360px, 1fr) 120px 120px 30px`，用于对齐 Start 列。
- 未修改 `Default 24x7` 在 Skill Queues 中的展示口径。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认页面正常渲染，列表页不出现旧提示。
- 源码扫描确认旧提示不存在，新优先级提示存在。

回滚说明：

- 如需回滚，恢复旧优先级提示文本，并将 Holiday/Special grid 恢复为 `136px 136px minmax(180px, 1fr) 104px 104px 30px`。

当前风险点：

- in-app browser 点击 Add 弹框仍受控制接口 3 秒超时影响，未完成弹框内视觉点击验证；源码、lint、build 和页面渲染检查已通过。

### 2026-06-04 10:38 +08:00 - Skill Routing Rules 重复规则区文案调整

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-1038.md`
- `.codex-backup/current-todo-2026-06-04-1038.md`
- `.codex-backup/page-state-2026-06-04-1038.md`

修改原因：

- 用户确认 `Batch Add Skill Routing Rules` 弹框中的 `Generated Routing Rules Preview` 文案不准确；该区域实际应表达“已有重复规则”，不是普通新规则预览。

修改结果：

- 分区标题改为 `Duplicate Routing Rules`。
- 提示文案改为：`The following route combinations already exist. Selected rows will update the existing skill queue to the current target queue; unselected rows will remain unchanged.`
- 表格数据源从 `batchPreviewRows` 改为 `duplicatePreviewRows`，该区域只展示重复规则。
- 新组合仍由现有保存逻辑正常新增，不在重复规则表中展示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认页面正常渲染且 `Batch Add` 按钮存在。
- 源码扫描确认新标题、新提示文案和 `dataSource={duplicatePreviewRows}` 已生效，旧标题不再存在。

回滚说明：

- 如需回滚，将标题恢复为 `Generated Routing Rules Preview`，提示文案恢复旧文本，并将表格数据源恢复为 `batchPreviewRows`。

当前风险点：

- in-app browser 点击 `Batch Add` 仍受控制接口 3 秒超时影响，未完成弹框内视觉点击验证；源码和构建验证已通过。

### 2026-06-04 00:28 +08:00 - Skill Routing Rules 主操作按钮右侧独立

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-0028.md`
- `.codex-backup/current-todo-2026-06-04-0028.md`
- `.codex-backup/page-state-2026-06-04-0028.md`

修改原因：

- 用户指出 `Skill Routing Rules` 菜单中按钮应按管理台统一样式规则放在最右侧，而不是紧挨 `Reset`。

修改结果：

- `SkillRoutingRulesPage` 工具栏结构调整为普通管理台结构：左侧 `query-group` 包含筛选条件和 `Search / Reset`，右侧独立 `add-action` 放置 `Batch Add`。
- 移除规则页此前 `admin-toolbar--rules` 的 block 布局和 `filters--rules` 内部 Add 特殊覆盖。
- 未修改查询字段、表格列、Batch Add 弹框逻辑或数据结构。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认页面正常渲染，查询区仍显示 Search / Reset / Batch Add。

回滚说明：

- 如需回滚，恢复 `SkillRoutingRulesPage` 将 `Batch Add` 放回 filters 容器，并恢复规则页专属 CSS 覆盖；不建议回滚，因为当前结构更符合管理台统一规范。

当前风险点：

- 无新增技术风险；仍需人工视觉复查不同窗口宽度下 `Batch Add` 是否稳定靠右。

### 2026-06-04 00:13 +08:00 - Site Access Volume 增加媒体类型筛选

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-04-0013.md`
- `.codex-backup/current-todo-2026-06-04-0013.md`
- `.codex-backup/page-state-2026-06-04-0013.md`

修改原因：

- 用户要求 `Site Access Volume` 查询条件把媒体类型单独拎出来，使用下拉选择。

修改结果：

- `Site Access Volume` 查询区改为 `Keyword + Media Type + Status`。
- `Keyword` 只匹配 Channel ID / Channel Code / Channel Name，不再把媒体类型混在关键字里。
- `Media Type` 独立下拉，选项为 `All / Voice / Video / Text`。
- 按媒体类型筛选后，表格只展示命中的媒体行，并重新计算同一渠道合并单元格的 `rowSpan`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：确认查询区显示 `Keyword / Media Type / Status`，页面正常渲染。

回滚说明：

- 如需回滚，移除 `mediaCode` filter state、Media Type 下拉和媒体过滤逻辑，将 Keyword 恢复为同时匹配媒体名称。

当前风险点：

- 无新增技术风险；仍需人工复查选择不同 Media Type 后的合并单元格和分页体验。

### 2026-06-03 19:52 +08:00 - Routing Config 标题英文统一

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1952.md`
- `.codex-backup/current-todo-2026-06-03-1952.md`
- `.codex-backup/page-state-2026-06-03-1952.md`

修改原因：

- 用户要求 `Routing Config` 下的子菜单改成英文名，页面上的菜单名称和弹框标题名称也统一使用英文。

修改结果：

- 左侧 `Routing Config` 二级菜单统一为英文：Route Elements、VDN、Access Sites、Channels、Media Service Rule Plans、Business Types、Skill Queues、Access Accounts、Site Access Volume、Skill Routing Rules、Working Time Plans。
- `RoutingConfigDataPages.tsx` 所有 Routing Config 子页标题改成英文。
- `SkillRoutingRulesPage.tsx` 页面标题改成 `Skill Routing Rules`。
- 普通 CRUD 弹框通过英文页面标题或英文 `entityName` 派生标题；自定义弹框标题保持现有英文文案。
- 未修改路由 path、字段、mock 数据或管理台样式结构。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`、`/routing-config/channels`、`/routing-config/media-service-rule-plans`、`/routing-config/skill-routing-rules`：确认页面主标题显示英文，未发现中文标题残留。

回滚说明：

- 如需回滚，恢复上述页面 title 和 `BasicLayout` 菜单 label；路由 path 无需回滚。

当前风险点：

- 浏览器弹框点击验证在本轮受 in-app browser 控制接口超时影响未完成；源码扫描已确认 `modalLabels`、`modalTitle` 和通用 CRUD 标题派生均为英文。

### 2026-06-03 19:06 +08:00 - 补齐自定义管理页标准根容器

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-03-1906.md`
- `.codex-backup/current-todo-2026-06-03-1906.md`
- `.codex-backup/page-state-2026-06-03-1906.md`

修改原因：

- 用户指出新页面仍有明显字号变大、按钮高度不符合管理台规范的问题。
- 复查发现根因是两个自定义页面缺少标准 `<section className="routing-config-page">` 根容器，导致 `.routing-config-page .aicc-table ...` 等作用域样式未生效。

修改结果：

- `Channels` 与 `Media Service Rule Plans` 的 `BaseCard compact` 现在都包在 `<section className="routing-config-page">` 内。
- `routing-config-crud-modal__sections` 增加 `--routing-config-control-height: 32px`，让复杂分区弹框内控件继续继承标准高度。
- 明确后续自定义管理页结构必须为 `PageContainer > section.routing-config-page > BaseCard compact > admin-toolbar + BaseTable`，不能只复制局部 class。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认存在 `.routing-config-page` 根容器，表格、Search、Add 都处于该作用域内。
- Browser `/routing-config/media-service-rule-plans`：确认存在 `.routing-config-page` 根容器，`Key Rules` 不存在。

回滚说明：

- 如需回滚，删除两个页面新增的 `section.routing-config-page` 包裹和 `routing-config-crud-modal__sections` 中的控件高度变量；但不建议回滚，因为这是管理台标准样式生效的必要条件。

当前风险点：

- 无新增技术风险；后续新增复杂管理页必须优先复用完整页面骨架，而不是只复用局部 class。

### 2026-06-03 19:01 +08:00 - 自定义 Routing Config 页标准化收口

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-03-1901.md`
- `.codex-backup/current-todo-2026-06-03-1901.md`
- `.codex-backup/page-state-2026-06-03-1901.md`

修改原因：

- 用户指出不能只修正查询条件间距，其它样式也要检查；自定义页不应自创样式，而应复用管理台标准规范。

修改结果：

- `Channels` 与 `Media Service Rule Plans` 表格操作列改为标准 `routing-config-crud__row-actions` 原生图标按钮。
- 两个页面的 `BaseModal` 改为标准 `kind="detail"`，取消自定义 `footer` prop；footer 使用标准 `routing-config-crud-modal__footer`。
- 删除弹框改为标准 `Alert` 结构，引用保护时直接展示不可删除提示。
- 校验提示类型改为 warning，与普通 CRUD 页一致。
- 两个复杂弹框的业务分区改用通用 `routing-config-crud-modal__sections / __section / __section-grid / __section-title`，删除 `routing-config-channel-modal__*` 与大部分 `routing-config-media-rule-modal__*` 页面专属布局类。
- 删除上一轮临时新增的 `routing-config-page__admin-toolbar > label/button` 样式，避免继续支持非标准 toolbar 结构。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认查询栏、Rule Plan 列和 Add Channel 弹框可见。
- Browser `/routing-config/media-service-rule-plans`：确认查询栏、列表字段和 Add Media Service Rule Plan 弹框可见，`Key Rules` 不存在。

回滚说明：

- 如需回滚，恢复两个页面的自定义 row action、BaseModal footer prop、页面专属 modal layout CSS 和上一轮 toolbar 直子 CSS。

当前风险点：

- Media Service Rule Plan 弹框仍有少量业务专属行布局，如变量 tag、Queue Alert 行和媒体绑定行；这些是业务输入结构所需，但已尽量挂在通用 CRUD modal 框架下。

### 2026-06-03 18:45 +08:00 - 渠道媒体规则页查询栏样式统一

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-03-1845.md`
- `.codex-backup/current-todo-2026-06-03-1845.md`
- `.codex-backup/page-state-2026-06-03-1845.md`

修改原因：

- 用户指出新加的自定义管理页没有和其它管理界面保持同一套样式标准，出现查询条件间隔过大、按钮高度不一致等问题。
- 用户要求 `Media Service Rule Plans` 列表去掉 `Key Rules` 字段。

修改结果：

- `Channels` 和 `Media Service Rule Plans` 的查询栏改回普通 `RoutingConfigCrudPage` 同款结构：`query-group + filters + admin-actions + add-action`。
- 查询字段不再直接作为 `admin-toolbar` 子元素，避免 `justify-content: space-between` 把字段拉开。
- Search / Reset / Add 改用统一 `BaseButton variant`，继承其它管理台按钮高度与样式。
- 两个自定义页表格卡片改为 `BaseCard compact`。
- `Media Service Rule Plans` 列表删除 `Key Rules` 列。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels` 与 `/routing-config/media-service-rule-plans`：确认查询区关键字段和按钮可见，`Key Rules` 不再出现。

回滚说明：

- 如需回滚，恢复两个页面直接使用 `admin-toolbar` 子元素的查询栏结构，并把 `Key Rules` 列加回 `Media Service Rule Plans`。

当前风险点：

- 无新增技术风险；仍需用户继续目测确认自定义页与普通 CRUD 页的视觉完全一致。

### 2026-06-03 18:26 +08:00 - 渠道媒体服务规则方案与绑定

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1826.md`
- `.codex-backup/current-todo-2026-06-03-1826.md`
- `.codex-backup/page-state-2026-06-03-1826.md`

修改原因：

- 用户要求细化 `Channels` 下不同媒体的业务规则，并提出这些参数更适合像工作时间方案一样单独配置，再由 `Channel + Media Type` 引用。
- 用户明确先忽略现有 `Text Channel Settings`，后续会直接废弃该页。

修改结果：

- 新增 `Media Service Rule Plans / 媒体服务规则配置` 页面和 `/routing-config/media-service-rule-plans` 路由，菜单位置放在 `Channels` 后。
- 新增 `MediaServiceRulePlan`、`TextMediaQueueAlertRule`、`ChannelMediaRuleBinding` 类型，并在 mock/store 中接入本地 CRUD 数据。
- 新增两条 Text 规则方案 mock：`Standard Text Service` 与 `Priority Text Service`。
- 当前所有 Text 渠道 mock 都有 `Channel + Text` 绑定；Haloapp 默认绑定 Priority，其他 Text 渠道默认绑定 Standard。
- `Channels` 页面改为自定义管理页，列表新增 `Rule Plan` 摘要；Add/Edit 弹框根据媒体类型展示 `Media Rule Plan Binding`，Text 可选 Enabled Text rule plan，Voice / Video 显示 `Reserved / Not configured`。
- Text 规则方案弹框按 Basic Info、Capacity & Agent No Reply、Customer Timeout、Lifecycle Messages、Channel-specific Rules 分区维护；支持队列阈值、通知对象和 Webchat Recall Limit。
- 删除 Media Service Rule Plan 时会检查 `ChannelMediaRuleBinding` 引用，被引用时给出阻止提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认列表显示 Rule Plan 和两个示例规则方案；Add 弹框显示媒体规则绑定区。
- Browser `/routing-config/media-service-rule-plans`：确认页面打开、列表和 Add 弹框关键分区可见。

回滚说明：

- 如需回滚，删除新增类型、mock/store 集合、`MediaServiceRulePlansPage`、菜单/路由、Channels 的 Rule Plan 绑定 UI 和相关样式；恢复 Channels 为原 `RoutingConfigCrudPage<Channel>` 实现。

当前风险点：

- Voice / Video 规则仍只是预留，不维护专属字段。
- 现有 `Call Management > Text Channel Settings` 仍在菜单中保留，等待用户确认后续删除废弃；本轮没有复用它的数据结构。

### 2026-06-03 16:50 +08:00 - Working Time Plans 排班弹框简化

修改页面或文件：

- `package.json`
- `package-lock.json`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1650.md`
- `.codex-backup/current-todo-2026-06-03-1650.md`
- `.codex-backup/page-state-2026-06-03-1650.md`

修改原因：

- 用户确认上一轮样式方向可用，但要求继续简化：多行排班不再使用横线分隔，`Add Row` 文案简化为 `Add`。
- 用户要求 Holiday Schedule 去掉 `Closed` / `Closed All Day` 开关，像 Work Schedule 一样直接维护开始和结束时间。
- 用户指出日期控件显示中文，需要解释并修正。

修改结果：

- Work/Ramadan/Holiday/Special 的 `Add Row` 文案统一改为 `Add`。
- 排班行移除横向分隔线，仅保留紧凑行间距；多行仍只有首行显示字段名。
- Holiday Schedule 字段简化为 Start Date、End Date、Holiday Name、Start、End；不再展示 Closed All Day、Non-working Start、Non-working End。
- Holiday 新增默认时间段改为 `00:00-23:59`，mock 中 New Year Holiday 同步用该时间段表达全天非工作。
- 保存归一化时将历史 `closedAllDay` 置为 false，并为缺失时间段的 Holiday 补充 `00:00-23:59`。
- 日期字段从浏览器原生 `input type="date"` 改为 AntD DatePicker，并新增直接依赖 `dayjs`，避免日期控件跟随操作系统语言显示中文。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认 Add 弹框中没有 `Add Row`、`Closed All Day`、`Non-working` 和原生 date input；编辑已有方案时 DatePicker 数量为 6，弹层显示英文 `Today` / `Select date`。

回滚说明：

- 如需回滚，恢复 `Input type="date"`、Holiday 的 Closed All Day 开关、Non-working Start / End 文案、排班行横向分隔线和 `Add Row` 按钮文案，并从 package 中移除直接 `dayjs` 依赖。

当前风险点：

- `HolidayScheduleRule` 类型中仍保留 `closedAllDay` 兼容旧数据，但页面不再展示该字段；后续真实后端 schema 可考虑移除或废弃该字段。

### 2026-06-03 16:37 +08:00 - Working Time Plans 排班行样式优化

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1637.md`
- `.codex-backup/current-todo-2026-06-03-1637.md`
- `.codex-backup/page-state-2026-06-03-1637.md`

修改原因：

- 用户要求 Work Schedule 的 Add Row 放到右上角，并且多行录入时去掉每行外边框、后续行不重复显示字段名称。
- 用户要求 Ramadan Work Schedule、Holiday Schedule、Special Working Plan 按 Work Schedule 同样优化。
- 用户要求解释并处理 Holiday 中 `Closed` 后仍显示时间段的问题。

修改结果：

- Work Schedule 的 Add Row 移到分区标题右侧。
- Ramadan Work Schedule 标题右侧保留 Enabled/Disabled switch，启用后同时显示 Add Row；未启用时不显示排班行和 Add Row。
- Work/Ramadan/Holiday/Special 的行样式去掉外边框和卡片背景，改为浅分隔线。
- 多行时只第一行显示字段名，后续行不重复显示 Weekdays/Start/End 等字段名称。
- Holiday 的 `Closed` 改为 `Closed All Day`；全天关闭时隐藏 Non-working Start / Non-working End；非全天关闭时显示并沿用原时间段校验。
- 不改变列表字段、Default 24x7 规则、Ramadan 业务规则和现有校验口径。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认 Add 弹框旧 `Weekdays Start End` 表头短语不存在；编辑已有方案时 `Closed All Day` 可见，全天关闭时不显示 Non-working Start / End；Work/Ramadan 只有首行显示 Weekdays label。

回滚说明：

- 如需回滚，恢复 Work/Ramadan 底部 Add Row、恢复 Holiday 的 `Closed` 文案和禁用时间段展示，并恢复每行边框卡片样式。

当前风险点：

- 如果 Holiday 第一行是全天关闭、第二行是非全天关闭，第二行不会重复显示 Non-working Start / End 标签，这是按“后续行不重复字段名”的用户口径执行。

### 2026-06-03 16:13 +08:00 - Working Time Plans 列表字段与弹框样式回退

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1613.md`
- `.codex-backup/current-todo-2026-06-03-1613.md`
- `.codex-backup/page-state-2026-06-03-1613.md`

修改原因：

- 用户要求 Working Time Plans 列表去掉 `Work Schedule` 和 `Ramadan Period`，增加备注字段和更新人。
- 用户认为上一轮弹框样式比之前更乱，要求先还原弹框样式，再逐步说明后续调整。

修改结果：

- Working Time Plans 列表字段改为 Plan ID、Plan Name、Description、Updated Date、Updated By、Status、Actions。
- `WorkingTimePlan` 类型和默认 mock 新增 `updatedBy`；保存时默认写入 `Admin`。
- 删除不再用于列表的 Work Schedule / Ramadan Period 摘要函数。
- 弹框中的 Work/Ramadan/Holiday/Special 录入行从表头式网格退回普通字段行，每个控件恢复自己的 label。
- 分区样式恢复为普通边框卡片，减少上一轮表格式样式带来的视觉混乱。
- 本轮不改变无 timezone、无真实 Default 24x7 记录、Skill Queue 空方案显示 Default 24x7、Ramadan Work Schedule 的业务口径。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认列表无 Work Schedule / Ramadan Period 列，有 Description / Updated By 列；Add 弹框不再出现 `Weekdays Start End` 表头式录入。

回滚说明：

- 如需回滚本轮列表字段，恢复 Working Time Plans 列表的 Work Schedule / Ramadan Period 列，并移除 `updatedBy`。
- 如需回滚弹框样式，恢复上一轮 table/list head 结构和对应 CSS。

当前风险点：

- 用户后续会逐项指定弹框交互和样式，因此本轮只做样式回退，不继续扩展复杂交互。
- PowerShell 机械清理曾导致 `RoutingConfigDataPages.tsx` 编码异常，已转回 UTF-8 并修复被截断的中文标题；lint/build 已通过。

### 2026-06-03 15:57 +08:00 - Working Time Plans 印尼排班与 Default 24x7 调整

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1557.md`
- `.codex-backup/current-todo-2026-06-03-1557.md`
- `.codex-backup/page-state-2026-06-03-1557.md`

修改原因：

- 用户确认本项目暂时按印尼单国家场景处理，工作时间方案不需要 `timezone`。
- 用户要求不再维护真实 `Default 24x7` 方案记录；技能队列未选择工作时间方案时明确显示 `Default 24x7`。
- 印尼存在斋月工作时间差异，斋月不应归入节假日或特殊工作计划，而应作为普通工作日时间的日期段覆盖。
- 用户要求工作时间方案弹框更简洁整齐，减少大线框和控件高度不一致问题。

修改结果：

- `WorkingTimePlan` 类型移除 `timezone`、`default24x7`、`createdAt`、`weekdayRule`、`holidayRule`、`specialDateRule` 等旧字段，新增 `ramadanSchedule`。
- 默认 mock 删除真实 `WTP_24X7` 记录，仅保留自定义 `WTP_BANK_HOURS` 示例，并补充 Ramadan date range 与 Ramadan work schedule。
- `Skill Queues` 的 `workTimePlanCode` 允许为空，空值在列表、详情和弹框中展示为 `Default 24x7`，保存校验不再要求工作时间方案必填。
- `Working Time Plans` 查询区精简为 `Keyword + Status`；列表字段改为 Plan ID、Plan Name、Work Schedule、Ramadan Period、Updated Date、Status、Actions。
- Add/Edit/View 弹框按 Basic Info、Work Schedule、Ramadan Work Schedule、Holiday Schedule、Special Working Plan 分区；Ramadan 启用后配置一个日期段和专属工作日时间，并支持 Copy from Work Schedule。
- 工作时间行录入改为紧凑表格行，控件高度统一为 32px；Ramadan 开关靠近标题，减少标题与控件距离过远的问题。
- 校验规则更新为：自定义方案至少一条 Work Schedule；Ramadan 启用后必须配置日期段和工作时间；日期、时间范围必须合法；被技能队列引用的自定义方案不能直接删除。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认列表不再显示 Timezone / Schedule Mode / Default 24x7 真实记录，Add 弹框包含 Ramadan Work Schedule，启用 Ramadan 后显示 Start Date、End Date、Copy from Work Schedule。
- Browser `/routing-config/skill-queues`：确认列表和 Add 弹框可见 `Default 24x7`，`Work Time Plan` 不再有必填星号。
- Browser 日志仍有既有 AntD deprecation warnings：`Alert.message`、`InputNumber.addonAfter`。

回滚说明：

- 如需回滚，恢复 `WorkingTimePlan` 的 timezone / 24x7 mode 字段、`WTP_24X7` mock 记录和 Skill Queue 工作时间方案必填校验，并移除 Ramadan Work Schedule 分区及相关样式。

当前风险点：

- 当前每个方案只支持一个 Ramadan date range；后续如需跨年维护多个斋月周期，需要把 `ramadanSchedule` 扩展为数组。
- 当前工作时间判断规则仅在前端 demo 中表达，不接真实后台运行时。
- Browser 日志中的 AntD deprecation warnings 为既有问题，本轮未做全局替换。

### 2026-06-03 14:49 +08:00 - Working Time Plans 结构化排班配置

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1449.md`
- `.codex-backup/current-todo-2026-06-03-1449.md`
- `.codex-backup/page-state-2026-06-03-1449.md`

修改原因：

- 用户要求先解释并落地工作时间方案中的 `timezone` 与 `Default 24x7`，并参考附件将工作日、节假日、特殊工作计划拆开配置。
- 当前 demo 的 Working Time Plans 只是扁平文本字段，不足以表达真实 AICC 排班、节假日覆盖和特殊工作覆盖。

修改结果：

- `WorkingTimePlan` 类型新增结构化 `workSchedules`、`holidayRules`、`specialWorkingPlans`，并保留旧摘要字段用于列表展示和兼容。
- 默认 mock 增加 `createdAt`、`updatedAt`、`description`、工作日规则、节假日规则和特殊工作计划示例。
- `routingConfigStore` 对工作时间方案嵌套数组做深拷贝，避免编辑过程中污染初始 mock。
- `Working Time Plans` 页面改为自定义管理页：查询区支持 Keyword / Timezone / Schedule Mode / Status，列表展示 Plan ID、Plan Name、Timezone、Schedule Mode、Description、Created Date、Updated Date、Status、Actions。
- Add/Edit/View 弹框按 Basic Info、Work Schedule、Holiday Schedule、Special Working Plan 分区；24x7 模式显示全天候说明，Custom Schedule 模式展示规则行。
- Custom Schedule 必须至少有一条 Work Schedule；日期和时间范围做合法性校验；被技能队列引用的方案删除仍受保护。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认列表字段、Add 弹框、24x7 默认说明、Custom Schedule 分区和空自定义排班校验均可见。
- Browser 日志仍有既有 AntD deprecation warnings：`Alert.message`、`InputNumber.addonAfter`。

回滚说明：

- 如需回滚，恢复 `WorkingTimePlan` 扁平字段结构、mock 工作时间数据、store 浅拷贝和 `WorkingTimePlansPage` 的泛型 `RoutingConfigCrudPage` 实现，并移除本轮新增样式。

当前风险点：

- 当前排班编辑器每行只编辑一个时间段；如后续需要同一规则内多个 time range，可在现有 `timeRanges` 数组结构上继续扩展 UI。
- AntD 6 对 `Alert.message` 和 `InputNumber.addonAfter` 有 deprecation warning，项目中已有多处使用；本轮未做全局替换。

### 2026-06-03 14:36 +08:00 - Skill Routing Rules 查询工具栏空白修正

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1436.md`
- `.codex-backup/current-todo-2026-06-03-1436.md`
- `.codex-backup/page-state-2026-06-03-1436.md`

修改原因：

- 用户指出查询工具栏第一行右侧仍有大块空白，原因不是放不下，而是 `Batch Add` 被单独 `margin-left: auto` 推到右侧。
- 用户要求 Target Skill Queue 宽度不要比其它查询条件明显更大，并应紧跟 Business Type。

修改结果：

- 规则页 Target Skill Queue 查询框宽度从 `240px` 改为 `180px`。
- 规则页 Batch Add 的专用 `margin-left` 从 `auto` 改为 `0`，不再单独占据右侧空间。
- 查询工具栏按 Access Site、Channel、Media Type、Language Type、Business Type、Target Skill Queue、Status、Search、Reset、Batch Add 的自然顺序排列。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser DOM 检查确认 Target Skill Queue 位于 Business Type 后，Batch Add 位于 Reset 后。

回滚说明：

- 如需回滚，恢复 Target Skill Queue 宽度为 `240px`，并将规则页 Add action 的 `margin-left` 改回 `auto`。

当前风险点：

- 若未来启用更多路由要素，查询工具栏仍会自然换行；但不应再为 Batch Add 预留独立大空白。

### 2026-06-03 13:38 +08:00 - Skill Routing Rules 状态开关与操作列固定

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1338.md`
- `.codex-backup/current-todo-2026-06-03-1338.md`
- `.codex-backup/page-state-2026-06-03-1338.md`

修改原因：

- 用户要求 Edit 弹框中的 Status 不使用下拉框，改为参考其它管理页面的状态开关样式。
- 用户指出查询工具栏右侧空白过多，Search / Reset 应跟随最后一个查询条件，Batch Add 在同一行有空间时靠右。
- 用户提出多字段表格横向滚动时操作列应固定，只有非操作列横向滚动。

修改结果：

- Skill Routing Rules Edit 弹框 Status 改为短胶囊 switch + Enabled/Disabled 文案。
- Skill Routing Rules 查询工具栏改为单行流式布局，Batch Add 在同一行靠右。
- Skill Routing Rules Actions 列设置为 `fixed: 'right'`，配合横向 scroll 保持操作列可见。
- 保留通用 CRUD 表格已有的操作列固定逻辑，本轮补齐手写规则表格。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown plugin timing 和 chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认列表要素列仍正常，Edit 弹框 Status 为 switch 且不再是 Status combobox。

回滚说明：

- 如需回滚，恢复 Edit 弹框 Status 的 Select 控件，恢复规则页查询工具栏原三段结构，并移除规则列表 Actions 的 `fixed: 'right'`。

当前风险点：

- 其它手写 Routing Config 表格如后续也出现横向滚动，需要逐页确认操作列固定；通用 CRUD 容器已固定操作列。

### 2026-06-03 13:32 +08:00 - Skill Routing Rules 列表拆列与多选查询

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1332.md`
- `.codex-backup/current-todo-2026-06-03-1332.md`
- `.codex-backup/page-state-2026-06-03-1332.md`

修改原因：

- 用户指出规则保存会按 Batch Add 下方预览表拆分，因此主列表也应把各路由要素列出来，而不是合并在一个 Elements 字段里。
- 用户要求查询条件中的路由要素直接使用多选下拉，不要 `All` 和 `Empty` 选项。
- 用户要求详情/编辑弹框按单行数据展示，并与其它管理页面保持一致。

修改结果：

- 主查询区启用路由要素筛选改为多选下拉，空选择表示不限制该要素。
- 主列表由 `Elements` 合并列改为 Access Site、Channel、Media Type、Language Type、Business Type 独立列。
- 主列表各列宽度收紧，并保留 Target Skill Queue、Updated Date、Updated By、Status、Actions。
- View/Edit 弹框去掉旧的条件卡片区，改为标准两列表单字段；要素只读，Target Skill Queue 和 Status 可按模式编辑，Updated Date / Updated By 只读。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认列表拆列、元素多选下拉无 All/Empty、Edit 弹框标准字段布局。

回滚说明：

- 如需回滚，恢复单个 `Elements` 合并列、要素筛选的 `All / Empty` 单选下拉，以及旧的 `routing-config-rule-modal__conditions` 条件卡片展示。

当前风险点：

- 当前 5 个启用要素下列表可读；如未来启用更多路由要素，需要考虑横向滚动、列显隐或详情抽屉。

### 2026-06-03 13:21 +08:00 - Skill Routing Rules 查询、列表与拆分预览

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1321.md`
- `.codex-backup/current-todo-2026-06-03-1321.md`
- `.codex-backup/page-state-2026-06-03-1321.md`

修改原因：

- 用户确认技能路由规则新增后会按要素组合拆分为多条规则，查询、列表和 Batch Add 下方表格都应围绕拆分后的规则行设计。
- 用户要求查询条件删除 ID/Keyword，改为当前启用路由要素、目标技能队列和启用/禁用状态。
- 用户要求列表展示 Rule ID、元素、目标技能队列、更新日期、更新人、状态；详情/编辑只针对单条规则，编辑只能改目标技能和状态。

修改结果：

- 主查询区改为 Access Site、Channel、Media Type、Language Type、Business Type、Target Skill Queue、Status。
- Status 筛选只保留 All / Enabled / Disabled；空路由要素可通过 Empty 筛选，页面仍不展示 `ANY`。
- 主列表调整为 Rule ID、Elements、Target Skill Queue、Updated Date、Updated By、Status、Actions，移除 Priority 和 Effective From 主列。
- `RoutingRule` 类型和 mock 增加 `updatedAt`、`updatedBy`。
- Batch Add 下方表改为 Generated Routing Rules Preview，展示新建/重复拆分行；重复行默认勾选覆盖，取消勾选保留原配置，新行默认创建。
- Batch Add 预览表新增 Status 列并压缩列宽，降低表格超出弹框风险。
- Edit 弹框只保留 Target Skill Queue 与 Status 可编辑；Priority 不再展示或可编辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认查询区、主列表列、Batch Add 预览表和 Edit 弹框符合本轮口径。

回滚说明：

- 如需回滚，恢复 Skill Routing Rules 的 Keyword 查询、Priority / Effective From 列、重复项专用表格和 Priority 编辑字段，并移除 `RoutingRule.updatedAt/updatedBy`。

当前风险点：

- `updatedBy` 当前为前端 demo 固定 `Admin`；接真实后端时应改为登录用户或审计字段。
- 空路由要素仍用空字符串表示；接真实后端时需要确认 API 是否接受空字符串或需要映射为 null。

### 2026-06-03 13:03 +08:00 - Skill Routing Rules 空元素与重复提示文案

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1303.md`
- `.codex-backup/current-todo-2026-06-03-1303.md`
- `.codex-backup/page-state-2026-06-03-1303.md`

修改原因：

- 用户要求 Batch Add 中路由要素可以为空，而不是选择 `ANY`。
- 用户要求重复组合区域补充英文提示，说明勾选代表覆盖为当前目标技能，不勾选代表保留原有配置。

修改结果：

- Batch Add 下拉移除 `ANY` 选项，清空要素后保持空值。
- 组合生成、重复判断、规则 key 和保存逻辑使用空字符串表示未限定要素。
- 默认 mock 中 `factorValueCode: 'ANY'` 改为空字符串。
- 规则列表、View/Edit 条件区和重复表格空值不显示 `ANY`。
- 重复组合表格上方新增轻量英文提示文案。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser Batch Add：确认无 `ANY` 文案，重复提示文案出现，清空要素后字段可保持空白。

回滚说明：

- 如需回滚，恢复 Batch Add 的 `ANY` 选项、空选择自动转 `ANY`、mock 中 `factorValueCode: 'ANY'`，并移除重复组合提示文案。

当前风险点：

- 空字符串现在承载“不限定要素”的语义；如后续接真实后端，需要确认后端是否接受空字符串，或在 API 层映射为空/null。

### 2026-06-03 12:54 +08:00 - Skill Routing Rules Batch Add 弹框细化

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1254.md`
- `.codex-backup/current-todo-2026-06-03-1254.md`
- `.codex-backup/page-state-2026-06-03-1254.md`

修改原因：

- 用户指出 Batch Add 弹框字段标签与输入框距离过远，重复表格元素会超出弹框。
- 用户要求选择元素时只显示元素名称，不显示括号中的元素 ID。
- 用户要求重复示例多几条，重复表格表头提供全选。
- 用户要求技能名称只显示名称，弹框中仅分块标题加粗。

修改结果：

- Batch Add 默认选择 3 个站点，并在 mock routingRules 中补充 Surabaya / Singapore DR 两条默认重复规则。
- 路由要素下拉和技能队列下拉都只显示名称，不再显示 `Name (ID)`。
- 重复表格表头增加全选 checkbox。
- 重复组合表格列宽压缩并取消横向 scroll，避免内容超出弹框。
- Batch Add 弹框字段标签列收紧，普通字段标签改为正常字重，仅分块标题保持加粗。
- 技能队列展示移除编码，仅显示技能队列名称。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser Batch Add：确认表头全选、三条重复站点示例、下拉无括号编码、技能名称无括号编码。
- Browser 截图复查命令超时；未影响 DOM 验证结果。

回滚说明：

- 如需回滚，恢复 `initialBatchSelections` 为单站点，删除新增的两条 mock routingRules，恢复下拉 label 中的编码、重复表格无表头全选、原列宽和横向 scroll。

当前风险点：

- 重复表格当前按 5 个启用要素压缩适配；若未来启用更多路由要素，仍可能需要改成详情抽屉或可横向滚动表格。

### 2026-06-03 12:26 +08:00 - Skill Routing Rules 页面与 Batch Add 弹框调整

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1226.md`
- `.codex-backup/current-todo-2026-06-03-1226.md`
- `.codex-backup/page-state-2026-06-03-1226.md`

修改原因：

- 用户指出 `技能路由规则配置` 页面样式与其它管理菜单不一致：查询区上方重复显示菜单名称，底部还有 `Published Routing Rule Index`。
- 用户要求 Batch Add 中 5 个路由要素改成一行一个多选下拉，目标技能队列与要素分区展示，并暂时去掉新增时的 Priority。
- 用户要求重复组合提示改为下方表格，默认全选，可取消某行，表格展示 5 个要素值、原技能队列和目标技能队列。

修改结果：

- 主页面删除表格卡片重复标题，页面标题只保留 `PageContainer` 的 `技能路由规则配置`。
- 删除 `Published Routing Rule Index` 页面展示区及相关展开状态和索引表 UI。
- Batch Add 弹框改为 `Route Elements` / `Target Routing` 分区。
- 启用路由要素在弹框中逐行展示，多选下拉撑满可用宽度。
- Batch Add 去掉 Priority、Overwrite checkbox、组合摘要和重复摘要；新增/覆盖仍使用内部默认 priority `70`。
- 重复组合改为表格，默认勾选所有重复行；取消勾选的重复规则不会被覆盖。
- 若本次没有新规则且所有重复行都取消勾选，保存提示 `No routing rule changes selected.`，不提交变更。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认页面标题只出现一次，`Published Routing Rule Index` 不再出现。
- Browser Batch Add：确认 Route Elements / Target Routing 分区、5 个启用要素逐行展示、Overwrite 和摘要不存在。
- Browser Batch Add 重复表格：确认重复行默认勾选，取消勾选后保存出现 `No routing rule changes selected.`。

回滚说明：

- 如需回滚，恢复 `SkillRoutingRulesPage.tsx` 中 `Published Routing Rule Index` 卡片、Batch Add 网格布局、Priority 输入、Overwrite checkbox、组合摘要和 Alert 风格重复提示；恢复对应 Less 样式。

当前风险点：

- 主列表和 Edit 弹框仍保留 Priority，只有 Batch Add 新增场景隐藏 Priority；如果后续确认规则整体不需要优先级，需要再统一清理列表、编辑弹框、类型和 mock。

### 2026-06-03 12:08 +08:00 - Skill Queues 所属 VDN 字段

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1208.md`
- `.codex-backup/current-todo-2026-06-03-1208.md`
- `.codex-backup/page-state-2026-06-03-1208.md`

修改原因：

- 用户要求 `技能队列管理` 增加 `所属VDN` 字段：作为查询条件放在状态前面，作为列表字段放在技能名称后面，维护时为必填下拉单选。

修改结果：

- `SkillQueue` 类型和默认 mock 新增 `vdnCode`。
- 技能队列查询区调整为 `Keyword + VDN + Status`。
- 技能队列列表在 `Skill Name` 后展示 `VDN` 列，并用 VDN 名称显示。
- Add/Edit/View 弹框新增必填 `VDN` 单选下拉，选项来自 VDN 主数据，新增默认选择第一个 VDN。
- 保存校验加入 `VDN` 必填校验。
- `VDN配置` 删除保护补充技能队列引用检查，被技能队列使用的 VDN 不能直接删除。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- Browser `/routing-config/skill-queues`：确认查询区、列表和 Add 弹框均已展示 VDN 字段；最终刷新确认 VDN 查询、VDN 列和默认 VDN 名称正常显示。

回滚说明：

- 如需回滚，删除 `SkillQueue.vdnCode` 类型字段、mock 中的 `vdnCode`、Skill Queues 页面里的 VDN 查询条件、列表列、弹框字段、draft/record 映射和必填校验。

当前风险点：

- `VDN` 当前只作为技能队列主数据归属字段，不作为默认路由要素参与 Skill Routing Rules；如后续需要按 VDN 路由，需单独重新启用 VDN 路由要素。

### 2026-06-03 12:02 +08:00 - Route Elements 默认顺序与 Skill Routing Rules 启用要素过滤

修改页面或文件：

- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1202.md`
- `.codex-backup/current-todo-2026-06-03-1202.md`
- `.codex-backup/page-state-2026-06-03-1202.md`

修改原因：

- 用户要求优先调整 `路由要素配置` 菜单，默认数据顺序为接入站点、渠道、媒体类型、国家（禁用）、语言类型、业务类型、接入账号（禁用）、接入入口（禁用）。
- 用户要求 `技能路由规则配置` 中不要展示禁用的路由要素。

修改结果：

- 默认 routeFactors 移除 VDN，保留 8 个路由要素并按 `displayOrder` 1-8 排序。
- `Country`、`Access Account`、`Access Entry` 默认禁用；`Access Site`、`Channel`、`Media Type`、`Language Type`、`Business Type` 默认启用。
- Route Elements 页面按 `displayOrder` 排序展示。
- 默认 routingRules 删除 VDN 条件，Batch Add 默认选择也移除 VDN。
- Skill Routing Rules 继续只读取启用且 Active 的要素，禁用要素不会出现在 Batch Add、Route Conditions、View/Edit 条件区和 Published Routing Rule Index。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认顺序、禁用状态和不显示 VDN。
- Browser `/routing-config/skill-routing-rules`：确认 Route Conditions、Batch Add、Published Routing Rule Index 均不展示 Country / Access Account / Access Entry / VDN。

回滚说明：

- 如需回滚，恢复 `routeFactors` 中 VDN 默认要素、原 displayOrder 和默认 routingRules 中 `factorCode: '10'` 条件，并恢复 Batch Add 初始选择中的 VDN。

当前风险点：

- `VDN` 仍保留主数据和候选映射，当前只是从默认 Route Elements 中移除；若未来重新启用 VDN 路由要素，可继续复用现有 VDN 数据。

### 2026-06-03 11:39 +08:00 - Skill Routing Rules 管理台结构统一

修改页面或文件：

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1139.md`
- `.codex-backup/current-todo-2026-06-03-1139.md`
- `.codex-backup/page-state-2026-06-03-1139.md`

修改原因：

- 用户认可技能路由规则业务结构应不同于普通主数据 CRUD，但要求页面视觉和操作结构继续向管理台统一。
- 原页面将 `Batch Add Routing Rules` 常驻铺在顶部，并将每个启用路由要素拆成表格列，页面显得重且横向滚动过多。

修改结果：

- 主页面改为 `Keyword + Target Skill Queue + Status` 查询区、`Search / Reset` 按钮、右侧独立 `Batch Add` 按钮和分页表格。
- 规则列表改为 `Rule ID`、`Route Conditions`、`Target Skill Queue`、`Priority`、`Effective From`、`Status`、`Actions`。
- `Route Conditions` 用紧凑 chips 汇总展示启用要素，不再每个要素独立一列。
- Batch Add 改为专用弹框，保留多要素多选、组合预览、重复检测、覆盖选项和保存逻辑。
- Edit 弹框仍只允许修改目标技能队列、优先级和状态，Route Conditions 只读。
- `Published Routing Rule Index` 改为默认折叠的次级卡片，展开后展示运行时索引表。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认查询区、Batch Add 按钮、Route Conditions 列、Status 列、默认折叠的 Published Routing Rule Index。
- Browser Batch Add：确认弹框包含启用要素多选、覆盖复选框、组合/重复摘要；重复且未覆盖时阻止保存。
- Browser Edit：确认 Route Conditions 只读，目标队列、优先级、状态可编辑。
- Browser Published Routing Rule Index：确认默认折叠，点击后可展开并显示索引表。

回滚说明：

- 如需回滚，恢复 `SkillRoutingRulesPage.tsx` 中常驻 Batch Add 卡片、按启用要素拆列表列的表格结构，以及默认展开的 Published Routing Rule Index。

当前风险点：

- `Route Conditions` 汇总列在启用要素非常多时会增加行高；目前用紧凑 chips 和换行控制，后续如启用超过 10 个要素可考虑详情弹出或 hover 展开。

### 2026-06-03 11:00 +08:00 - Access Accounts 列表字段和全渠道示例调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/mock/routingConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1100.md`
- `.codex-backup/current-todo-2026-06-03-1100.md`
- `.codex-backup/page-state-2026-06-03-1100.md`

修改原因：

- 用户指出 Access Accounts 列表缺少可见状态字段，且 `Key Config` 列价值不高。
- 用户建议列表 mock 数据应覆盖所有非电话渠道，方便评审时看到各渠道账号示例。

修改结果：

- Access Accounts 列表移除 `Key Config` 列，保留 `Status` 列。
- Mock 接入账号补齐除 `Phone` 外的 12 个渠道示例：Haloapp、webchat、WhatsApp、Email、Instagram、LinkedIn、Facebook、X、Tik Tok、YouTube、AppStore、playstore。
- 保持 Channel 动态字段和结构化 `extensionConfig` 不变。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/access-accounts`：确认列表有 `Status` 列、没有 `Key Config` 列、12 个非电话渠道示例均可见、无 Phone 账号示例。
- Browser Add 弹框：确认动态字段仍正常，未回退到 `Channel-specific Config` 文本域。

回滚说明：

- 如需回滚，恢复 Access Accounts 列表的 `Key Config` 列，并将 mock accessAccounts 恢复为本轮前的 3 条示例。

当前风险点：

- 示例账号均为 demo 数据；真实后端落地时需要结合渠道开通状态决定是否默认展示所有渠道示例。

### 2026-06-03 10:45 +08:00 - Access Accounts 账号列表与动态渠道字段调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1045.md`
- `.codex-backup/current-todo-2026-06-03-1045.md`
- `.codex-backup/page-state-2026-06-03-1045.md`

修改原因：

- 用户确认 `Access Accounts` 中电话不属于官方账号配置，应先去掉 `Phone`。
- 用户要求去掉机器人/人工入口 ID、支持媒体类型等非必要字段，并采用账号列表维护方式。
- 接入账号需要表达不同渠道账号配置差异，但不应继续用一整块自由文本域。

修改结果：

- 通用 `RoutingConfigCrudPage` 支持按当前弹框 draft 动态计算字段，供 Access Accounts 根据 Channel 切换字段。
- `AccessAccount.extensionConfig` 从字符串调整为结构化对象。
- `Access Accounts` Channel 下拉过滤掉 `PHONE`，但不影响 Channels 页面中的 Phone。
- 列表新增 `Key Config` 摘要列，继续展示账号数据列表和所属 Channel。
- 查询区改为 `Keyword + Channel + Status`。
- Add/Edit/View 弹框移除 `Channel-specific Config` 文本域，按 Channel 展示 Haloapp、webchat、WhatsApp、Email、社媒和应用商店渠道的结构化配置字段。
- Mock 账号数据同步改为结构化 `extensionConfig`，仍不保存 token、password、private key 原文。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- Browser `/routing-config/access-accounts`：确认页面可打开，查询区包含 Keyword / Channel / Status，列表包含 `Key Config`。
- Browser Add 弹框：确认默认 Haloapp 动态字段出现，无 `Channel-specific Config`、支持媒体类型、机器人/人工入口字段。
- Browser Channel 下拉：确认没有 `Phone` 选项；切换到 `webchat` 后弹框显示 `Widget ID`、`Allowed Domain` 等 Webchat 字段。

回滚说明：

- 如需回滚，恢复 `AccessAccount.extensionConfig` 为字符串，恢复 Access Accounts 的 `Channel-specific Config` textarea 和包含 Phone 的 channel options，并移除 `RoutingConfigCrudPage` 的动态 fields 支持。

当前风险点：

- 当前仍是前端 demo 本地状态；真实后台落地时需要将结构化 `extensionConfig` schema 固化到接口契约或由后端返回渠道字段元数据。

### 2026-06-03 10:12 +08:00 - 管理台页面顶部通用版式优化

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-1012.md`
- `.codex-backup/current-todo-2026-06-03-1012.md`
- `.codex-backup/page-state-2026-06-03-1012.md`

修改原因：

- 用户指出页面顶部有大块空白，显得页面上方空旷；页面顶部菜单名称字号接近 Logo 字号，层级过重，需要形成统一管理台标准规范。

修改结果：

- 全局 `.aicc-content` 顶部 padding 从 `12px` 收紧为 `8px`。
- `PageContainer` header 最小高度从 `50px` 降为 `28px`，标题下方 margin 从 `18px` 降为 `10px`。
- 页面标题字号从 `20px` 降为 `16px`，行高从 `28px` 降为 `22px`，视觉层级明显低于 `BANK 1` Logo。
- `PageContainer` body gap 从 `16px` 降为 `12px`。
- 该调整作为通用管理台规范应用于所有使用 `PageContainer` 的后台/配置页。

验证：

- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- `npm run lint` 单独重跑通过；首次与 build 并行执行时因资源占用超时。
- 重新启动 Vite dev server 到 `http://127.0.0.1:5174`。
- Browser `/routing-config/route-elements`：确认页面标题小于 Logo，顶部留白收紧，标题后直接进入查询卡片。

回滚说明：

- 如需回滚，恢复 `.aicc-content` padding、`.aicc-page-container__header` min-height/margin、`.aicc-page-container__title` 字号/行高和 `.aicc-page-container__body` gap 到本次修改前的值。

当前风险点：

- 这是全局 `PageContainer` 版式调整，会同步影响 Design System、Text Channel Settings 等使用同一容器的页面；如果未来某个页面需要更大的标题区，应新增显式 page variant，而不是回退全局管理台标准。

### 2026-06-03 01:22 +08:00 - Routing Config 二级菜单中文顺序调整

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-0122.md`
- `.codex-backup/current-todo-2026-06-03-0122.md`
- `.codex-backup/page-state-2026-06-03-0122.md`

修改原因：

- 用户要求调整 `Routing Config` 二级菜单顺序和名称为中文业务口径。

修改结果：

- `Routing Config` 二级菜单顺序调整为：路由要素配置、VDN配置、接入站点配置、渠道配置、业务类型配置、技能队列配置、接入账号配置、站点接入量配置、技能路由规则配置、工作时间方案配置。
- 路由 path 不变，旧链接不失效。
- 对应页面左上角标题同步改为同名中文。
- `SkillRoutingRulesPage` 的页面标题和列表卡片标题同步为 `技能路由规则配置`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：展开左侧导航后确认 10 个二级菜单按指定中文顺序展示。

回滚说明：

- 如需回滚，恢复 `BasicLayout` 中 Routing Config 二级菜单英文 label 和原顺序，并恢复各 Routing Config 页面标题为英文。

当前风险点：

- 页面内表格列名、查询条件、弹框字段仍按此前英文管理台风格保留；本轮仅调整二级菜单和页面标题中文名称。

### 2026-06-03 01:05 +08:00 - Skill Queues 查询、表格和弹框细节修正

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-0105.md`
- `.codex-backup/current-todo-2026-06-03-0105.md`
- `.codex-backup/page-state-2026-06-03-0105.md`

修改原因：

- 用户要求 Keyword 查询条件去掉状态匹配。
- 用户指出 Skill Queues 表格字段间隔过宽，并且不应在空间充足时出现横向滚动条。
- 用户指出弹框内下拉框和输入框高度不一致，并要求移除 `Queue Prompts` 字段。

修改结果：

- Keyword 仅匹配 `Skill ID`、`Platform Skill ID`、`Skill Name`；`Status` 保留为独立下拉筛选。
- Keyword placeholder 改为 `Skill ID / Platform Skill ID / Skill Name`。
- Skill Queues 表格列宽收窄，并去掉该页强制 `tableScrollX`。
- Add/Edit/View 弹框移除 `Queue Prompts` 字段；底层保存仍保留已有 prompt 或新增默认 prompt。
- CRUD 弹框内普通输入框、下拉框和带单位数字输入框高度统一。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-queues`：确认 Keyword placeholder 不含 Status，Add 弹框无 `Queue Prompts` 和 `Routing Method`。

回滚说明：

- 如需回滚，恢复 Keyword 状态匹配和 placeholder，恢复 Skill Queues 的 `tableScrollX`，重新加入 `Queue Prompts` 字段，并移除 CRUD 弹框高度统一样式。

当前风险点：

- `Queue Prompts` 从 UI 移除后，新增记录使用默认 prompt，编辑记录保留原 prompt；若后续需要维护提示语，应拆成独立提示语配置页面或结构化子表。

### 2026-06-03 00:54 +08:00 - Skill Queues 字段与弹框调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-0054.md`
- `.codex-backup/current-todo-2026-06-03-0054.md`
- `.codex-backup/page-state-2026-06-03-0054.md`

修改原因：

- 用户要求调整 `Skill Queues` 查询条件、列表字段、工作时间方案展示、最大排队和超时字段的默认值/范围/单位、视频支持字段，以及弹框内坐席数量和 routing method 的展示方式。

修改结果：

- 查询区改为 `Keyword + Status`；Keyword 匹配 `Skill ID`、`Platform Skill ID`、`Skill Name` 和状态文案。
- 列表 `Work Time` 改为 `Work Time Plan`，并展示工作时间方案名称。
- 列表新增 `Supports Video`，展示 `Yes / No`。
- `Max Queue Size` 和 `Queue Timeout` 在列表和弹框中带单位，分别为 `items` 和 `sec`。
- 新增默认值改为 `Max Queue Size = 60`、`Queue Timeout = 100`、`Supports Video = No`。
- 保存校验增加必填校验和范围校验：`Max Queue Size 1-60000`、`Queue Timeout 0-10000`。
- 弹框去掉 `Routing Method` 字段；`routingMethod` 从 `SkillQueue` 类型和 mock 数据移除。
- 弹框保留 `Assigned Agents` 但设为禁用只读，不允许输入。
- 通用 `RoutingConfigCrudPage` 支持数字字段 `min/max/addonAfter` 和全程只读字段。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-queues`：确认列表字段、单位、工作时间方案名称和视频支持字段展示正确。
- Browser `/routing-config/skill-queues`：确认 Add 弹框默认值、单位、必填标识、禁用 `Assigned Agents` 和无 `Routing Method`。

回滚说明：

- 如需回滚，恢复 `SkillQueue.routingMethod` 类型和 mock 字段，恢复 Skill Queues 字段配置中的 `Routing Method`，删除 `supportsVideo` 字段，并还原数字字段默认值和通用 CRUD 数字单位能力。

当前风险点：

- 用户括号中的单位写法疑似将 `秒` 和 `个` 写反；当前实现按字段语义使用 `Max Queue Size = items`、`Queue Timeout = sec`。

### 2026-06-03 00:34 +08:00 - Site Access Volume 展示细节修正

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-0034.md`
- `.codex-backup/current-todo-2026-06-03-0034.md`
- `.codex-backup/page-state-2026-06-03-0034.md`

修改原因：

- 用户认为 `Site Configuration` 使用分号分隔不够清晰，建议改为 `|`。
- 用户指出弹框内站点名称与比例输入距离过远。
- 用户要求已经配置过接入量的渠道在 Add 弹框中置灰不可选择。

修改结果：

- 列表 `Site Configuration` 改为使用 ` | ` 分隔站点比例，例如 `Jakarta Site 34% | Surabaya Site 33% | Singapore DR Site 33%`。
- 弹框站点比例行改为固定紧凑两列，站点名称和比例输入框距离缩短。
- Add 弹框中已存在接入量配置的渠道置灰禁选。
- Add 弹框默认选择第一个未配置渠道；已有渠道的比例维护走 Edit。
- 如果全部渠道都已配置，Add 弹框只提示没有可新增渠道，不再叠加无媒体类型提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：确认列表已使用 `|` 展示站点比例。
- Browser `/routing-config/site-access-volume`：确认 Add 弹框默认选择未配置渠道 `webchat`。
- Add 渠道禁选逻辑通过代码实现；AntD 浮层在 Browser DOM 中未稳定展开，最终以代码逻辑和默认值行为验证为准。

回滚说明：

- 如需回滚，恢复 `getSiteConfigText` 为分号拼接，恢复站点比例行 `1fr + 128px` 布局，并删除 Add 渠道禁选逻辑。

当前风险点：

- 错误比例保存阻止仍需人工复查一次，因为当前 Browser 插件无法稳定重输 `InputNumber` 数字。

### 2026-06-03 00:23 +08:00 - Site Access Volume 合并单元格列表

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-0023.md`
- `.codex-backup/current-todo-2026-06-03-0023.md`
- `.codex-backup/page-state-2026-06-03-0023.md`

修改原因：

- 用户认为渠道一行摘要仍不够直观，要求改为合并单元格形式：同一渠道下每个媒体一行，渠道单元格合并；站点配置列直接拼接站点比例。

修改结果：

- Site Access Volume 列表改为媒体逐行展示。
- 同一渠道的 `Channel ID`、`Channel Name`、`Status`、`Actions` 使用 `rowSpan` 合并单元格。
- `Media Type` 每行显示一个媒体，例如 Haloapp 展示 Voice、Video、Text 三行。
- `Site Configuration` 每行拼接该媒体下所有站点比例，例如 `Jakarta Site 34%; Surabaya Site 33%; Singapore DR Site 33%`。
- View/Edit/Delete 仍按 channel-level 操作，弹框仍展示所选渠道的所有媒体站点比例。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：确认表头为 `Channel ID`、`Channel Name`、`Media Type`、`Site Configuration`、`Status`、`Actions`，无 `Total`。
- Browser `/routing-config/site-access-volume`：确认 Haloapp 展示为三行媒体，渠道、状态和操作列合并显示。
- Browser `/routing-config/site-access-volume`：确认站点配置列按 `站点名 比例%` 使用分号拼接。

回滚说明：

- 如需回滚，恢复列表数据源为 channel-level summary rows，恢复 `Site Allocation` 摘要列和媒体数量摘要样式。

当前风险点：

- 新增同一渠道时仍会按现有 `Channel + Media Type` 更新已有比例组；当前 demo 没有单独覆盖确认步骤。
- 错误比例保存阻止仍需人工复查一次，因为当前 Browser 插件无法稳定重输 `InputNumber` 数字。

### 2026-06-03 00:13 +08:00 - Site Access Volume 列表渠道级汇总

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-03-0013.md`
- `.codex-backup/current-todo-2026-06-03-0013.md`
- `.codex-backup/page-state-2026-06-03-0013.md`

修改原因：

- 用户指出列表不应显示 `Total`，因为比例合计不等于 100% 时本来就不允许提交；同时指出 `Site Ratios` 横向堆站点比例没有考虑 Haloapp 三媒体，也无法承载 5 个或 10 个站点。

修改结果：

- Site Access Volume 列表从单条 `Channel + Media Type` 比例组展示改为按 `Channel` 聚合展示。
- 列表列调整为 `Channel ID`、`Channel Name`、`Media Type`、`Site Allocation`、`Status`、`Actions`。
- 列表移除 `Ratio Group ID`、`Site Ratios` 和 `Total`。
- `Site Allocation` 改为媒体级摘要，例如 `Voice 3 sites configured`，不再横向展开所有站点比例。
- View/Edit/Delete 改为 channel-level 操作；Delete 会删除该渠道下全部媒体比例组，并在确认文案中说明。
- mock 补齐 Haloapp Voice / Video 默认比例组，使默认列表中的 Haloapp 一行能展示 Voice / Video / Text 三种媒体。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：确认列表表头不再有 `Total`、`Site Ratios`、`Ratio Group ID`。
- Browser `/routing-config/site-access-volume`：确认 Haloapp 只占一行，媒体列为 `Voice / Video / Text`，`Site Allocation` 为三条媒体级摘要。
- Browser `/routing-config/site-access-volume`：确认 Haloapp View 弹框仍展示 Voice、Video、Text 三组及各站点比例。

回滚说明：

- 如需回滚，恢复 Site Access Volume 表格数据源为 `siteAccessRatioGroups`，恢复 `Ratio Group ID`、`Media Type`、`Site Ratios`、`Total` 列，恢复 View/Edit/Delete 针对单条比例组。

当前风险点：

- 新增同一渠道时仍会按现有 `Channel + Media Type` 更新已有比例组；当前 demo 没有单独覆盖确认步骤。
- 错误比例保存阻止仍需人工复查一次，因为当前 Browser 插件无法稳定重输 `InputNumber` 数字。

### 2026-06-02 23:49 +08:00 - Site Access Volume 弹框布局细化

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2349.md`
- `.codex-backup/current-todo-2026-06-02-2349.md`
- `.codex-backup/page-state-2026-06-02-2349.md`

修改原因：

- 用户指出 `Site Access Volume` 新增弹框的 Channel 下拉框过长、媒体标题重复渠道、站点展示重复、比例输入缺少百分号，并要求思考站点比例是否应纵向展示。

修改结果：

- Add/Edit/View 弹框顶部 `Channel` / `Status` 控件改为固定宽度，不再撑满弹框。
- 媒体分组标题只显示 `Voice`、`Video`、`Text`，不再显示 `Haloapp / Voice` 这类重复渠道前缀。
- 站点比例录入从横向三列卡片改为纵向行：左侧站点名称，右侧比例输入框。
- 站点行只显示站点名称，不再重复显示站点编码。
- 比例输入框增加 `%` 后缀，内部值仍保持数字。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：Add 弹框默认 Phone / Voice 布局正常，Channel 下拉框宽度收敛到普通弹框控件尺寸，站点纵向展示且比例输入带 `%`。
- Browser `/routing-config/site-access-volume`：通过可见坐标切换 Haloapp，确认 Voice、Video、Text 三个媒体分组均展示，媒体标题不重复渠道，站点只显示名称。
- Browser 插件对 `InputNumber` 填值/重输存在虚拟剪贴板限制，错误比例保存阻止未完成自动化复测；该校验逻辑本轮未改动，建议人工复查一次。

回滚说明：

- 如需回滚，恢复 `RoutingConfigDataPages.tsx` 中媒体标题为 `Channel / Media`，恢复站点比例容器为 `routing-config-site-volume-modal__site-grid`，并恢复 `index.less` 中三列站点 grid 样式。

当前风险点：

- 新增同一渠道时仍会按现有 `Channel + Media Type` 更新已有比例组；当前 demo 没有单独覆盖确认步骤。
- 错误比例保存阻止需要人工复查一次，因为当前 Browser 插件无法稳定重输 `InputNumber` 数字。

### 2026-06-02 23:04 +08:00 - Site Access Volume 渠道媒体站点比例矩阵

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2304.md`
- `.codex-backup/current-todo-2026-06-02-2304.md`
- `.codex-backup/page-state-2026-06-02-2304.md`

修改原因：

- 用户要求站点接入量管理新增时先选渠道，再列出该渠道在 Channels 配置里关联的所有媒体，并分别为每个媒体列出所有站点比例输入框；同一渠道 + 媒体下所有站点合计必须为 100%。同时要求去除 `Business Override` 和 `Language Override` 字段。

修改结果：

- Site Access Volume 从通用 `RoutingConfigCrudPage` 改为自定义管理页，保留统一管理台 toolbar、表格、分页、弹框和按钮风格。
- 新增弹框按 `channel.mediaTypes` 自动生成媒体分组；每个媒体分组按 Sites 列出所有站点输入框。
- 新增保存会为所选渠道的每个媒体生成或覆盖一条 `Channel + Media Type` 比例组。
- 编辑/查看/删除仍针对单条比例组。
- 保存校验按每个媒体分组分别检查站点比例总和必须为 100%。
- `SiteAccessRatioGroup` 类型移除 `businessTypeCode`、`languageCode`，mock 中 PHONE voice 组改为默认组并补齐 Singapore 站点 0%。
- 页面不再显示 `Business Override`、`Language Override`，也不再使用 textarea 输入站点比例。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/site-access-volume` 验证通过：列表不显示 Business/Language override，保留 Site Ratios，PHONE voice 默认组显示所有站点。
- Browser Add 弹框验证通过：默认渠道显示 Phone / Voice，列出 Jakarta、Surabaya、Singapore 三个站点输入区域，新增打开时无提前校验错误。
- Browser Ant Select 切换 Haloapp 在当前工具中不稳定，未完成实际点击切换验证；代码实现按 `channel.mediaTypes` 驱动，Haloapp 会展开 Voice / Video / Text 三个媒体分组。

回滚说明：

- 如需回滚，恢复 `SiteAccessRatioGroup` 的 `businessTypeCode` / `languageCode` 字段，恢复 `SiteAccessVolumePage` 使用通用 `RoutingConfigCrudPage` 和 textarea 比例输入，恢复 mock 中 `RATIO_PHONE_VOICE_CARD` 的业务覆盖字段。

当前风险点：

- 新增同一渠道时会按现有 `Channel + Media Type` 更新已有比例组；当前 demo 没有单独覆盖确认步骤。
- Ant Select 在 in-app browser 自动化中切换不稳定，需要人工复查 Haloapp 三媒体展开效果。

### 2026-06-02 22:46 +08:00 - Business Types 查询条件与 Project 字段调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2246.md`
- `.codex-backup/current-todo-2026-06-02-2246.md`
- `.codex-backup/page-state-2026-06-02-2246.md`

修改原因：

- 用户要求业务类型查询条件与其它管理台菜单一致，将 ID 和名称合并搜索，并增加状态筛选；列表中去掉 `Project` 字段。

修改结果：

- Business Types 查询区改为 `Keyword + Status`。
- `Keyword` 匹配 `Business Type ID` 与 `Business Name`，placeholder 为 `Business Type ID / Name`。
- Business Types 列表去掉 `Project` 列。
- 新增/编辑弹框同步隐藏 `Project Code`；`projectCode` 仍作为内部默认 `BANK1` 保留，避免影响项目范围唯一性。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/business-types` 验证通过：查询区有 `Business Type ID / Name` 和 `Status`，列表不显示 `Project`。
- Browser Add 弹框验证通过：显示 Business Type ID、Business Name、Status，不显示 `Project Code`，首次打开不提前展示校验错误。

回滚说明：

- 如需回滚，恢复 Business Types 的 `Project` 列、`Project Code` 表单字段，并移除 `filters` 配置使其回到普通 Keyword 搜索。

当前风险点：

- `projectCode` 仍作为内部字段存在但不再可见；如果后续真实后台需要跨项目维护业务类型，需要重新暴露项目选择或在项目上下文中固定。

### 2026-06-02 22:37 +08:00 - Routing Config 菜单精简

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2237.md`
- `.codex-backup/current-todo-2026-06-02-2237.md`
- `.codex-backup/page-state-2026-06-02-2237.md`

修改原因：

- 用户要求去掉没用过或重复的 Routing Config 菜单：`Channel Media` 与 `Channels` 重复，`Media Types` / `Languages` 属于数据字典类，`Access Entries` 与 Access Accounts 容易混淆；确认 Access Accounts 应保留，用于配置同一渠道多个账号及不同渠道差异字段。

修改结果：

- 从 `Routing Config` 二级菜单删除 `Channel Media`、`Media Types`、`Languages`、`Access Entries`。
- 删除对应路由和页面组件导出，旧 URL 走现有 fallback，不再保留隐藏直达页。
- 底层 `mediaTypes`、`languageTypes`、`channelMediaSettings`、`accessEntries` mock/store 数据仍保留，避免影响 Channels、Site Access Volume、Skill Routing Rules 和内部 mock 关系。
- Access Accounts 页面保留，并将渠道差异字段标签改为 `Channel-specific Config`。
- Channels 删除保护不再因隐藏的 Channel Media 数据阻止删除。
- Access Accounts 删除保护不再因隐藏的 Access Entries 数据阻止删除。
- VDN 删除保护同步去掉隐藏 Access Entries 依赖，避免不可见数据卡住 VDN 删除操作。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/channels` 验证通过：页面仍可用，旧菜单文字不再出现在页面快照中。
- Browser `/routing-config/access-accounts` 验证通过：页面可打开。
- Browser `/routing-config/route-elements`、`/routing-config/skill-routing-rules` 验证通过：保留页面仍可打开并显示关键内容。
- Browser 旧 URL 验证通过：`/routing-config/channel-media`、`/routing-config/media-types`、`/routing-config/languages`、`/routing-config/access-entries` 均回到 `/`，不再进入旧页面。

回滚说明：

- 如需回滚，恢复 `BasicLayout` 菜单项、`routes.tsx` 对应路由和 `RoutingConfigDataPages.tsx` 中四个页面组件；同时恢复 Channels / Access Accounts / VDN 的隐藏依赖删除保护文案。

当前风险点：

- `Access Entries` 底层 mock 数据仍存在，但不再提供维护页；如后续真实后台需要入口层配置，需要重新引入入口页或合并到 Access Accounts。
- `Channel Media` 底层 mock 数据仍存在，但 UI 维护入口已移除；如后续要维护 scan mode 等细字段，需要在 Channels 页补充或重新拆出高级配置。

### 2026-06-02 22:04 +08:00 - Channels 管理页字段与查询条件调整

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2204.md`
- `.codex-backup/current-todo-2026-06-02-2204.md`
- `.codex-backup/page-state-2026-06-02-2204.md`

修改原因：

- 用户要求渠道管理列表字段改为数字渠道 ID、渠道名称、媒体类型多选、并发呼叫数、最小扫描间隔和状态，并要求查询条件与 VDN 等菜单一致，使用 ID/名称合并输入框、媒体类型多选和状态筛选。

修改结果：

- `Channel` 类型新增页面可见 `channelId`、`mediaTypes`、`maxConcurrency`、`minScanIntervalSeconds`，`channelId` 采用非序列数字编码。
- Channels 列表显示 `Channel ID`、`Channel Name`、`Media Type`、`Max Concurrent Calls`、`Min Scan Interval (s)`、`Status`。
- Channels 新增/编辑弹框提供 `Media Type` 多选、默认 `Max Concurrent Calls=50`、默认 `Min Scan Interval Seconds=30`。
- Channels 查询区改为 `Keyword + Media Type + Status`；Keyword 匹配 `Channel ID` 和 `Channel Name`，Media Type 支持多选。
- mock 渠道补齐 13 个渠道，Phone 仅 Voice，Haloapp/webchat 为 Voice/Video/Text，其它渠道为 Text。
- 内部 `channelCode` 仍保留为路由规则、账号、入口等引用键，避免将现有引用关系强行迁移为数字 ID。
- `RoutingConfigCrudPage` 新增 `multiSelect` 字段和筛选能力，后续普通管理台页面可复用。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/channels` 验证通过：页面包含 Channel ID / Name 查询、Media Type 查询、目标列表字段、13 个渠道和底部分页。
- Browser `/routing-config/channels` Add 弹框验证通过：字段和默认值 50/30 正常，首次打开无提前校验错误。
- Browser 文本输入过滤验证受 in-app browser 虚拟剪贴板限制影响，未完成实际键入过滤；代码层过滤逻辑和页面渲染已通过。

回滚说明：

- 如需回滚，恢复 `Channel` 类型和 mock 为仅包含 `channelCode`、`channelName`、`channelCategory`、`status`，移除 `RoutingConfigCrudPage` 的 `multiSelect` 支持，并恢复 `ChannelsPage` 原来的 Category 列和普通搜索。

当前风险点：

- `channelId` 是页面维护字段，`channelCode` 仍是内部引用键；如果后续真实接口要求所有引用也使用数字渠道 ID，需要统一迁移路由规则、渠道媒体、接入账号和接入入口的引用字段。
- `Channel Media` 独立页面仍保留原来的渠道媒体明细 mock；本轮只调整 Channels 主数据页，未展开维护所有渠道的全部媒体明细组合。

### 2026-06-02 21:52 +08:00 - Route Elements 查询条件合并

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2152.md`
- `.codex-backup/current-todo-2026-06-02-2152.md`
- `.codex-backup/page-state-2026-06-02-2152.md`

修改原因：

- 用户要求路由元素配置的查询条件也把 ID 和名称合并，保持和 VDN / Sites 的查询方式一致。

修改结果：

- Route Elements 查询区从 `Element ID`、`Element Name`、`Status` 改为 `Keyword + Status`。
- `Keyword` 对 `Element ID` 和 `Element Name` 做多字段模糊搜索，placeholder 为 `Element ID / Name`。
- `Status` 继续使用 `All / Enabled / Disabled`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：查询区仅显示 `Keyword`、`Status`，不再显示单独的 `Element ID` / `Element Name` 查询框。

回滚说明：

- 如需回滚，恢复 Route Elements 的 `filters` 配置为独立 `factorCode`、`factorName`、`status` 三个条件。

当前风险点：

- 本轮仅调整 Route Elements 查询条件；其它页面仍按各自当前过滤配置执行，后续如要全量统一需要逐页处理。

### 2026-06-02 21:47 +08:00 - Sites 管理页字段与 VDN/Sites 查询条件调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2147.md`
- `.codex-backup/current-todo-2026-06-02-2147.md`
- `.codex-backup/page-state-2026-06-02-2147.md`

修改原因：

- 用户要求接入站点管理去掉顶部提示和国家 ID 字段，并确认 VDN / 接入站点查询条件应为一个支持多字段模糊搜索的 `Keyword` 加一个 `Status` 下拉。

修改结果：

- Sites 页移除顶部 timezone 提示条。
- Sites 页从列表、弹框、校验和搜索字段中移除 `Country` / `Country Code`；内部 `countryCode` 仍保留默认值，避免影响类型和 mock 结构。
- Sites 弹框实体名改为单数 `Site`，新增弹框标题为 `Add Site`。
- VDN 查询条件改为 `Keyword + Status`，Keyword 匹配 `VDN ID`、`VDN Name`、`Platform VDN ID`。
- Sites 查询条件改为 `Keyword + Status`，Keyword 匹配 `Site ID`、`Site Name`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/vdn` 验证通过：查询区有 `Keyword`、`Status`，Keyword placeholder 为 `VDN ID / Name / Platform ID`。
- Browser `/routing-config/sites` 验证通过：无顶部提示、无 Country 字段，列表和 Add 弹框均符合调整，弹框标题为 `Add Site`。

回滚说明：

- 如需回滚，恢复 Sites 的 `Country` 列、`Country Code` 字段、顶部 `extraContent` 提示和 `countryCode` 校验；移除 VDN/Sites 的 `filters` 配置，使其回到普通 `Keyword` 搜索。

当前风险点：

- Sites UI 不再展示国家字段，但内部类型和 mock 仍保留 `countryCode`；如后续真实接口完全删除国家维度，需要再同步类型和 mock 数据结构。

### 2026-06-02 21:23 +08:00 - VDN 管理字段顺序与必填校验调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2123.md`
- `.codex-backup/current-todo-2026-06-02-2123.md`
- `.codex-backup/page-state-2026-06-02-2123.md`

修改原因：

- 用户要求 VDN 管理中 `Platform VDN ID` 也必须填写；同时因弹框高度和 textarea 位置导致状态与备注布局不合理，需要交换位置，并让备注输入框更宽。

修改结果：

- VDN 字段配置中 `Platform VDN ID` 设置为必填，并加入 `fieldRequired` 校验。
- VDN 弹框字段顺序调整为 `VDN ID`、`VDN Name`、`Platform VDN ID`、`Status`、`Description`。
- `RoutingConfigCrudPage` 字段配置新增 `fullWidth` 能力；VDN `Description` 独占整行展示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning 和 plugin timing 提示。
- Browser `/routing-config/vdn` 验证通过：Add 弹框打开后 `Platform VDN ID*` 显示必填，空保存提示 `Platform VDN ID is required.`，字段顺序符合调整。

回滚说明：

- 如需回滚，移除 `RoutingConfigCrudPage` 的 `fullWidth` 字段支持和 `.routing-config-crud-modal__field--full` 样式；恢复 VDN `fields` 中 `Description` 与 `Status` 的原顺序，并移除 `platformVdnId` 的 required 和 `fieldRequired` 校验。

当前风险点：

- `fullWidth` 是共享 CRUD 字段能力，目前只用于 VDN `Description`；后续其它页面如要使用，需要逐页确认不会破坏移动端单列布局。

### 2026-06-02 20:04 +08:00 - Routing Config 弹框按钮尺寸统一

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2004.md`
- `.codex-backup/current-todo-2026-06-02-2004.md`
- `.codex-backup/page-state-2026-06-02-2004.md`

修改原因：

- 用户指出弹框里的按钮可能与外部 Search / Reset 按钮高度和宽度不统一，需要按管理台统一规范收敛。

修改结果：

- `RoutingConfigCrudPage` 共享弹框 footer 按钮纳入管理台按钮规则。
- 弹框 `Cancel` / `Save` / `Delete` 与外部查询区 `Search` / `Reset` 统一为 82px 宽、32px 高，并使用同一字号、圆角和内边距。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：Add 弹框可打开，`Cancel` / `Save` 正常显示。

回滚说明：

- 如需回滚本次按钮尺寸统一，移除 `src/styles/index.less` 中 `.routing-config-crud-modal__footer .aicc-button.ant-btn` 对 `--routing-config-control-height`、height/min-height 和按钮视觉规则的继承。

当前风险点：

- 本次只统一普通 Routing Config CRUD 弹框；若后续 Skill Routing Rules 或其它独立弹框使用非共享 footer，需要单独纳入同一按钮规范。

### 2026-06-02 20:01 +08:00 - Routing Config 顶部只显示菜单名称

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-2001.md`
- `.codex-backup/current-todo-2026-06-02-2001.md`
- `.codex-backup/page-state-2026-06-02-2001.md`

修改原因：

- 用户再次强调左上角只要菜单名称，这也必须作为所有管理台配置页的统一标准；此前 VDN 等普通配置页仍显示说明文案，Skill Routing Rules 仍显示 eyebrow 和 description。

修改结果：

- `RoutingConfigCrudPage` 只向 `PageContainer` 传 `title`，不再传 `description` 和 `eyebrow`。
- `SkillRoutingRulesPage` 移除 `Routing Config` eyebrow 和说明文案，只保留 `Skill Routing Rules` 标题。
- Add 已统一在表格工具栏右侧，不再出现在页面标题区。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements`、`/routing-config/vdn`、`/routing-config/skill-routing-rules` 验证通过：顶部只有页面标题，无 eyebrow、无说明文案。

回滚说明：

- 如需回滚本次顶部标准化，恢复 `RoutingConfigCrudPage.tsx` 对 `PageContainer` 的 `description` / `eyebrow` 传参，并恢复 `SkillRoutingRulesPage.tsx` 的 description 和 eyebrow。

当前风险点：

- 本次统一会隐藏普通配置页原本的说明文案；这是用户明确要求的管理台标准，后续如需要说明，应放到帮助提示或独立文档，不放在左上角标题区。

### 2026-06-02 19:54 +08:00 - Routing Config 管理台工具栏标准化

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1954.md`
- `.codex-backup/current-todo-2026-06-02-1954.md`
- `.codex-backup/page-state-2026-06-02-1954.md`

修改原因：

- 用户反馈管理台查询区按钮高度看起来比输入框高，需要改成一致；用户确认第一个菜单样式已可作为管理台统一标准，其它配置菜单应引用该样式。

修改结果：

- `RoutingConfigCrudPage` 普通页面也统一使用表格上方工具栏：`Keyword` 搜索框 + `Search` / `Reset`，右侧 `Add`。
- `Add` 不再放在无 filters 页面标题右侧，VDN 等普通页继承同一工具栏结构。
- 新增 `searchDraft`，Keyword 搜索点击 `Search` 后应用，`Reset` 清空并恢复全部数据。
- 在 `routing-config-page` 中统一控件高度为 32px，输入框、SearchInput、下拉框、Search/Reset/Add 按钮高度一致。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：多条件筛选工具栏、Search/Reset/Add 和表格正常展示。
- Browser `/routing-config/vdn` 验证通过：普通页面已使用 `Keyword`、Search、Reset、右侧 Add 的统一工具栏；表格正常展示。
- Browser 输入框写入因当前插件虚拟剪贴板限制未完成；相关 Search/Reset 绑定已通过 lint/build。

回滚说明：

- 如需回滚本次工具栏标准化，恢复 `RoutingConfigCrudPage.tsx` 中无 filters 页面原先的 PageContainer `extra` Add 和 `routing-config-page__toolbar` 搜索结构，并移除 `styles/index.less` 中本轮新增的 32px 工具栏控件高度规则。

当前风险点：

- 本轮将普通 Routing Config CRUD 页统一切换到管理台工具栏，范围覆盖 VDN 等全部普通配置页；仍建议逐页人工复查工具栏换行、按钮位置和搜索行为。

### 2026-06-02 19:50 +08:00 - Routing Config 状态展示统一

修改页面或文件：

- `src/pages/routing-config/RoutingConfigStatusBadge.tsx`
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1950.md`
- `.codex-backup/current-todo-2026-06-02-1950.md`
- `.codex-backup/page-state-2026-06-02-1950.md`

修改原因：

- 用户要求评估并落实 `Routing Config` 状态展示统一：当前 Route Elements、VDN、列表、详情、新增/编辑之间存在 `Enabled/Disabled`、`Active/Disabled`、AntD Tag、StatusBadge、select、switch 和纯文本混用。

修改结果：

- `RoutingConfigStatusBadge` 统一将内部 `Active` 展示为 `Enabled`，`Disabled` 展示为 `Disabled`，并改为小尺寸 dot badge。
- `RoutingConfigCrudPage` 的 `statusSwitch` 在新增/编辑中展示短胶囊 switch + `Enabled/Disabled` 文本；详情态展示同一套状态 badge。
- `Route Elements` 列表从 AntD `Tag` 改为统一 `RoutingConfigStatusBadge`。
- 普通 Routing Config CRUD 页的 `Status` 字段从 `select Active/Disabled` 改为 `statusSwitch`，包括 VDN、Sites、Channels、Media Types、Languages、Business Types、Site Access Volume、Access Accounts、Access Entries、Working Time Plans、Skill Queues、Channel Media。
- 内部数据值仍保留 `Active/Disabled`，未修改 mock、store 或类型结构。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：列表、详情、新增弹框状态均为 `Enabled/Disabled` 语义，新增状态为短 switch + 文本。
- Browser `/routing-config/vdn` 验证通过：列表、详情、新增弹框状态均为 `Enabled/Disabled` 语义，不再出现 `Active`。

回滚说明：

- 如需回滚本次统一，恢复 `RoutingConfigStatusBadge.tsx` 的原始 label/icon 行为，恢复 `RoutingConfigCrudPage.tsx` 中 `statusSwitch` 的详情纯文本和无状态文本 switch，恢复 `RoutingConfigDataPages.tsx` 中普通页 `Status` 字段为 select，并恢复 Route Elements 的 AntD Tag 渲染。

当前风险点：

- 本次统一作用于所有普通 Routing Config CRUD 页，范围比 Route Elements/VDN 更大；lint/build 已通过，仍建议逐页人工复查弹框布局是否因状态文本增加而需要微调。

### 2026-06-02 19:40 +08:00 - Route Elements 搜索按钮主按钮化

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1940.md`
- `.codex-backup/current-todo-2026-06-02-1940.md`
- `.codex-backup/page-state-2026-06-02-1940.md`

修改原因：

- 用户反馈搜索按钮也可以像新增按钮一样有背景色，以强化查询区主操作。

修改结果：

- 将通用 CRUD 查询区 `Search` 按钮从 `secondary` 改为 `primary`。
- `Reset` 保持 `secondary`，继续作为次操作。
- `Add` 独立靠右、按钮固定宽度、短胶囊状态开关和弹框顶部标题栏背景修正不变。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：查询条件、Search、Reset、Add、表格和分页仍正常展示。

回滚说明：

- 如需回滚本次调整，将 `RoutingConfigCrudPage.tsx` 中 Search 的 `variant=\"primary\"` 改回 `variant=\"secondary\"`。

当前风险点：

- 该调整作用于通用 CRUD 容器，其它 Routing Config 普通配置页的 Search 按钮也会同步变为 primary；这符合管理台主查询操作样式，但仍建议逐页人工复查。

### 2026-06-02 19:36 +08:00 - Route Elements 弹框标题栏背景修正

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1936.md`
- `.codex-backup/current-todo-2026-06-02-1936.md`
- `.codex-backup/page-state-2026-06-02-1936.md`

修改原因：

- 用户澄清上一条“不要把背景色去掉，改回来”指的是弹框顶部标题所在区域，不是底部 footer；上一轮按 footer 理解并恢复底部背景是错误方向。

修改结果：

- 移除 19:18 加到 `routing-config-crud-modal__footer` 的浅色背景、上边线、负 margin 和额外 padding。
- 恢复 `routing-config-crud-modal` 顶部 `.ant-modal-header` 的浅蓝渐变标题栏背景。
- 保留弹框标题黑色、按钮固定宽度、Add 独立靠右和短胶囊状态开关。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：Add 弹框可正常打开，字段、状态开关、Cancel/Save 和分页仍正常。

回滚说明：

- 如需回滚本次纠正，恢复 `src/styles/index.less` 中 `routing-config-crud-modal__footer` 的 footer 背景样式，并将 `routing-config-crud-modal.aicc-modal .ant-modal-header` 改回 transparent。

当前风险点：

- 本轮是针对用户澄清的定向修正；顶部标题栏背景恢复为项目统一 modal header 风格，后续仍需在目标演示分辨率下目视确认。

### 2026-06-02 19:18 +08:00 - Route Elements 工具栏、弹框 footer 和短开关调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1918.md`
- `.codex-backup/current-todo-2026-06-02-1918.md`
- `.codex-backup/page-state-2026-06-02-1918.md`

修改原因：

- 用户继续反馈 `Route Elements` 管理台样式：新增按钮应独立靠右；弹框底部背景不应被去掉；Search/Reset 和 Cancel/Save 等操作按钮应宽度一致；状态开关仍过宽，应改成类似常见短胶囊开关。

修改结果：

- CRUD 查询工具栏拆成左侧 query group 和右侧 add action；`Add` 独立靠右，`Search` / `Reset` 紧跟查询条件。
- `Search` / `Reset` 与 CRUD 弹框 footer 按钮统一为 82px 固定宽度。
- CRUD 弹框 footer 恢复浅色背景和上边线，保留标题黑色与主体简洁背景。
- 路由配置状态开关改为固定 34px x 18px 短胶囊样式，checked 使用 `--aicc-primary`。
- 窄屏规则同步处理 query group 和 add action，避免 Add 与查询条件挤压。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：英文标题、查询条件、右侧 Add、精简表头、底部分页、Add 弹框初始无错误、Save 后小型校验提示。

回滚说明：

- 如需回滚本次调整，恢复 `RoutingConfigCrudPage.tsx` 中工具栏分组，以及 `styles/index.less` 中 `routing-config-page__query-group`、`routing-config-page__add-action`、footer、按钮宽度和状态开关样式。

当前风险点：

- 本轮样式继续作用于通用 CRUD 容器，后续其它 Routing Config 普通配置页也会继承 Add 靠右、footer 背景和短状态开关；符合统一管理台规范，但仍建议逐页人工复查。

### 2026-06-02 19:11 +08:00 - Route Elements 英文化、分页和密度调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1911.md`
- `.codex-backup/current-todo-2026-06-02-1911.md`
- `.codex-backup/page-state-2026-06-02-1911.md`

修改原因：

- 用户继续反馈首个菜单需要使用英文；搜索/重置按钮应贴近查询条件；状态下拉宽度应与输入框一致；列表底部应支持分页和每页条数；表格字号/间距偏大；弹框标题不应是蓝色，背景和状态开关仍需收敛。

修改结果：

- `Route Elements` 文案改回英文：`Route Element Configuration`、`Element ID`、`Element Name`、`Status`。
- 查询条件与 `Search` / `Reset` / `Add` 连续排列，状态下拉宽度与输入框统一为 200px。
- 通用 CRUD 表格启用分页：默认 20 条，支持 10 / 20 / 50 / 100，数据总数移动到底部分页区展示。
- 收紧 `Routing Config` CRUD 表格字号、单元格 padding、分页字号和行操作按钮尺寸。
- CRUD 弹框标题覆盖为黑色；移除额外白底/只读输入框背景；状态开关缩短。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements` 验证通过：英文标题、英文查询条件、搜索/重置/新增、精简表头、分页总数、Add 弹框初始无错误、Save 后英文校验提示。

回滚说明：

- 如需回滚本次调整，恢复 `RoutingConfigCrudPage.tsx`、`RoutingConfigDataPages.tsx`、`styles/index.less` 中 19:11 的英文化、分页、表格密度和弹框覆盖样式。

当前风险点：

- 分页现在应用于通用 CRUD 容器，因此其它 Routing Config 普通配置页也会显示底部分页；这是管理台列表维护的合理统一，但后续如某页需要无分页需加独立参数。

### 2026-06-02 19:03 +08:00 - 路由要素配置页与管理台 CRUD 样式调整

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1903.md`
- `.codex-backup/current-todo-2026-06-02-1903.md`
- `.codex-backup/page-state-2026-06-02-1903.md`

修改原因：

- 用户反馈第一个菜单 `Route Elements` 页面不符合管理台数据维护习惯：标题信息太多、查询框过长、字段过多且技术化、弹框灰蓝背景和初始错误提示不合理、状态开关过长。
- 用户确认路由要素管理字段应为 `要素ID、要素名称、状态（启用/禁用）`。

修改结果：

- `Route Elements` 页面改为 `路由要素配置`，移除页面 eyebrow 和冗长说明。
- 查询区改为短字段横向表单：`要素ID`、`要素名称`、`状态`，并将 `搜索`、`重置`、`新增` 放在同一行。
- 列表字段精简为 `要素ID`、`要素名称`、`状态`、`操作`。
- 新增/编辑/查看弹框只展示 `要素ID`、`要素名称`、`状态`；状态字段改为短开关；查看态字段改为白底。
- 通用 CRUD 容器新增 `filters`、`submitAttempted`、`statusSwitch`、轻量校验提示和可配置中文动作文案；本轮先应用到路由要素配置页。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser `/routing-config/route-elements`：确认页面标题、查询栏、精简列表字段、隐藏技术列、新增弹框初始无错误提示。

回滚说明：

- 如需回滚本次首个菜单调整，恢复 `RoutingConfigCrudPage.tsx`、`RoutingConfigDataPages.tsx` 和 `styles/index.less` 中本轮 CRUD/filter/modal 样式改动，并恢复本次文档和备份。

当前风险点：

- 本轮只将管理台 CRUD 新规范应用到 `Route Elements`；VDN、Sites、Channels 等其它页面仍保持上一轮 CRUD 结构，后续可逐步统一。

### 2026-06-02 18:37 +08:00 - Routing Config 拆分独立配置页并补齐 CRUD

修改页面或文件：

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/pages/routing-config/RoutingConfigStatusBadge.tsx`
- `src/pages/routing-config/index.ts`
- `src/pages/call-management/RoutingConfigurationPage.tsx`
- `src/pages/index.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/store/routingConfigStore.ts`
- `src/store/index.ts`
- `src/mock/routingConfiguration.ts`
- `src/types/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-02-1837.md`
- `.codex-backup/current-todo-2026-06-02-1837.md`
- `.codex-backup/page-state-2026-06-02-1837.md`

修改原因：

- 用户反馈旧的 `Routing Configuration` tabs 页面太拥挤，不符合配置管理诉求；要求新增一级菜单 `Routing Config`，二级菜单进入各独立配置页，并补齐增删改查。
- 用户要求解释并调整站点 `timezone`：海外 AICC 的时区应服务于工作时间、节假日和报表，但会议字段没有站点时区，因此本轮从 Sites 移除，只保留在 Working Time Plans。

修改结果：

- 新增一级菜单 `Routing Config`，二级页面包括 Route Elements、VDN、Sites、Channels、Channel Media、Media Types、Languages、Business Types、Site Access Volume、Access Accounts、Access Entries、Working Time Plans、Skill Queues、Skill Routing Rules。
- `Call Management` 下只保留 `Text Channel Settings`；旧 `/call-management/routing-configuration` 改为重定向到 `/routing-config/route-elements`。
- 新增 `routingConfigStore` 和通用 `RoutingConfigCrudPage`，普通配置页支持 Search / Add / View / Edit / Delete，本地状态刷新后恢复 mock。
- Sites 类型、mock 和页面均移除 `timezone`；Working Time Plans 保留 `timezone` 并显示 `Default 24x7`。
- 删除操作增加引用保护：被站点接入比例、路由规则、接入入口、技能队列等引用的记录不能直接删除。
- Skill Routing Rules 独立页面支持批量新增、组合预览、重复组合展示、覆盖更新目标队列/优先级、未覆盖阻止保存、规则查看/编辑/删除和发布索引展示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite chunk size warning。
- Browser smoke check 通过：`/`、`/design-system`、`/routing-config/route-elements`、`/routing-config/sites`、`/routing-config/channels`、`/routing-config/skill-routing-rules`、`/call-management/text-channel-settings`。
- Browser 确认 `/call-management/routing-configuration` 重定向到 `/routing-config/route-elements`。
- Browser 交互检查通过：Sites 搜索、Add 弹窗、被引用删除保护；Skill Routing Rules 重复组合预览和未勾选覆盖时阻止保存。

回滚说明：

- 如需回滚本次拆分，删除 `src/pages/routing-config/*`、恢复旧 `RoutingConfigurationPage` tabs 页面，恢复 `routes.tsx`、`BasicLayout.tsx`、`styles/index.less`、`PROJECT_CONTEXT.md`、`DEV_LOG.md` 和本次 `.codex-backup` 文件。

当前风险点：

- Routing Config 仍为前端 demo，不接真实后台配置服务；本地 CRUD 和规则覆盖只保存在前端 store，刷新后恢复 mock。
- 本轮自动验证覆盖关键路由和部分交互，仍建议在目标演示分辨率下人工复查所有二级菜单的弹窗布局、收起态 flyout 和表格横向滚动。

### 2026-06-02 17:58 +08:00 - Call Management 路由配置架构页

修改页面或文件：

- `src/pages/call-management/RoutingConfigurationPage.tsx`
- `src/pages/call-management/index.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/mock/routingConfiguration.ts`
- `src/types/routingConfiguration.ts`
- `src/types/index.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-02-1758.md`
- `.codex-backup/current-todo-2026-06-02-1758.md`
- `.codex-backup/page-state-2026-06-02-1758.md`

修改原因：

- 用户要求将会议重新定义的 AICC 路由配置架构落地实现，新增 `Call Management > Routing Configuration`，用于演示路由要素、VDN、站点、渠道媒体、接入账号、接入入口、业务类型、站点接入比例、工作时间、技能队列和技能路由规则。

修改结果：

- 新增 `/call-management/routing-configuration` 路由与左侧菜单入口。
- 新增路由配置专用类型和 mock，所有业务 ID 使用显式编码；补充 `10=VDN` 路由要素，会议中的 `11-18` 要素编码保持不变。
- 新增 `RoutingConfigurationPage`，包含 11 个配置页签：Route Elements、VDN、Sites、Channels & Media、Access Accounts、Access Entries、Business Types、Site Access Volume、Working Time Plans、Skill Queues、Skill Routing Rules。
- Skill Routing Rules 支持按启用要素批量选择、生成组合、检测重复组合、覆盖重复组合并展示物化 `routing_rule_index`。
- 页面预发布校验覆盖站点比例 100%、业务类型两位编码、自编码格式、目标技能队列、工作时间方案和坐席覆盖风险。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning 和插件耗时提示。
- 本地 Vite 服务运行在 `http://127.0.0.1:5174/`；5173 已被旧服务占用。
- Chrome headless smoke check 通过：`/`、`/design-system`、`/call-management/routing-configuration` 均能渲染 BANK 1 shell；新增页可见 `Route Elements` 和 `Skill Routing Rules`；`/call-management/text-channel-settings` 仍可见 `Text Channel Settings`、`Service Rules`、`Channel Queue Alerts`。

回滚说明：

- 如需回滚本次路由配置页，删除 `RoutingConfigurationPage`、`routingConfiguration` mock/type，恢复 `routes.tsx`、`BasicLayout.tsx`、`styles/index.less`、`PROJECT_CONTEXT.md`、`DEV_LOG.md` 和本次 `.codex-backup` 文件即可。

当前风险点：

- `Routing Configuration` 仍为前端 demo，不接真实配置接口；批量新增/覆盖路由规则只在页面内存中生效，刷新后恢复 mock 默认值。
- 本轮未做人工视觉复查，仍建议在目标演示分辨率下检查 11 个页签、批量规则表单、重复提示和收起/展开侧栏 flyout。

### 2026-06-01 13:00 +08:00 - 数据呼叫管理文字渠道配置页

修改页面或文件：

- `src/pages/call-management/TextChannelSettingsPage.tsx`
- `src/pages/call-management/index.ts`
- `src/pages/index.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/mock/textChannelSettings.ts`
- `src/types/textChannelSettings.ts`
- `src/types/index.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-01-1300.md`
- `.codex-backup/current-todo-2026-06-01-1300.md`
- `.codex-backup/page-state-2026-06-01-1300.md`

修改原因：

- 用户要求在数据呼叫管理菜单下新增系统配置管理页面，用于集中配置文字渠道默认服务人数、坐席未回复自动回复、渠道排队阈值提醒、Webchat 撤回时限、客户未回复超时关闭话术、欢迎语、结束语和坐席未回复服务级别提醒。

修改结果：

- 新增 `/call-management/text-channel-settings` 路由与 `Call Management > Text Channel Settings` 菜单。
- 新增 `TextChannelSettingsPage`，包含 `Service Rules`、`Customer Timeout & Messages`、`Channel Queue Alerts` 三个页签。
- 新增文字渠道配置 mock 和类型；配置专用渠道 code 为 `haloapp | webchat | whatsapp`，避免耦合现有 `AccessChannel`。
- 页面支持本地输入、开关、变量 chip 插入、基本校验、`Save Draft` 和 `Publish` 本地状态提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check 通过：`/`、`/design-system`、`/call-management/text-channel-settings` 均可加载；新配置页三页签、`Save Draft`、`Publish` 均可操作并显示本地提示。

回滚说明：

- 如需回滚该配置页，删除新增 `call-management` 页面、`textChannelSettings` mock/type，并恢复 `routes.tsx`、`BasicLayout.tsx`、`styles/index.less`、`PROJECT_CONTEXT.md`、`DEV_LOG.md` 和本次 `.codex-backup` 文件即可。

当前风险点：

- 当前配置页为前端 demo，不接真实配置接口；刷新后恢复 mock 默认值。
- 菜单新增了 `Call Management` 子项，需要在目标演示分辨率下人工确认展开态/收起态 flyout 视觉。

### 2026-05-29 19:23 +08:00 - Live Chat formatDuration runtime error 热修

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1923.md`
- `.codex-backup/current-todo-2026-05-29-1923.md`
- `.codex-backup/page-state-2026-05-29-1923.md`

修改原因：

- 用户反馈跳转进正式 Live Chat 弹屏时报 `Unexpected Application Error! formatDuration is not defined`，页面无法进入。

修改结果：

- 在 `LiveChat2Page.tsx` 中从 `../../utils/duration` 正确导入 `formatDuration`，修复 `customer.accessDuration: formatDuration(activeSession.elapsedSeconds)` 的未定义引用。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning 和插件耗时提示。
- Browser `/`：页面可加载，不再出现 `Unexpected Application Error` 或 `formatDuration is not defined`。
- Browser `/design-system`：页面可加载，不再出现 runtime error。

回滚说明：

- 不建议回滚该热修；如回滚会重新触发 Live Chat runtime error。若必须回滚上一轮运行时 access duration 改动，需要同时移除对应 `formatDuration(...)` 调用。

当前风险点：

- 仍需人工复查正式 Live Chat 内部视觉细节：新接入计时从 `00:00` 开始、默认 no flag、消息满宽、右侧 tabs close 可点。

### 2026-05-29 18:02 +08:00 - Live Chat 计时、星标和 tabs 遮挡修正

修改页面或文件：

- `src/store/appStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1802.md`
- `.codex-backup/current-todo-2026-05-29-1802.md`
- `.codex-backup/page-state-2026-05-29-1802.md`

修改原因：

- 用户继续反馈正式 `Live Chat`：文字客户新接入后计时不应继承 mock 时长；列表星标应默认 no flag；无星标时最新消息不应被隐藏星标占宽；上轮右侧 tabs 间距修反了；more 按钮仍遮挡最后一个关闭按钮且占宽过大。

修改结果：

- Demo handoff 生成的新文字客户实例将 `customer.accessDuration` 置为 `00:00`，运行时 timing `startedAt` 使用当前时刻；Customer Information 的 access duration 改用 active session 的运行时服务时长。
- Live Chat 列表默认星标统一显示为灰色 no flag，不再读 mock 的 `initialStarColor`；handoff 实例也写入灰色星标。
- no flag 客户行的星标操作改为浮动 hover 区，最新消息在非历史行也能跨满第二行宽度。
- Assistant tab label 改为扁平 icon/text/close 结构，删除宽泛 span gap 规则，恢复与 Assistant / Connection 一致的紧凑间距。
- CRM / Assistant more operations 宽度收紧到 18px，并提高 close 按钮层级，降低最后一个页签关闭按钮被遮挡的风险。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Sign In 后固定 `Live Chat` tab 可见；当前 in-app browser 仍未稳定完成进入 Live Chat 细节页的自动化点击验证。
- Browser `/design-system`：正常加载，`UI Design System` 与 `Color System` 可见。

回滚说明：

- 如需回滚，可恢复 `requestLiveChatWorkspace` 对 mock `accessDuration` / `initialStarColor` 的继承，恢复 `LiveChat2Page` 对 `session.initialStarColor` 的读取，移除 `LiveChat2CustomerPanel` 的 floating action class，并恢复 Assistant / CRM tabs 上轮 more operations 宽度。

当前风险点：

- 仍建议在目标分辨率下人工复查 Live Chat 内部：新接入计时是否从 `00:00` 开始、灰色 no flag 行消息是否满宽、Quick Replies / Message Record 间距是否与 Assistant / Connection 一致，以及 CRM / Assistant 最后一个 tab close 是否可点。

### 2026-05-29 17:42 +08:00 - Live Chat 替换后手工评审问题修正

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/store/appStore.ts`
- `src/types/inbound.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1742.md`
- `.codex-backup/current-todo-2026-05-29-1742.md`
- `.codex-backup/page-state-2026-05-29-1742.md`

修改原因：

- 用户手工点击正式 `Live Chat` 后反馈：坐席主动结束应直接关闭、Ticketing tab 应显示 CRM ID、右侧 tabs 间距不一致、更多按钮遮挡 close、引用消息展示不自然、demo 再次跳入应作为新客户接入。

修改结果：

- 坐席主动 `End Service` 确认后会追加系统结束语并直接调用 close，将会话移入 History；客户主动结束和超时结束仍保留 `Close` 按钮。
- Ticketing History 打开的动态 CRM tab label 改为 ticket reference，例如 `CRM000145`，详情区域仍显示原业务类型。
- Assistant extra tabs 与固定 tabs 使用统一 label renderer，Quick Replies / Message Record 的 icon 和文字间距与 Assistant / Connection 对齐。
- CRM 与 Assistant tabs 的 nav wrap / operations 增加右侧预留，降低更多按钮遮挡最后一个 close 按钮的风险。
- 引用消息发送时使用 `quotedMessage` 字段，正文不再包含 `Replying to ...`；消息区用浅灰引用块展示引用内容。
- `requestLiveChatWorkspace` 每次 demo handoff 都会基于对应 livechat2 mock 创建新的 session instance，重复从 WhatsApp / BankApp Demo 跳入不再复用原客户行。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Sign In 后固定 `Live Chat` tab 可见；本轮 in-app browser 未稳定完成 `Live Chat` tab 切换后的细节自动化复查。
- Browser `/design-system`：正常加载，`UI Design System` 与基础章节可见。

回滚说明：

- 如需回滚，可恢复 `requestLiveChatWorkspace` 为固定 session id 映射、恢复 `LiveChat2Page` 中 End Service 只调用 `endLiveChat2Session`、恢复 AssistantPanel 的原 extra tab label 结构，并移除 `quotedMessage` 发送参数。

当前风险点：

- 仍建议在目标演示分辨率下人工复查重复 WhatsApp / BankApp handoff 后的多客户列表、未读 badge、CRM/Assistant 最后一项 close 按钮可点击性和引用消息视觉。

### 2026-05-29 16:27 +08:00 - 正式 Live Chat 替换为新版弹屏并补未读 badge

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1627.md`
- `.codex-backup/current-todo-2026-05-29-1627.md`
- `.codex-backup/page-state-2026-05-29-1627.md`

修改原因：

- 用户确认当前 livechat2 弹屏已足够完善，可以替换原有 `Live Chat`；同时要求正式 `Live Chat` 页签右上角显示总未读消息数，超过 99 显示 `99+`，并移除临时 `livechat2` 菜单入口。

修改结果：

- `AgentWorkspace` 保持正式 tab key `live-chat` 与 label `Live Chat`，但渲染新版 `LiveChat2Page`，不再渲染独立 `livechat2` tab。
- `Live Chat` tab 右上角新增未读总数 badge，只统计当前 active 且未读的新版会话，已读、ended 和 history 会话不计入，大于 99 显示 `99+`。
- `requestLiveChatWorkspace` 继续服务旧 WhatsApp / BankApp 跳转流程，但内部映射到 `liveChat2*` 状态：`live-chat-001 -> livechat2-001`、`live-chat-002 -> livechat2-002`、`live-chat-003 -> livechat2-003`。
- 左侧 `Channel Simulation` 删除临时 `livechat2` 菜单项；旧 `LiveChatPage` 源码未删除，保留作本地回滚参考。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- `git diff --check` 通过，仅有 CRLF 提示。
- Browser `/`：可 Sign In，正式 `Live Chat` tab 可打开并渲染新版 Live Chat workspace，页面中没有可见 `livechat2` 文案。
- Browser `/design-system`：正常加载。

回滚说明：

- 如需回滚，可恢复 `AgentWorkspace` 中旧 `LiveChatPage` tab children、恢复独立 `LIVE_CHAT2_TAB_KEY` tab 与 `BasicLayout` 的 `customer-livechat2` 菜单处理，并把 `requestLiveChatWorkspace` 恢复为旧 `activeLiveChatSessionIds` 状态。

当前风险点：

- 仍建议在目标演示分辨率下人工复查 WhatsApp Demo、BankApp Live Chat、未读 badge、Quick Replies、Message Record 和菜单入口移除效果。

### 2026-05-29 15:39 +08:00 - livechat2 Quick Replies 加号和箭头样式微调

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1539.md`
- `.codex-backup/current-todo-2026-05-29-1539.md`
- `.codex-backup/page-state-2026-05-29-1539.md`

修改原因：

- 用户反馈 `My Phrases` 标题上的加号与下方分类操作加号粗细、居中不一致；收起展开箭头不应为黑色，应与 Customer Journey 等系统卡片样式一致。

修改结果：

- `livechat2-quick-reply-panel__section-add` 调整为与分类操作按钮一致的 22px 小按钮视觉：统一字号、line-height、居中和 margin。
- section / group 折叠箭头统一为系统次级文本色，hover / focus 时变为主题蓝，贴近 `BaseCard` / Customer Journey 的箭头口径。
- 本轮不改 Quick Replies 结构、CRUD 逻辑或旧功能。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- `git diff --check` 通过，仅有 CRLF 提示。
- 实际 `livechat2` Quick Replies 视觉仍需在页面中人工复查。

回滚说明：

- 如需回滚，可移除 `.livechat2-quick-reply-panel__section-toggle .anticon` / `.group-toggle .anticon` 颜色规则，并恢复 `.section-add` 原 margin 和字号。

当前风险点：

- 仍需人工确认 hover 出现加号时与标题行视觉对齐。

### 2026-05-29 15:31 +08:00 - livechat2 Quick Replies 面板视觉优化

修改页面或文件：

- `src/pages/inbound/components/LiveChat2QuickRepliesPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1531.md`
- `.codex-backup/current-todo-2026-05-29-1531.md`
- `.codex-backup/page-state-2026-05-29-1531.md`

修改原因：

- 用户反馈 Quick Replies 常用语面板计数冗余、长语句被省略、分类不能折叠、My Phrases 添加按钮占独立行，以及短语操作按钮未悬浮时预留右侧空白导致文本显示不完整。

修改结果：

- 移除 section 和 group 标题可见计数。
- section 标题继续可折叠，group 标题新增折叠状态并默认展开。
- My Phrases 添加分组按钮移到标题右侧，hover / focus 时显示加号；不再常驻单独一行。
- phrase code/text 改为完整换行，不再使用 ellipsis 截断。
- My phrase 的 Insert/Edit/Delete 操作按钮改为右上角悬浮覆盖层，未 hover / focus 时不占布局列宽。
- 本轮不改 quick reply 数据模型、公共常用语只读规则、`/` 浮层同步逻辑或旧 `Live Chat`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning，并出现插件耗时提示。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载。
- Browser livechat2 点击链路：当前 in-app browser DOM 未暴露 `livechat2` 菜单入口，实际 Quick Replies 视觉仍需人工复查。

回滚说明：

- 如需回滚，可恢复 `LiveChat2QuickRepliesPanel` 中 group header 为非折叠结构，并恢复 Quick Replies CSS 中原先的 grid 两列 phrase 布局、计数 badge 和 ellipsis 文本样式。

当前风险点：

- 仍需在实际 livechat2 页面人工复查 hover 操作层是否遮挡关键文本，以及长语句换行后的面板高度是否符合演示密度。

### 2026-05-29 13:17 +08:00 - livechat2 右侧 Quick Replies tab

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/LiveChat2QuickRepliesPanel.tsx`
- `src/pages/inbound/components/liveChat2QuickReplies.ts`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1317.md`
- `.codex-backup/current-todo-2026-05-29-1317.md`
- `.codex-backup/page-state-2026-05-29-1317.md`

修改原因：

- 用户要求 livechat2 文字弹屏右侧 Assistant 区新增 `Quick Replies` tab，用于展示和维护聊天输入框 `/` 快捷回复同一份内容；我的常用语可本次演示内增删改，公共常用语只读。

修改结果：

- 新增 livechat2 quick replies 数据模型和默认 groups，并由 `LiveChat2Page` 持有本次运行期 state。
- Conversation 输入框 `/` 浮层改为读取共享 quick reply options，保留默认选中、上下键切换、Enter 带入和最多 10 条结果。
- 右侧 Assistant 区新增固定 `Quick Replies` tab；`AssistantPanelExtraTab` 新增 `closable?: boolean` 支持固定 tab。
- 新增 `LiveChat2QuickRepliesPanel`：支持 code/text 搜索、My/Public 两区块默认展开/收起、My 分组和 phrase 的 inline 增删改、Public 只读点击插入。
- 右侧 phrase 点击后会写入当前 active livechat2 draft，并通过 focus request 让 Conversation textarea 聚焦且光标位于语句末尾。
- 本轮不写后端、不写 localStorage，不影响旧 `Live Chat`、电话/视频弹屏或弹框。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载。
- Browser livechat2 点击链路：当前 in-app browser DOM 未暴露 `livechat2` 菜单入口，实际 `Quick Replies` tab 与 CRUD / 插入交互仍需人工复查。

回滚说明：

- 如需回滚，可移除 `LiveChat2QuickRepliesPanel`、`liveChat2QuickReplies`、`LiveChat2Page` 中的 quick reply groups/focus request/right tab 接线，并将 Conversation quick replies 恢复为本地静态数组。

当前风险点：

- 仍需在实际 livechat2 页面人工复查窄右侧面板下的 inline 表单、hover 操作按钮和 `/` 浮层同步效果。

### 2026-05-29 12:25 +08:00 - livechat2 quick replies 键盘选择

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1225.md`
- `.codex-backup/current-todo-2026-05-29-1225.md`
- `.codex-backup/page-state-2026-05-29-1225.md`

修改原因：

- 用户希望 livechat2 聊天输入框输入 `/` 后，快捷回复浮层默认选中第一条，可用上下箭头切换，按 Enter 自动带入选中语句，并把输入光标放到语句末尾。

修改结果：

- quick replies 打开时默认选中第一条候选。
- `ArrowDown` / `ArrowUp` 支持在当前候选列表中循环切换。
- quick replies 打开时按 `Enter` 会带入当前选中语句，不触发发送；浮层未打开时保留原 Enter 发送行为。
- 鼠标悬浮候选会同步选中态，点击候选仍可带入语句。
- 带入语句后 textarea 保持 focus，selection range 移到语句末尾。
- 选中候选增加浅蓝背景和左侧主题色强调线。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载。
- Browser livechat2 点击链路：当前 in-app browser DOM 未暴露 `livechat2` 菜单入口，slash 键盘交互仍需在实际页面人工复查。

回滚说明：

- 如需回滚，可移除 `quickReplySelection` 状态、`handleComposerKeyDown` 中 quick reply 分支，以及 `.livechat2-quick-replies button.is-selected` 样式；恢复后 quick replies 仍可点击，但无键盘选择带入能力。

当前风险点：

- 仍需在实际 livechat2 页面人工复查 `/`、上下键、Enter 和光标位置的完整视觉交互。

### 2026-05-29 12:04 +08:00 - livechat2 quick replies 悬浮层上移

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-29-1204.md`
- `.codex-backup/current-todo-2026-05-29-1204.md`
- `.codex-backup/page-state-2026-05-29-1204.md`

修改原因：

- 用户反馈在 livechat2 聊天输入框输入 `/` 时，快捷回复悬浮层挡住输入框，导致看不到正在输入的内容。

修改结果：

- `.livechat2-quick-replies` 从 `bottom: 54px` 改为 `bottom: calc(100% + 6px)`，让悬浮层出现在整个 composer 正上方。
- quick replies 增加 `max-height: 218px` 和内部纵向滚动，避免回复项过多时遮挡输入区。
- 本轮不改 quick reply 数据、筛选逻辑或发送逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载；`livechat2` slash 悬浮层仍需在实际菜单路径下人工复查。

回滚说明：

- 如需回滚，可将 `.livechat2-quick-replies` 恢复为 `bottom: 54px` 和 `overflow: hidden`，但会重新出现遮挡 textarea 的问题。

当前风险点：

- 仍需人工复查 livechat2 实际视觉：输入 `/` 时悬浮层应在输入框正上方，且不遮挡输入内容。

### 2026-05-28 23:26 +08:00 - livechat2 Message Record 视觉与 Locate 状态微调

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-2326.md`
- `.codex-backup/current-todo-2026-05-28-2326.md`
- `.codex-backup/page-state-2026-05-28-2326.md`

修改原因：

- 用户反馈 `Message Record` 页签 icon 与文字距离过大、搜索框 placeholder 字号偏大，并指出定位后回到连续文字记录时不应继续显示定位按钮。

修改结果：

- 收紧 right panel extra tab 的 icon/text gap，并覆盖 AntD icon 默认右侧 margin。
- 将 Message Record 搜索框 input 与 placeholder 字号压到 11px。
- 新增搜索结果态控制：`Locate` 只在点击 `Search` 后显示，点击 `Locate` 后重置过滤条件并退出搜索结果态，连续记录中不再显示定位按钮。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- Browser livechat2 点击链路未完成：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查页签间距、placeholder 字号和 Locate 显示时机。

回滚说明：

- 如需回滚本轮调整，可移除 `isSearchResultMode` 状态，让 `Locate` 在所有记录行继续 hover 显示，并恢复 right tab gap 与 placeholder 字号。

当前风险点：

- 仍需人工复查 livechat2 实际视觉：页签 icon/text 间距和 placeholder 字号是否达到预期。
- 当前 in-app browser 未能自动进入 `Channel Simulation > livechat2`，因此本轮只完成 `/` 与 `/design-system` smoke check。

### 2026-05-28 23:16 +08:00 - livechat2 Message Record 页签与搜索区精简

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-2316.md`
- `.codex-backup/current-todo-2026-05-28-2316.md`
- `.codex-backup/page-state-2026-05-28-2316.md`

修改原因：

- 用户要求历史消息图标改为双态按钮，右侧 `Message Record` 页签保留页签级关闭后删除面板内重复标题/关闭按钮，并将日期条件合并为一个日期段选择控件，搜索条件尽量一行展示。

修改结果：

- Composer 历史消息按钮改为 toggle：点击打开右侧 `Message Record`，再次点击关闭并回到 `Connection`。
- `Message Record` 面板删除内部 header、标题和关闭按钮。
- 搜索区改为一行布局：AntD `RangePicker`、消息内容搜索框、`Search` 按钮和紧凑结果数。
- 右侧 extra tab label 改为 icon/text/close 紧凑结构，并为 AntD tabs more 操作留出稳定宽度，降低关闭按钮被遮挡风险。
- 保留搜索倒序、高亮、`Locate` 定位和中间消息短暂高亮。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- Browser livechat2 点击链路未完成：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查 Message Record 双态按钮、页签关闭和一行搜索区视觉。

回滚说明：

- 如需回滚本轮调整，可将 `handleToggleMessageRecord` 恢复为只打开记录页签，恢复 `LiveChat2MessageRecordPanel` 的内部 header/close，并把 RangePicker 搜索区恢复为 From/To 两个输入行。

当前风险点：

- 仍需人工复查 livechat2 实际视觉：右侧页签关闭按钮、more 图标、一行搜索区和 RangePicker 弹层是否符合目标分辨率。
- 当前 in-app browser 未能自动进入 `Channel Simulation > livechat2`，因此本轮只完成 `/` 与 `/design-system` smoke check。

### 2026-05-28 23:01 +08:00 - livechat2 Message Record 搜索与定位优化

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/liveChat2MessageUtils.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-2301.md`
- `.codex-backup/current-todo-2026-05-28-2301.md`
- `.codex-backup/page-state-2026-05-28-2301.md`

修改原因：

- 用户要求调整历史消息记录页签内容：默认近 7 天日期范围、文字搜索、点击搜索后展示倒序结果、关键字高亮，并支持从结果定位到中间聊天记录。

修改结果：

- `Message Record` 搜索区改为日期范围 + 消息内容输入 + `Search` 按钮，修改条件不立即刷新。
- 搜索结果按日期范围和消息内容过滤，并按发送时间倒序排列。
- 结果行展示发送人、消息内容、发送时间；匹配文字继续高亮。
- 结果行 hover / focus 时显示 `Locate`，点击后重置搜索条件，并通过定位请求让 Conversation 滚动到原消息且短暂高亮。
- 新增 `LiveChat2MessageLocateRequest`，用 `messageId + requestId` 支持重复定位同一条消息。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 plugin timings 与 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- Browser livechat2 点击链路未完成：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查 Message Record 搜索与 Locate 定位交互。

回滚说明：

- 如需回滚本轮调整，可恢复 `LiveChat2MessageRecordPanel` 原有范围下拉和输入即过滤逻辑，移除 `messageLocateRequest` 状态、消息 article ref 与定位高亮样式。

当前风险点：

- 仍需人工复查 livechat2 实际交互：日期范围、Search 触发、倒序结果和 Locate 定位高亮是否符合演示预期。
- 当前 in-app browser 未能自动进入 `Channel Simulation > livechat2`，因此本轮只完成 `/` 与 `/design-system` smoke check。

### 2026-05-28 20:10 +08:00 - livechat2 Message Record 改为右侧可关闭页签

修改页面或文件：

- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/liveChat2MessageUtils.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-2010.md`
- `.codex-backup/current-todo-2026-05-28-2010.md`
- `.codex-backup/page-state-2026-05-28-2010.md`

修改原因：

- 用户要求点击历史消息后，不在 Conversation 内部展示，而是在右侧 `Connection` 页签旁边新开一个可关闭页签展示。

修改结果：

- `AssistantPanel` 支持受控 active tab、额外页签和关闭额外页签。
- `InteractionWorkspace` 将右侧页签扩展能力透传给 livechat2。
- `LiveChat2Page` 打开 `Message Record` 时在右侧新增 `Message Record` tab，并切换到该 tab；关闭时回到 `Connection`。
- `LiveChat2ConversationWorkspace` 移除内嵌记录侧栏，composer 历史消息图标改为打开右侧记录页签；记录面板组件复用于右侧 tab。
- 新增 `liveChat2MessageUtils.ts` 共享欢迎语过滤后的可见消息源，避免组件文件导出 helper 触发 lint。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- Browser livechat2 点击链路未完成：当前 in-app browser 可见 DOM 未暴露左侧菜单项，临时桌面 viewport 后仍只能看到 Home tab，需人工复查。

回滚说明：

- 如需回滚本轮调整，可移除 `AssistantPanel` extra tab 扩展，恢复 `LiveChat2ConversationWorkspace` 内部 `isRecordOpen` 侧栏状态与右侧 `livechat2-records` 渲染。

当前风险点：

- 仍需人工复查 livechat2 实际交互：点击 composer 历史消息图标后，右侧 `Message Record` tab 应出现在 `Connection` 旁且可关闭。
- 当前 in-app browser 未能自动进入 `Channel Simulation > livechat2`，因此本轮只完成 `/` 与 `/design-system` smoke check。

### 2026-05-28 19:56 +08:00 - livechat2 Conversation 输入区移除图片图标

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1956.md`
- `.codex-backup/current-todo-2026-05-28-1956.md`
- `.codex-backup/page-state-2026-05-28-1956.md`

修改原因：

- 用户要求底部内容输入区域去除图片图标，只保留表情、文件、历史消息图标。

修改结果：

- Composer 工具栏移除 `Image` 图标按钮。
- 输入区保留 `Emoji`、`File`、`Message record` 三个图标和 Send 按钮。
- 仍保留消息区已有图片消息的渲染能力，不改消息类型或 mock。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。

回滚说明：

- 如需恢复图片入口，可在 composer 工具栏重新加入 `Image` 按钮并使用 `FileImageOutlined` 图标。

当前风险点：

- 仍需人工复查输入区图标顺序和间距是否符合预期。

### 2026-05-28 19:36 +08:00 - livechat2 Conversation 消息记录与撤回消息优化

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1936.md`
- `.codex-backup/current-todo-2026-05-28-1936.md`
- `.codex-backup/page-state-2026-05-28-1936.md`

修改原因：

- 用户要求历史消息记录图标放到发送文件图标旁边，消息区不显示点击查看更多，坐席端不显示客户端欢迎语，已撤回消息不能引用且改为重新编辑。

修改结果：

- `Message Record` 入口移到 composer 工具栏文件图标旁边，并在记录面板打开时高亮。
- 删除消息区顶部 `Message Record` 文字按钮以及 `Click to load more` / `No more records` 展示。
- Conversation 与 Message Record 共用过滤后的消息源，过滤客户端欢迎语系统消息。
- 已撤回消息不显示 `Quote`；当前坐席已撤回消息显示 `Re-edit`，点击后把原消息内容写入输入框并聚焦。
- 本轮不修改消息 mock、store 撤回数据结构或发送逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。

回滚说明：

- 如需回滚本轮调整，可恢复消息区顶部 `Message Record` 按钮、load-more 状态与样式，并将已撤回消息工具区恢复为原 `Quote` / `Recall` 逻辑。

当前风险点：

- 仍需人工复查 active Conversation：历史记录图标位置、滚动消息区、欢迎语过滤和撤回消息 `Re-edit` 是否符合演示预期。

### 2026-05-28 19:26 +08:00 - Transfer Skill 增加技能人数与空闲人数

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1926.md`
- `.codex-backup/current-todo-2026-05-28-1926.md`
- `.codex-backup/page-state-2026-05-28-1926.md`

修改原因：

- 用户要求 `Transfer Skill` 页面列表在 `Skill Name` 后增加技能人数和空闲人数两列。

修改结果：

- `Transfer Skill` 表格新增 `Agents` 与 `Ready` 列。
- `Agents` 按 `transferAgents.skillName` 统计该技能坐席总数。
- `Ready` 按同一技能下 `status === 'Ready'` 统计空闲人数。
- 本轮不新增重复 mock 字段，不修改类型结构，避免 skill mock 与 agent mock 数据不一致。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。

回滚说明：

- 如需回滚本轮调整，可移除 `TransferSkillTab` 中 `skillAgentCounts` 统计以及 `Agents` / `Ready` 两个表格列。

当前风险点：

- 仍需人工复查 `Transfer Skill` 页签表格列宽和数字展示是否符合弹框密度。

### 2026-05-28 19:24 +08:00 - Transfer Agent 移除更多按钮

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1924.md`
- `.codex-backup/current-todo-2026-05-28-1924.md`
- `.codex-backup/page-state-2026-05-28-1924.md`

修改原因：

- 用户要求 Transfer Agent 页面去除更多按钮，只保留转移和三方按钮。

修改结果：

- Conversation 版本 `Transfer Agent` 行内动作只保留 `Transfer` 和 `Conference`。
- 移除更多按钮、`Force Transfer` / `Force Conference` 下拉入口，以及相关 Dropdown / DownOutlined / MenuProps 代码。
- 动作列宽从 198px 收窄为 180px，匹配两个按钮。
- 删除 more 按钮专用样式；通话工具条 Transfer 弹框不受影响。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。

回滚说明：

- 如需恢复更多按钮，可恢复 `conversationOverflowAgentActions`、Dropdown 渲染和 `.aicc-transfer-agent-actions__more` 样式，并将 conversation actions 列宽恢复为至少 198px。

当前风险点：

- 仍需人工打开 Conversation Transfer 弹框复查 Transfer Agent 行只剩两个按钮，且动作列宽、表头和按钮边框正常。

### 2026-05-28 19:17 +08:00 - Transfer Agent 动作列与按钮宽度修正

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1917.md`
- `.codex-backup/current-todo-2026-05-28-1917.md`
- `.codex-backup/page-state-2026-05-28-1917.md`

修改原因：

- 用户指出去掉 `Request` 文案后按钮宽度没有同步收窄，导致 Transfer Agent 表头被挤压换行，且按钮边框显示不完整。

修改结果：

- Conversation 版本 Transfer Agent 动作列宽从 262px 收窄为 198px。
- Conversation 行内主按钮宽度从 112px 收窄为 80px，适配 `Transfer` / `Conference`。
- Transfer 弹框表头设置不换行；conversation 行内按钮补齐 `inline-flex`、`box-sizing` 和行高，避免边框裁切。
- 本轮不修改动作逻辑、mock、store 或旧 Live Chat。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。

回滚说明：

- 如需回滚本轮调整，可将 `TransferModal.tsx` 的 conversation actions 列宽恢复到 262px，并将 `.aicc-transfer-agent-actions` 主按钮宽度恢复为 112px，同时移除表头 nowrap 与按钮 box model 修正。

当前风险点：

- 仍需人工打开 Conversation Transfer 弹框复查 `Transfer Agent` 表头不换行、按钮边框完整、动作列不挤压其它列。

### 2026-05-28 19:12 +08:00 - Transfer Agent 行内按钮文案精简

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1912.md`
- `.codex-backup/current-todo-2026-05-28-1912.md`
- `.codex-backup/page-state-2026-05-28-1912.md`

修改原因：

- 用户要求转移功能中 `Transfer Agent` 页面数据行的两个按钮去除 `Request` 字样。

修改结果：

- Conversation 版本 `Transfer Agent` 行内主按钮从 `Request Transfer` / `Request Conference` 改为 `Transfer` / `Conference`。
- `Force Transfer` / `Force Conference` 下拉动作保持不变。
- 本轮只改显示文案，不改变动作逻辑或其它弹框。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚本轮调整，可将 `TransferModal.tsx` 中 `conversationPrimaryAgentActions` 恢复为 `Request Transfer` 和 `Request Conference`。

当前风险点：

- 需人工复查 Conversation Transfer 弹框的 `Transfer Agent` 表格行按钮文案是否满足演示口径。

### 2026-05-28 19:00 +08:00 - livechat2 时长口径与 ended 提示精简

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/mock/inbound.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1900.md`
- `.codex-backup/current-todo-2026-05-28-1900.md`
- `.codex-backup/page-state-2026-05-28-1900.md`

修改原因：

- 用户指出服务时长比坐席未回复时长还短不合理，并要求 customer-ended mock 客户服务时长为 `02:53`；同时确认 ended 原因完整文案只保留在对话系统消息中，header 不重复展示。

修改结果：

- `requestLiveChat2Workspace` 增加 `initialElapsedSeconds`，store 初始化 livechat2 timing 时使用 mock access duration 作为已服务时长。
- `BasicLayout` 打开 livechat2 时解析每个 mock 的 `customer.accessDuration` 并传入 store。
- `LiveChat2Page` 将 active 未回复计时限制为不超过服务时长。
- `livechat2-005` 的 `customer.accessDuration` 改为 `02:53`。
- customer-ended 系统消息统一为 `This user has ended the session.`；timeout 系统消息统一为 `This session was closed due to customer timeout.`。
- Conversation header 移除 customer/timeout ended 完整提示，保留灰态头像与 `Close`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- Browser `/` 中 `livechat2` 菜单文字存在于 DOM，但当前自动化判断该入口不可见，未完成菜单点击后的细节复查。

回滚说明：

- 如需回滚本轮调整，可移除 `initialElapsedSeconds` 初始化链路，恢复 `livechat2-005` 原 access duration 和旧结束消息，并恢复 `LiveChat2ConversationWorkspace.tsx` 中 ended notice 渲染与相关样式。

当前风险点：

- 仍需人工在目标演示分辨率下确认 active 服务时长、未回复计时上限、customer-ended `02:53` 和 header 无重复提示的视觉效果。

### 2026-05-28 18:49 +08:00 - livechat2 Header 未回复提示与 End Service hover

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1849.md`
- `.codex-backup/current-todo-2026-05-28-1849.md`
- `.codex-backup/page-state-2026-05-28-1849.md`

修改原因：

- 用户反馈 `Unanswered` 单词太长，希望用图标表示；并指出 `End Service` 鼠标悬浮时也应该呈现红色危险态。

修改结果：

- Conversation header 的未回复提示改为告警图标 + 计时，不再显示可见 `Unanswered` 文案。
- 未回复提示保留 `title` 和 `aria-label`，便于悬浮说明和可访问语义。
- `End Service` 按钮增加专属 hover/focus 样式，使用浅红背景与深红文字。
- 本轮不修改旧 `Live Chat`、mock、store 或弹框。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。

回滚说明：

- 如需回滚本轮调整，可恢复 `LiveChat2ConversationWorkspace.tsx` 中未回复计时的文案渲染，并移除 `src/styles/index.less` 中 `livechat2-conversation__end-action:hover/focus-visible` 专属样式。

当前风险点：

- 仍需人工在目标演示分辨率下确认未回复图标的视觉是否足够明确，且 End Service hover 红色不显得过重。

### 2026-05-28 18:34 +08:00 - livechat2 Conversation 顶部与结束状态

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/mock/inbound.ts`
- `src/types/inbound.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1834.md`
- `.codex-backup/current-todo-2026-05-28-1834.md`
- `.codex-backup/page-state-2026-05-28-1834.md`

修改原因：

- 用户要求 livechat2 conversation 顶部参考旧 Live Chat，仅展示渠道图标、客户名和服务时长；右侧 active 状态只保留 Transfer / End Service，客户主动结束或超时结束后改为 Close，并增加一个 mock 客户演示用户主动结束。

修改结果：

- Conversation header 移除 `intent` 业务类型文案，新增渠道图标。
- Header active 操作为 `Transfer` + `End Service`；ended 操作为 `Close`。
- `Message Record` 从 header 右侧移到消息区顶部紧凑入口，记录面板保留。
- `LiveChat2SessionView` 增加 `endReason`，store 的 `requestLiveChat2Workspace` 支持 `initialSessionStatuses`。
- `BasicLayout` 根据 mock 的 ended 状态初始化 livechat2 session status，避免 ended mock 被转成 active。
- 新增 Haloapps mock `livechat2-005`，状态为 customer ended，用于展示用户主动结束、头像灰掉和 Close。
- customer ended / timeout ended 在 conversation header 显示对应提示；坐席主动结束仍使用现有固定系统结束语。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- 当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮调整，可恢复 `LiveChat2ConversationWorkspace.tsx` header 结构和 Message Record header 按钮，移除 `livechat2-005` mock、`endReason` view/type 字段、`initialSessionStatuses` 初始化逻辑，以及新增的 conversation ended/message toolbar 样式。

当前风险点：

- 仍需人工在目标演示分辨率下复查 active 与 customer ended 两类会话的 header、按钮、头像灰度和 Message Record 入口视觉。

### 2026-05-28 18:13 +08:00 - livechat2 History 最新消息满宽修复

修改页面或文件：

- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1813.md`
- `.codex-backup/current-todo-2026-05-28-1813.md`
- `.codex-backup/page-state-2026-05-28-1813.md`

修改原因：

- 用户指出 History 行第一行右侧的挂断图标 + 时间仍通过 grid 第二列压缩了第二行最新消息宽度；时间和名字在第一行，不应影响最新消息长度。

修改结果：

- History 会话消息行增加 `livechat2-session-card__message--full-row` modifier。
- History 最新消息行使用 `grid-column: 1 / -1`，跨过右侧时间列，占满第二行内容区。
- 当前服务列表不改，保留第二行右侧星标 / Close 操作区。
- 本轮不修改旧 `Live Chat`、store 数据结构、mock、弹框或 livechat2 其它交互。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- 当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮调整，可移除 `LiveChat2CustomerPanel.tsx` 中 History 消息行的 modifier class，并删除 `src/styles/index.less` 中 `.livechat2-session-card__message--full-row`。

当前风险点：

- 仍需人工在目标演示分辨率下复查 History 第二行消息是否真正满宽，以及当前服务列表右侧星标 / Close 是否不受影响。

### 2026-05-28 18:08 +08:00 - livechat2 历史结束时间图标前缀

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1808.md`
- `.codex-backup/current-todo-2026-05-28-1808.md`
- `.codex-backup/page-state-2026-05-28-1808.md`

修改原因：

- 用户澄清不是去掉具体时间，而是把历史结束时间前缀 `Ended` 换成挂断/结束图标，缓解长文案压缩最新消息宽度。

修改结果：

- 历史结束时间格式从 `Ended HH:mm:ss` / `Ended MM-DD HH:mm:ss` 改为纯时间 `HH:mm:ss` / `MM-DD HH:mm:ss`。
- 历史客户行右侧新增 `DisconnectOutlined` 作为可见结束前缀，时间继续常显。
- `aria-label` / `title` 保留完整 `Ended ${time}` 语义。
- 结束标识样式保持浅灰、紧凑、tabular nums。
- 当前列表、收起态、旧 `Live Chat`、store 数据结构和 mock 不变。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- 当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮调整，可把 `formatHistoryEndTime` 恢复为返回 `Ended ...` 文案，移除 `LiveChat2CustomerPanel.tsx` 中的 `DisconnectOutlined` 渲染和 `.livechat2-session-card__end-time .anticon` 样式。

当前风险点：

- 仍需人工在目标演示分辨率下复查 History 行右侧图标 + 时间是否比长文案更省宽，以及最新消息宽度是否符合预期。

### 2026-05-28 18:00 +08:00 - livechat2 历史列表结束时间展示

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1800.md`
- `.codex-backup/current-todo-2026-05-28-1800.md`
- `.codex-backup/page-state-2026-05-28-1800.md`

修改原因：

- 用户确认历史列表需要展示结束会话时间，并使用时分秒口径。

修改结果：

- `LiveChat2SessionView` 新增 `endTimeDisplay`。
- 历史结束时间优先使用真实 `endedAt`；初始历史 mock 无 `endedAt` 时，用 `lastMessageAt` 兜底。
- 当天历史显示 `Ended HH:mm:ss`，非当天历史显示 `Ended MM-DD HH:mm:ss`。
- 展开态历史客户行第一行右侧显示结束时间，使用浅灰文本；当前列表和收起态不显示。
- 本轮不修改旧 `Live Chat`、store 数据结构、mock、弹框或 livechat2 其它交互。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- 当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮调整，可移除 `LiveChat2Page.tsx` 中 `formatHistoryEndTime` 和 `endTimeDisplay` 计算，移除 `LiveChat2CustomerPanel.tsx` 中历史结束时间渲染，并删除 `src/styles/index.less` 中 `.livechat2-session-card__end-time` 样式。

当前风险点：

- 仍需人工在目标演示分辨率下复查历史列表结束时间是否不挤压客户名，且当前列表和收起态不出现结束时间。

### 2026-05-28 16:42 +08:00 - livechat2 页签计时颜色与历史收起态星标调整

修改页面或文件：

- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1642.md`
- `.codex-backup/current-todo-2026-05-28-1642.md`
- `.codex-backup/page-state-2026-05-28-1642.md`

修改原因：

- 用户要求 `livechat2` 页签上的时间不用变色，只展示当前最大服务客户的服务时长；如果当前没有服务客户则不显示时长。历史会话在客户列表面板收起状态时不需要显示星标。

修改结果：

- `livechat2` tab duration 只来自 active livechat2 timings，不再使用 ended 会话兜底显示。
- `livechat2` tab 不再传入 SLA state，因此页签时间不会因为服务时长进入 warning / breach 颜色。
- 新客户接入的 tab flash 仍保留，继续使用 active livechat2 timings 的最大 `flashUntil`。
- 历史会话不再渲染头像内的 collapsed star；当前服务会话的收起态星标保留。
- 本轮不修改旧 `Live Chat`、电话/视频 tab、store 数据结构、mock、弹框或客户列表其它交互。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- 当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮调整，可恢复 `AgentWorkspace.tsx` 中 livechat2 ended timing fallback 与 `slaState` 传参，并恢复 `LiveChat2CustomerPanel.tsx` 中收起态星标不区分历史会话的渲染条件。

当前风险点：

- 仍需人工在目标演示分辨率下复查 `livechat2` tab：有 active 客户时显示最长服务时长且不变色，无 active 客户时不显示时长，新接入仍短闪；同时复查历史会话收起态无头像星标。

### 2026-05-28 16:20 +08:00 - livechat2 页签最长服务计时与新接入闪烁

修改页面或文件：

- `src/pages/AgentWorkspace.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1620.md`
- `.codex-backup/current-todo-2026-05-28-1620.md`
- `.codex-backup/page-state-2026-05-28-1620.md`

修改原因：

- 用户要求 `livechat2` workspace 页签显示客户服务时间最长的计时，效果与电话/视频来电弹屏一致；有新客户接入时页签也要闪烁。

修改结果：

- `AgentWorkspace` 新增 livechat2 tab timing 计算，读取 `activeLiveChat2SessionIds`、`liveChat2SessionTimings` 和 `liveChat2SessionStatuses`。
- `livechat2` tab 使用当前 active livechat2 客户中最长服务时长显示 `(mm:ss)`。
- 如果只剩 ended 未关闭会话，tab 使用 ended 会话 `endedAt` 冻结最长服务时长。
- 新接入 livechat2 客户继续使用 `flashUntil` 触发 workspace tab 短闪。
- 本轮不修改旧 `Live Chat`、电话/视频 tab 行为、store 数据结构、客户列表或弹框逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，Home tab 正常。
- Browser `/design-system` 可加载，Design System 文本可见。
- 当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮页签行为，可恢复 `AgentWorkspace.tsx` 中 `WorkspaceDurationTiming`、`getLongestDurationTiming`、livechat2 timing/status selector 与 `livechat2` tab label 的 `durationStartedAt` / `isFlashing` / `slaState` 参数。

当前风险点：

- 仍需在目标演示分辨率下人工复查 `livechat2 (mm:ss)` 是否随最长 active 客户增长，并确认新客户接入时 tab 短闪效果符合演示预期。

### 2026-05-28 16:06 +08:00 - livechat2 客户列表文字 tab 与工具精简

修改页面或文件：

- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1606.md`
- `.codex-backup/current-todo-2026-05-28-1606.md`
- `.codex-backup/page-state-2026-05-28-1606.md`

修改原因：

- 用户要求继续优化 livechat2 客户列表：Current/History 切换改回文字展示，去除转接图标，并把顶部 ALL 渠道标识文字改为系统主题深蓝色。

修改结果：

- Current / History 从图标-only tab 改回居中文字 tab，继续保留计数与 hover 排序按钮能力。
- 客户行第二行去除转接图标，只保留星标与 ended 状态 Close，降低列表视觉噪音。
- `ALL` 渠道头像文字颜色改为 `var(--aicc-primary-strong)`，非选中态也保持主题深蓝色。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载，标题为 `BANK 1 AICC Demo`，Home tab 正常。
- Browser `/design-system` 可加载，标题为 `BANK 1 AICC Demo`，Design System 文本可见。
- Browser `/` 可检测到隐藏的 `livechat2` 文本，但当前 in-app browser 没有暴露侧栏入口的可点击可见节点，未完成菜单点击自动化验证。

回滚说明：

- 如需回滚本轮调整，可恢复 `LiveChat2CustomerPanel.tsx` 中 Current/History 的图标 tab 与转接图标渲染，并恢复 `src/styles/index.less` 中 view tab 图标 badge 和 `livechat2-session-card__transfer` 相关样式。

当前风险点：

- 仍需在目标演示分辨率下人工复查 livechat2 菜单入口、文字 tab 密度、客户行无转接图标后的信息完整度，以及 ALL 深蓝色在选中/非选中态下的可读性。

### 2026-05-28 15:48 +08:00 - livechat2 客户列表图标 tab 与星标精简

修改页面或文件：

- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-1548.md`
- `.codex-backup/current-todo-2026-05-28-1548.md`
- `.codex-backup/page-state-2026-05-28-1548.md`

修改原因：

- 用户要求继续简化 livechat2 客户列表：Current/History 用居中图标 tab，排序按钮只在悬浮整行时显示，客户行计时/操作对齐，灰色星标默认隐藏，收起态星标去掉白色圆底。

修改结果：

- Current / History 改为图标-only tab，保留可访问标签、title 和计数 badge。
- 排序按钮固定在 tab 行右侧但默认透明隐藏，hover/focus tab 行时显示。
- 客户卡片改为两行 grid，客户名与未回复计时对齐，最新消息与转接/星标/Close 工具对齐。
- 星标下拉改为 hover 触发，去掉下拉箭头；灰色未关注星标默认隐藏，hover/focus 客户行时显示空心灰星。
- 收起态头像内星标去掉白色圆形背景，仅保留星标并加轻量白色描边阴影。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning；本轮额外出现插件耗时提示，不影响构建结果。
- Browser `/design-system` 可加载，标题为 `BANK 1 AICC Demo`。
- Browser `/` 可加载；自动化可数到侧栏和 `livechat2` 按钮，但当前 in-app browser 仍报告侧栏按钮无可点击 bounding box，未完成 `Channel Simulation > livechat2` 菜单点击验证。

回滚说明：

- 如需回滚本轮精简，可恢复 `LiveChat2CustomerPanel.tsx` 中图标 tab、hover 星标和客户行 content grid 结构，以及 `src/styles/index.less` 中 `livechat2-customer-panel__view-*`、`sort-button`、`session-card__content`、`star-button`、`collapsed-star` 相关样式。

当前风险点：

- 仍需在浏览器目标分辨率下人工复查 `livechat2` 入口、图标 tab 是否足够清楚、hover 排序按钮是否容易发现、灰色星标隐藏后是否仍便于标记。

### 2026-05-28 01:28 +08:00 - livechat2 客户列表收起态与 tab 微调

修改页面或文件：

- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-0128.md`
- `.codex-backup/current-todo-2026-05-28-0128.md`
- `.codex-backup/page-state-2026-05-28-0128.md`

修改原因：

- 用户要求继续优化 livechat2 客户列表：收起态 warning / breach 标识要和展开态一样位于左侧，不再用左下角圆点；星标放进渠道头像；Current / History tab 参考 Assistant；排序按钮取消边框并换更简单图标。

修改结果：

- 移除 livechat2 收起态 SLA 小圆点，收起态继续保留 warning / breach 左侧色条。
- 收起态星标移入渠道头像右下角，略微放大，只作为只读状态展示。
- Current / History 切换改为 Assistant 风格的轻量下划线 tab。
- 排序按钮取消边框和白底，图标改为更简洁的菜单图标。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/` 可加载并可 Sign In；受当前 in-app browser 中侧栏按钮无可点击 bounding box/后续 CDP timeout 影响，本轮未完成 `livechat2` 菜单入口的自动化点击验证。
- Browser `/design-system` 可加载，标题为 `BANK 1 AICC Demo`。

回滚说明：

- 如需回滚本轮微调，可恢复 `LiveChat2CustomerPanel.tsx` 中排序图标与头像内星标结构，以及 `src/styles/index.less` 中 `livechat2-customer-panel__view-*`、`sort-button`、`collapsed-star` 和收起态 SLA 相关样式。

当前风险点：

- 仍需在浏览器目标分辨率下人工复查 `livechat2` 菜单入口、收起态左侧色条、头像内星标位置和 Assistant 风格 tab 的视觉效果。

### 2026-05-28 00:54 +08:00 - livechat2 客户列表视觉密度调整

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-0054.md`
- `.codex-backup/current-todo-2026-05-28-0054.md`
- `.codex-backup/page-state-2026-05-28-0054.md`

修改原因：

- 用户要求 livechat2 客户列表进一步参考旧 Live Chat：Current / History 用简洁 tab，去掉 Serving 行和消息时间，恢复 SLA 色条/收起态提示，压缩宽度并解决收起态拥挤与横向滚动。

修改结果：

- 删除 Serving 工具行，将排序改为 Current / History tab 行右侧的小图标下拉。
- 客户卡片不再显示最新消息发送时间；未回复计时去掉时钟图标。
- warning / breach 客户恢复左侧色条，收起态显示 SLA 小圆点。
- 转接与星标在右侧同一行；星标菜单只显示颜色图标。
- 收起态渠道筛选间距、未读 badge 尺寸、头像右下角只读星标和横向溢出已优化。
- 展开态 livechat2 第一列收窄到接近旧 Live Chat。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚本轮客户列表视觉调整，可恢复 `LiveChat2CustomerPanel.tsx`、`LiveChat2Page.tsx` 和 `src/styles/index.less` 中 livechat2 customer panel 相关改动。

当前风险点：

- 仍需在浏览器目标分辨率下人工复查收起态无横向滚动、SLA 左侧提示和星标小标记位置。

### 2026-05-28 00:19 +08:00 - 合并弹框评审改动到 livechat2

修改页面或文件：

- `src/layouts/components/InternalChatModal.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/layouts/components/TransferModal.tsx`
- `src/mock/transfer.ts`
- `src/styles/index.less`
- `src/types/transfer.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-0019.md`
- `.codex-backup/current-todo-2026-05-28-0019.md`
- `.codex-backup/page-state-2026-05-28-0019.md`

修改原因：

- 用户要求把弹框发布线的最新本地改动合并回 `codex/livechat2-popup`，以便继续调试 livechat2，同时不 push 到 GitHub。

修改结果：

- 已在 `codex/modal-review-fixes` 本地提交 `5917330 fix: refine review modal controls`。
- 已切到 `codex/livechat2-popup` 并合并 `codex/modal-review-fixes`。
- 合并保留 `livechat2` 菜单、tab、store、mock、页面组件和客户列表能力。
- 合并带入 Transfer / Outbound / Internal Chat 最新弹框评审改动。
- 文档冲突按规则处理：`PROJECT_CONTEXT.md` 保留 livechat2 当前上下文，`DEV_LOG.md` 保留弹框评审记录并补回 livechat2 记录。
- 本轮未 push 到 GitHub。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需撤销合并，可在确认无新调试改动后回退本次 merge commit；不要回退 `codex/livechat2-popup` 上的 `567f65e` / `7809b58` livechat2 commits。

当前风险点：

- 需要在浏览器中人工复查 `livechat2` 入口和客户列表，以及 Transfer / Outbound / Internal Chat 弹框视觉。
- 当前分支仍为本地调试分支，未 push；如后续要给客户看，需要先确认发布策略。

### 2026-05-27 03:02 +08:00 - livechat2 客户列表功能补齐

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-0302.md`
- `.codex-backup/current-todo-2026-05-27-0302.md`
- `.codex-backup/page-state-2026-05-27-0302.md`

修改原因：

- 用户要求补回旧 Live Chat 客户列表顶部能力：收起/展开、渠道筛选、方形渠道图标。
- 用户要求客户行去掉第三行渠道名称和业务类型，并将当前/历史列表改为左右切换。

修改结果：

- `livechat2` 客户列表新增 ALL / WhatsApp / BankApp / Webchat 渠道筛选和收起/展开。
- 渠道头像恢复方形图标样式。
- 客户卡片压缩为两行，未回复计时移到右侧工具区。
- Current / History 改为横向切换，只显示当前选中列表。

验证：

- `npm run lint` 通过。
- Browser `/`：`livechat2` 顶部筛选、Current / History 左右切换、History 用户和收起态均可用。

回滚说明：

- 如需回滚本轮列表 hotfix，可恢复 `LiveChat2CustomerPanel.tsx`、`LiveChat2Page.tsx` 和 `styles/index.less` 中 `livechat2-customer-panel` 相关规则到 `567f65e`。

当前风险点：

- 筛选、收起和 Current/History 切换为前端本地 UI 状态，不写入全局 store。
- 仍需在客户目标分辨率下人工确认收起态和两行客户卡片的视觉密度。

### 2026-05-27 02:45 +08:00 - 新增 livechat2 并行弹屏

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/mock/inbound.ts`
- `src/types/inbound.ts`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 用户要求基于旧 Live Chat 的优秀能力做并行新版 `livechat2`，新增菜单和 tab，不替换旧 Live Chat，不影响其他功能。

修改结果：

- 新增 `Channel Simulation > livechat2` 菜单项，位于 WhatsApp 下方。
- 新增独立 `liveChat2*` store 状态和动作，覆盖批量接入、聚焦、已读、排序、星标、草稿、未回复计时、结束/关闭、历史列表、发送消息、撤回消息和清理。
- 新增 `LiveChat2Page`、`LiveChat2CustomerPanel`、`LiveChat2ConversationWorkspace`、`liveChat2Sessions` mock 和相关类型。
- 旧 `Live Chat` 未被替换。

验证：

- `npm run lint` 通过。
- Browser `/`：旧 `Live Chat`、WhatsApp Demo、`livechat2` tab、快捷回复、消息记录和 Transfer 入口均可演示。
- Browser `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 `livechat2`，可删除新增 `LiveChat2*` 页面/组件/mock/types/store 字段，并移除 `BasicLayout` 菜单项、`AgentWorkspace` tab 接入和 `livechat2-*` 样式。

当前风险点：

- `livechat2` 为前端演示模拟，不接真实消息网关、文件库、拼写检查、截图插件、敏感词服务或后台配置。
- 后续如果要公开给客户，需要先决定弹框修复分支和 livechat2 分支的发布策略。

### 2026-05-28 00:04 +08:00 - 号码页签输入框与按钮对齐

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-28-0004.md`
- `.codex-backup/current-todo-2026-05-28-0004.md`
- `.codex-backup/page-state-2026-05-28-0004.md`

修改原因：

- 用户指出 `Transfer Number` 和 `Call Number` 页签里的号码输入框与按钮仍和其它 tab 控件大小、高低不一致，需要继续对齐。

修改结果：

- `Transfer Number` 号码输入框、`Transfer`、`Conference` 统一到 30px 控件高度，并使用与其它 tab 查询按钮一致的紧凑字号、圆角和内边距。
- `Outbound Call > Call Number` 号码输入框、prefix icon、`Call` 按钮统一到 30px 控件高度，修正输入框与按钮高低不齐。
- 本轮只调整号码页签样式，不修改弹框结构、数据、store、路由或 livechat2。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚本次对齐，只需恢复 `src/styles/index.less` 中 `.aicc-transfer-number`、`.aicc-transfer-number__line`、`.aicc-outbound-number`、`.aicc-outbound-number__field` 相关控件高度覆盖。

当前风险点：

- 当前仍未 push；发布前需确认 `codex/modal-review-fixes` 不包含 livechat2 文件。
- Transfer / Outbound 深层弹框仍建议在目标演示分辨率下做一次人工视觉复查。

### 2026-05-27 23:46 +08:00 - Internal Chat 输入区回退到上上版本

修改页面或文件：

- `src/layouts/components/InternalChatModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-2346.md`
- `.codex-backup/current-todo-2026-05-27-2346.md`
- `.codex-backup/page-state-2026-05-27-2346.md`

修改原因：

- 用户明确要求停止继续当前视觉方向，并将 Internal Chat 输入区改回上上版本。

修改结果：

- 回退 23:34 / 23:39 两次 Internal Chat composer 视觉尝试。
- 当前 composer 为 23:30 版本：两列布局，左侧无边框 textarea，右侧纯文本 `Send` 按钮。
- 不显示 Emoji、Upload image、Attach file 或 Send icon。
- 本轮只回退 Internal Chat composer，不影响 Transfer / Outbound 的弹框评审修改。

验证：

- `npm run lint` 第一次执行超时，重新执行通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `http://127.0.0.1:5174/`：Internal Chat 可打开；DOM 中无 `Emoji` / `Choose emoji` / `Upload image` / `Attach file` / `send` icon，存在 `Type internal message` textarea 和纯文本 `Send` button。

回滚说明：

- 如需再次恢复图标 Send 或 Live Chat 风格 toolbar，可参考本日志之前 23:34 / 23:39 记录，但当前用户明确要求回到上上版本，不建议再继续试探式调整。

当前风险点：

- 当前仍未 push；发布前需确认 `codex/modal-review-fixes` 不包含 livechat2 文件。
- Internal Chat 输入区后续建议只在用户明确指明具体目标版本或截图标注后再改。

### 2026-05-27 23:39 +08:00 - Internal Chat 发送区按截图收敛

修改页面或文件：

- `src/layouts/components/InternalChatModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-2339.md`
- `.codex-backup/current-todo-2026-05-27-2339.md`
- `.codex-backup/page-state-2026-05-27-2339.md`

修改原因：

- 用户提供截图，要求 Internal Chat 输入区使用最简洁样式：输入框无边框、无背景，只保留右下角发送按钮。
- 用户要求发送按钮与截图一致，使用图标 + `Send` 文案。

修改结果：

- Internal Chat composer 保持白底、无输入框边框、无输入框背景和无 focus 阴影。
- toolbar 左侧继续不显示任何工具图标。
- Send 按钮改为右下角蓝色大按钮，包含 `SendOutlined` 图标和 `Send` 文案。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `http://127.0.0.1:5174/`：Internal Chat 可打开；DOM 中无 `Emoji` / `Choose emoji` / `Upload image` / `Attach file`，存在 `Type internal message` textarea、`Send` button 和 `send` 图标。

回滚说明：

- 如需恢复无图标 Send，可回退 `InternalChatModal.tsx` 中 `SendOutlined` 引用和 `index.less` 中 Send 按钮尺寸样式。

当前风险点：

- 本轮仍未 push；发布前需确认 `codex/modal-review-fixes` 不包含 livechat2 文件。
- 建议用户在本地浏览器最终复查按钮尺寸是否与截图视觉一致。

### 2026-05-27 23:34 +08:00 - Internal Chat 输入区对齐 Live Chat 口径

修改页面或文件：

- `src/layouts/components/InternalChatModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-2334.md`
- `.codex-backup/current-todo-2026-05-27-2334.md`
- `.codex-backup/page-state-2026-05-27-2334.md`

修改原因：

- 用户指出 Internal Chat 底部应参考 Live Chat 弹屏中间 Conversation 的信息发送区域，只去掉左下角工具图标。
- 上一版两列输入 + Send 的布局不像 Live Chat 的聊天输入区。

修改结果：

- Internal Chat composer 改为上方 textarea、下方 toolbar 的结构，与 Live Chat Conversation composer 一致。
- toolbar 左侧不显示任何 Emoji / Attach / Upload image 工具按钮。
- toolbar 右侧只保留文本 `Send` 按钮。
- textarea 继续保持无边框，并恢复 3-5 行输入高度。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `http://127.0.0.1:5174/`：Internal Chat 可打开；DOM 中无 `Emoji` / `Choose emoji` / `Upload image` / `Attach file`，存在 `Type internal message` textarea 和 `Send` button。

回滚说明：

- 如需恢复上一版两列布局，可回退本轮对 `InternalChatModal.tsx` composer 结构和 `.aicc-internal-chat__composer*` 样式的修改。

当前风险点：

- 本轮仍未 push；发布前需确认 `codex/modal-review-fixes` 不包含 livechat2 文件。
- 建议用户在本地浏览器最终复查 Internal Chat 输入区与 Live Chat Conversation 底部是否足够一致。

### 2026-05-27 23:30 +08:00 - Internal Chat 输入区简化

修改页面或文件：

- `src/layouts/components/InternalChatModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-2330.md`
- `.codex-backup/current-todo-2026-05-27-2330.md`
- `.codex-backup/page-state-2026-05-27-2330.md`

修改原因：

- 用户要求 Internal Chat 弹框底部去掉表情和图片图标，只保留输入和发送按钮。
- 用户要求输入框边框不用展示。

修改结果：

- 移除 Internal Chat composer 中的 Emoji 与 Upload image 图标按钮。
- Send 按钮移除图标，仅保留文本。
- composer 改为无边框输入区 + Send 按钮的两列布局。
- textarea 边框、focus 边框和阴影均隐藏。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `http://127.0.0.1:5174/`：Internal Chat 可打开；DOM 中不再有 `Emoji` / `Upload image`，存在 `Type internal message` textarea 和 `Send` button。

回滚说明：

- 如需恢复底部图标，可回退 `InternalChatModal.tsx` 中 composer actions 结构和 `index.less` 中 `.aicc-internal-chat__composer*` 相关样式。

当前风险点：

- 本轮仍未 push；发布前需确认 `codex/modal-review-fixes` 不包含 livechat2 文件。
- 建议用户在本地浏览器最终复查 Internal Chat 输入区视觉，确认无边框输入区符合评审口径。

### 2026-05-27 23:11 +08:00 - 弹框坐席列表宽度与查询栏对齐修复

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-2311.md`
- `.codex-backup/current-todo-2026-05-27-2311.md`
- `.codex-backup/page-state-2026-05-27-2311.md`

修改原因：

- 用户指出坐席列表宽度不足，动作按钮显示不完整。
- 用户指出查询条件中的输入框、下拉框、按钮高低和大小不一致。

修改结果：

- `Transfer Agent` 与 `Outbound Call > Call Agent` 坐席列表移除 `Department` 列。
- `Name` 与 `Skill Name` 列宽增加，Conversation Transfer 动作列补足宽度，避免行内按钮被挤掉。
- `.aicc-transfer-search` 统一使用 30px 控件高度，且用更高优先级覆盖通用 modal toolbar 规则。
- SearchInput、Skill Queue、Status、Search 按钮的外框高度、内部文字 line-height 和选择项高度统一。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需恢复 Department 列，可回退本次对 `TransferModal.tsx`、`OutboundCallModal.tsx` 的 columns 修改。
- 如需恢复 28px 查询栏控件高度，可回退本次 `.aicc-transfer-search` 相关样式覆盖。

当前风险点：

- 本轮仍未 push；发布前需确认 `codex/modal-review-fixes` 不包含 livechat2 文件。
- 仍建议用户在本地浏览器中最终人工复查 Transfer / Outbound 弹框视觉。

### 2026-05-27 22:56 +08:00 - 弹框评审分支查询与密度优化

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/mock/transfer.ts`
- `src/types/transfer.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-2256.md`
- `.codex-backup/current-todo-2026-05-27-2256.md`
- `.codex-backup/page-state-2026-05-27-2256.md`

修改原因：

- 下午内部评审前，用户要求继续优化弹框而不混入仍在本地调整的 `livechat2`。
- Transfer / Outbound Agent 查询需要增加技能队列和坐席状态筛选，列表需要展示技能名称和状态。
- Transfer Number 页需要去掉 `System Number` 与 `Manual Number`，改为一行号码输入框加两个动作按钮。
- 弹框搜索框文字和 placeholder 偏下，Search / 行内按钮偏大导致表格一页展示行数少。

修改结果：

- `codex/modal-review-fixes` 保持为弹框评审分支，本轮未切入或修改 `codex/livechat2-popup`。
- `TransferAgent` 新增 `skillName`、`status`；状态类型为 `Ready | Talking | Not Ready`。
- `transferAgents` mock 补齐技能名称和状态，供 Transfer 与 Outbound 两个弹框共用。
- `Transfer Agent` 与 `Outbound Call > Call Agent` 查询栏新增 `Skill Queue`、`Status` 筛选，筛选逻辑同时支持姓名/工号、技能队列、状态。
- Agent 列表新增 `Skill Name` 与 `Status` 列，状态用紧凑 tag 区分 Ready / Talking / Not Ready。
- `Transfer Number` 页仅保留号码输入框、`Transfer`、`Conference`，同一行展示。
- 弹框 SearchInput、普通输入框、Select、Search / Call 按钮和行内动作按钮统一收紧，并补充垂直居中样式。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- `git diff --check` 通过，仅提示 Windows 下 LF 将由 Git 转为 CRLF。
- Browser `http://127.0.0.1:5174/`：主页面可加载，Internal Chat 弹框可通过可见 DOM 打开，搜索输入框存在。
- Browser `http://127.0.0.1:5174/design-system`：页面正常加载，Design System、Modal System、Table System 存在。
- `git diff --name-only | Select-String 'livechat2|LiveChat2'` 无匹配。

回滚说明：

- 如需回滚本轮弹框评审修改，可恢复上述 5 个源码文件及本轮文档/备份。
- `transferSystemNumbers` mock 暂未删除，只是当前 Transfer Number UI 不再引用；如需恢复系统号码下拉，可从本轮 diff 回退 `TransferNumberTab`。

当前风险点：

- Codex in-app browser 对隐藏侧栏/话务工具条的 Playwright 点击不稳定，本轮无法自动深点 Transfer / Outbound 全路径；用户仍需在本地浏览器中最终人工复查这两个弹框。
- 发布前必须再次确认 `codex/modal-review-fixes` 不包含 livechat2 commits 或文件。

### 2026-05-27 02:07 +08:00 - Modal 视觉回调修复

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-0207.md`
- `.codex-backup/current-todo-2026-05-27-0207.md`
- `.codex-backup/page-state-2026-05-27-0207.md`

修改原因：

- 用户指出上一轮 Modal 收敛后内容区 padding 被清掉，文字和背景边紧贴，界面显得粗糙。
- 用户指出弹框标题栏蓝色背景被清掉后整体白花花，与 BANK 1 系统风格不搭。
- 用户指出 Search 按钮仍与输入框和其它按钮大小不统一、未对齐。

修改结果：

- `.aicc-modal` 恢复浅蓝标题栏，使用 `#f8fbff -> #eef6ff` 轻渐变、清晰底部分隔线和品牌蓝标题文字。
- `.aicc-modal` body 改为单层灰蓝底，`.aicc-modal-section` 恢复白色内容面、12px padding、轻边框和圆角，避免内容贴边。
- Modal tabs 回到紧凑导航样式，不再做独立浅蓝容器。
- Transfer / Outbound toolbar 输入框、Search、Call 统一到 30px 高度；Search 固定 88px，Call 固定 76px。
- Transfer 行内 `Consult` / `Transfer` / `Conference` 统一为 82px x 28px；Conversation 长动作按钮统一为 132px x 28px。
- Internal Chat 保持单个白色工作区，左侧列表和消息区使用轻灰蓝分区，不增加多层背景框。
- `/design-system` Modal preview 同步恢复浅蓝标题栏与灰蓝 body。
- 本轮未修改 `BaseModal` JSX、业务流程、tab 数量、mock 数据、store、路由或话务状态机。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：Internal Chat 可打开，浅蓝标题栏、白色聊天工作区和轻灰蓝列表/消息区存在。
- Browser `/`：签入后触发 PSTN 并打开 Transfer；三个 tab 存在，`Transfer Number` 无 `Cancel`。
- Browser `/`：Transfer 搜索框与 Search 按钮视觉等高，行内动作按钮尺寸统一。
- Browser `/`：`More > Outbound Call` 可打开，Call Number 仍为输入框 + Call 单行布局，无 `Cancel` 和旧 footer。
- Browser `/design-system`：页面正常加载，`UI Design System`、Modal system、Table system 均存在。

回滚说明：

- 如需回滚本轮视觉回调，可恢复 `src/styles/index.less` 中 `.aicc-modal*`、`.aicc-tabs--modal`、`.aicc-transfer*`、`.aicc-internal-chat*` 和 `.design-modal-surface*` 相关规则到 2026-05-27 01:47 版本。
- 本轮只改样式和文档，不涉及业务逻辑回滚。

当前风险点：

- Codex Browser 截图输出偶发重复拼接画面，但 DOM 与交互验证正常；仍建议用户在当前 in-app browser 里做最终视觉判断。

### 2026-05-27 01:47 +08:00 - Modal 样式系统收敛修复

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-27-0147.md`
- `.codex-backup/current-todo-2026-05-27-0147.md`
- `.codex-backup/page-state-2026-05-27-0147.md`

修改原因：

- 用户指出 Transfer 弹框仍存在多层接近浅蓝色背景，tab 内容区、section、table header 等层级不清晰。
- 用户指出 Search 按钮过大且与搜索框高度不齐，弹框整体不够简洁清爽专业。

修改结果：

- `.aicc-modal` 主体、Header、Body 改为白色内容面，仅保留轻量灰色分隔线。
- `.aicc-modal-section` 去掉额外浅蓝背景、内阴影和圆角容器，避免 tab 内容区重复套框。
- Modal tabs 改为单纯导航样式，白底、蓝色 active underline、统一间距。
- Transfer / Outbound 搜索框与 Search / Call 按钮统一 32px 高度，按钮去掉额外阴影并按内容紧凑显示。
- Transfer / Outbound 表格改为白底、浅灰 header、浅灰 hover 和清晰行分隔线。
- Transfer 行内 `Consult` / `Transfer` / `Conference` 小按钮统一为 80px x 28px。
- `/design-system` Modal preview surface 同步更新为白色内容面。
- 本轮未修改 `BaseModal` JSX、业务流程、tab 数量、mock 数据、store、路由或话务状态机。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Outbound Call 弹框可打开，Call Number 页仍保留输入框 + Call 按钮。
- Browser smoke check `/`：Internal Chat 弹框可打开，Agent Sessions、消息列表和 composer 结构仍存在。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System`、Modal preview 和 Table preview 均存在。

回滚说明：

- 如需回滚本轮视觉收敛，可恢复 `src/styles/index.less` 中 `.aicc-modal*`、`.aicc-tabs--modal`、`.aicc-table`、`.aicc-transfer*` 和 `.design-modal-surface*` 的上一版样式。
- 本轮只改样式和文档，不涉及业务逻辑回滚。

当前风险点：

- in-app browser 本轮截图能力不稳定，自动化视觉截图未能稳定产出；建议用户在当前本地页面人工复查 Transfer 弹框视觉。

### 2026-05-26 11:32 +08:00 - 话务条与内部聊天弹框回归修复

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-26-1132.md`
- `.codex-backup/current-todo-2026-05-26-1132.md`
- `.codex-backup/page-state-2026-05-26-1132.md`

修改原因：

- 用户指出话务条 Transfer 弹框的 `Transfer Number` 页多出 `Cancel`，与 Transfer Agent / Transfer Skill 不一致。
- 用户指出话务条 Outbound Call 的 `Call Number` 页变复杂，期望恢复为输入框后直接跟外呼按钮。
- 用户指出 Internal Chat 弹框颜色变得浑浊、背景框过多，期望参考 Live Chat Conversation 区域的清晰简洁风格。

修改结果：

- `Transfer Number` 页移除 `Cancel`，只保留 `Transfer` 与 `Conference`。
- `Outbound Call > Call Number` 页改为单行 `Phone Number` 输入框 + `Call` 按钮，移除底部 footer 和 `Cancel`。
- `Internal Chat` 弹框保留现有结构，样式改为白灰主导、轻边界、清晰消息气泡和简洁 composer，减少淡蓝大背景与多层框。
- 本轮未修改 `BaseModal` 全局结构、Transfer / Outbound tab 数量、mock 数据、store、路由或话务状态机。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning 和 plugin timings 提示。
- Browser smoke check `/`：PSTN 通话中打开 `Transfer`，`Transfer Number` 页无 `Cancel`，`Transfer` / `Conference` 均存在。
- Browser smoke check `/`：`More > Outbound Call` 的 `Call Number` 页无 `Cancel`，输入框和右侧 `Call` 按钮存在，旧 footer 不存在。
- Browser visual check `/`：`Internal Chat` 弹框视觉回到白灰主导，消息区清晰，未见大面积浑浊淡蓝背景。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System` 可见。

回滚说明：

- 如需回滚号码页动作布局，可恢复 `TransferNumberTab` / `CallNumberTab` 的 `onCancel` 参数和对应 `Cancel` 按钮。
- 如需回滚 Internal Chat 视觉，可恢复 `.aicc-internal-chat*` 相关样式到上一版本。
- 不需要回滚全局 Modal 或业务状态机，因为本轮未改这些模块。

当前风险点：

- 仍建议在客户目标演示分辨率下人工复查 Internal Chat 与用户历史截图的视觉一致性。

### 2026-05-25 17:51 +08:00 - Next Best Action 箭头 Overlay Hotfix

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-25-1751.md`
- `.codex-backup/current-todo-2026-05-25-1751.md`
- `.codex-backup/page-state-2026-05-25-1751.md`

修改原因：

- 用户要求把 `Next Best Action` 卡片的 hover 箭头改成和 `Ticketing History` 一致的 overlay 效果，保证左栏卡片交互统一。
- 用户指出 `Next Best Action` 箭头存在错乱；根因是该行复用了绝对定位的 `.inbound-ticket-row__hint`，但 `.inbound-action-row` 仍保留箭头 grid 占位且没有定位上下文。

修改结果：

- `.inbound-action-row` 增加 `position: relative`，为复用的 overlay 箭头提供定位上下文。
- `.inbound-action-row` 去掉箭头占位列，改为单列布局，避免 hover 箭头参与默认排版。
- `Next Best Action` hover/focus-visible 时使用和 `Ticketing History` 一致的右侧浮层箭头效果。
- 本轮未修改 `NextBestActionCard.tsx`、store、mock、tab key、路由或话务状态机。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：主路由正常加载。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚，可恢复 `.inbound-action-row` 的两列 grid 和原 hover selector。
- 回滚会重新让 `Next Best Action` 箭头占位，并可能再次受 `.inbound-ticket-row__hint` 绝对定位影响而错位。

当前风险点：

- 仍建议在客户目标演示分辨率下人工 hover `Next Best Action` 行，确认箭头位置、遮罩和点击区域符合预期。

### 2026-05-25 17:42 +08:00 - Ticketing History 日期对齐 Hotfix

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-25-1742.md`
- `.codex-backup/current-todo-2026-05-25-1742.md`
- `.codex-backup/page-state-2026-05-25-1742.md`

修改原因：

- 用户指出 `Ticketing History` 日期仍未与 `Customer Journey` 日期对齐，根因是行尾 hover 箭头仍作为 grid 列占位。
- 用户建议箭头在 hover 时浮在日期上方，不参与默认布局，从而既保留默认对齐，又保留 hover 指引。

修改结果：

- `.inbound-ticket-row` 去掉行尾箭头占位列，grid 仅保留左侧 ticket 类型和右侧 meta 区。
- `.inbound-ticket-row__hint` 改为绝对定位，默认透明，不占布局空间；hover/focus-visible 时浮在最右侧并以浅色渐变背景覆盖日期右侧上方。
- 箭头设置 `pointer-events: none`，不影响整行点击打开 CRM 动态 tab。
- 本轮未修改 `TicketingHistoryCard.tsx`、CRM tabs、store、mock、tab key、路由或话务状态机。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：主路由正常加载。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚本 hotfix，可恢复 `.inbound-ticket-row` 的三列 grid 和 `.inbound-ticket-row__hint` 的普通 grid 子项样式。
- 回滚会重新让箭头占用行尾布局空间，日期会再次向左偏移。

当前风险点：

- 仍建议在客户目标演示分辨率下人工 hover Ticketing 行，确认日期默认右边界、箭头覆盖范围和视觉强度合适。

### 2026-05-25 17:12 +08:00 - Ticketing 与 CRM 更多按钮 Hotfix

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-25-1712.md`
- `.codex-backup/current-todo-2026-05-25-1712.md`
- `.codex-backup/page-state-2026-05-25-1712.md`

修改原因：

- 用户指出 v0.6.5 将 `Ticketing History` 卡片中的 CRM 编号和日期改成了上下换行，实际要求是同一行右对齐。
- 用户指出中部 CRM 顶部 tabs 多开后的更多按钮仍偏宽，且图标未居中。

修改结果：

- `Ticketing History` 右侧 meta 区改回横向一行排列：ticket 编号和日期不换行，整体靠右。
- CRM tabs overflow 外层 `.ant-tabs-nav-operations` 与内层 `.ant-tabs-nav-more` 同时锁定为紧凑方形区域。
- 更多按钮图标改为 flex 居中，避免按钮宽度和图标位置受 AntD 默认 operation 容器影响。
- 本轮未修改 `TicketingHistoryCard.tsx`、`CrmPanel.tsx`、store、mock、tab key、路由或业务状态机。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning，并额外出现插件耗时提示。
- Browser smoke check `/`：主路由正常加载。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚本 hotfix，可恢复 `.inbound-ticket-row__meta`、`.inbound-ticket-row__number`、`.ant-tabs-nav-operations` 和 `.ant-tabs-nav-more` 的 v0.6.5 样式。
- 不需要回滚业务组件或状态逻辑，因为本轮只改样式。

当前风险点：

- 仍建议在客户目标演示分辨率下人工复查多个 CRM 动态 tab 打开后的 overflow 下拉与更多按钮点击区域。

### 2026-05-25 15:34 +08:00 - 弹屏卡片与 CRM Tab 视觉稳定优化

修改页面或文件：

- `src/pages/inbound/components/TicketingHistoryCard.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-25-1534.md`
- `.codex-backup/current-todo-2026-05-25-1534.md`
- `.codex-backup/page-state-2026-05-25-1534.md`

修改原因：

- 用户指出 `Ticketing History` 中 CRM 编号和日期未与上方 `Customer Journey` 右侧结果/日期列形成一致对齐。
- 用户指出中部 CRM tabs 在多开动态 tab 后存在高度不稳定、下方间隙、部分 tab 图标不一致和最右侧更多按钮过宽的问题。
- 当前外网链接已提供给客户查看，本轮需保持低风险，只做弹屏视觉稳定优化，不改业务状态与流程。

修改结果：

- `Ticketing History` 行调整为“票据类型 + 右侧 meta 区 + 箭头”，右侧 meta 区内 ticket 编号与日期统一右对齐。
- `CrmPanel` 新增统一 `inbound-crm-tab-label` label 结构，CRM、Conversation、Ticketing、Next Best Action、Quick Action 均使用固定图标尺寸、4px 图文间距和文字 ellipsis。
- 中部 CRM tabs nav 锁定单行固定高度，content holder 使用剩余高度，避免多 tab 后撑高 nav 或在 tab 下方留下异常间隙。
- CRM tabs overflow 更多按钮压缩为紧凑图标按钮，保留 AntD overflow 和动态 tab 关闭能力。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：主路由正常加载，Sign In 成功后出现固定 `Live Chat` tab。
- Browser smoke check `/design-system`：页面正常加载。
- 受 in-app browser 当前可见导航区域限制，本轮未能完整通过浏览器点击 PSTN 并逐项打开 CRM 动态 tab；需要在常规浏览器或客户目标分辨率下补做视觉复查。

回滚说明：

- 如需回滚 Ticketing 对齐，只需恢复 `TicketingHistoryCard.tsx` 中 ticket 编号/日期的直接渲染结构，并恢复 `.inbound-ticket-row` 原 grid columns。
- 如需回滚 CRM tabs 视觉，可恢复 `CrmPanel.tsx` 中原始 inline label，并移除 `.inbound-crm-tab-label`、CRM nav 固定高度和 `.ant-tabs-nav-more` 压缩样式。
- 本轮未修改 store、mock、tab key、路由或业务状态机。

当前风险点：

- 本轮为视觉优化，需在客户目标演示分辨率下复查多个 CRM 动态 tab 打开后的 overflow 下拉与右侧 Assistant 对齐效果。
- 当前项目仍缺少自动化视觉回归测试，主要依赖 lint/build 和浏览器 smoke check。

### 2026-05-25 13:17 +08:00 - Ready-aware 通话接入提示

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-1317.md`
- `.codex-backup/current-todo-2026-05-25-1317.md`
- `.codex-backup/page-state-2026-05-25-1317.md`

修改原因：

- 用户指出仅提示“先挂机”不完整，因为 Hang Up 后坐席会进入 ACW / Not Ready，只有自动回 Ready 后才能接入下一路电话/语音/视频。
- BankApp Voice / Video 在挂机后 ACW/Not Ready 阶段可能触发 request 后被 `BasicLayout` 静默 return，需要在 BankApp handoff 前就给出明确反馈。
- 用户询问 Answer 黄色按钮是否应改白字；本轮确认深色文字/图标是可读性设计，保持不变。

修改结果：

- `appStore` 新增 `VoiceVideoHandoffReadiness`：`available`、`active-call`、`not-ready`，以及 `setVoiceVideoHandoffReadiness()`。
- `BasicLayout` 根据坐席状态、话务状态和当前未结束 `CallInteraction` 计算 readiness，并同步到 store。
- PSTN / voice / video 入口使用 readiness 统一拦截：`active-call` 提示先挂机并等待 Ready，`not-ready` 提示坐席需要切回 Ready。
- BankApp Voice / Video handoff 读取同一 readiness：`active-call` 时提示 `Please hang up the current call and wait until the agent is Ready before routing this interaction to Agent Workspace.`；`not-ready` 时提示 `Agent must be Ready before routing this interaction to Agent Workspace.`。
- BankApp Live Chat / WhatsApp Live Chat 不受 voice/video readiness 限制影响。
- Answer 按钮仍使用黄色背景 + 深色文字/图标，不改为白色。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：PSTN Incoming 未挂机时再次点击 PSTN，不新增 tab，顶部提示包含 hang up 和 Ready。
- Browser smoke check `/`：PSTN Hang Up 后 ACW/Not Ready 阶段点击 PSTN，不新增 tab，顶部提示 `Agent is not Ready`。
- Browser smoke check `/`：PSTN 未挂机时 BankApp Voice / Video `Next Step` 均显示 hang up + Ready inline warning，且不创建对应 call tab。
- Browser smoke check `/`：PSTN Hang Up 后 ACW/Not Ready 阶段 BankApp Video `Next Step` 显示 `Agent must be Ready`，不创建 `Video Call` tab。
- Browser smoke check `/`：自动回 Ready 后 BankApp Video `Next Step` 可正常创建 `Video Call` tab。
- Browser smoke check `/`：Incoming 状态下 Answer 按钮仍为黄色背景、深色文字和深色图标。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 readiness 共享，可移除 `VoiceVideoHandoffReadiness`、`voiceVideoHandoffReadiness` 和 `setVoiceVideoHandoffReadiness()`，恢复 BankApp 只判断当前未结束 call 的逻辑。
- 如需回滚文案，可恢复 v0.6.3 的两个 warning 文案；但会重新出现 ACW/Not Ready 阶段提示不完整的问题。
- Answer 按钮未修改，无需回滚。

当前风险点：

- 当前仍只支持同一时间一路未挂断电话/语音/视频通话；本轮不支持多路同时接入。
- `voiceVideoHandoffReadiness` 由 `BasicLayout` 同步到 store，当前路由均在 `BasicLayout` 下，适配现有架构。

### 2026-05-25 12:53 +08:00 - 通话接入阻塞提示

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-1253.md`
- `.codex-backup/current-todo-2026-05-25-1253.md`
- `.codex-backup/page-state-2026-05-25-1253.md`

修改原因：

- 演示时当前 PSTN 未挂机，再操作 PSTN、BankApp Voice 或 BankApp Video handoff 时，因为系统限制同一时间只有一路未挂断电话/语音/视频通话，页面看起来像点击无响应。
- 用户要求在跳转坐席工作页面之前判断当前是否已有未挂断通话，并给出可见提示，引导先挂机。

修改结果：

- `BasicLayout` 新增通话 handoff notice：当 `triggerVoiceInboundCall()` / `triggerVideoInboundCall()` 因当前未结束通话被阻塞时，在 Header / 话务条下方显示轻量 warning，不打开 modal、不新增 tab、不改变当前通话。
- PSTN 阻塞文案为 `Active call in progress. Please hang up before accepting another voice or video interaction.`，短暂展示后自动隐藏。
- `BankAppDemoPage` 在 Voice / Video 的 `Connected -> Agent Workspace` handoff 前检查当前未结束 `CallInteraction`；如有未挂断通话，阻止 `requestBankAppVoiceCall()` / `requestBankAppVideoCall()` 和 `agent-workspace` 步骤跳转。
- BankApp inline warning 文案为 `Please hang up the current call before routing this interaction to Agent Workspace.`；切换渠道、Reset、Live Chat 或成功 handoff 后清除。
- Live Chat 路径不受影响，仍可在当前通话存在时进入 Live Chat。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In -> PSTN Incoming 后再次点击 PSTN，不新增 tab，并显示顶部 active call warning。
- Browser smoke check `/`：PSTN 未挂机时 BankApp Voice 在 `Connected -> Next Step` 显示 inline warning，未创建 `Voice Call` tab。
- Browser smoke check `/`：Hang Up 当前 PSTN 并自动回 Ready 后，BankApp Voice `Next Step` 可正常创建 `Voice Call` tab。
- Browser smoke check `/`：PSTN 未挂机时 BankApp Video 在 `Connected -> Next Step` 显示 inline warning，未创建 `Video Call` tab。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚顶部提示，可移除 `BasicLayout` 中 `callHandoffNotice` 状态、`showCallHandoffNotice()` / `hideCallHandoffNotice()` 和 `.aicc-call-handoff-warning` 样式。
- 如需回滚 BankApp inline 提示，可移除 `BankAppDemoPage` 中 `handoffWarningVisible` 状态、current call 检查和 `.bankapp-process__handoff-warning` 样式。
- 本轮没有修改 `appStore` 多通话实例模型，也没有改变 Hang Up、ACW、Live Chat 或 workspace tab 架构。

当前风险点：

- 当前仍只支持同一时间一路未挂断电话/语音/视频通话；本轮只是让阻塞可见，不支持多路同时接入。
- 如果后续要区分 Not Ready / AUX / ACW 导致的接入失败，需要再增加单独的 Agent not Ready 提示文案，避免和未挂机提示混用。

### 2026-05-25 03:58 +08:00 - Live Chat 闪烁范围与 SLA 颜色优化

修改页面或文件：

- `src/pages/AgentWorkspace.tsx`
- `src/styles/index.less`
- `src/styles/tokens.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-0358.md`
- `.codex-backup/current-todo-2026-05-25-0358.md`
- `.codex-backup/page-state-2026-05-25-0358.md`

修改原因：

- 用户指出 Live Chat 新接入闪烁边框没有贴合整块背景边框，客户列表中的 flash 范围偏小。
- 用户反馈 Live Chat tab、客户列表和 Conversation header 的 warning / breach 计时颜色偏暗，需要更明亮、更统一。

修改结果：

- `WorkspaceTabLabel` 新增 `flashScope`，Live Chat 使用 tab 级闪烁标记，PSTN / Voice / Video 保持原 label 级闪烁。
- `index.less` 使用 `:has(.workspace-tab-label--tab-flash)` 将 Live Chat flash 动画作用到整个 AntD tab item。
- 客户列表 flash overlay 改为 `inset: 0` 和 `border-radius: inherit`，闪烁范围贴合整行 item 背景。
- `tokens.less` 新增 Live Chat SLA token：warning `#f59e0b`，breach `#f04438`，并提供 RGB token 供阴影和 accent 使用。
- Live Chat tab duration、客户列表 duration、Conversation timer、SLA marker、左侧 accent 统一使用新的 SLA token。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后 Live Chat 无 active session 时无 duration。
- Browser smoke check `/`：WhatsApp Live Chat 新接入时，Live Chat tab item 使用 `aicc-interaction-tab-flash`，label 本身无单独动画。
- Browser smoke check `/`：BankApp Live Chat 新接入时，客户列表 flash `::after` 为 `inset: 0px`，边框贴合整行。
- Browser smoke check `/`：warning / breach 在 tab duration、list duration、Conversation timer、SLA marker 四处分别统一为 `rgb(245, 158, 11)` 和 `rgb(240, 68, 56)`。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 Live Chat tab 整块闪烁，可移除 `flashScope="tab"` 和 `:has(.workspace-tab-label--tab-flash)` 样式，恢复 label 级 `.workspace-tab-label--flash`。
- 如需回滚客户列表整行 flash，可将 `.live-chat-customer-list__item--flash::after` 的 `inset` 恢复为 `3px 5px`。
- 如需回滚 SLA 颜色，可恢复旧色值 `#c77a00` / `#b42318` 和 marker/accent 旧色。

当前风险点：

- Live Chat tab 整块闪烁依赖现代浏览器支持 CSS `:has()`；当前演示目标浏览器 Chrome/Edge 支持该选择器。
- 本轮仅优化现有新 active session 视觉，不新增真实消息到达事件或 unread 模型。
- 本轮未改 store 状态机和多通话 tab 架构，风险集中在样式层。

### 2026-05-25 03:39 +08:00 - Live Chat 新接入可见性与已读状态优化

修改页面或文件：

- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-0339.md`
- `.codex-backup/current-todo-2026-05-25-0339.md`
- `.codex-backup/page-state-2026-05-25-0339.md`

修改原因：

- 用户发现 Live Chat 新客户接入时，Live Chat workspace tab 没有在当前已选中 Live Chat 的情况下闪烁。
- 用户认为客户列表新接入闪烁不够明显，且 active customer 与 inactive customer 闪烁视觉不一致。
- 用户要求 Conversation header 中客户姓名旁边的计时也要随 SLA 状态变色。
- 用户指出点击客户后头像右上角 unread badge 应消失，头像右下 SLA marker 的白色边框偏厚。

修改结果：

- `AgentWorkspace` 中 Live Chat tab 只要存在最新 session `flashUntil > now` 就短闪，不再要求当前 active tab 不是 Live Chat。
- `.workspace-tab-label--flash` 增强为浅 amber 背景、细 outline 与轻 glow，不改变 tab 尺寸。
- `LiveChatCustomerList` 的 flash 改为统一 overlay 样式，active/inactive 客户项使用同一套浅 amber 闪烁，不受 active 白底影响。
- `ConversationWorkspace` 接收当前 session 的 `slaState`，客户姓名旁边 timer 的图标和文字会随 warning / breach 变色。
- `appStore` 新增 `readLiveChatSessionIds` 和 `markLiveChatSessionRead()`；会话被聚焦、点击、筛选切换到或 End Service 后自动选中时会清 unread badge。
- 已读状态提升到 store，避免从 Live Chat 切到 BankApp / WhatsApp Demo 再回来时 unread badge 重新出现；End Service、Sign Out、AUX 或关闭 Live Chat 会清理对应已读状态。
- Live Chat SLA marker 白色边框从 `2px` 调整为 `1px`，保留可读性但降低厚重感。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后通过 WhatsApp Demo 进入 Live Chat，Live Chat tab 和客户列表行短闪，active unread badge 已清零。
- Browser smoke check `/`：当前停留在 Live Chat 时通过 BankApp Demo 新接入第二个客户，Live Chat tab 仍短闪，两个客户列表项均出现明显 flash。
- Browser smoke check `/`：点击已存在的 WhatsApp 客户后 active customer 切换正常，unread badge 不再恢复。
- Browser smoke check `/`：SLA marker CSS 边框为 `1px`。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 Live Chat tab 闪烁，可恢复 `AgentWorkspace` 中 `activeKey !== LIVE_CHAT_TAB_KEY` 的闪烁条件。
- 如需回滚 unread 已读状态，可移除 `readLiveChatSessionIds` / `markLiveChatSessionRead()`，并恢复 `LiveChatPage` 仅使用本地 `sessionSummariesById`。
- 如需回滚闪烁视觉，可恢复 `live-chat-session-flash` 旧 keyframes 和 `.live-chat-customer-list__item--flash` 的原动画。

当前风险点：

- unread 已读状态仍是前端 demo 级别，不接真实消息已读回执；刷新页面后不会持久化。
- Live Chat SLA 阈值仍按客户示例固定为 warning 60 秒、breach 120 秒，未来多渠道 SLA 需要配置化。
- 本轮未改 v0.6.0 多通话 tab 架构，PSTN / BankApp Voice / BankApp Video 多弹屏风险边界保持不变。

### 2026-05-25 02:10 +08:00 - 多 Inbound 弹屏与通话 Tab 架构

修改页面或文件：

- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-0210.md`
- `.codex-backup/current-todo-2026-05-25-0210.md`
- `.codex-backup/page-state-2026-05-25-0210.md`

修改原因：

- 用户要求 Hang Up 后当前 PSTN / BankApp Voice / BankApp Video 弹屏不要被新呼叫覆盖，应保留旧 tab 供坐席继续登记。
- 新呼叫进入时需要创建新的 workspace tab，并且当前正在通话的 tab 在 Hang Up 前不可关闭，避免误关导致话务条和弹屏状态不一致。
- Live Chat 已有固定 tab + 多客户列表，本轮不纳入多 workspace tab 重构。

修改结果：

- `appStore` 新增 `CallInteraction` 多实例模型，使用 `callInteractions`、`callInteractionOrder`、`currentCallInteractionId` 和 `callInteractionSeq` 管理多个通话弹屏。
- 新通话 tab key 使用 `call-1`、`call-2`、`call-3` 稳定递增，不再使用单例 `inbound` / `video-call` tab。
- `AgentWorkspace` 按 `callInteractionOrder` 渲染多个通话 tab；running tab 实时计时，ended tab 使用 `endedAt` 冻结时长。
- 当前 active call tab 不可关闭；Hang Up 后 tab 保留、时长冻结并变为可关闭。
- `BasicLayout` 保留单一路当前通话状态机，但 Answer / Hang Up 会同步更新当前 `CallInteraction` 的 `phase`。
- `InboundPage` / `VideoCallPage` 改为接收 interaction source，旧 tab 的客户资料不会被新呼叫覆盖。
- OpenEye 浮窗和 BankApp Video desktop share 只绑定当前 active video interaction；ended video tab 不显示浮窗。
- Sign Out 会关闭所有 call tabs；AUX 会结束当前 active call 并保留 ended tab，同时清理文字 active sessions。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 Live Chat tab 无 duration。
- Browser smoke check `/`：PSTN Incoming 创建不可关闭 `PSTN (00:xx)` tab；Answer -> Hang Up 后 tab 保留、duration 冻结并变为可关闭。
- Browser smoke check `/`：旧 PSTN tab 未关闭时再次触发 PSTN，会创建第二个 PSTN tab，不覆盖旧 tab。
- Browser smoke check `/`：BankApp Voice 创建 `Voice Call (00:xx)` tab，Hang Up 后变为可关闭。
- Browser smoke check `/`：BankApp Video 创建 `Video Call (00:xx)` tab，旧 Voice Call tab 保留，Answer 后 OpenEye 浮窗正常显示。
- Browser smoke check `/`：WhatsApp Demo 仍能进入 Live Chat，Webchat mock 仍不可见。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚多通话 tab，可恢复 `appStore` 的单例 `isInboundTabOpen`、`inboundPopupSource`、`inboundInteractionTiming`、`isVideoCallTabOpen`、`videoCallPopupSource`、`videoCallInteractionTiming` 字段，并恢复 `AgentWorkspace` 中固定 `inbound` / `video-call` tab 渲染。
- 如需只回滚 active tab 不可关闭，可将 call tab 的 `closable` 恢复为 true，但需要同步定义关闭 active call 是否挂断，否则容易出现状态不一致。
- 如需回滚页面 source 传递，可恢复 `InboundPage` / `VideoCallPage` 从 store 读取单例 source。

当前风险点：

- 当前仍只支持同一时间一路 active call；多通话 tab 解决旧弹屏保留和新呼叫新开 tab，不支持两路通话同时由话务条控制。
- 旧 ended tab 保留的是前端组件内存状态，刷新页面后不会恢复未提交登记内容。
- 关闭 ended tab 会丢弃该 tab 内未落盘的动态 CRM tab 状态；这是当前前端 demo 的预期行为。

### 2026-05-25 01:31 +08:00 - Live Chat 计时与 Tab 视觉清理

修改页面或文件：

- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/DesignSystem.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-0131.md`
- `.codex-backup/current-todo-2026-05-25-0131.md`
- `.codex-backup/page-state-2026-05-25-0131.md`

修改原因：

- 用户发现 workspace tab 中 Live Chat、PSTN、Voice Call、Video Call 的图标与文字距离比其它 tab 更远，需要统一 tab label 结构和间距。
- 用户希望 BankApp / WhatsApp Live Chat 模拟客户接入时，运行计时从新接入 `00:00` 开始，而不是沿用 mock access duration 回推。
- 用户明确 Customer Information 中的 access duration 是客户从渠道接入、排队、转坐席成功前的静态耗时，应保留但与渠道标签合并展示，避免页面出现过多分散时间。
- 用户指出 Live Chat 60 秒 warning 色偏深棕，需要更明确的 amber/yellow。

修改结果：

- `AgentWorkspace` 中所有 workspace tab 统一使用 `WorkspaceTabLabel` 结构，修复 nested `span` 被通用 gap 样式影响导致交互 tab 间距变宽的问题。
- `appStore` 的 Live Chat session timing 改为接入时从 `00:00` 开始，不再根据 `customer.accessDuration` 初始化回推。
- Live Chat 客户列表仍始终显示每个 active customer 的运行 duration；Conversation header、客户列表和 Live Chat tab 继续共用同一份 runtime timing。
- `ChannelTag` 支持可选 duration，Customer Information 的 access strip 改为 `渠道 · 接入时长`，移除独立时钟图标与单独 duration 文本。
- `CustomerInformationCard` 和 `/design-system` 示例同步使用新的渠道标签 duration 形态。
- Live Chat SLA warning 色更新为更清晰的 amber/yellow；breach 红色逻辑不变。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 Live Chat tab 无 duration，Home 和 Live Chat tab 图标文字间距一致。
- Browser smoke check `/`：PSTN Incoming 显示 `PSTN (00:xx)`，BankApp Voice 显示 `Voice Call (00:xx)`，BankApp Video 显示 `Video Call (00:xx)`，旧 `PSTN / Voice Call` 不再出现。
- Browser smoke check `/`：BankApp / WhatsApp Live Chat 均从 `00:00` 开始计时，列表和 Conversation header 同步增长，单个 active customer 仍显示 duration。
- Browser smoke check `/`：Customer Information access strip 显示 `渠道 · 接入时长`，不再出现独立时钟时长。
- Browser smoke check `/`：End Service 后清理该 session timing，无 active sessions 时 Live Chat tab 恢复无 duration。
- Browser smoke check `/`：warning duration 色为 `#c77a00`，收起态 marker 色为 `#f5a400`。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 tab 间距，可恢复 `interaction-tab-label` 结构和旧 `.agent-workspace-tabs .ant-tabs-tab-btn span` 样式，但会重新带来嵌套 span 间距风险。
- 如需回滚 Live Chat 起始计时，可恢复 `liveChatInitialElapsedSecondsById` 和 `parseDurationSeconds(customer.accessDuration)` 初始化逻辑。
- 如需回滚 Customer Information 渠道时长整合，可恢复 `ClockCircleOutlined` 和 `aicc-customer-info__access-duration` 单独展示。
- 如需回滚 SLA warning 色，可恢复原 warning 色 token。

当前风险点：

- 本轮未实现 Hang Up 后旧弹屏保留且新呼叫新开 tab 的多 inbound 架构，该需求需在 `v0.6.0` 单独处理。
- 当前仍只支持一个 `inbound` tab、一个 `video-call` tab 和一个固定 `live-chat` workspace；多路电话并发会涉及 store 和 tab key 架构改造。
- Customer Information 静态接入耗时与 Live Chat 运行计时现在同时存在，但语义不同：前者是渠道/排队耗时，后者是坐席服务运行时长。

### 2026-05-25 00:00 +08:00 - 交互页签与 Live Chat 计时/SLA/短闪

修改页面或文件：

- `src/store/appStore.ts`
- `src/hooks/useNow.ts`
- `src/utils/duration.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-25-0000.md`
- `.codex-backup/current-todo-2026-05-25-0000.md`
- `.codex-backup/page-state-2026-05-25-0000.md`

修改原因：

- 客户要求来电弹屏页签名称按来源区分：PSTN 呼入显示 `PSTN`，BankApp Voice 显示 `Voice Call`，不再统一显示 `PSTN / Voice Call`。
- 客户希望在交互页签附近显示持续时间，并为多交互场景提供服务级别提示、新交互短闪。
- 用户补充 Live Chat 客户列表也应展示持续时间和新客户短闪，且不能影响既有 BankApp、WhatsApp、Video、话务条功能。

修改结果：

- `appStore` 增加 voice/video interaction timing 和 Live Chat session timing，包含 `startedAt`、`flashUntil`。
- PSTN tab 显示 `PSTN (mm:ss)`，BankApp Voice 显示 `Voice Call (mm:ss)`，Video Call 显示 `Video Call (mm:ss)`。
- Live Chat 有 active session 时显示最长会话持续时间；无 active session 时仍显示 `Live Chat`。
- 新交互进入且当前不在该 tab 时，workspace tab 使用轻量短闪，不改变 tab key。
- Live Chat 客户列表为每个 active customer 显示 `lastMessageTime · mm:ss`，并增加 60 秒 warning、120 秒 breach 的 SLA 视觉状态。
- Live Chat 展开态通过左侧细 accent 和 duration 颜色表达 SLA；收起态通过渠道 icon 角标表达 SLA。
- `ConversationWorkspace` 不再自行维护独立 elapsed interval，改为接收 Live Chat runtime elapsed，保持聊天头部、客户列表和 workspace tab 计时一致。
- `BasicLayout` 在 Hang Up、Unsigned、AUX 等路径清理 voice/video interaction timing，End Service 清理对应 Live Chat session timing。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 Live Chat tab 无持续时间。
- Browser smoke check `/`：PSTN 呼入 tab 显示 `PSTN (mm:ss)`，旧 `PSTN / Voice Call` 不再出现。
- Browser smoke check `/`：BankApp Voice tab 显示 `Voice Call (mm:ss)`；BankApp Video tab 显示 `Video Call (mm:ss)`。
- Browser smoke check `/`：BankApp Live Chat tab 显示最长 active session duration，客户列表显示 `lastMessageTime · duration`，BankApp backdated session 命中 breach 状态。
- Browser smoke check `/`：Live Chat 收起态 SLA marker 显示为红色 breach；End Service 后 Live Chat tab duration 清理。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚页签持续时间，可恢复 `AgentWorkspace` 的静态 label，并移除 `interaction-tab-label` 样式。
- 如需回滚 Live Chat SLA/短闪，可恢复 `LiveChatCustomerList` 的原始 topline，仅保留 last message time。
- 如需回滚 store runtime timing，可移除 `InteractionTiming`、`liveChatSessionTimings`、`inboundInteractionTiming`、`videoCallInteractionTiming` 及相关清理逻辑。

当前风险点：

- 当前架构仍只支持一路 voice call、一路 video call 和一个 Live Chat workspace；客户提到的多个交互本轮仅覆盖多个类型或多个 Live Chat active sessions。
- Live Chat SLA 阈值当前按客户示例固定为 warning 60 秒、breach 120 秒，未来若客户给出不同渠道 SLA，需要改成配置化。
- Webchat mock 仍保留但隐藏，不参与 active sessions、SLA、tab timing。

### 2026-05-24 22:31 +08:00 - 话务条文字层级、Settings 简化与 Icon Only 优化

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/ToolbarSettingsModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-24-2231.md`
- `.codex-backup/current-todo-2026-05-24-2231.md`
- `.codex-backup/page-state-2026-05-24-2231.md`

修改原因：

- 用户发现话务条左侧号码与右侧时长的粗细、颜色层级不统一，整体看起来一块粗一块细、一块灰一块黑。
- 用户希望 Settings 弹框减少文字，只保留 `Toolbar display` 和选择控件，并横向展示。
- 用户指出 `Icon Only` 模式下图标偏小，需要在紧凑模式中提升识别度。

修改结果：

- `IVR` / `BankID` 标签改为灰色 600，不再使用蓝色 800。
- 接入号码与右侧状态时长使用相同黑色、700 字重和 tabular nums。
- Settings 弹框宽度从 520 收到 420，删除说明文案，改为一行 `Toolbar display` + segmented control。
- `AgentToolbar` 增加 `aicc-agent-toolbar--icon-only` 模式 class。
- `Icon Only` 模式下话务按钮固定为 29px 方形、padding 归零，按钮图标和 More 图标放大到 14px；默认 `Icon + Text` 模式保持原尺寸。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 More > Settings 可打开，Settings 只显示一行 `Toolbar display` + `Icon + Text` / `Icon Only`，没有说明文案。
- Browser smoke check `/`：切换 `Icon Only` 后 toolbar 增加 `aicc-agent-toolbar--icon-only`，按钮宽度 29px，按钮图标和 More 图标均为 14px。
- Browser smoke check `/`：PSTN Incoming 显示 `IVR 08123456789`；identification label 与 timer label 的计算样式一致，identification value 与 timer value 的计算样式一致。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚文字层级，可恢复 `aicc-agent-toolbar__identification span` 的蓝色和 800 字重，并恢复 timer label 700。
- 如需回滚 Settings 简化，可恢复说明文案和 520 宽弹框。
- 如需回滚 icon-only 优化，可移除 `aicc-agent-toolbar--icon-only` class 和对应 CSS。

当前风险点：

- Toolbar display mode 仍只保存在当前页面运行状态，刷新后恢复默认 `Icon + Text`。
- 本轮仍只影响话务条与 Settings，不改变 BankApp/WhatsApp/Video 状态联动。

### 2026-05-24 22:07 +08:00 - 话务条视觉细节与 Settings 控件统一

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/ToolbarSettingsModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-24-2207.md`
- `.codex-backup/current-todo-2026-05-24-2207.md`
- `.codex-backup/page-state-2026-05-24-2207.md`

修改原因：

- 用户发现话务条上 identification 右侧和 timer 左侧两条竖线不明显，需要在不增加背景框和不加粗线的前提下优化可见度。
- 用户要求评估接入号码是否应加粗；本轮选择保留号码半粗，避免抢占动作按钮视觉焦点。
- 用户指出 Settings 中 Toolbar display 选择控件样式不明显，需与系统内 BankApp Customer type 单选风格统一。

修改结果：

- 两条话务条 divider 统一为更清晰的 `rgba(86, 122, 166, 0.52)`，保持 1px。
- `IVR` / `BankID` 标签保持 800 字重，接入号码显式设置为 700 字重和 tabular nums。
- `ToolbarSettingsModal` 移除 Ant Design `Segmented`，改用项目自定义 `.aicc-segmented-control` 按钮组。
- 自定义 segmented 控件使用白底、细边框、浅蓝选中态和统一 hover/focus 样式，贴近 BankApp Customer type 的视觉。
- More Dropdown 明确使用 click trigger，点击 More 后可稳定打开 Settings 入口。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 More 点击可打开菜单，Settings 可打开。
- Browser smoke check `/`：Settings 只显示 Toolbar display；`Icon + Text` / `Icon Only` 为自定义 segmented buttons。
- Browser smoke check `/`：切换 `Icon Only` 并 Confirm 后，话务条按钮文字隐藏，图标和可访问标签保留。
- Browser smoke check `/`：PSTN Incoming 显示 `IVR 08123456789` 在 Answer 左侧。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 Settings 控件视觉，可恢复 `ToolbarSettingsModal` 使用 Ant Design `Segmented`，并删除 `.aicc-segmented-control` 样式。
- 如需回滚 divider 视觉，可恢复 `rgba(126, 160, 204, 0.32)`。
- 如需回滚 More 触发方式，可移除 `Dropdown` 的 `trigger={['click']}`。

当前风险点：

- Toolbar display mode 仍只保存在当前页面运行状态，刷新后恢复默认 `Icon + Text`。
- 本轮只验证 PSTN Incoming 的 divider 与 Settings；BankApp Voice / Video 的 BankID 位置沿用同一 `AgentToolbar` 渲染路径，未改动状态机。

### 2026-05-24 19:48 +08:00 - 话务条 Identification 样式与显示模式

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/ToolbarSettingsModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-24-1948.md`
- `.codex-backup/current-todo-2026-05-24-1948.md`
- `.codex-backup/page-state-2026-05-24-1948.md`

修改原因：

- 用户确认 incoming identification 应固定放在动作按钮左侧：Incoming 在 Answer 左侧，通话中在 Hold 左侧。
- 用户要求去掉 identification 背景框和冒号，使用类似状态时长的纯文本和竖线分隔。
- 用户希望重新开放话务条 Settings，并支持 `Icon + Text` / `Icon Only` 显示模式，以缩短长期使用时的话务条。

修改结果：

- Identification 改为纯文本：`IVR 08123456789` / `BankID 00012345`，无背景、无边框、无冒号。
- Identification 现在是动作按钮组第一个元素，右侧用竖线分隔。
- `AgentToolbar` 新增 `ToolbarDisplayMode`，由 `BasicLayout` 用本地 state 保存，默认 `text`。
- More 菜单重新加入 `Settings`，Settings 弹框只展示 Toolbar display 分段控件。
- `Icon Only` 模式隐藏 Answer/Hold/Mute/Transfer/Hang Up/Ready 的可见文字，但保留图标、`aria-label` 和 `title`。
- 自动接听仍固定使用默认 3 秒逻辑，但不再在 Settings 中显示或配置。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：More > Settings 可打开，弹框只显示 Toolbar display，不显示自动接听秒数。
- Browser smoke check `/`：默认 `Icon + Text` 保持按钮文字，切换 `Icon Only` 后按钮文字隐藏且可访问标签保留。
- Browser smoke check `/`：PSTN Incoming 中 `IVR 08123456789` 位于 Answer 左侧；Talking 中位于 Hold 左侧。
- Browser smoke check `/`：BankApp Voice / Video 中 `BankID 00012345` 位于动作按钮最左侧；Hang Up 后隐藏。
- Browser smoke check `/`：BankApp/WhatsApp Live Chat 不显示 IVR/BankID。
- Browser layout check `/` at 1366x768：话务条不遮挡 BANK 1 logo 或右侧 profile/actions。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚显示模式，可移除 `ToolbarDisplayMode` state、Settings 菜单项和 `ToolbarSettingsModal` 的分段控件，恢复按钮始终显示文字。
- 如需回滚 identification 样式，可恢复 `aicc-agent-toolbar__identification` 的 pill 样式和原插入位置。

当前风险点：

- Toolbar display mode 仅保存在当前页面运行状态，刷新后恢复默认 `Icon + Text`。
- 自动接听秒数仍是前端固定默认 3 秒；如果后续客户需要设置入口，需要重新设计 Settings。

### 2026-05-24 19:16 +08:00 - 话务条 Incoming Identification 展示

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-24-1916.md`
- `.codex-backup/current-todo-2026-05-24-1916.md`
- `.codex-backup/page-state-2026-05-24-1916.md`

修改原因：

- 客户要求在话务条位置展示 incoming identification，方便坐席识别呼入来自 IVR 还是 BankApp/Halo Apps CTI。
- 为避免出现 BCA 字样，本轮使用脱敏标签 `BankID`，不使用客户原话中的 `BCAID`。

修改结果：

- `BasicLayout` 根据 `activeCallChannel`、`inboundPopupSource`、`videoCallPopupSource` 计算 `callIdentification`。
- PSTN / IVR 呼入在 `Incoming`、`Talking`、`Hold`、`Mute` 显示 `IVR: 08123456789`。
- BankApp Voice / Video 呼入在同一通话状态显示 `BankID: 00012345`。
- `AgentToolbar` 新增可选 `callIdentification` prop，并用浅色 pill 显示在 Answer 或 Hold 右侧。
- Hang Up / Ready / ACW / Live Chat / WhatsApp 文字会话不显示 identification。
- Customer Information、Contact Management、外呼申请、BankApp/WhatsApp 客户侧流程和 `v0.5.0` presence 状态点机制未修改。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后无通话时不显示 identification。
- Browser smoke check `/`：PSTN Incoming / Talking 显示 `IVR: 08123456789`，Hang Up 后隐藏。
- Browser smoke check `/`：BankApp Voice 显示 `BankID: 00012345`，Hang Up 后隐藏。
- Browser smoke check `/`：BankApp Video 显示 `BankID: 00012345`，OpenEye `Desktop Share` 仍可见，Hang Up 后隐藏。
- Browser smoke check `/`：BankApp Live Chat 和 WhatsApp Demo Live Chat 不显示 IVR/BankID。
- Browser layout check `/` at 1366x768：话务条不遮挡 BANK 1 logo 或右侧 profile/actions。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚，仅移除 `AgentToolbar` 的 `callIdentification` prop 和 pill 样式，并删除 `BasicLayout` 中的 `callIdentification` 计算与传参。
- 无需回滚 Customer Information、mock 客户资料或 store 状态结构，因为本轮没有修改这些内容。

当前风险点：

- IVR ANI 和 BankID 当前是前端 demo 固定值，未接真实 CTI payload。
- 话务条宽度已扩大，客户实际远程演示分辨率下仍建议复查一次。

### 2026-05-24 17:57 +08:00 - 客户远程演示状态机制优化

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-24-1757.md`
- `.codex-backup/current-todo-2026-05-24-1757.md`
- `.codex-backup/page-state-2026-05-24-1757.md`

修改原因：

- 客户要求右上角坐席状态圆点表达真实客户互动状态：有电话、语音、视频、聊天等客户接入时显示红色忙碌；AUX/离开显示黄色；绿色仅表示坐席已 Ready 且尚无客户接入。
- 需要让 Live Chat 登录后默认无客户接入，只有 BankApp / WhatsApp 客户侧入口触发后才出现对应客户；Webchat 在尚无入口前暂时隐藏。

修改结果：

- `appStore` 新增 `activeLiveChatSessionIds`、`closeLiveChatSession(sessionId)`、`clearLiveChatSessions()`。
- `requestLiveChatWorkspace(sessionId?, activate?)` 只有在传入 session id 时才把客户加入 active sessions；Sign Out、AUX、关闭 Live Chat tab 会清理 active sessions。
- `BasicLayout` 新增 `effectiveAgentPresence`：Unsigned 灰色；Ready 且无互动绿色；电话/视频 `Incoming/Talking/Hold/Mute` 或存在 active live chat session 时红色；AUX / Not Ready / ACW 且无互动黄色。
- `AgentProfileArea` 改为接收 presence 渲染状态点，保留原坐席状态菜单和状态机。
- `LiveChatPage` 只展示 active sessions；Sign In 后 Live Chat 页面为空态，BankApp Live Chat 只显示 Sari Amelia，WhatsApp Demo 只显示 Dimas Abimanyu。
- `LiveChatCustomerList` 暂时移除 Webchat 筛选项，Webchat mock 数据仍保留，后续新增入口时可恢复。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后状态点绿色，Live Chat 为空态且 Webchat 不可见。
- Browser smoke check `/`：PSTN Incoming 和 Talking 状态点红色；Hang Up 后 ACW 黄色，约 5 秒后 Ready 绿色。
- Browser smoke check `/`：BankApp Live Chat 触发后仅显示 Sari Amelia，状态点红色；Confirm End Service 后回空态和绿色。
- Browser smoke check `/`：WhatsApp Demo 触发后仅显示 Dimas Abimanyu，状态点红色；Confirm End Service 后回空态和绿色。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚状态点规则，可恢复 `AgentProfileArea` 直接按 `AgentStatus` 映射状态类，并移除 `BasicLayout` 的 `effectiveAgentPresence`。
- 如需恢复 Live Chat 默认显示全部 mock 客户，可移除 `activeLiveChatSessionIds` gating，恢复 `LiveChatPage` 本地 `openSessionIds` 初始为全部 `liveChatSessions`，并把 Webchat 筛选项加回 `LiveChatCustomerList`。

当前风险点：

- Webchat mock 数据仍在代码中，只是暂时不进入 visible/active 列表；后续新增 Webchat 客户入口时，需要同步恢复 active session 触发和筛选项。
- End Service 目前只关闭文字 active session，不触发电话 ACW、工单关闭或真实路由释放。
- 当前项目仍没有自动化测试体系，发布前仍依赖 lint/build 与浏览器 smoke check。

### 2026-05-24 14:12 +08:00 - BankApp Video 桌面共享附件与按钮修正

修改页面或文件：

- `public/screenshots/openeye-share-selection.png`
- `public/screenshots/bankapp/video-screen-sharing.png`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户反馈 OpenEye 选择共享程序图不应绘制，必须直接使用附件一原图。
- 用户反馈 BankApp 第八步 `View Agent Screen Sharing` 必须直接使用附件二原图。
- 用户要求 OpenEye 桌面共享按钮改成英文，并使背景更半透明。

修改结果：

- 从当前 Codex session 中的用户消息 `data:image/png;base64` 直接解码两张附件，覆盖 `openeye-share-selection.png` 和 `video-screen-sharing.png`。
- OpenEye 共享按钮可见文案从 `桌面共享` 改为 `Desktop Share`，背景改为半透明深色覆盖样式。
- 既有 BankApp Video step、store 状态机和 Netinfo 标签逻辑保持不变。

验证：

- Local image check 通过：`openeye-share-selection.png` 为附件一原图，尺寸 `533x920`。
- Local image check 通过：`video-screen-sharing.png` 为附件二原图，尺寸 `750x1624`。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Video 到 `Agent Workspace` 后 OpenEye 显示 `Desktop Share` 按钮。
- Browser smoke check `/`：点击 `Desktop Share` 后 OpenEye 加载 `/screenshots/openeye-share-selection.png`。
- Browser smoke check `/`：点击 `确定` 后 BankApp 第八步加载 `/screenshots/bankapp/video-screen-sharing.png`，并保留 `Select Sharing Program` / `View Agent Screen Sharing` 两个 Netinfo 步骤。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚按钮文案和透明度，可恢复 `OpenEyeVideoWindow.tsx` 与 `.openeye-video-window__share-button` 上一版样式。
- 如需替换附件，只需要覆盖同名 PNG 资源，不需要修改流程代码。

当前风险点：

- 两张截图来自用户当前会话附件；发布公开环境前仍需确认授权与脱敏口径。

### 2026-05-24 13:48 +08:00 - BankApp Video 桌面共享流程修正

修改页面或文件：

- `public/screenshots/openeye-share-selection.png`
- `public/screenshots/bankapp/video-screen-sharing.png`
- `src/store/appStore.ts`
- `src/types/bankapp.ts`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 用户要求 BankApp Demo 的 Video Call 桌面共享从 OpenEye 浮窗发起，而不是从 BankApp connected 手机页发起。
- 用户要求 OpenEye 点击 `桌面共享` 后展示“选择共享程序”截图，点击 `确定` 后跳回 BankApp Demo 展示客户侧查看坐席共享画面。
- 用户要求新增步骤属于 BankApp 流程第 6 步 Agent Workspace 后续步骤，标签均为 `Netinfo`，且不影响其它功能。

修改结果：

- BankApp Video 流程在 `Agent Workspace` 后新增 `Select Sharing Program` 和 `View Agent Screen Sharing` 两个 Netinfo 步骤。
- OpenEye 浮窗仅在 `bankapp-video` 来源下显示 `桌面共享` 按钮；点击后切换到 `openeye-share-selection.png`，确认热区点击后设置共享状态并激活 `BankApp Demo` tab。
- BankApp Demo 的共享查看画面通过 `video-screen-sharing.png` 展示，旧的 connected 页内 `Screen share / Start / Stop` 覆盖控件已移除。
- `appStore` 新增 BankApp Video 共享选择、确认和重置状态；Reset、Hang Up、关闭 Video Call tab、非 BankApp Video 呼叫、签出/AUX 会清理共享状态。
- Voice、Live Chat、WhatsApp 和普通 Video Call 代码路径未增加 BankApp 桌面共享入口。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Video Registered 到 `Agent Workspace` 后激活 `Video Call` tab，OpenEye 出现 `桌面共享` 按钮。
- Browser smoke check `/`：点击 `桌面共享` 后 OpenEye 显示选择共享程序截图，且存在 `确定` 确认热区。
- Browser smoke check `/`：点击 `确定` 后自动切回 `BankApp Demo`，手机区显示 `BankApp agent screen sharing`，AICC Process rail 显示 `Select Sharing Program` 和 `View Agent Screen Sharing` 两个 Netinfo 步骤。
- Browser smoke check `/`：共享画面后点击 `Next Step` 进入 `Service Closed`，Reset 后回到 `Choose Channel` 且不再显示共享画面。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚本轮桌面共享流程，可移除 `share-select` / `screen-sharing` 步骤与 `bankAppVideoShareState` 相关 store 字段，恢复 `BankAppDemoPage` 中 Video connected 的旧 screen share 覆盖控件，并删除新增两张截图资源。
- 如只需替换附件视觉，可直接替换 `openeye-share-selection.png` 和 `video-screen-sharing.png`，无需改流程代码。

当前风险点：

- `openeye-share-selection.png` 为按用户附件视觉生成的演示截图；如后续拿到原始附件文件，可直接覆盖同名资源。
- `video-screen-sharing.png` 当前复用已有客户侧共享截图内容，发布公开环境前仍需确认授权与脱敏口径。

### 2026-05-24 13:04 +08:00 - BankApp Video Connected 图片缓存规避修复

修改页面或文件：

- `public/screenshots/bankapp/video-connected-new.png`
- `src/mock/bankapp.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户反馈 Video connected 没有展示其附件截图。
- 检查发现附件原图已经覆盖到 `video-connected.png`，但页面仍沿用旧文件名，浏览器或 dev server 容易命中同名资源缓存，导致视觉上像没有替换。

修改结果：

- 将用户附件原图复制为 `public/screenshots/bankapp/video-connected-new.png`。
- `bankAppScreenshotSources.videoConnected` 改为 `/screenshots/bankapp/video-connected-new.png`，强制运行时加载新的资源 URL。
- Video `Calling Agent` 继续复用 `/screenshots/bankapp/voice-calling.png`，Voice、Live Chat、WhatsApp 路径未改变。

验证：

- Local image check 通过：`video-connected-new.png` 已打开确认，内容与用户附件一致。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Video Registered 的 `Calling Agent` 加载 `/screenshots/bankapp/voice-calling.png`，`Connected` 加载 `/screenshots/bankapp/video-connected-new.png`。
- Browser smoke check `/`：切回 BankApp Demo 后仍显示 `/screenshots/bankapp/video-connected-new.png`，再下一步进入 `Service Closed` 并加载 `/screenshots/bankapp/service-closed.png`。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚本轮缓存规避修复，可将 `src/mock/bankapp.ts` 的 `videoConnected` 指回 `/screenshots/bankapp/video-connected.png`，并删除 `video-connected-new.png`。
- 如需回滚 Video connected 图片内容，则用上一版截图覆盖当前 `video-connected.png` / `video-connected-new.png`。

当前风险点：

- `video-connected-new.png` 为用户附件原图，发布公开环境前仍需确认授权与可分享性。
- `video-connected.png` 仍保留同一份原图副本，但当前运行时引用新文件名，后续清理资源时需避免误删 `video-connected-new.png`。

### 2026-05-24 12:45 +08:00 - BankApp Video Calling / Connected 截图替换

修改页面或文件：

- `public/screenshots/bankapp/video-connected.png`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求 BankApp Demo 中 Video 渠道第四步 `Calling Agent` 使用 Voice 渠道第四步同一张 calling 截图。
- 用户要求 Video 渠道第五步 `Connected` 使用本轮附件 1 原图。
- 用户明确要求直接使用附件截图，不重新脱敏或前端绘制。

修改结果：

- 已从当前 Codex session 中提取用户本轮 Video connected 附件原图，并覆盖 `public/screenshots/bankapp/video-connected.png`。
- BankApp Demo 的 Video `Calling Agent` 改为直接显示 `bankAppScreenshotSources.voiceCalling`，即复用 `/screenshots/bankapp/voice-calling.png`。
- BankApp Demo 的 Video `Connected` 继续引用 `/screenshots/bankapp/video-connected.png`，该文件已换成本轮用户附件原图。
- Video connected 上既有 screen share 演示控件保持不变；Voice、Live Chat、WhatsApp 路径未改变。

验证：

- Local image check 通过：`video-connected.png` 已打开确认，尺寸为 `750x1624`，内容与用户附件一致。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning，并出现一次插件耗时提示。
- Browser smoke check `/`：BankApp Video Registered 的 `Calling Agent` 加载 `/screenshots/bankapp/voice-calling.png`，`Connected` 加载 `/screenshots/bankapp/video-connected.png`。
- Browser smoke check `/`：BankApp Video 在 `Agent Workspace` 步骤激活 `Video Call`；切回 BankApp Demo 后仍显示新的 connected 截图，并可继续到 `Service Closed`。
- Browser smoke check `/`：BankApp Video Guest 仍保留 `Input Phone Number` 分支，后续 Calling / Connected 使用指定截图。
- Browser smoke check `/`：BankApp Voice 和 Chat 路径截图引用未回归。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 如需回滚 Video connected 图片，可用上一版 `public/screenshots/bankapp/video-connected.png` 覆盖当前文件。
- 如需恢复 Video `Calling Agent` 前端绘制，可移除 `BankAppDemoPage.tsx` 中 `contactMethod === 'video'` 的 calling 图片分支，并从 `isScreenshotStep` 中移除 Video calling 条件。

当前风险点：

- Video connected 图为用户附件原图，发布公开环境前仍需确认授权与可分享性。
- Video connected 仍保留既有 screen share 演示控件；如果客户要求纯截图无叠加控件，需另行移除或调整该控件。

### 2026-05-24 02:42 +08:00 - BankApp Voice Calling / Connected 截图替换

修改页面或文件：

- `public/screenshots/bankapp/voice-calling.png`
- `public/screenshots/bankapp/voice-connected.png`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求 BankApp Demo 中 Voice 渠道的第四步 `Calling Agent` 使用附件 1，第五步 `Connected` 使用附件 2。
- 用户明确要求直接使用附件截图，不重新脱敏或前端绘制。

修改结果：

- 已从当前 Codex session 中提取两张用户附件原图，并落盘为 `voice-calling.png` 与 `voice-connected.png`。
- `bankAppScreenshotSources` 新增 `voiceCalling` / `voiceConnected`。
- BankApp Demo 的 Voice `Calling Agent` / `Connected` / Voice `Agent Workspace` 返回状态改为直接展示这两张截图。
- Video 的 `Calling Agent`、Video `Connected`、Live Chat 路径、坐席工作台跳转与返回保活逻辑未改变。

验证：

- Local image check 通过：两张 Voice 图片均已打开确认，尺寸为 `747x1624`，内容与用户附件一致。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Voice Registered 的 `Calling Agent` 加载 `/screenshots/bankapp/voice-calling.png`，`Connected` 加载 `/screenshots/bankapp/voice-connected.png`。
- Browser smoke check `/`：BankApp Voice 在 `Agent Workspace` 步骤激活 `PSTN / Voice Call`；切回 BankApp Demo 后仍显示新的 connected 截图，并可继续到 `Service Closed`。
- Browser smoke check `/`：BankApp Voice Guest 仍保留 `Input Phone Number` 分支，后续 Calling / Connected 使用新截图。
- Browser smoke check `/`：BankApp Video 和 Chat 路径截图引用未回归。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 删除 `voice-calling.png` / `voice-connected.png` 并恢复 `BankAppDemoPage.tsx` 中 Voice `Calling Agent` / `Connected` 的前端绘制分支即可。
- 同时移除 `bankAppScreenshotSources.voiceCalling` / `voiceConnected` 配置。

当前风险点：

- 两张 Voice 通话图为用户附件原图，发布公开环境前仍需确认授权与可分享性。

### 2026-05-24 01:50 +08:00 - WhatsApp Demo Channel 显示文案改为 chat

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户在浏览器评论中标注 WhatsApp Demo 右侧 AICC Process 的只读 Channel 值，要求文字从 `WhatsApp` 改为 `chat`。

修改结果：

- WhatsApp Demo 右侧只读 Channel 控件显示值改为小写 `chat`。
- 本次只改右侧控件展示，不改变 WhatsApp Demo tab、左侧菜单、截图资源、Live Chat 会话渠道或坐席侧 WhatsApp 客户资料。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：WhatsApp Demo 右侧只读 Channel 显示为 `chat`，未再出现 `Channel: WhatsApp`。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 将 `BankAppDemoPage.tsx` 中 WhatsApp 只读 Channel 文案从 `chat` 改回 `WhatsApp` 即可。

当前风险点：

- 无已知技术风险；仅需浏览器复查该控件文案。

### 2026-05-24 01:44 +08:00 - BankApp / WhatsApp Demo 顶部信息减负

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户反馈统一画布顶部元素仍偏多，要求 BankApp Demo 和 WhatsApp Demo 一起去除顶部 `Customer Access Demo` 整块。
- 用户要求去除手机图片区域右上角的当前步骤说明和 `Bank1` / `Netinfo` badge，因为右侧 AICC Process 已经显示当前步骤。

修改结果：

- 删除 `bankapp-demo__canvas-header` DOM，不再显示跨列 `Customer Access Demo` 顶部标题条。
- 手机区标题行只保留 `Customer BankApp` / `Customer WhatsApp`，不再显示当前步骤名称和开发方 badge。
- `bankapp-demo__stage` 改为单内容行网格，继续保留统一外框、背景、阴影和左右浅分隔线。
- 右侧 AICC Process 继续负责当前步骤、开发方 badge、Next/Reset 和 Completed 终态表达；流程逻辑、store、mock 和类型未修改。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Demo 无顶部 `Customer Access Demo`，手机区右上角不再显示步骤名称或 badge；Channel / Customer Type 切换正常。
- Browser smoke check `/`：WhatsApp Demo 无顶部 `Customer Access Demo`，手机区右上角不再显示步骤名称或 badge；切到 Live Chat 后返回保活，并可进入禁用 `Completed` 终态。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 可恢复 `BankAppDemoPage.tsx` 中的 `bankapp-demo__canvas-header` 和手机标题行右侧 `bankapp-step-title`，并恢复 `index.less` 中相关样式与双行 grid 设置。

当前风险点：

- 仍需在目标演示分辨率下复查顶部信息减负后的留白和手机高度是否符合领导观感。

### 2026-05-24 01:24 +08:00 - BankApp / WhatsApp Demo 统一画布布局

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户反馈领导认为原“左手机面板 + 右 AICC Process 面板”的视觉关系过于分离，要求改为一个统一大画布，让 AICC Process 内容放在 App 图片旁边并被感知为同一个客户接入演示内容。

修改结果：

- `bankapp-demo__stage` 改为统一画布容器，承载整体边框、圆角、背景、阴影和跨两列标题条。
- `bankapp-demo__phone-panel` 与 `bankapp-process` 去除独立卡片边框和背景，改为同一画布内的 App Preview 区与 AICC Process 区。
- 手机区与流程区之间改为浅分隔线；画布最大宽度和左侧预览列已收紧，降低宽屏下 App 与 Process 的距离。
- BankApp 与 WhatsApp 共用该布局，保留现有流程状态、Channel / Customer Type 控件、Completed 结束态、`Bank1` / `Netinfo` badge 和截图资源。
- 窄屏下保持同一大容器内上下排列，AICC Process 通过顶部浅分隔线接续手机区。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Demo 手机和 AICC Process 位于同一个统一画布内；Channel / Customer Type 仍可选中，`aria-pressed` 状态正确。
- Browser smoke check `/`：WhatsApp Demo 使用同一统一画布布局；第三步切到 Live Chat 后返回 WhatsApp Demo 保持 `View Agent Workspace`，再下一步进入禁用 `Completed` 终态。
- Browser smoke check `/design-system`：页面正常加载。

回滚说明：

- 可回滚 `BankAppDemoPage.tsx` 中新增的 `bankapp-demo__canvas-header`，并恢复 `index.less` 中 `bankapp-demo__stage`、`bankapp-demo__phone-panel`、`bankapp-process` 的独立卡片样式。

当前风险点：

- 仍需在领导实际演示屏幕分辨率下复查统一画布的最大宽度、左右距离和手机截图裁切感。

### 2026-05-24 01:08 +08:00 - BankApp 分段控件 hover / selected 状态修复

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 用户反馈 BankApp Demo 的渠道选择和客户类型选择控件在选中 Video / Chat 时，鼠标悬浮或选中视觉可能让 Voice 看起来也有悬浮效果。

修改结果：

- `SegmentedControl` 从 `<label>` 包裹多个 `<button>` 改为 `role="group"` 容器，避免浏览器将多个按钮错误关联到同一个 label。
- 分段按钮增加 `aria-pressed`，当前选中项由 pressed 状态表达。
- hover / focus 和 selected 样式拆分：hover 使用中性浅色，selected 才使用蓝色选中态。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Channel / Customer Type 按钮名称独立，不再串联成一组长名称。
- Browser smoke check `/`：点击 Video 后只有 Video 为 `[pressed]`；点击 Chat 后只有 Chat 为 `[pressed]`，Voice 不会被错误标记。

回滚说明：

- 可将 `SegmentedControl` 恢复为原 `<label>` 包裹结构，并恢复 hover / selected 共用样式，但不建议回滚。

当前风险点：

- 本轮只修复分段控件交互与视觉状态，仍需在目标演示分辨率下做最终目视确认。

### 2026-05-24 00:58 +08:00 - BankApp / WhatsApp Demo 右侧流程区优化

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求 BankApp Demo 和 WhatsApp Demo 右侧渠道、客户类型和操作按钮放在同一行。
- 用户要求流程最后一步走完后体现流程结束，避免 `Next Step` 继续可点。
- 用户指出步骤图标蓝绿状态和 `Bank1` / `Netinfo` 蓝绿 badge 容易混淆，要求优化 step rail 图标样式。
- 用户要求 WhatsApp Demo 第四步 `View Agent Workspace` 的标签从 `Bank1` 改为 `Netinfo`。

修改结果：

- BankApp Demo 右侧控制条同区展示 `Channel`、`Customer Type`、`Next Step / Reset`；`Channel` 为可点击分段控件，切换 Voice / Video / Chat 会重置流程到起点。
- WhatsApp Demo 右侧控制条同区展示只读 `Channel: WhatsApp` 和操作按钮，不显示 `Customer Type`。
- 当流程到达最后一步时，`Next Step` 变为禁用的 `Completed`，`Reset` 继续作为唯一重启入口。
- 步骤 rail 从蓝色/绿色状态图标改为中性编号 marker 和细灰色箭头连接；当前步骤用边框、轻背景和字重强调。
- `getStepOwner()` 增加 WhatsApp 第四步例外：`agent-workspace` 返回 `Netinfo`，其它 WhatsApp 步骤保持 `Bank1`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Demo 右侧同区显示 Channel、Customer Type、Next/Reset；右侧 Channel 切换到 Video 后流程重置到 `Choose Channel`。
- Browser smoke check `/`：BankApp Demo 最后一步显示禁用 `Completed`，`Reset` 仍可见；流程 rail 显示中性编号 marker。
- Browser smoke check `/`：WhatsApp Demo 右侧只显示 `Channel: WhatsApp` 和操作按钮，不显示 `Customer Type`。
- Browser smoke check `/`：WhatsApp Demo 第四步 `View Agent Workspace` 显示 `Netinfo` badge。
- Browser smoke check `/`：WhatsApp Demo 最后一步显示禁用 `Completed`。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System` 可见。

回滚说明：

- 可恢复 `BankAppDemoPage.tsx` 中右侧控制区为原 `Customer Type + 操作按钮` 与单独 Channel summary。
- 可恢复 `Next Step` 始终可点击并保持最后一步不变的旧逻辑。
- 可恢复 step rail 使用 `CheckCircleOutlined` / `ClockCircleOutlined` 与蓝绿状态色。
- 可移除 WhatsApp `agent-workspace` 的 `Netinfo` 例外，使 WhatsApp 全步骤回到 `Bank1`。

当前风险点：

- 右侧控制条在目标演示分辨率下仍需人工复查是否保持一行可读；极窄视口允许换行以避免文字溢出。
- 本轮浏览器验证为手工 smoke check，项目仍没有自动化浏览器测试体系。

### 2026-05-24 00:10 +08:00 - BankApp Demo 同步坐席工作台步骤与渐进流程 rail

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求把 WhatsApp Demo 的策略同步到 BankApp Demo 操作上。
- BankApp Voice、Video、Live Chat 都需要在客户侧接通/聊天后新增“查看坐席工作台”步骤。
- 从坐席工作台切回 BankApp Demo 时不能刷新页面内容，因为还要继续点击下一步进入服务结束。
- BankApp 的流程步骤也需要只显示当前已经到达的步骤，后续步骤点击下一步后再显示。

修改结果：

- BankApp Live Chat 流程调整为 `channel -> personal-info? -> business -> confirm -> calling -> chat -> agent-workspace -> closed`。
- BankApp Voice / Video 流程调整为 `channel -> phone-number? -> business -> confirm -> calling -> connected -> agent-workspace -> closed`。
- `agent-workspace` 步骤沿用 BankApp 现有开发责任口径显示 `Netinfo`；`Customer Type` 保持不变。
- `requestBankAppVoiceCall(activate?)` / `requestBankAppVideoCall(activate?)` 新增激活参数，并由 `BasicLayout` 传递给真实 voice/video workspace 打开逻辑。
- `AgentWorkspace` 中 BankApp Demo tab 改为保持挂载，切到坐席工作台后再切回不会重置本地步骤状态。
- BankApp Demo 的 AICC Process rail 改为只渲染已到达步骤，后续步骤不会提前显示。
- BankApp Voice 在 `Connected` 后点击 `Next Step` 会进入 `Agent Workspace` 并激活 `PSTN / Voice Call`；Video 激活 `Video Call`；Live Chat 激活 `Live Chat` 并聚焦 BankApp 客户。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Voice Registered 路径进入 `PSTN / Voice Call`，切回 BankApp Demo 后保持 `Agent Workspace`，再下一步进入 `Service Closed`。
- Browser smoke check `/`：BankApp Voice Guest 仍保留 `Input Phone Number` 分支，流程 rail 渐进显示。
- Browser smoke check `/`：BankApp Video 路径进入 `Video Call`，切回后保持 `Agent Workspace` 并保留视频接通画面，再下一步进入 `Service Closed`。
- Browser smoke check `/`：BankApp Live Chat 路径进入 `Live Chat` 并聚焦 BankApp 客户，切回后保持 `Agent Workspace`，再下一步进入 `Service Closed`。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System` 可见。

回滚说明：

- 可从 BankApp 的 `getStepSequence()` 中移除 `agent-workspace`，并恢复 handoff 步骤直接进入 `closed`。
- 可恢复 `AgentWorkspace.tsx` 中 BankApp Demo tab 只在激活时渲染的逻辑，但会重新引入切出后状态重置行为。
- 可恢复 `requestBankAppVoiceCall()` / `requestBankAppVideoCall()` 为无参数 request id，并在 `BasicLayout` 固定以后台方式打开 voice/video workspace。

当前风险点：

- BankApp Voice / Video 触发仍依赖坐席处于 `Ready` 且当前话务为 `Idle`；如果坐席未签入、未 Ready 或已有通话，客户侧会进入 `Agent Workspace`，但坐席侧不会打开新通话。
- 本轮浏览器验证为手工 smoke check，项目仍没有自动化浏览器测试体系。

### 2026-05-23 23:54 +08:00 - WhatsApp Demo 坐席工作台步骤与渐进流程 rail

修改页面或文件：

- `src/types/bankapp.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求在 WhatsApp Demo 第三步后新增一步查看坐席工作台。
- 新增步骤需要跳转到 `Live Chat` 来电弹屏页面，并且接入渠道是 WhatsApp。
- 用户要求从 Live Chat 切回 WhatsApp Demo 时页面内容不刷新，因为还要继续点击下一步进入服务结束。
- 用户要求流程步骤文字的后续步骤不要提前显示，点击下一步时再显示当前步骤。

修改结果：

- `BankAppDemoStep` 新增 `agent-workspace`。
- WhatsApp Demo 流程从 4 步改为 5 步：`channel -> business -> chat -> agent-workspace -> closed`。
- WhatsApp Demo 在 `Queue & Agent Chat` 后点击 `Next Step` 会进入 `View Agent Workspace` 并激活 `Live Chat` tab，聚焦 WhatsApp 会话 `live-chat-001`。
- `AgentWorkspace` 中 WhatsApp Demo tab 改为保持挂载，切到 Live Chat 后再切回不会重置 WhatsApp Demo 本地步骤状态。
- WhatsApp Demo 的 AICC Process rail 只渲染已到达步骤，后续步骤在点击 `Next Step` 后才显示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：初始只显示 `Request Human Agent`，不提前显示后续步骤。
- Browser smoke check `/`：点击下一步后才依次显示 `Business Selection`、`Queue & Agent Chat`、`View Agent Workspace`、`Satisfaction Rating`。
- Browser smoke check `/`：第三步后点击下一步会切到 `Live Chat` tab，并可见 WhatsApp 客户会话。
- Browser smoke check `/`：切回 `WhatsApp Demo` 后仍停留在 `View Agent Workspace`，未刷新回第一步；再点下一步进入满意度评价。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System` 可见。

回滚说明：

- 可从 `BankAppDemoStep` 移除 `agent-workspace`，恢复 WhatsApp sequence 为 `channel -> business -> chat -> closed`。
- 可恢复 `AgentWorkspace.tsx` 中 WhatsApp Demo tab 只在激活时渲染的逻辑，但会重新引入切出后状态重置行为。
- 可恢复 `BankAppDemoPage.tsx` 中 WhatsApp rail 渲染完整 `currentSequence` 的逻辑。

当前风险点：

- Live Chat 仍为静态前端 demo，不接真实 WhatsApp 网关。
- WhatsApp Demo tab 保持挂载是为保留演示步骤状态；如后续新增重型资源，需要复查内存和 inactive tab 行为。

### 2026-05-23 23:11 +08:00 - WhatsApp Demo 四步截图流程

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/styles/index.less`
- `public/screenshots/whatsapp/chat-request.png`
- `public/screenshots/whatsapp/business-selection.png`
- `public/screenshots/whatsapp/agent-chat.png`
- `public/screenshots/whatsapp/satisfaction-rating.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求 WhatsApp 接入的 WhatsApp Demo 去除 `Customer Type`。
- 用户要求流程改为 4 步：进入客服聊天页面并要求转坐席、业务选择、排队并接入坐席沟通、服务结束满意度评价。
- 用户要求步骤流程每一步标签都是 `Bank1`。
- 用户提供的 4 张截图已经脱敏，要求直接使用附件截图，不重新绘制。

修改结果：

- 从当前 Codex session 中提取用户本轮 4 张脱敏附件，落盘到 `public/screenshots/whatsapp/`。
- `src/mock/bankapp.ts` 新增 `whatsAppScreenshotSources`，WhatsApp Demo 不再复用 BankApp livechat 图片。
- `BankAppDemoPage` 在 `variant="whatsapp"` 时使用独立四步 sequence：`channel -> business -> chat -> closed`。
- WhatsApp Demo 的 AICC Process 控制区隐藏 `Customer Type`，只保留 `Next Step` 和 `Reset`。
- WhatsApp Demo 手机当前步骤标题与右侧流程 rail 每一步都显示 `Bank1` badge。
- WhatsApp Demo 的 `Queue & Agent Chat` 后继续后台打开 Live Chat 并聚焦 WhatsApp 会话 `live-chat-001`，同时保持 WhatsApp Demo 展示满意度评价终态。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：`Channel Simulation > WhatsApp` 可打开 `WhatsApp Demo` tab。
- Browser smoke check `/`：WhatsApp Demo 不再出现 `Customer Type`。
- Browser smoke check `/`：四步流程和每步 `Bank1` badge 可见。
- Browser smoke check `/`：四步分别引用 WhatsApp 专用截图资源。
- Browser smoke check `/`：进入满意度评价终态时后台出现 `Live Chat` tab。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System` 可见。

回滚说明：

- 可删除 `public/screenshots/whatsapp/` 四张图片，并移除 `whatsAppScreenshotSources`。
- 可恢复 `BankAppDemoPage.tsx` 中 WhatsApp variant 继续复用 BankApp livechat sequence 和 Customer Type 控制。
- 可删除 `src/styles/index.less` 中 `.bankapp-demo--whatsapp`、`.bankapp-whatsapp-hotspot*` 和 `.bankapp-process__controls--actions-only` 相关样式。

当前风险点：

- WhatsApp 截图是静态演示资源，不接真实 WhatsApp 消息网关。
- 发布公开环境前仍需确认 4 张用户附件截图的授权和脱敏口径。
- 当前项目仍没有自动化浏览器测试体系，本轮依赖 lint/build 和手工 Browser smoke check。

### 2026-05-23 19:40 +08:00 - GitHub Actions CI

修改页面或文件：

- `.github/workflows/ci.yml`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 计划要求每个里程碑 PR 至少通过 `npm ci`、`npm run lint`、`npm run build`，防止未构建通过的代码合入 `main`。

修改结果：

- 新增 GitHub Actions `CI` workflow。
- PR 到 `main` 时运行 CI。
- push 到 `main` 或 `codex/**` 分支时运行 CI。

回滚说明：

- 如需取消 CI，可删除 `.github/workflows/ci.yml`。

当前风险点：

- 本地已通过 lint/build；远端 CI 还需要在 push 后由 GitHub Actions 实际执行。

### 2026-05-23 19:39 +08:00 - v0.4.0 Video screen share demo

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 用户后续需要调整 Video Call 和 BankApp demo 视频通话功能中的桌面共享功能。
- 计划要求先做 demo-only screen share 状态，让 BankApp Video 客户侧和坐席侧 Video Call/OpenEye 展示同步。

修改结果：

- `appStore` 新增 `isScreenShareActive` 和 `setScreenShareActive()`。
- BankApp Video connected 画面新增 `Screen share` 控制，可 Start/Stop 桌面共享。
- BankApp Video handoff 到坐席侧时保留当前共享状态，OpenEye 浮窗显示 `Screen Share Active` 桌面预览层。
- 普通新视频呼叫、Hang Up、关闭 Video Call tab、Reset BankApp/WhatsApp Demo、Unsigned/AUX 状态切换都会清理共享状态。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 可删除 `appStore` 中 screen share 状态和相关 reset 逻辑。
- 可移除 `BankAppDemoPage.tsx` 的 screen share 控制和 `OpenEyeVideoWindow.tsx` 的共享预览层。
- 同时删除 `src/styles/index.less` 中 `.bankapp-screen-share-control` 与 `.openeye-video-window__screen-share*` 相关样式。

当前风险点：

- 当前只是前端演示状态，不接真实桌面共享协议、权限请求或媒体流。
- BankApp Video connected 图片仍是背景截图，共享控制为叠加演示控件；如客户要求完全还原真实 APP，需要后续替换为真实设计稿。

### 2026-05-23 19:36 +08:00 - v0.3.1 菜单重组与 WhatsApp 模拟入口

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/whatsapp/*`
- `src/store/appStore.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 用户要求左侧菜单调整为 `Channel Simulation > PSTN / BankApp / WhatsApp`。
- `PSTN / Voice Call` 可见文案需要改为 `PSTN`。
- `Video Call` 和 `Live Chat` 需要从可见菜单移除，但保留底层能力。
- 需要新增 WhatsApp 客户接入模拟界面，初版可复制 BankApp Demo 弹屏流程。

修改结果：

- 左侧可见菜单已移除 `Customer Simulator` 分组，`BankApp` 移到 `Channel Simulation` 下，位于 `PSTN` 下方。
- `Video Call` 与 `Live Chat` 不再作为左侧可见菜单项出现；BankApp Video 和固定 Live Chat 工作台底层逻辑保留。
- 新增 `WhatsApp Demo` workspace tab 与 store open/close/request 方法。
- `WhatsApp Demo` 复用 BankApp 客户侧流程壳，默认 Live Chat 渠道并在 handoff 时聚焦现有 WhatsApp mock 会话 `live-chat-001`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 可恢复 `BasicLayout.tsx` 中旧菜单配置，并删除 `src/pages/whatsapp/` 与 store 中 WhatsApp demo tab 状态。
- `BankAppDemoPage.tsx` 的 `variant` 支持可保留，不影响 BankApp 默认行为。

当前风险点：

- WhatsApp Demo 初版复用 BankApp 截图壳，仅作为入口和流程模拟；后续仍需按 WhatsApp 真实客户界面细化。
- 左侧菜单隐藏 Video Call / Live Chat 后，普通 Video Call 入口只能通过内部流程或后续调试入口触发。

### 2026-05-23 19:33 +08:00 - BankApp 基线版本与素材风险清理

修改页面或文件：

- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `public/screenshots/bankapp/`

修改原因：

- 用户确认采用里程碑分支、`main` 直发演示和仅保留脱敏/可分享素材的版本策略。
- 当前 BankApp Demo 已较完整，需要先形成可回滚的 `v0.3.0` 基线，再继续菜单、WhatsApp 和桌面共享工作。

修改结果：

- 已在当前 `main` 提交上创建 `v0.2.0` tag，作为旧稳定基线回滚点。
- 已将明显未脱敏或旧版原始截图 `channel-selection.png`、`voice-phone-number.png`、`text-login.png`、`voice-skill-selection-en.png`、`voice-skill-confirm-en.png` 迁出仓库目录，避免误提交。
- `public/screenshots/bankapp/` 仅保留当前代码引用的脱敏图和演示必需图；`video-connected.png`、`livechat-queue.png`、`livechat-chat.png`、`service-closed.png` 仍需发布前确认可分享性。

回滚说明：

- 如需恢复迁出的原始截图，可从本机私有目录 `D:\03projects\bca-aicc-demo-v2-private-assets\` 找回对应 `bankapp-raw-*` 备份。
- 删除 `v0.2.0` tag 可使用 `git tag -d v0.2.0`，但不建议在已推送后删除。

当前风险点：

- `v0.3.0` 基线提交后仍需合入 `main` 并打 tag，才能作为远程演示的新稳定版本。
- 部分保留演示图来自用户附件，推送公开或客户外部分发前仍需确认授权和脱敏口径。

### 2026-05-23 19:03 +08:00 - BankApp 步骤开发方标识

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求在所有 BankApp 演示步骤后增加开发方标识，让客户能清楚区分哪些页面由 BANK1 开发，哪些页面由 Netinfo 开发。
- `Choose Channel`、`Input Phone Number`、`Personal Information`、`Service Closed` 需要显示 `BANK1`。
- 其它步骤需要显示 `Netinfo`。

修改结果：

- 新增步骤归属判断，`channel`、`phone-number`、`personal-info`、`closed` 显示 `BANK1`，其余步骤显示 `Netinfo`。
- BankApp 手机当前步骤标题和右侧 AICC Process rail 的每个步骤名后都显示对应开发方 badge。
- 新增 badge 样式：`BANK1` 使用 BANK 1 主蓝，`Netinfo` 使用绿色，保持轻量不抢主流程。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：Registered Voice 流程中 `Choose Channel` / `Service Closed` 显示 `BANK1`，其它流程步骤显示 `Netinfo`。
- Browser check `/` 通过：Guest Voice 流程中 `Input Phone Number` 显示 `BANK1`。
- Browser check `/` 通过：Guest Live Chat 流程中 `Personal Information` 显示 `BANK1`。
- Browser check `/design-system` 通过，`UI Design System` 页面正常加载。

回滚说明：

- 如需回滚本轮，可移除 `BankAppDemoPage.tsx` 中 `bankOwnedSteps`、`getStepOwner()` 和 `bankapp-step-owner` 渲染，恢复步骤标题只显示文案。
- 同时删除 `src/styles/index.less` 中 `.bankapp-step-owner*` 相关样式。

当前风险点：

- 这些标识是演示口径，不改变真实系统责任边界或后端集成关系。
- 若后续客户确认某个步骤开发归属不同，只需调整 `bankOwnedSteps` 集合。

### 2026-05-23 18:38 +08:00 - BankApp Video Connected 原图替换

修改页面或文件：

- `public/screenshots/bankapp/video-connected.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户明确要求视频通话界面直接使用本轮附件截图原图，不允许绘制，也不需要脱敏处理。
- 之前 `video-connected.png` 不是用户本轮提供的原图，需要直接替换。

修改结果：

- 已将 `public/screenshots/bankapp/video-connected.png` 覆盖为用户本轮提供的视频通话截图原图。
- BankApp Demo 已有代码路径继续引用同一个 `videoConnected` 图片地址，因此无需修改组件逻辑。
- 本轮只替换视频通话客户侧 connected 图片，不修改其它页面和交互。

验证：

- Local image check 通过：`video-connected.png` 已打开确认，内容为用户本轮提供的视频通话截图。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：BankApp Video 进入 `Connected` 后显示 `img[alt="BankApp connected video call"][src*="video-connected.png"]`，且仍停留在 BankApp Demo。
- Browser check `/design-system` 通过，`UI Design System` 页面正常加载。

回滚说明：

- 如需回滚本轮，可用上一版 `public/screenshots/bankapp/video-connected.png` 覆盖当前文件，或替换为新的客户截图原图。
- 组件仍通过 `src/mock/bankapp.ts` 的 `videoConnected` 路径引用该文件。

当前风险点：

- 该图片是静态客户侧演示资产，不接真实视频协议或真实通话状态。
- 图片原图大小较上一版明显增加，当前不影响构建；如后续部署体积受限再考虑压缩，但不能改变内容。

### 2026-05-23 18:12 +08:00 - BankApp 附件原图接入与 Service Closed 闭环修复

修改页面或文件：

- `public/screenshots/bankapp/livechat-queue.png`
- `public/screenshots/bankapp/livechat-chat.png`
- `public/screenshots/bankapp/service-closed.png`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户明确要求文字渠道排队页和聊天页直接使用已处理附件原图，不允许前端重新绘制。
- 用户补充三渠道最后一步 `Service Closed` 要使用新提供的满意度评价截图，且语音、视频、文字都能进入该最后一步。
- 之前 `Connected` / `Chat Page` 后触发坐席工作台会直接切走当前 tab，导致 BankApp 手机端最后一步无法展示。

修改结果：

- 已将 `livechat-queue.png`、`livechat-chat.png` 替换为用户附件原图，BankApp Demo 的文字排队和聊天页面直接显示图片，不再绘制、不再脱敏处理。
- 新增 `service-closed.png`，并在 Voice / Video / Live Chat 三条路径的 `Service Closed` 步骤统一显示用户提供的满意度评价截图。
- `requestInboundPopup`、`requestVideoCallPopup`、`requestLiveChatWorkspace` 增加 `activate` 参数；BankApp 演示触发坐席电话、视频、文字页时后台打开对应 workspace tab，但保持 BankApp Demo 当前激活页继续展示客户侧满意度评价。
- 修复 `Next Step` 从 Voice/Video `Connected` 或 Live Chat `Chat Page` 到 `Service Closed` 没有反应的问题。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：Livechat `Connecting to Agent` 加载 `/screenshots/bankapp/livechat-queue.png`。
- Browser check `/` 通过：Livechat `Chat Page` 加载 `/screenshots/bankapp/livechat-chat.png`。
- Browser check `/` 通过：Voice / Video / Livechat 均可通过 `Next Step` 到达 `/screenshots/bankapp/service-closed.png`。
- Browser check `/` 通过：触发 BankApp voice/video/livechat 坐席页时，当前仍停留在 BankApp Demo 以展示 Service Closed。
- Browser check `/design-system` 通过，`UI Design System` 页面正常加载。

回滚说明：

- 如需回滚本轮，可恢复 `BankAppDemoPage.tsx` 中 Live Chat 排队/聊天和 `Service Closed` 的组件化渲染，移除 `src/mock/bankapp.ts` 中 `serviceClosed` 路径。
- 如需恢复坐席页触发后立即切换 workspace，可把 `requestInboundPopup`、`requestVideoCallPopup`、`requestLiveChatWorkspace` 的 `activate` 参数调用恢复为默认激活，并移除相关后台打开逻辑。
- 三张图片资源可保留在 `public/screenshots/bankapp/` 作为素材备份。

当前风险点：

- 三张直接引用的图片是静态客户侧演示资产，不接真实消息网关、语音/视频协议或满意度评价接口。
- BankApp 演示触发坐席页后保持当前 BankApp Demo 激活，是为了完整展示客户侧闭环；如果演示口径改为“立即切到坐席端”，需要再调整 `activate` 行为。

### 2026-05-23 17:47 +08:00 - BankApp Live Chat 排队与聊天截图接入

修改页面或文件：

- `public/screenshots/bankapp/livechat-queue.png`
- `public/screenshots/bankapp/livechat-chat.png`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求文字渠道的排队页使用附件截图 1，文字渠道的聊天页使用附件截图 2。
- 用户说明这两张图已经处理过，可以直接使用，不需要再次脱敏。

修改结果：

- BankApp Live Chat 的 `Connecting to Agent` / 排队步骤改为显示 `livechat-queue.png` 图片资源。
- BankApp Live Chat 的 `Chat Page` 步骤改为显示 `livechat-chat.png` 图片资源。
- `src/mock/bankapp.ts` 新增 `textQueue` / `textChat` 截图路径配置，`BankAppDemoPage` 只在 Live Chat 对应步骤引用这两张图。
- 语音、视频、坐席 Live Chat 工作台、Inbound、Design System 等其它界面逻辑未改。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：BankApp Livechat 进入 `Connecting to Agent` 后加载 `/screenshots/bankapp/livechat-queue.png`。
- Browser check `/` 通过：点击 `Next Step` 进入 `Chat Page` 后加载 `/screenshots/bankapp/livechat-chat.png`。
- Browser check `/design-system` 通过，`UI Design System` 页面正常加载。

回滚说明：

- 如需回滚本轮，可恢复 `BankAppDemoPage.tsx` 中 Live Chat 排队和聊天页面的组件化实现，并移除 `src/mock/bankapp.ts` 中 `textQueue` / `textChat` 路径。
- 两张图片资源可保留在 `public/screenshots/bankapp/` 作为素材备份，不会影响其它页面。

当前风险点：

- 这两张图片当前只用于 BankApp Demo 客户侧手机，不接真实消息网关，也不会改变坐席端 Live Chat Conversation 的静态 mock 数据。
- 如果后续需要替换为客户提供的原始文件，只需保持图片比例一致并替换 `livechat-queue.png` / `livechat-chat.png`。

### 2026-05-23 16:49 +08:00 - BankApp 渠道标识与 Live Chat 条件步骤修正

修改页面或文件：

- `src/types/inbound.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/mock/inbound.ts`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `public/screenshots/bankapp/channel-selection-sanitized.png`
- `public/screenshots/bankapp/video-connected.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求 BankApp voice/video 转坐席后，Customer Information 的渠道图标和文字都显示为 BankApp。
- 用户要求 Video Call 的客户侧通话界面使用附件风格截图资源。
- 用户要求 Live Chat 只有 Guest 才需要 Personal Information，Registered Customer 跳过该步骤。
- 用户要求渠道选择图中 `Voice Call`、`Video Call`、`Live Chat` 字体放大，便于演示观看。

修改结果：

- 新增 `BankApp` 和 `Video` 渠道类型；BankApp voice/video 客户资料使用 `BankApp` 渠道，`ChannelTag` 使用移动端 BankApp 图标并显示 `BankApp`。
- 为 Video Call 弹屏增加 `standard | bankapp-video` 来源；只有 BankApp Video 路径显示 BankApp 渠道，普通 `Channel Simulation > Video Call` 仍显示 `Video Call`。
- Live Chat 路径按客户身份动态生成步骤：Registered Customer 直接进入 `Select Business`，Guest 才显示 `Personal Information`。
- Video connected 步骤引用 `public/screenshots/bankapp/video-connected.png`。
- `channel-selection-sanitized.png` 中三条渠道入口文字已放大，保留原图尺寸和热区稳定性。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：Registered Live Chat 直接进入业务选择，Guest Live Chat 进入个人信息录入。
- Browser check `/` 通过：Video connected 步骤加载 `/screenshots/bankapp/video-connected.png`。
- Browser check `/` 通过：BankApp Voice 坐席弹屏 Customer Information 显示 `mobile BankApp`。
- Browser check `/` 通过：BankApp Video 坐席弹屏 Customer Information 显示 `mobile BankApp`。
- Browser check `/` 通过：普通 `Channel Simulation > Video Call` 显示 `video-camera Video Call`，不受 BankApp Video 来源影响。
- Browser check `/design-system` 通过，`UI Design System` 页面正常加载。

回滚说明：

- 如需回滚 BankApp 渠道显示，可恢复 `bankAppVoiceCustomer` / `bankAppVideoCustomer` 的 `accessChannel` 和 `ChannelTag` 对 `BankApp` / `Video` 的处理。
- 如需回滚 Live Chat 条件步骤，可恢复 `getStepSequence()` 中 Livechat 固定包含 `personal-info` 的逻辑。
- 如需回滚视频通话图片，可把 `bankAppScreenshotSources.videoConnected` 指回前端生成页或替换为新的截图资源。

当前风险点：

- `video-connected.png` 当前为项目内视频通话图片资源；如果必须逐像素使用用户附件原图，需要用户把原图落到本地素材目录后替换该文件。
- BankApp voice/video 触发仍要求坐席处于 `Ready` 且当前话务为 `Idle`。

### 2026-05-23 16:01 +08:00 - BankApp 三渠道业务选择与确认截图脱敏

修改页面或文件：

- `public/screenshots/bankapp/voice-business-selection-sanitized.png`
- `public/screenshots/bankapp/video-business-selection-sanitized.png`
- `public/screenshots/bankapp/livechat-business-selection-sanitized.png`
- `public/screenshots/bankapp/voice-business-confirm-sanitized.png`
- `public/screenshots/bankapp/video-business-confirm-sanitized.png`
- `public/screenshots/bankapp/livechat-business-confirm-sanitized.png`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求 Voice、Video、Livechat 三个渠道的 `Select Business` 和 `Confirm Business` 页面都使用客户提供截图，但必须打码脱敏。
- 需要避免继续展示纯前端生成业务页，同时不能暴露客户真实系统品牌、产品名或业务截图细节。

修改结果：

- 基于客户提供的业务选择和确认截图，生成三渠道共六张脱敏图，保持 `1320 x 2868` 手机比例。
- 业务选择页保留原截图的宫格样式，顶部按渠道显示 `Voice Call`、`Video Call`、`Live Chat`，业务名称替换为 BANK 1 通用服务类别。
- 业务确认页使用已脱敏业务选择页作为背景并叠加确认弹窗，避免原截图背景残留客户品牌或产品名。
- `BankAppDemoPage` 的 `business` 和 `confirm` 步骤改为展示脱敏截图。
- 业务选择页保留透明业务热区；点击业务卡片会选中业务并进入确认页。
- 业务确认页保留 No / Yes 透明热区；No 返回业务选择，Yes 进入 `Calling Agent`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：Voice 进入 `voice-business-selection-sanitized.png` 和 `voice-business-confirm-sanitized.png`，确认后进入 `Calling...`。
- Browser check `/` 通过：Video 进入 `video-business-selection-sanitized.png` 和 `video-business-confirm-sanitized.png`。
- Browser check `/` 通过：Livechat 进入 `livechat-business-selection-sanitized.png` 和 `livechat-business-confirm-sanitized.png`。
- Browser check `/design-system` 通过，页面正常加载。

回滚说明：

- 如需回滚本轮，可恢复 `BankAppDemoPage.tsx` 中 `renderBusinessScreen` 和 `renderConfirmScreen` 的组件化实现，删除新增的业务截图路径和热区样式。
- 新增脱敏图片可保留作为素材备份，不影响其它页面。

当前风险点：

- 三渠道业务选择/确认脱敏图当前基于同一组客户业务截图模板生成，只通过渠道标题区分；如客户后续提供专属 Video/Livechat 截图，应替换对应素材。
- 业务热区坐标依赖当前脱敏业务宫格位置；如果图片布局变更，需要重新校验热区。

### 2026-05-23 13:30 +08:00 - BankApp 三张入口截图脱敏

修改页面或文件：

- `public/screenshots/bankapp/channel-selection-sanitized.png`
- `public/screenshots/bankapp/voice-phone-number-sanitized.png`
- `public/screenshots/bankapp/text-login-sanitized.png`
- `src/mock/bankapp.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户要求外网演示时不能看出客户真实系统特征，需要对 BankApp Demo 使用的三张入口截图做脱敏。
- 脱敏范围限定为渠道选择、客户号码录入、客户信息录入三张图，不修改其它界面。
- 需要保留原始截图，新增脱敏图，并只把 BankApp Demo 的引用切到脱敏版本。

修改结果：

- 使用本地图像处理生成三张脱敏 PNG，保持原图尺寸和手机比例。
- 渠道选择页顶部品牌改为 `BANK 1`，只保留 `Voice Call`、`Video Call`、`Live Chat` 三个服务入口清晰可见，其它入口、底部导航和系统特征弱化。
- 号码录入页和客户信息录入页改为 BANK 1 风格脱敏重绘，保留表单/弹窗大概形态，敏感字段以遮挡线展示。
- `src/mock/bankapp.ts` 中 `channel`、`voicePhoneNumber`、`textLogin` 三个入口图路径已切到 `*-sanitized.png`。
- 原始 `channel-selection.png`、`voice-phone-number.png`、`text-login.png` 保留在 `public/screenshots/bankapp/`，不再被 BankApp Demo 页面引用。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：`Customer Simulator > BankApp` 渠道页引用 `channel-selection-sanitized.png`，顶部显示 `BANK 1`。
- Browser check `/` 通过：Video、Livechat、Guest Voice 三个热区仍能进入正确流程。
- Browser check `/` 通过：Guest + Voice 显示 `voice-phone-number-sanitized.png`。
- Browser check `/` 通过：Livechat 显示 `text-login-sanitized.png`。
- Browser check `/design-system` 通过，页面正常加载。

回滚说明：

- 如需回滚本轮脱敏引用，只需把 `src/mock/bankapp.ts` 中三张入口图路径恢复为原始 `channel-selection.png`、`voice-phone-number.png`、`text-login.png`。
- 如需删除脱敏资源，可移除三个 `*-sanitized.png` 文件；原始截图未删除。

当前风险点：

- 脱敏图是确定性重绘/遮挡版本，用于外网演示隐私保护，不是客户原 App 的像素级截图。
- 渠道页热区仍依赖当前脱敏图中三条服务卡片的位置；以后改图需要再次浏览器校验热区。

### 2026-05-23 01:14 +08:00 - BankApp 手机放大与截图页补齐

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户指出手机框仍然太小，需要按截图比例放大并让高度基本撑满。
- 用户指出三个渠道热区位置没有对齐截图中的 Voice Call、Video Call、Live Chat。
- 用户要求渠道选择、客户号码录入、客户信息录入页面都先用客户截图。
- 用户要求 AICC Process 中 Customer Type、Next Step、Reset 放在同一行，Customer Type 不占整行。

修改结果：

- `.bankapp-phone` 改为按左侧面板高度驱动，保留截图比例，手机展示明显放大并接近撑满左侧面板。
- 重新校准 Voice、Video、Livechat 三个透明热区位置，使其覆盖截图中的三条渠道菜单。
- `Input Phone Number` 改为展示 `voice-phone-number.png` 客户截图。
- `Personal Information` 改为展示 `text-login.png` 客户截图。
- `Customer Type` 与 `Next Step` / `Reset` 在 AICC Process 控制区同一行展示，操作按钮靠右。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：手机框放大并按比例显示。
- Browser check `/` 通过：AICC Process 控制区中 Customer Type、Next Step、Reset 同行展示。
- Browser check `/` 通过：Guest + Voice 热区进入 `Input Phone Number` 截图页。
- Browser check `/` 通过：Livechat 热区进入 `Personal Information` 截图页。

回滚说明：

- 如需回滚本轮，恢复 `.bankapp-phone` 的高度设置和 `.bankapp-channel-hotspot-*` 百分比位置，并恢复 `BankAppDemoPage` 中号码录入、个人信息录入的组件化页面。

当前风险点：

- 号码录入和客户信息录入页当前直接展示客户截图；后续如果要改文案或品牌，需要替换截图或重新组件化。
- 渠道热区仍依赖当前截图版式，换图后需重新校准。

### 2026-05-23 00:50 +08:00 - BankApp 浏览器批注调整

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户在浏览器批注中要求删除 BankApp Demo 顶部标题条、去除 Language 控制、去除 AICC 面板中不必要的客户/语言和 Business/Skill/Phone 摘要。
- 用户要求将 `Customer Type` 和 `Next Step` / `Reset` 移入 AICC Process 面板。
- 用户要求渠道选择页面使用已提供截图，并在 Voice/Video/Livechat 三个渠道上使用热区交互。
- 用户指出当前手机比例被压得过宽，需要按截图比例显示。

修改结果：

- 删除 BankApp Demo 页面顶部 `Customer Simulator / BankApp Service Entry` 标题区。
- 去除 `Language` 分段控件，AICC Process header 不再显示 `Registered Customer / EN`。
- `Customer Type` 和 `Next Step` / `Reset` 已移动到 AICC Process 面板内。
- AICC Process summary 去除 `Business`、`Skill`、`Phone`，只保留当前渠道摘要和流程 rail。
- 渠道选择页改为显示 `public/screenshots/bankapp/channel-selection.png`，并覆盖三个透明按钮热区：Voice Call、Video Call、Livechat。
- 手机模拟器尺寸改为固定截图纵横比并用高度驱动，避免在低高度视口中被压扁变宽。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser check `/` 通过：批注要求删除的顶部标题、Language、AICC header 客户/语言、Business/Skill/Phone 摘要均已消失。
- Browser check `/` 通过：Customer Type 和 Next Step / Reset 位于 AICC Process 面板内。
- Browser check `/` 通过：渠道选择页展示客户截图，Video 热区点击后进入 `Select Business`，Guest + Voice 热区点击后进入 `Input Phone Number`。

回滚说明：

- 如需回滚本轮批注调整，恢复 `BankAppDemoPage.tsx` 中原 header、Language 控制、AICC summary 和组件化渠道入口，并恢复 `.bankapp-phone` 的旧宽度驱动样式。

当前风险点：

- 渠道选择页按用户最新批注直接使用客户原始截图，因此该页面会呈现截图内原始品牌视觉；后续如需统一品牌，需要提供已替换品牌的截图或重新组件化绘制。
- 热区位置基于当前 `channel-selection.png` 的版式百分比；如更换截图，需重新校准热区。

### 2026-05-23 00:07 +08:00 - BankApp 演示交互简化重构

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/types/bankapp.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

修改原因：

- 用户确认初版三栏 BankApp demo 过重，需要改为“Customer BankApp 手机主导 + AICC Process rail 联动”的演示舞台。
- 需要支持客户在手机端或通过 `Next Step` 完成 Voice、Video、Livechat 三条接入路径，并用真实坐席 workspace tab 展示最终结果。
- 页面可见命名必须统一为 `BankApp`，接管页面不直接展示带旧品牌字样的截图。

修改结果：

- `BankAppDemoPage` 移除厚重的 `Agent Desktop Outcome` 面板，页面主体改为真实手机比例 `1320 / 2868` 的 Customer BankApp 和轻量 `AICC Process` 竖向 rail。
- 顶部控制简化为 `Customer Type`、`Language`、`Next Step`、`Reset`。
- 新增 `customerType`、`language`、`contactMethod`、`businessType`、`demoStep` 状态；Registered Voice/Video 跳过号码输入，Guest Voice/Video 显示号码输入。
- `Select Business`、`Confirm Business`、Calling、Connected、Chat、Closed 均为前端组件生成，业务技能按 `language + customerType + contactMethod` 动态展示。
- 接管前的渠道选择、游客号码输入、个人信息页也改为组件化模拟页，避免页面直接露出旧截图品牌。
- Voice handoff 触发现有 `PSTN / Voice Call`，Customer Information 显示 `BankApp Voice`。
- Video handoff 触发现有 `Video Call`，Customer Information 显示 `BankApp Video`，接听后 OpenEye 浮窗显示。
- Livechat handoff 打开 `Live Chat / Conversation` 并聚焦 Sari Amelia 的 BankApp 会话。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：`Customer Simulator > BankApp` 可打开 BankApp Demo，顶部控制、手机舞台和 AICC Process rail 正常显示，未出现 `Haloapps` 可见文案。
- Browser smoke check `/` 通过：Registered Voice 跳过 `Input Phone Number`，Guest Voice 显示 `Input Phone Number`。
- Browser smoke check `/` 通过：Voice connected 后点击 `Next Step` 打开 `PSTN / Voice Call`，渠道显示 `BankApp Voice`，自动接听后进入 `Talking`。
- Browser smoke check `/` 通过：Video connected 后点击 `Next Step` 打开 `Video Call`，渠道显示 `BankApp Video`，接通后显示 OpenEye 浮窗。
- Browser smoke check `/` 通过：Livechat 到 `Chat Page` 后点击 `Next Step` 打开 Live Chat，并聚焦 BankApp 客户 Sari Amelia 的 Conversation。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚本轮简化重构，可恢复 `BankAppDemoPage.tsx` 到 2026-05-22 19:52 的三栏 demo 版本，并恢复对应 `.bankapp-*` 样式。
- 如需完全移除 BankApp 演示，还需删除 `src/pages/bankapp/`、`src/mock/bankapp.ts`、`src/types/bankapp.ts`、`public/screenshots/bankapp/`，并恢复 `BasicLayout`、`AgentWorkspace`、`appStore`、`InboundPage`、`LiveChatPage`、`ChannelTag`、`inbound.ts`、`chat.ts`、`index.less` 中的 BankApp 相关改动。

当前风险点：

- BankApp Demo 仍为前端演示闭环，不接真实 BankApp、真实路由服务、消息网关或音视频协议。
- Voice / Video 路径需要坐席处于 `Ready` 且话务 `Idle` 才会触发坐席侧来电；测试时需先 `Sign In`。
- `public/screenshots/bankapp/` 仍保留客户原始截图作为素材备份；当前新页面不直接展示这些截图。

### 2026-05-22 19:52 +08:00 - BankApp 客户侧接入演示

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/store/appStore.ts`
- `src/mock/bankapp.ts`
- `src/mock/inbound.ts`
- `src/types/bankapp.ts`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/styles/index.less`
- `public/screenshots/bankapp/*`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 客户需要单独演示客户从 BankApp 内选择文字、语音、视频联系方式和业务类型，再接入 AICC 坐席的完整服务链路。
- 需要复用现有 Live Chat、Inbound Voice、Video Call 工作台能力，不影响 `main` 客户可见版本。

修改结果：

- 新增 `Customer Simulator > BankApp` 菜单和 `BankApp Demo` 可关闭 tab。
- BankApp Demo 页面采用 Customer BankApp、AICC Routing、Agent Desktop Outcome 三栏布局。
- 已将客户提供的 BankApp/Haloapps 截图复制到 `public/screenshots/bankapp/` 并改为 ASCII 文件名。
- Text Chat 路径可打开 Live Chat 并聚焦 BankApp 客户 Sari Amelia。
- Voice Call 路径通过 store request id 触发现有 Inbound 来电状态机，并以 `BankApp Voice` 渠道展示客户资料。
- Video Call 路径通过 store request id 触发现有 Video Call tab，并复用接听后的 OpenEye 浮窗。
- 页面可见渠道命名统一为 `BankApp` / `BankApp Voice` / `BankApp Video`；Internal Chat mock 中的旧可见文案也改为 `BankApp`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：`Customer Simulator > BankApp` 可打开 `BankApp Demo` tab，且页面未出现 `Haloapps` 可见文案。
- Browser smoke check `/` 通过：Text Chat 路径可打开 Live Chat，并聚焦 BankApp 客户 Sari Amelia 的 Conversation。
- Browser smoke check `/` 通过：Voice Call 路径在坐席 `Ready` / `Idle` 时打开 `PSTN / Voice Call`，Customer Information 显示 `BankApp Voice`。
- Browser smoke check `/` 通过：Video Call 路径在坐席 `Ready` / `Idle` 时打开 `Video Call`，接听后出现 OpenEye 独立视频浮窗。
- Browser smoke check `/` 通过：`Reset Demo` 可恢复 BankApp 手机模拟器到渠道选择初始状态。
- Browser smoke check `/design-system` 通过：页面正常加载，标题为 `BANK 1 AICC Demo`。

回滚说明：

- 如需回滚本轮，删除 `src/pages/bankapp/`、`src/mock/bankapp.ts`、`src/types/bankapp.ts` 和 `public/screenshots/bankapp/`，并恢复 `BasicLayout`、`AgentWorkspace`、`appStore`、`InboundPage`、`LiveChatPage`、`ChannelTag`、`inbound.ts`、`chat.ts`、`index.less` 中的 BankApp demo 相关改动。
- 回滚不应影响已提交的 `codex/live-chat-detail` Live Chat / Conversation 成果。

当前风险点：

- BankApp Demo 当前为前端演示状态，不接真实 BankApp、消息网关、真实语音/视频协议或真实路由服务。
- Voice / Video 路径需要坐席处于 `Ready` 且话务 `Idle` 才会触发坐席侧来电；否则只会停留在客户侧演示状态。
- 视频路径和服务完成评价页为前端模拟，当前没有客户提供的真实截图。

### 2026-05-22 18:55 +08:00 - 话务条 Transfer 换行回归修复与 Conversation Invite 移除

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-22-1855.md`
- `.codex-backup/current-todo-2026-05-22-1855.md`
- `.codex-backup/page-state-2026-05-22-1855.md`

修改原因：

- 用户指出话务条 Transfer 弹框的 `Consult` / `Transfer` / `Conference` 三个按钮被错误换行，之前不应换行。
- 用户要求移除 Conversation 面板右上角的 `Invite` 按钮。

修改结果：

- `TransferModal` 的通用 `rowActions` 移除 wrap 行为，`.aicc-transfer-row-actions` 强制单行显示。
- 话务条 `call` 变体 Action 列宽调整为 `250`，确保 `Consult`、`Transfer`、`Conference` 保持同一行。
- Conversation `conversation` 变体继续使用专用 `Request Transfer` / `Request Conference` + 更多下拉，不受 call 分支修复影响。
- Conversation 顶部移除 `Invite` 按钮和 `UserAddOutlined` 引用，右侧仅保留 `Transfer` 与 End Service 叉号。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：PSTN / Voice Call 接听后打开话务条 Transfer，第一行 `Consult`、`Transfer`、`Conference` 三按钮同一行且无 request 动作。
- Browser smoke check `/` 通过：Conversation header 不再显示 `Invite`，仅保留 `Transfer` 与 End Service。
- Browser smoke check `/` 通过：Conversation Transfer 仍无 `Transfer Number`，仍显示 `Request Conference`，下拉仍为 `Force Transfer` / `Force Conference`。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚本轮，恢复 `rowActions` 的 wrap 参数和 call 变体原 Action 列宽，并在 `ConversationWorkspace` 顶部加回 `Invite` 按钮和 `UserAddOutlined`。
- 不需要回滚 Conversation Transfer Agent 操作收纳或 `TransferModal` 的 `variant` 组件化。

当前风险点：

- Conversation 顶部已无独立 Invite 入口；如果后续需要单独邀请/会议入口，需要重新确定是 header 按钮还是 Transfer 弹框内动作。
- Transfer / Conference 动作仍为前端演示动作，点击后只关闭弹框。

### 2026-05-22 18:49 +08:00 - Conversation Transfer Agent 操作收纳

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-05-22-1849.md`
- `.codex-backup/current-todo-2026-05-22-1849.md`
- `.codex-backup/page-state-2026-05-22-1849.md`

修改原因：

- 用户指出 Conversation Transfer Agent 页签中四个长按钮会换行，导致表格行距过高。
- 用户建议默认只显示申请转移和申请会议，并通过小箭头下拉提供强制转移和强制会议。
- 需要将文字渠道邀请语义与话务条 `Conference` 文案统一。

修改结果：

- `TransferModal` 的 `conversation` 变体新增专用 Agent 行动作：默认显示 `Request Transfer`、`Request Conference` 和更多下箭头。
- 更多菜单使用 Ant Design `Dropdown`，菜单项为 `Force Transfer`、`Force Conference`，点击后仍按演示逻辑关闭弹框。
- 移除 Conversation Agent 行内 `Request Invite` / `Force Invite` 文案，统一使用 `Conference`。
- `Transfer Skill` 页签保持原搜索、表格和 `Transfer` 按钮；话务条 `call` 变体仍保持 `Consult` / `Transfer` / `Conference` 与三页签。
- 新增 `.aicc-transfer-agent-actions` 单行布局和小箭头按钮样式，避免长按钮换行抬高行距。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：Conversation Transfer 弹框无 `Transfer Number`，Agent 行默认显示 `Request Transfer`、`Request Conference` 和下箭头，不再显示 `Request Invite`。
- Browser smoke check `/` 通过：点击下箭头显示 `Force Transfer`、`Force Conference`，点击下拉动作后弹框关闭。
- Browser smoke check `/` 通过：Conversation Transfer Skill tab 可见按钮仍为 `Transfer`。
- Browser smoke check `/` 通过：PSTN / Voice Call 话务条 Transfer 弹框仍保留三页签和原 `Consult` / `Transfer` / `Conference` 动作。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚本轮，只需恢复 `TransferModal` 中 conversation 变体的四按钮 action 数组与 render 逻辑，并移除 `.aicc-transfer-agent-actions` 相关样式。
- 不需要回滚 `TransferModal` 的 `variant` 组件化、Conversation 顶部 Transfer 接入或话务条 Transfer 逻辑。

当前风险点：

- Force 类动作仍为前端演示动作，点击后只关闭弹框，不接真实强制转移或强制会议流程。
- Conversation 顶部 `Invite` 按钮仍保留原英文展示，尚未统一为 `Conference` 或接入会议流程。

### 2026-05-22 18:28 +08:00 - Conversation Transfer 弹框组件化

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1828.md`
- `.codex-backup/current-todo-2026-05-22-1828.md`
- `.codex-backup/page-state-2026-05-22-1828.md`

修改原因：

- 用户要求 Conversation 顶部 `Transfer` 点击后打开 Transfer 弹框。
- 用户要求 Conversation 弹框不显示 `Transfer Number` 页签。
- 用户要求 Conversation 的 `Transfer Agent` 每行显示请求转移、强制转移、请求邀请、强制邀请四类动作；`Transfer Skill` 保持现有内容和 `Transfer` 按钮不变。

修改结果：

- `TransferModal` 增加 `variant?: 'call' | 'conversation'`，默认 `call`，话务条不传参时保持原三页签与原动作。
- `conversation` 变体仅显示 `Transfer Agent` / `Transfer Skill` 两个页签，并隐藏 `Transfer Number`。
- `conversation` 变体的 Agent 行动作改为 `Request Transfer`、`Force Transfer`、`Request Invite`、`Force Invite`；Skill tab 仍沿用原 `Transfer` 动作。
- Conversation 顶部 `Transfer` 按钮接入 `TransferModal variant="conversation"`；顶部 `Invite` 本轮仍为展示按钮。
- 增加 Transfer 行动作换行样式，避免四个按钮挤压表格。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：Live Chat Conversation 顶部 `Transfer` 打开弹框，弹框无 `Transfer Number` 页签。
- Browser smoke check `/` 通过：Conversation Transfer Agent 行显示四个新动作，Transfer Skill tab 保持 `Transfer` 动作，点击动作后弹框关闭。
- Browser smoke check `/` 通过：PSTN / Voice Call 进入通话后，话务条 Transfer 弹框仍保留三页签和原 `Consult` / `Transfer` / `Conference` 动作。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚本轮，移除 `TransferModal` 的 `variant` 逻辑，恢复 `ConversationWorkspace` 中 Transfer 按钮为展示按钮，并移除 `.aicc-transfer-row-actions` 样式。
- 不需要回滚 Conversation tab、消息发送、End Service 或话务条 Transfer 的既有业务状态。

当前风险点：

- Conversation Transfer 四个动作仍为前端演示动作，点击后只关闭弹框，不接真实转移/邀请流程。
- 顶部 `Invite` 按钮本轮仍保持展示按钮，尚未接入弹框或邀请流程。
- 仍需在目标演示分辨率下人工复查四个长按钮在 Agent 表格中的换行视觉。

### 2026-05-22 17:48 +08:00 - Conversation 顶部视觉校准

修改页面或文件：

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1748.md`
- `.codex-backup/current-todo-2026-05-22-1748.md`
- `.codex-backup/page-state-2026-05-22-1748.md`

修改原因：

- 用户指出 End Service 叉号偏大，且 hover 缺少背景块，和 Transfer/Invite 图标未对齐。
- 用户指出 Conversation 面板配色看起来比系统主色调更暗，需要检查是否存在局部硬编码导致的两套标准。

修改结果：

- Conversation 顶部渠道图标继续复用 `.live-chat-channel-icon`，并额外加上客户列表行同款 `live-chat-channel-icon--customer`，统一图标尺寸与视觉重量。
- `Transfer` / `Invite` hover/focus 从局部硬编码 `#eef6ff` / `--aicc-primary-strong` 改为系统 token `--aicc-hover` / `--aicc-primary`。
- End Service 叉号从 `18px` 调整为 `16px`，按钮盒回到 `28px`，hover/focus 恢复浅红背景块 `#fff1f1`。
- 本轮未修改中部消息区、底部发送区、客户列表、Customer Information、CRM 或 Assistant。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：Sign In 后打开 Live Chat，Conversation 顶部仍显示渠道图标、客户名、计时、Transfer/Invite 图标和 End Service close 图标。
- Browser smoke check `/` 通过：点击 End Service 仍打开二次确认弹窗。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚本轮视觉校准，恢复 `ConversationWorkspace.tsx` 中渠道图标 class 的本轮新增项，以及 `src/styles/index.less` 中 Conversation header action hover 和 End Service 尺寸/hover 样式。
- 不需要回滚 Conversation tab、中部消息布局、底部 composer、客户切换、发送或 End Service 业务逻辑。

当前风险点：

- 计时器仍为本地前端演示计时，不接真实会话网关时间。
- Transfer 和 Invite 仍为展示按钮，尚未接真实弹窗或协作流程。
- 仍需在最终演示分辨率下人工复查顶部操作区 hover 视觉和图标对齐。

### 2026-05-22 17:33 +08:00 - Conversation 顶部三次调整

修改页面或文件：

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1733.md`
- `.codex-backup/current-todo-2026-05-22-1733.md`
- `.codex-backup/page-state-2026-05-22-1733.md`

修改原因：

- 用户要求 Conversation 顶部渠道标识改为客户列表同款图标，只显示图形，hover/title 再表达渠道名。
- 用户要求顶部左侧三项采用更合理的扫描顺序，并确认采用“渠道图标 -> 客户姓名 -> 计时”。
- 用户要求右侧 `Transfer` / `Invite` 恢复图标，结束按钮去掉圆圈叉，改为更大的单独红色叉号。

修改结果：

- Conversation 顶部左侧改为渠道图标、客户姓名、计时；渠道图标复用 `live-chat-channel-icon` 和 WhatsApp / BankApp / Webchat modifier，保留 `title` 与 `aria-label`。
- `Transfer` / `Invite` 恢复为 `SwapOutlined` / `UserAddOutlined` 图标 + 文字，仍为无边框、低强调、常规字重按钮。
- End Service 改为 `CloseOutlined` 单独叉号按钮，尺寸放大、红色显示，不显示文字，并保留二次确认弹窗。
- 本轮未修改中部消息区、底部发送区、客户列表、Customer Information、CRM 或 Assistant。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：Sign In 后打开 Live Chat，Conversation 顶部左侧为渠道图标、客户姓名、计时；右侧 Transfer/Invite 为图标 + 文字，结束按钮为 `close` 图标。
- Browser smoke check `/` 通过：点击 End Service 仍打开二次确认弹窗；本轮未确认关闭客户，避免顶部视觉复查改变当前会话状态。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚本轮顶部三次调整，恢复 `ConversationWorkspace.tsx` 的 header icon/import/markup，以及 `src/styles/index.less` 中 Conversation header 相关选择器。
- 不需要回滚 Conversation tab、中部消息布局、底部 composer、客户切换、发送或 End Service 业务逻辑。

当前风险点：

- 计时器仍为本地前端演示计时，不接真实会话网关时间。
- Transfer 和 Invite 仍为展示按钮，尚未接真实弹窗或协作流程。
- 仍需在最终演示分辨率下人工复查顶部操作区换行和图标密度。

### 2026-05-22 17:17 +08:00 - Conversation 面板二次精简

修改页面或文件：

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1717.md`
- `.codex-backup/current-todo-2026-05-22-1717.md`
- `.codex-backup/page-state-2026-05-22-1717.md`

修改原因：

- 用户要求 Conversation 顶部左侧显示客户名称、无外框通话计时和与 Customer Information 一致的渠道标识。
- 用户要求顶部右侧显示轻量 Transfer、Invite 和仅红色叉号的结束按钮。
- 用户要求中部消息时间放在气泡外上方，只有其他坐席在时间前显示名称，当前坐席不显示 `You`。

修改结果：

- Conversation 顶部改为左侧客户姓名、计时、渠道；右侧 Transfer/Invite 为无边框常规字重文本按钮，结束服务为红色叉号图标按钮。
- 底部 composer 只保留表情、附件和 Send，不再承载 Transfer、Invite、End Service。
- 消息元信息移到气泡外上方：客户消息只显示时间；历史坐席显示坐席姓名和时间；当前坐席只显示时间。
- 当前坐席消息不再显示 `You`；历史坐席仍在左侧，当前坐席仍在右侧，避免误判历史话术来源。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：签入后打开固定 `Live Chat` tab，Conversation 顶部结构与右侧操作符合本轮要求。
- Browser smoke check `/` 通过：消息 DOM 显示客户消息只有时间，历史坐席为姓名 + 时间，当前坐席无 `You`。
- Browser smoke check `/` 通过：End Service 二次确认出现，确认后关闭当前客户并切换到 Sari Amelia。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。
- 浏览器插件本轮输入文本时报虚拟剪贴板不可用，因此发送消息未通过浏览器完成复测；发送逻辑本轮未改，仅移动了非发送操作按钮。

回滚说明：

- 如需回滚本轮二次精简，恢复 `ConversationWorkspace.tsx` 中 header/actions/message meta 结构，以及 `src/styles/index.less` 中 `.live-chat-conversation*` 的本轮样式修改。
- 不需要回滚 Conversation tab 功能、Live Chat 客户切换、发送消息或 End Service 确认逻辑。

当前风险点：

- 计时器仍为本地前端演示计时，不接真实会话网关时间。
- Transfer 和 Invite 仍为展示按钮，尚未接真实弹窗或协作流程。
- 仍需在最终演示分辨率下人工复查顶部右侧操作是否在窄宽度下换行合理。

### 2026-05-22 16:50 +08:00 - Conversation 面板浅色企业级视觉收敛

修改页面或文件：

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1650.md`
- `.codex-backup/current-todo-2026-05-22-1650.md`
- `.codex-backup/page-state-2026-05-22-1650.md`

修改原因：

- 用户指出 Conversation 顶部深色背景与系统整体浅色企业级工作台样式割裂。
- 用户要求顶部右侧只展示客户姓名和聊天计时。
- 用户要求中部不再展示客户名称和 `Customer` 字样，并希望明确历史坐席记录的位置与原因。
- 规划结论：历史坐席记录放左侧，用中性样式与客户消息区分；右侧只保留当前坐席发送内容，避免误判历史话术是当前坐席刚发送。

修改结果：

- Conversation 顶部从深色 header 改为浅色工具头，左侧显示渠道标签与 intent，右侧只显示客户姓名和本地递增聊天计时。
- Transfer、Invite、End Service 从顶部移到底部发送区操作组，Send 保持主操作。
- 客户消息左侧显示头像、气泡和时间，不再显示客户姓名或 `Customer` 字样。
- 历史坐席记录放在左侧，使用中性灰蓝气泡并保留坐席姓名、`Previous Agent` 与时间；当前坐席消息右侧显示浅 BANK 1 蓝气泡和 `You`。
- `.live-chat-conversation*` 样式改回现有浅色 surface hierarchy，不再使用内部深色大块。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：签入后打开固定 `Live Chat` tab，CRM 工作区默认选中 `Conversation`。
- Browser smoke check `/` 通过：Conversation 顶部显示 WhatsApp/BankApp 渠道与 intent，右侧只显示客户姓名和聊天计时。
- Browser smoke check `/` 通过：发送消息后追加为右侧 `You` 消息；End Service 二次确认后关闭当前客户并切换到下一个客户。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。
- 本轮浏览器截图接口在 CDP 上超时，因此未保存截图；关键路径已通过 DOM 与交互 smoke check 验证。

回滚说明：

- 如需回滚本轮浅色视觉收敛，恢复 `ConversationWorkspace.tsx` 中 header/actions/message meta 结构，以及 `src/styles/index.less` 中 `.live-chat-conversation*` 的本轮样式修改。
- 不需要回滚 Conversation tab 功能、Live Chat 客户切换、发送消息或 End Service 逻辑。

当前风险点：

- 计时器为本地前端演示计时，不接真实会话网关时间。
- Transfer 和 Invite 仍为展示按钮，尚未接真实弹窗或协作流程。
- 仍需在最终演示分辨率下人工复查底部操作组是否会换行挤压发送区。

### 2026-05-22 16:20 +08:00 - 限定调整 Conversation 对话与发送区样式

修改页面或文件：

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1620.md`
- `.codex-backup/current-todo-2026-05-22-1620.md`
- `.codex-backup/page-state-2026-05-22-1620.md`

修改原因：

- 用户要求不要修改 Conversation 以外内容。
- 用户要求 Conversation 顶部客户名称区域使用深色背景，中部对话和底部发送信息框使用最浅色背景。
- 用户要求中部对话改为左右气泡框形式，显示客户头像和其它坐席头像；当前坐席发送的消息不显示头像，并使用深色配色方便区分。
- 用户要求底部发送区与中部同为浅色背景，只用一个线框/分割线区分，大线框内不再用额外线框分割。

修改结果：

- 仅调整 `ConversationWorkspace` 结构和 `.live-chat-conversation*` 样式。
- Conversation 顶部改为深色 header，客户名称与意图/时长使用白色层级。
- 消息区改为左右气泡：客户左侧头像 + 白色气泡，历史坐席右侧头像 + 浅蓝气泡，当前坐席右侧深色气泡且无头像。
- 底部发送区去掉 textarea 自身边框，与消息区保持同一浅色背景，只保留顶部一条分割线，内部保留输入、表情、附件和发送按钮。
- 增加消息区滚到底部的 DOM 同步，避免发送后的当前坐席消息显示不完整。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser visual check `/` 通过：Live Chat Conversation 顶部为深色，中部和底部为统一浅色背景；客户和历史坐席头像显示，当前坐席深色气泡无头像；Conversation 以外区域未被本轮样式调整影响。

回滚说明：

- 如需回滚本轮视觉调整，恢复 `ConversationWorkspace.tsx` 中消息 avatar wrapper 结构，以及 `src/styles/index.less` 中 `.live-chat-conversation*` 的本轮样式修改。
- 不需要回滚前一轮新增的 Conversation tab、mock conversation 或 Live Chat 客户切换逻辑。

当前风险点：

- 当前坐席消息自动滚动使用 DOM `scrollIntoView`，只作用于 Conversation 消息区。
- 本轮未重新验证 `End Service` 关闭客户流程，因功能逻辑未改；上一轮已验证通过。

### 2026-05-22 15:52 +08:00 - 新增 Live Chat Conversation 固定页签

修改页面或文件：

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1552.md`
- `.codex-backup/current-todo-2026-05-22-1552.md`
- `.codex-backup/page-state-2026-05-22-1552.md`

修改原因：

- 用户要求在 CRM 右侧新增固定 `Conversation` 页签，用于实时对话的客户与坐席聊天框。
- 用户要求点击左侧客户列表选择客户时，聊天内容随当前客户联动。
- 用户要求 Conversation 顶部显示客户名称和 `Transfer`、`Invite`、`End Service` 操作；`End Service` 点击后需要二次确认，确认后关闭该客户。
- 用户要求 Conversation 中部展示客户与其他坐席的历史会话记录，下方提供发送信息框、表情、文件和发送按钮。

修改结果：

- 新增 `ConversationWorkspace` 组件，作为 Live Chat CRM 工作区内固定 `Conversation` tab 内容。
- `CrmPanel` 支持在 `CRM` tab 右侧插入不可关闭的 `Conversation` tab；PSTN / Voice Call 与 Video Call 未传入 conversation 配置时仍保持原有 CRM 行为。
- `InteractionWorkspace` 支持传入 conversation 配置，Live Chat 默认选中 `Conversation`，其它弹屏默认选中 `CRM`。
- `LiveChatPage` 新增前端演示状态：每个客户保留独立 conversation messages，发送消息会追加 Current Agent 消息并更新客户列表最后消息；确认 `End Service` 后会从列表移除当前客户并切到下一个客户。
- `LiveChatSession` 新增 `conversation` 字段，mock 为 WhatsApp、BankApp、Webchat 三个客户补充客户、历史坐席和当前坐席会话记录。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` 通过：签入后打开固定 `Live Chat` tab，CRM 工作区默认选中固定 `Conversation` tab 且无关闭按钮。
- Browser smoke check `/` 通过：展开客户列表并切换到 Sari Amelia 后，Conversation 顶部、历史消息与输入框同步切换。
- Browser smoke check `/` 通过：发送消息后，Current Agent 消息追加到当前会话，客户列表最后消息和时间同步更新。
- Browser smoke check `/` 通过：点击 `End Service` 后出现二次确认框，确认后 Sari Amelia 从客户列表关闭并自动切换到 Rafi Firmansyah。
- Browser smoke check `/design-system` 通过：设计系统页面正常加载。

回滚说明：

- 如需回滚 Conversation 功能，移除 `ConversationWorkspace.tsx`，恢复 `CrmPanel`、`InteractionWorkspace`、`LiveChatPage` 中 conversation 相关 props/state，并删除 `LiveChatSession.conversation` 类型与 mock 字段。
- 如只需隐藏 Conversation tab，可停止从 `LiveChatPage` 向 `InteractionWorkspace` 传入 `conversation` 配置，保留 mock 数据不影响 PSTN / Video Call。

当前风险点：

- `Transfer` 和 `Invite` 当前为展示按钮，尚未接真实弹窗或协作流程。
- `End Service` 关闭客户仅影响 Live Chat 前端列表，不联动坐席 ACW、工单或后端会话网关。
- 发送消息只存在于当前页面内存，刷新后恢复 mock 初始 conversation。
- 仍需在目标演示分辨率下复查 Conversation tab 对四列 Live Chat 布局的横向压缩影响。

### 2026-05-22 13:10 +08:00 - 恢复邮箱 hover 标识并按客户隔离外呼申请状态

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1310.md`
- `.codex-backup/current-todo-2026-05-22-1310.md`
- `.codex-backup/page-state-2026-05-22-1310.md`

修改原因：

- 用户指出上一轮为了解决邮箱过长换行时，把邮箱悬浮后的文字高亮点击提示弱化/丢失了，需要恢复 hover 高亮标识。
- 用户要求点击电话号码触发的外呼申请功能只针对当前客户，而不是切换后的所有客户共用同一个申请状态。

修改结果：

- 邮箱按钮保持上轮的换行结构，同时在 hover/focus-visible 时让邮箱文字变为主蓝色并显示下划线，明确提示可点击。
- `CustomerInformationCard` 的外呼申请状态从单个组件级状态改为按 `accessChannel + CIS + phoneNumber` 组成的客户 key 存储。
- 外呼申请审批计时器也按客户 key 管理，组件卸载时统一清理，避免切换 Live Chat 客户后状态串到其它客户。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：签入后 Live Chat 和 Customer Information 正常加载，邮箱仍作为 `Send email` 按钮出现在 DOM 中。

回滚说明：

- 如需回滚邮箱 hover 效果，恢复 `src/styles/index.less` 中 `.aicc-customer-info__email-value` hover/focus 样式。
- 如需回滚外呼申请状态隔离，恢复 `CustomerInformationCard.tsx` 中单个 `outboundRequestStatus` state 和单个 timer ref 的实现，但会重新出现 Live Chat 切换客户时状态共享的问题。

当前风险点：

- 本轮外呼状态隔离只作用于外呼申请状态；Customer Information 里其它本地状态如验证状态、联系人编辑状态仍沿用既有实现，后续如要完全按客户隔离可继续拆分。
- 浏览器工具未稳定点中隐藏 hover 外呼按钮，已通过代码结构、lint/build 和页面加载 smoke check 验证本轮改动。

### 2026-05-22 12:53 +08:00 - 优化 Customer Information 卡片头像、级别与邮箱显示

修改页面或文件：

- `src/components/CustomerInformationPanel.tsx`
- `src/mock/inbound.ts`
- `src/styles/index.less`
- `public/avatars/whatsapp-customer-female.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1253.md`
- `.codex-backup/current-todo-2026-05-22-1253.md`
- `.codex-backup/page-state-2026-05-22-1253.md`

修改原因：

- 用户要求 Live Chat 的 Customer Information 卡片中，WhatsApp 客户改为女生头像，BankApp 和 Webchat 客户按未上传头像显示姓名首字母。
- 用户要求 BankApp 和 Webchat 作为普通客户，不显示客户级别。
- 用户指出邮箱过长时邮箱图标被缩小，要求图标不缩小，邮箱文本可换行。
- 用户要求 Webchat 渠道标识配色与客户列表面板中的 Webchat 图标一致。
- 用户强调 Customer Information 是共用组件，不要改客户信息卡片以外内容。

修改结果：

- 新增本地 WhatsApp 女生客户头像资源 `public/avatars/whatsapp-customer-female.png`，并仅在 Live Chat WhatsApp 会话中覆盖头像。
- BankApp 与 Webchat Live Chat 客户保持空 `avatarUrl`，共用 `CustomerInformationPanel` 对空头像改为显示 `avatarInitials`。
- `CustomerInformationPanel` 改为按 `customerType` 条件渲染客户级别：`Regular Customer` 不显示，`Priority Customer` 显示 `Priority`。
- Customer Information 邮箱行改为固定图标列 + 可换行文本，长邮箱不再压缩邮箱图标。
- Webchat 的 `inbound-channel-tag--webchat` 改为与客户列表 Webchat 图标一致的橙色系。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke/visual check `/` 通过：WhatsApp 显示新女生头像并保留 `Priority`；BankApp 显示 `SA` 默认头像且无客户级别；Webchat 显示 `RF` 默认头像且无客户级别。
- Browser smoke/visual check `/` 通过：邮箱图标不被压缩，Webchat 渠道 tag 为橙色系。

回滚说明：

- 如需回滚头像，可移除 `src/mock/inbound.ts` 中 WhatsApp 会话的 `avatarUrl` 覆盖并删除新增头像资源。
- 如需回滚客户级别逻辑，可恢复 `CustomerInformationPanel` 中固定显示 `Priority` 的实现，但会重新影响所有共用卡片。
- 如需回滚邮箱显示，可恢复 `.aicc-customer-info__fact-action` 与 `.aicc-customer-info__email-value` 的样式调整。
- 如需回滚 Webchat 渠道色，可恢复 `src/styles/index.less` 中 `.inbound-channel-tag--webchat` 的旧配色。

当前风险点：

- `CustomerInformationPanel` 是共用组件，本轮已按客户类型做通用条件渲染；后续如需要在其它页面展示 `Regular Customer` badge，需要新增显式配置。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-22 12:19 +08:00 - 调亮 Live Chat 客户行 hover 与 selected 背景

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1219.md`
- `.codex-backup/current-todo-2026-05-22-1219.md`
- `.codex-backup/page-state-2026-05-22-1219.md`

修改原因：

- 用户要求 Live Chat 客户列表数据的选中背景框继续优化：选中效果和悬浮效果颜色都比当前更浅白、更亮。
- 用户要求其他效果都不要动。

修改结果：

- 仅调整 `.live-chat-customer-list__item:hover` / `:focus-visible` 和 `.live-chat-customer-list__item--active` 的背景透明度。
- hover 背景从 `rgba(255, 255, 255, 0.34)` 调整为 `rgba(255, 255, 255, 0.48)`。
- active 背景从 `rgba(255, 255, 255, 0.78)` 调整为 `rgba(255, 255, 255, 0.88)`。
- 其他客户列表交互、尺寸、渠道筛选、收起态和页面其它区域未改动。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser visual check `/` 通过：Live Chat 展开态 selected 行更亮，客户列表其它效果保持不变。

回滚说明：

- 如需回滚本轮调色，仅恢复 `src/styles/index.less` 中上述两个背景色值即可。

当前风险点：

- 本轮仅调亮客户列表 hover/selected 背景；最终视觉仍以目标演示屏幕效果为准。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-22 12:09 +08:00 - 加宽 Live Chat 客户列表选中行背景

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1209.md`
- `.codex-backup/current-todo-2026-05-22-1209.md`
- `.codex-backup/page-state-2026-05-22-1209.md`

修改原因：

- 用户要求 Live Chat 客户列表数据选中背景更浅白一些。
- 用户要求选中背景拉宽到整个客户列表面板，不要两边留边距，使选中效果更明显。

修改结果：

- 仅调整 `.live-chat-customer-list` 相关样式。
- 客户列表容器左右 padding 移除，行内 padding 补偿，保持文本与图标对齐。
- active 行背景从 `rgba(255, 255, 255, 0.58)` 调整为 `rgba(255, 255, 255, 0.78)`。
- active 行背景现在横向铺满客户列表面板，收起态 active 行也铺满窄栏宽度。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser visual check `/` 通过：Live Chat 展开态 active 客户行背景更浅，并铺满客户列表面板宽度。

回滚说明：

- 如需回滚本轮视觉调整，可恢复 `src/styles/index.less` 中 `.live-chat-customer-list__items`、`.live-chat-customer-list__item`、`.live-chat-customer-list__item--active` 和收起态 items/item 的 padding/width 改动。

当前风险点：

- 本轮仅调整客户列表面板选中行样式，未改动客户列表面板以外内容。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-22 11:58 +08:00 - 优化 Live Chat ALL 双态、选中行与收起态宽度

修改页面或文件：

- `src/pages/inbound/LiveChatPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1158.md`
- `.codex-backup/current-todo-2026-05-22-1158.md`
- `.codex-backup/page-state-2026-05-22-1158.md`

修改原因：

- 用户要求顶部 `ALL` 也具备双态：选中时点击相当于取消所有渠道。
- 用户要求客户列表选中效果更简洁，整行选中即可，不再加额外框，以便收起状态进一步缩窄。
- 用户要求未读数圆形 badge 不再有白色外边框。
- 用户强调不要修改客户列表面板以外的内容。

修改结果：

- `ALL` 筛选逻辑改为双态：当前全渠道选中时点击 ALL 会清空所有渠道；非全选时点击 ALL 会恢复全渠道。
- 客户列表 active 行改为整行浅色背景，不再使用左侧主色 accent、白底卡片框或额外边框。
- Live Chat 收起态列宽从 `66px` 收窄到 `56px`，对应收起态筛选图标、客户行和渠道图标尺寸同步收敛。
- 客户列表面板内覆盖 Ant Design badge 样式，去掉未读数白色外描边。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：点击 ALL 可清空所有渠道并显示 `No active chats`，再次点击 ALL 恢复全部客户。
- Browser visual check `/` 通过：active 行为整行浅色选中，收起态更窄，未读数 badge 无白色外描边。

回滚说明：

- 如需回滚本轮调整，可恢复 `LiveChatPage` 中 ALL 点击逻辑，并恢复 `src/styles/index.less` 中 `.inbound-page--live-chat-list-collapsed`、`.live-chat-customer-list__item--active`、`.live-chat-customer-list--collapsed` 和 badge 相关样式。
- 不要回滚前序多选渠道、BankApp 文案、渠道图标替换头像等功能，除非另有明确要求。

当前风险点：

- 当前允许 ALL 清空所有渠道，空列表时右侧仍保留最近 active customer 的信息；这是本轮按用户要求实现的行为。
- 收起态变窄后仍需在最终演示分辨率下确认点击舒适度。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-22 11:45 +08:00 - 重新调整 Live Chat 客户列表面板蓝色层级与行样式

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-1145.md`
- `.codex-backup/current-todo-2026-05-22-1145.md`
- `.codex-backup/page-state-2026-05-22-1145.md`

修改原因：

- 用户指出上一版客户列表面板配色不好看，要求整体再蓝一些。
- 用户要求聊天列表中未选中客户行不显示背景色块，改用条线隔开。
- 用户要求顶部渠道选择选中/悬浮都不要在图标外再加边框，让图标更大、点击范围更大。
- 用户要求顶部收起展开按钮不要边框，只在鼠标悬浮时明显显示。
- 用户强调不要修改客户列表面板以外的内容。

修改结果：

- 仅调整 `.live-chat-customer-list` 相关样式。
- 客户列表面板从冷灰蓝改为更明确的浅 BANK 1 蓝色调，header 同步加深蓝色层级。
- 未选中客户行改为透明底 + 分隔线；active 行保留白底和左侧主色强调。
- 顶部渠道筛选按钮取消外层 border、hover border 和 active 外层框，放大按钮与图标尺寸。
- 未选中筛选图标继续置灰，选中图标恢复渠道色。
- 顶部收起/展开按钮取消 border，默认弱化，header 或按钮悬浮时才明显显示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser visual check `/` 通过：Live Chat 客户列表面板更蓝，普通客户行无背景色块并以分隔线区分，顶部筛选图标无外层框，收起按钮无边框且默认弱化。

回滚说明：

- 如需回滚本轮视觉调整，可恢复 `src/styles/index.less` 中 `.live-chat-customer-list`、`.live-chat-customer-list__filter`、`.live-chat-channel-icon`、`.live-chat-customer-list__toggle`、`.live-chat-customer-list__item` 相关样式。
- 不要回滚多选筛选逻辑、BankApp 文案、客户头像替换渠道图标等前序功能，除非另有明确要求。

当前风险点：

- 本轮仅调整客户列表面板样式，未改变客户列表以外页面内容。
- 仍需以最终演示分辨率确认蓝色面板与右侧三栏的视觉权重是否满足演示口径。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-22 01:28 +08:00 - 细化 Live Chat 渠道多选与客户列表面板层级

修改页面或文件：

- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-0128.md`
- `.codex-backup/current-todo-2026-05-22-0128.md`
- `.codex-backup/page-state-2026-05-22-0128.md`

修改原因：

- 用户要求 Live Chat 左侧客户列表顶部渠道选择改为多选：未选中置灰，选中高亮，点击 ALL 全部高亮，取消单个渠道时 ALL 不再选中。
- 用户指出 Webchat 渠道图标颜色与 WhatsApp 重复，需要换色。
- 用户要求客户列表面板整体背景色加深，避免 Live Chat 四列全是同一种浅色卡片样式导致视觉混乱。
- 用户要求不改动客户列表面板以外的内容。

修改结果：

- `LiveChatPage` 将渠道过滤从单选改为多选数组，默认 WhatsApp、BankApp、Webchat 全选。
- 点击 ALL 会恢复三渠道全选；点击单个渠道会切换该渠道，少选任意渠道时 ALL 自动取消高亮。
- 未选中的筛选图标置灰，选中的筛选图标恢复渠道色并高亮。
- Webchat 图标从绿色改为橙色系，避免与 WhatsApp 绿色重复。
- 客户列表面板改为冷灰蓝背景、稍深 header、白色 active 行和更明确的 hover/active 层级，只影响 `.live-chat-customer-list` 相关样式。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：默认 ALL 与三个渠道均高亮；取消 Webchat 后 ALL 取消高亮、Webchat 置灰且 Rafi 从列表消失；点击 ALL 后恢复完整列表。
- Browser visual check `/` 通过：客户列表面板与右侧白色区域已有更明显层级区分，Webchat 图标为橙色系。

回滚说明：

- 如需回滚本轮细化，可恢复 `LiveChatPage` 的单选渠道状态、`LiveChatCustomerList` 的 `channelFilter` prop 和 `src/styles/index.less` 中 `.live-chat-customer-list` 相关样式。
- 不要回滚上一轮头像替换渠道图标、BankApp 文案或 Live Chat tab 基础功能，除非另有明确要求。

当前风险点：

- 当前采用冷灰蓝面板方案；如演示现场希望更强的视觉重心，可改为深蓝侧栏或浅灰分组方案。
- 多选允许取消所有渠道，此时列表为空但右侧仍保留最近 active session 的客户信息；如不希望空列表，后续可禁止取消最后一个渠道。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-22 01:02 +08:00 - 调整 Live Chat 左侧客户列表筛选与收起态

修改页面或文件：

- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/pages/inbound/components/ContactManagementModal.tsx`
- `src/pages/inbound/components/contactManagementData.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-22-0102.md`
- `.codex-backup/current-todo-2026-05-22-0102.md`
- `.codex-backup/page-state-2026-05-22-0102.md`

修改原因：

- 用户要求 Live Chat 来电弹屏左侧客户列表顶部改为 ALL、WhatsApp、BankApp、Webchat 四个渠道图标筛选。
- 用户要求客户列表行用渠道图标替代客户头像，去掉行内渠道标签和 High 优先级标签，以节省高度。
- 用户要求客户列表默认收起，并且渠道图标不要与 Contact Management 面板中的图标不一致。

修改结果：

- `LiveChatPage` 新增渠道过滤状态，默认客户列表收起。
- `LiveChatCustomerList` 顶部改为四个图标筛选按钮，hover 显示渠道名；收起态使用窄栏 2x2 筛选图标与箭头。
- 客户列表行改为渠道图标 + unread count + 客户名/时间/最后消息，不再显示客户头像、行内渠道 tag 或 High tag。
- `Haloapps` 作为内部 channel key 保留，用户可见文案统一显示为 `BankApp`。
- `ChannelTag` 中 `Haloapps` / `Haloapps Video` 的可见标签显示为 `BankApp`，`Haloapps` 使用与 Contact Management 一致的 Mobile icon。
- Contact Management 面板中的 `Bankapp` 文案统一为 `BankApp`。

验证：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：签入后 Live Chat tab 出现，列表默认收起，顶部可见 ALL、WhatsApp、BankApp、Webchat 图标筛选和展开箭头。
- Browser smoke check `/` 通过：展开后客户行仅显示渠道图标、未读数、客户名、时间和最后消息；BankApp 筛选仅显示 Sari Amelia 并同步 Customer Information。
- Browser smoke check `/design-system` 通过：页面正常加载，标题为 `BANK 1 AICC Demo`。

回滚说明：

- 如需回滚本轮 Live Chat 客户列表调整，可恢复 `LiveChatPage`、`LiveChatCustomerList`、`ChannelTag`、`ContactManagementModal`、`contactManagementData` 和 `src/styles/index.less` 中本次改动。
- 回滚时应保留上一轮 Live Chat tab、InteractionWorkspace、Video Call 和 PSTN / Voice Call 的既有功能，除非另有明确要求。

当前风险点：

- Live Chat 仍为静态 demo mock，不接真实 WhatsApp / BankApp / Webchat 消息网关。
- 展开态仍是四列布局，需要在最终演示分辨率下确认 CRM 与 Assistant 区域宽度是否足够。
- `npm run build` 仍有既有 Vite chunk size warning，不影响本轮功能。

### 2026-05-21 23:40 +08:00 - 创建非生产集成分支暂存弹屏框架

修改页面或文件：

- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- Git 分支：`codex/interaction-popup-base`

修改原因：

- 用户希望保留当前视频/文字弹屏框架，但暂不合并或推送到 `main`，避免客户正式环境看到未完成的页面内容。
- 需要创建一个非生产集成分支，作为后续视频来电详情和文字弹屏详情优化的共同基础。

修改结果：

- 已从当前 `codex/videocall-popup` 工作区创建 `codex/interaction-popup-base`。
- 当前分支定位为非生产集成备份分支；后续优化可从该分支继续拆分。
- `main` 未合并、未推送，客户正式环境不更新。

回滚说明：

- 如需撤销该集成分支，可删除本地和远端 `codex/interaction-popup-base` 分支；不要删除 `main`。
- 如需继续在原分支开发，可切回 `codex/videocall-popup`，但建议后续需求从 `codex/interaction-popup-base` 新开分支。

当前风险点：

- 推送非 `main` 分支不会更新生产分支；如果 Vercel 对所有分支启用了 preview deployment，可能产生预览部署，但不影响客户正式地址。
- 后续正式给客户前，仍需把最终验收版本合并并推送到 `main`。

### 2026-05-21 23:01 +08:00 - 新增 Sign In 后固定 Live Chat 工作台

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/index.ts`
- `src/mock/inbound.ts`
- `src/types/inbound.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-2301.md`
- `.codex-backup/current-todo-2026-05-21-2301.md`
- `.codex-backup/page-state-2026-05-21-2301.md`

修改原因：

- 用户要求新增实时文字聊天弹屏页面。
- 坐席点击右上角 `Sign In` 后具备实时聊天技能，因此 Home 旁需要新增固定不可关闭的 `Live Chat` 页签。
- Live Chat 页面需在语音来电弹屏内容基础上复用现有组件，在左侧新增类似微信客户端的客户列表，并支持 WhatsApp、Haloapps、Webchat 渠道。

修改结果：

- `appStore` 新增 Live Chat tab 状态与切换方法，签出时当前在 Live Chat 会退回 Home。
- `BasicLayout` 将 Live Chat tab 绑定到坐席签入状态；左侧 `Channel Simulation > Live Chat` 在已签入时切换到固定 Live Chat tab。
- `AgentWorkspace` 新增不可关闭 `Live Chat` tab，插入 Home 后、PSTN / Voice Call 和 Video Call 之前。
- `InteractionWorkspace` 增加 `leadPanel` 扩展点，Live Chat 通过该扩展点复用原三栏工作台，不复制电话/视频页面代码。
- 新增 `LiveChatPage`、`LiveChatCustomerList`、`LiveChatSession` 类型和 `liveChatSessions` mock。
- Live Chat 客户列表支持展开/收起，展示 unread count、渠道、最后消息、时间与高优先级标记；切换客户会同步更新 Customer Information。
- `ChannelTag` 支持 WhatsApp、Haloapps、Webchat 文字渠道；文字聊天渠道打开 Call Flow Detail 时不显示 IVR Journey。

回滚说明：

- 如需回滚本轮 Live Chat，可移除 `LiveChatPage`、`LiveChatCustomerList`、`LiveChatSession`、`liveChatSessions`，恢复 `InteractionWorkspace` 的 `leadPanel` 扩展前结构，并移除 `appStore` / `BasicLayout` / `AgentWorkspace` 中的 Live Chat tab 状态与入口。
- 不要回滚上一轮 Video Call、PSTN / Voice Call 或 OpenEye 相关改动，除非另有明确要求。

当前风险点：

- Live Chat 当前是静态 demo mock，不接真实 WhatsApp / Haloapps / Webchat 网关，也未实现真实消息发送。
- 四列展开布局需要在目标演示分辨率下继续复查；收起客户列表后可缓解横向空间压力。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser check `/` 通过：签入后出现不可关闭 Live Chat tab，客户列表可切换和收起。
- Browser check `/design-system` 通过：页面正常加载。

### 2026-05-21 22:12 +08:00 - 按浏览器评论调整 Channel Simulation 文案

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-2212.md`
- `.codex-backup/current-todo-2026-05-21-2212.md`
- `.codex-backup/page-state-2026-05-21-2212.md`

修改原因：

- 浏览器 diff comments 要求将左侧菜单 `PSTN / Voice` 改为 `PSTN / Voice Call`。
- 浏览器 diff comments 要求将 workspace 中原 `Inbound` tab 文案改为 `PSTN / Voice Call`。
- 浏览器 diff comments 要求 `Live Chat` 与 `Video Call` 菜单交换顺序。

修改结果：

- Channel Simulation 子菜单顺序调整为 `PSTN / Voice Call`、`Video Call`、`Live Chat`。
- 电话弹屏 workspace tab 文案调整为 `PSTN / Voice Call`。
- 仅调整显示文案与菜单顺序，未改变 PSTN / Voice Call 与 Video Call 的触发逻辑。

回滚说明：

- 如需回滚本轮评论调整，可将 `BasicLayout` 中子菜单文案恢复为 `PSTN / Voice`，并恢复 `Live Chat` / `Video Call` 顺序；将 `AgentWorkspace` 电话弹屏 tab label 恢复为 `Inbound`。

当前风险点：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser check `/` 通过：菜单顺序为 `PSTN / Voice Call`、`Video Call`、`Live Chat`；点击 `PSTN / Voice Call` 后 tab 文案显示为 `PSTN / Voice Call`。

### 2026-05-21 19:33 +08:00 - 调整 Video Call 接通显示、Haloapps Call Flow 与 Tab 宽度

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/CallFlowDetailModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1933.md`
- `.codex-backup/current-todo-2026-05-21-1933.md`
- `.codex-backup/page-state-2026-05-21-1933.md`

修改原因：

- 用户要求 OpenEye 截图只在视频通话 Answer 接通后显示，挂断视频通话时隐藏。
- 用户指出视频通话不进入 IVR 流程，因此 Haloapps 渠道的 `Call Flow Detail` 不应显示 IVR Journey。
- 用户指出 Home tab 没有关闭按钮却留出多余空间，要求标签宽度适应内容并居中。

修改结果：

- `appStore` 新增 `isOpenEyeVideoWindowVisible` 与 setter。
- `BasicLayout` 将 OpenEye 显示状态绑定到 `activeCallChannel === 'video'`、通话已连接状态和 Video Call tab 打开状态。
- Video Call Incoming 阶段不显示 OpenEye；Answer/Talking 后显示；Hang Up、关闭 Video Call tab 或非视频通话状态会隐藏。
- `CallFlowDetailModal` 支持隐藏 IVR Journey；`CustomerInformationCard` 对 `Haloapps Video` 传入隐藏 IVR 配置。
- Home tab 去掉固定最小宽度，并让 tab 内容居中显示。

回滚说明：

- 如需回滚本次细化，可移除 OpenEye 可见状态字段与 BasicLayout 同步 effect，恢复 VideoCallPage 始终渲染 OpenEye 浮窗。
- 可恢复 `CallFlowDetailModal` 始终显示 IVR Journey。
- 可恢复 `.agent-workspace-tabs.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab` 的 `min-width: 92px`。

当前风险点：

- 关闭 Video Call tab 仍不自动 Hang Up，只隐藏 OpenEye 浮窗；该行为与现有 Inbound tab 关闭策略一致。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：Incoming 阶段 OpenEye 不显示，Answer 后显示，Haloapps Call Flow Detail 不显示 IVR Journey，Hang Up 后 OpenEye 隐藏。
- Browser smoke check `/design-system` 通过。

### 2026-05-21 19:03 +08:00 - 新增 Video Call 弹屏与 OpenEye 独立浮窗

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `src/types/inbound.ts`
- `public/screenshots/openeye-video-call.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1903.md`
- `.codex-backup/current-todo-2026-05-21-1903.md`
- `.codex-backup/page-state-2026-05-21-1903.md`

修改原因：

- 用户要求点击左侧 `Video Call` 后，在 Home 旁打开可关闭的视频来电弹屏 tab。
- 用户要求视频弹屏复用电话弹屏页面内容，只将 Customer Information 渠道改为 Haloapps + 视频图标。
- 用户要求 OpenEye 作为完全独立客户端示意，直接把截图浮在 AICC 系统最上层，不添加 AICC 内部可见文案。

修改结果：

- 新增 `InteractionWorkspace`，抽出电话与视频弹屏共用的三栏工作台逻辑，避免复制页面。
- `InboundPage` 改为 PSTN/Voice wrapper；新增 `VideoCallPage` 复用同一工作台并叠加 OpenEye 浮窗。
- `appStore` 新增 Video Call tab open/close/request 状态。
- `AgentWorkspace` 新增可关闭的 `Video Call` tab。
- `BasicLayout` 新增 `triggerVideoInboundCall()`，仅在坐席 Ready 且通话 Idle 时触发 Incoming 和 Video Call tab。
- `AccessChannel` 新增 `Haloapps Video`；`ChannelTag` 对该渠道显示 `Haloapps` 并使用视频图标。
- 已将用户提供截图复制为 `public/screenshots/openeye-video-call.png`。
- 新增 `OpenEyeVideoWindow`，以 fixed 高层级、可拖动图片浮窗形式模拟独立 OpenEye 客户端；浮窗不添加额外可见标题或说明文案。

回滚说明：

- 如需回滚 Video Call 功能，可移除 `VideoCallPage`、`InteractionWorkspace`、`OpenEyeVideoWindow`、OpenEye 截图资源，并恢复 `InboundPage` 为原三栏实现。
- 同时移除 `appStore` 的 Video Call tab 状态、`AgentWorkspace` 的 Video Call tab、`BasicLayout` 的 `triggerVideoInboundCall()`、`AccessChannel` 的 `Haloapps Video` 和 `ChannelTag` 视频渠道分支。
- PSTN/Voice 点击触发电话来电是上一轮需求，如只回滚 Video Call，应保留该部分。

当前风险点：

- OpenEye 只是截图模拟，不接真实客户端协议和音视频能力。
- 关闭 Video Call tab 只隐藏 workspace 与 OpenEye 浮窗，不自动 Hang Up；当前与 Inbound tab 关闭策略保持一致。
- 自动接听倒计时仍保留；如果演示口径要求必须人工点击 Answer，需要后续停用 Incoming 自动接听。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：Video Call tab 打开、Answer 可用、Haloapps 视频渠道显示、OpenEye 浮窗显示并可拖动、关闭 tab 后浮窗消失、PSTN/Voice 仍可触发 Inbound。
- Browser smoke check `/design-system` 通过。

### 2026-05-21 18:01 +08:00 - PSTN/Voice 点击触发电话来电

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1801.md`
- `.codex-backup/current-todo-2026-05-21-1801.md`
- `.codex-backup/page-state-2026-05-21-1801.md`

修改原因：

- 用户要求主版本保持稳定，在 `codex/videocall-popup` 分支先完成 PSTN/Voice 电话来电触发逻辑。
- 原逻辑为坐席 Ready 且 Idle 后自动模拟来电；现在要求改为点击左侧菜单 `Channel Simulation > PSTN / Voice` 后才模拟电话打进来。
- Video Call 页面与视频弹屏需求尚未明确，本轮不实现。

修改结果：

- 已从干净 `main` 创建并切换到 `codex/videocall-popup` 分支。
- 移除 `BasicLayout` 中 Ready + Idle 后 2 秒自动来电的 effect。
- 新增 `triggerVoiceInboundCall()`，仅在 `agentStatus === 'Ready'` 且 `callStatus === 'Idle'` 时触发。
- 点击 `PSTN / Voice` 后进入 `Incoming`，打开 Inbound tab，并让话务条 Answer 按钮亮起。
- 保留现有 Answer、Talking、Hold、Mute、Hang Up、After Call Work 和自动接听倒计时逻辑。
- `Video Call` 菜单本轮不绑定新弹屏功能。

回滚说明：

- 如需回滚本轮交互改造，可恢复 `src/layouts/BasicLayout.tsx` 中原 Ready + Idle 自动来电 `useEffect`，并移除 `triggerVoiceInboundCall()` 及 `PSTN / Voice` 子菜单点击触发逻辑。
- 文档与备份可按本时间戳条目删除或回退。

当前风险点：

- 自动接听倒计时仍保留；如果演示口径要求必须人工点击 Answer，需要后续停用 Incoming 自动接听。
- Video Call 弹屏尚未设计与实现，需等待详细需求。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/` 通过：Sign In 后等待超过 2 秒不会自动弹 Inbound；点击 `PSTN / Voice` 后 Answer 可用且 Inbound tab 打开；Talking 后 Hang Up 进入 Not Ready 并自动回 Ready。
- Browser smoke check `/design-system` 通过。

### 2026-05-21 15:55 +08:00 - 优化侧栏电话图标与收起态浮层关闭

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1555.md`
- `.codex-backup/current-todo-2026-05-21-1555.md`
- `.codex-backup/page-state-2026-05-21-1555.md`

修改原因：

- 用户要求电话图标水平翻转。
- 用户要求收起状态下鼠标移出二级菜单浮层时，或点击菜单后，浮层不继续显示。

修改结果：

- 仅侧栏 `Call Management` 的电话图标增加 `aicc-sider__menu-phone-icon` class，并通过 CSS `scaleX(-1)` 水平翻转。
- 收起态二级菜单浮层改为 hover 打开，并在点击一级/二级菜单后通过 `closedFlyoutKey` 抑制当前浮层显示。
- 鼠标移出当前一级菜单与浮层区域后，关闭抑制状态重置，后续再次悬浮可正常打开。

回滚说明：

- 如需回滚本轮细化，移除 `aicc-sider__menu-phone-icon` class/CSS，并恢复 `.aicc-sider__flyout` 的展示规则及 `closedFlyoutKey` 相关逻辑。

当前风险点：

- 本轮只处理鼠标交互关闭逻辑，未新增完整键盘导航行为。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 已通过本地浏览器 smoke check `/`，确认页面可加载、侧栏默认收起、`Call Management` 菜单项存在。

### 2026-05-21 15:39 +08:00 - 细化左侧菜单搜索、英文文案和视觉密度

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1539.md`
- `.codex-backup/current-todo-2026-05-21-1539.md`
- `.codex-backup/page-state-2026-05-21-1539.md`

修改原因：

- 用户要求展开态顶部不要只有独立收起按钮，需要在按钮旁增加菜单搜索。
- 用户要求系统菜单使用英文企业级呼叫中心规范文案。
- 用户要求菜单图标、文字大小、行高和间距贴合当前系统密度，不要与整体风格割裂。

修改结果：

- 展开态侧栏顶部改为紧凑的 Collapse 按钮 + `Search menu` 输入框。
- 收起态不显示搜索框，并在收起时清空搜索条件。
- 菜单文案调整为 Channel Simulation、Agent Center、Operations、Call Management、Reports 等英文用语。
- 菜单主项高度、子项高度、图标尺寸、字体和间距已整体压缩，贴近现有工作台密度。

回滚说明：

- 如需回滚本轮细化，可恢复 `BasicLayout` 中搜索相关 state、过滤逻辑和英文菜单文案，并恢复 `index.less` 中 `.aicc-sider__toggle`、`.aicc-sider__search`、菜单行高和图标尺寸相关样式。

当前风险点：

- 菜单搜索只过滤当前静态菜单项，不涉及路由或权限。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 已通过本地浏览器检查 `/`：展开态搜索可过滤 `Live Chat`，收起态搜索隐藏。
- 已通过本地浏览器检查 `/design-system`：页面可访问，未发现菜单调整影响页面主体。

### 2026-05-21 15:20 +08:00 - 构建左侧系统菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1520.md`
- `.codex-backup/current-todo-2026-05-21-1520.md`
- `.codex-backup/page-state-2026-05-21-1520.md`

修改原因：

- 用户要求左侧菜单默认收起，可通过顶部按钮展开/收起。
- 展开态需要显示一级菜单图标和文字，并支持点击一级菜单展开二级菜单。
- 收起态只显示一级图标，悬浮图标时在右侧显示二级菜单选择层。

修改结果：

- `BasicLayout` 的左侧菜单改为项目内自绘菜单结构，保留 Ant Design 图标和现有 `Sider` 容器。
- 菜单已配置为：测试菜单、个人中心、运营管理、呼叫管理、报表；其中前三项包含二级菜单。
- `appStore.collapsed` 默认值改为 `true`，确保进入系统时左侧菜单处于收起状态。
- `index.less` 新增侧栏顶部按钮、展开态二级菜单、收起态图标居中和右侧悬浮菜单样式。

回滚说明：

- 如需回滚本轮菜单，可恢复 `src/layouts/BasicLayout.tsx` 中旧的 Ant Design `Menu` 配置，恢复 `src/store/appStore.ts` 中 `collapsed` 默认值，并删除本轮新增的 `.aicc-sider__*` 菜单样式。

当前风险点：

- 菜单点击目前只维护本地选中态，不绑定业务路由或渠道模拟逻辑。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 已通过本地浏览器检查 `/` 与 `/design-system`，展开态和二级菜单交互正常；收起态浮层支持 hover/focus，自动化侧以 focus 路径确认浮层可见。

### 2026-05-21 12:22 +08:00 - CRM/Assistant 截图完整等比适配面板

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户要求 CRM 和 Assistant 两张截图完整放入对应框架内。
- 图片不能拉伸或撑大页面布局，也不能变形或显示不完整。

修改结果：

- `.inbound-system-shot > img` 从裁切式显示调整为 `object-fit: contain`。
- 图片保持 `width: 100%`、`height: 100%`，由固定面板约束，不参与撑大页面布局。
- 图片 `object-position` 调整为 `top center`，优先从顶部完整展示。

回滚说明：

- 如需恢复裁切铺满效果，将 `.inbound-system-shot > img` 改回 `object-fit: cover`。
- 当前不建议回滚，因为完整截图展示是本轮明确要求。

当前风险点：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 两个图片 URL 均返回 HTTP 200，且构建产物 `dist/screenshots/` 中包含两张图片。
- in-app browser 当前没有可用 pane，未完成截图级页面验收。

### 2026-05-21 12:15 +08:00 - 恢复 CRM/Assistant 客户截图加载

修改页面或文件：

- `public/screenshots/crm-workspace.jpg`
- `public/screenshots/assistant-workspace.jpg`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户指出 CRM 和 Assistant 区域应显示之前客户提供的截图，而不是代码 fallback。
- 之前截图资源目录为空，组件也被改成了直接渲染 fallback，导致图片不再显示。

修改结果：

- 已从本机客户资料目录找回 CRM 与 Assistant 截图，并复制到 `public/screenshots/`，使用不含旧品牌的资源文件名。
- `CrmPanel` 恢复为截图优先加载：`/screenshots/crm-workspace.jpg`。
- `AssistantPanel` 恢复为截图优先加载：`/screenshots/assistant-workspace.jpg`。
- 图片加载失败时仍显示 BANK 1 代码 fallback，避免空白。
- `.inbound-system-shot` 恢复为图片加载成功后显示截图，保持原有截图优先逻辑。

回滚说明：

- 如需回滚本次修复，删除两张 `public/screenshots/*.jpg` 并恢复 `CrmPanel.tsx`、`AssistantPanel.tsx`、`src/styles/index.less` 中本次图片加载逻辑。
- 不建议回滚截图优先加载，因为这是当前 CRM/Assistant 的明确展示要求。

当前风险点：

- 两个静态图片 URL 均返回 HTTP 200。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- in-app browser 当前没有可用 pane，未完成截图级页面验收。

### 2026-05-21 12:03 +08:00 - 恢复主 Workspace 旧版视觉并保留 BANK 1

修改页面或文件：

- `src/styles/tokens.less`
- `src/styles/index.less`
- `src/pages/DesignSystem.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户确认上一轮 Workspace 视觉重构方向错误，要求先恢复主页面原有稳定视觉。
- 本轮必须保留旧品牌到 `BANK 1` 的品牌替换，不还原旧品牌。
- 本轮明确不继续调整 Modal/Dialog。

修改结果：

- 顶部 Header 恢复旧版蓝色渐变、白色品牌文字和蓝色工作台阴影。
- App/Workspace 主背景恢复旧版浅色体系，移除主内容区新增的灰蓝大面层、边框和内阴影。
- Customer Information、Ticketing History、Next Best Action、Customer Journey 等主页面卡片恢复旧版白底/浅蓝高亮层级。
- Agent Toolbar 恢复旧版半透明话务条和深蓝 active/selected 状态。
- Design System 色彩展示恢复旧版 Gradient Blue、Background、Card Background 等 token 口径，保留 `BANK 1 AICC` 文案。
- Modal/Dialog 未作为本轮目标继续优化。

回滚说明：

- 如需回滚本次纠偏，仅恢复 `src/styles/tokens.less`、`src/styles/index.less`、`src/pages/DesignSystem.tsx` 中 2026-05-21 12:03 的主视觉回退内容。
- 不要回滚 `BANK 1` 品牌替换，除非用户明确取消保密要求。

当前风险点：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 本地 `http://127.0.0.1:5175/` 返回 HTTP 200；in-app browser 当前没有可用 pane，未完成截图级可视验收。

### 2026-05-21 11:43 +08:00 - BANK 1 品牌替换与 Workspace Surface Hierarchy

修改页面或文件：

- `index.html`
- `public/favicon.svg`
- `src/layouts/BasicLayout.tsx`
- `src/pages/DesignSystem.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/SendEmailModal.tsx`
- `src/mock/inbound.ts`
- `src/styles/tokens.less`
- `src/styles/theme.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户要求系统可见品牌从旧品牌统一替换为 `BANK 1`。
- 用户要求重新建立 Enterprise Workspace Surface Hierarchy，明确 App Background、Workspace、Card、Modal、Header / Active Surface 的层级。
- 当前 Modal 像独立页面，需要改为轻量企业工作台浮层。

修改结果：

- Header、Browser Title、metadata、Design System、CRM fallback、Assistant fallback、mock 文案和邮件模板已统一为 `BANK 1`。
- `src`、`index.html`、`public` 已无旧品牌可见文案残留。
- 全局 token 新增 L0-L4 surface 语义，并同步 Ant Design theme。
- Header 从重蓝色块改为浅色 L4 active surface。
- `.aicc-content` 形成 L1 Workspace Surface，卡片与 CRM/Assistant 面板形成 L2 Surface。
- Modal 改为 L3 浅灰蓝浮层，header 高度降低，header/body/section 层级更清晰。
- CRM/Assistant 不再加载公开截图，改为代码内 BANK 1 fallback，避免旧品牌截图显示。

回滚说明：

- 若需回滚视觉层级，恢复 `src/styles/tokens.less`、`src/styles/theme.ts`、`src/styles/index.less`。
- 若需回滚品牌替换，恢复上述业务组件、mock 和 metadata 文件，但需重新评估保密要求。
- 若需重新使用真实截图，必须先提供已脱敏的 BANK 1 截图资源，再恢复图片加载逻辑。

当前风险点：

- 浏览器已检查 `/`、`/design-system` 和签入后自动打开的 Inbound DOM；in-app browser pane 在后续 modal 点击验证时不可用，Modal 仍建议继续做一次可视检查。
- 当前仍缺少自动化测试。
- `npm run build` 通过，但 Vite 仍提示 chunk size warning。

### 2026-05-21 10:42 +08:00 - 建立项目级 AI 开发规则

修改页面或文件：

- 新增 `AGENTS.md`
- 更新 `PROJECT_CONTEXT.md`
- 更新 `DEV_LOG.md`
- 更新 `.codex-backup/key-prompts.md`
- 新增 `.codex-backup/context-snapshot-2026-05-21-1042.md`
- 新增 `.codex-backup/current-todo-2026-05-21-1042.md`
- 新增 `.codex-backup/page-state-2026-05-21-1042.md`

修改原因：

- 用户要求为当前项目建立项目级 AI 开发规则，让未来所有 Codex 会话自动继承项目开发规范，而不是只依赖当前聊天上下文或 Codex sidebar 历史。

修改结果：

- `AGENTS.md` 已定义项目背景、技术栈、页面结构、当前开发方向、强制文档同步规则、自动备份规则、会话恢复规则、新会话启动规则和重大修改后的输出规范。
- `PROJECT_CONTEXT.md` 已更新为先读取 `AGENTS.md`，并刷新了当前工作区状态、截图资源状态、TODO 和回滚说明。
- `.codex-backup/` 已新增本次 context snapshot、当前 TODO 和页面状态备份。
- `.codex-backup/key-prompts.md` 已补充本次项目级规则 prompt。

回滚说明：

- 本次没有修改业务源码。
- 如需回滚本次规则创建，删除 `AGENTS.md`，删除 2026-05-21 10:42 的三份备份文件，并恢复 `PROJECT_CONTEXT.md`、`DEV_LOG.md`、`.codex-backup/key-prompts.md` 中本次新增内容。

当前风险点：

- 当前业务源码已有较多未提交改动，本次文档任务未运行 `npm run lint` 或 `npm run build`。
- 本次未启动浏览器验证页面，截图资源虽已存在但未在 UI 中重新验收。

### 2026-05-20 19:18 +08:00 - 建立长期开发上下文管理机制

修改页面或文件：

- 新增 `PROJECT_CONTEXT.md`
- 新增 `DEV_LOG.md`
- 新增 `.codex-backup/README.md`
- 新增 `.codex-backup/context-snapshot-2026-05-20-1918.md`
- 新增 `.codex-backup/current-todo-2026-05-20-1918.md`
- 新增 `.codex-backup/page-state-2026-05-20-1918.md`
- 新增 `.codex-backup/key-prompts.md`
- 新增 `.codex-backup/session-restore-summary-2026-05-20.md`
- 新增 `.codex-backup/rollout-recovery-result-2026-05-20.md`

修改原因：

- 用户要求建立长期开发上下文管理机制，避免 sidebar 丢失、session 消失、切换账号或 Codex UI bug 导致开发上下文丢失。

修改结果：

- 当前项目上下文、页面关系、技术栈、已完成模块、TODO、已知风险和关键 prompt 已落入项目文件。
- `.codex-backup/` 已保存第一版 context snapshot、当前 TODO、页面状态、恢复摘要和 rollout 恢复结果。
- 以后重大修改后应同步更新 `PROJECT_CONTEXT.md`、`DEV_LOG.md` 和 `.codex-backup/`。

回滚说明：

- 本次仅新增文档与备份目录，没有修改业务源码。
- 如需回滚本次机制，删除上述新增文件和 `.codex-backup/` 即可。

当前风险点：

- 当前业务源码已有未提交改动，本次未运行 `npm run lint` 或 `npm run build`。
- 需要后续确认新增文档是否纳入 Git 提交。

### 2026-05-20 - 从 rollout/session 历史恢复上下文

修改页面或文件：

- 新增 `codex-recovered-context.md`

修改原因：

- 之前尝试恢复 Codex sidebar/cache/session 可见性，后来停止修复 UI/cache，转为从 rollout session 文件中提取项目上下文。

修改结果：

- 已识别 13 个与 `bca-aicc-demo-v2` 相关的历史 rollout session。
- 恢复了项目演进脉络、页面结构、已完成功能、当前 dirty changes、TODO 与继续开发建议。

回滚说明：

- `codex-recovered-context.md` 是恢复材料，可保留作为来源文档。
- 如删除该文件，应确保 `PROJECT_CONTEXT.md` 和 `.codex-backup/` 已完整承接其中内容。

当前风险点：

- 文件为 UTF-8 中文，PowerShell 非 UTF-8 读取时可能乱码。

### 2026-05-19 - CRM workspace tabs、截图预留与印尼语业务内容

修改页面或文件：

- `src/mock/inbound.ts`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/pages/inbound/components/NextBestActionCard.tsx`
- `src/pages/inbound/components/QuickActionCard.tsx`
- `src/pages/inbound/components/TicketingHistoryCard.tsx`
- `src/styles/index.less`
- `src/types/inbound.ts`

修改原因：

- Demo Enhancement & Localization。
- 将部分业务内容切换为印尼语。
- 将 CRM 与 Assistant 区域改为真实截图优先、fallback 兜底。
- 将 CRM 中心区从单一链接状态升级为 workspace tabs。

修改结果：

- 新增 `CrmWorkspaceTab` 类型。
- Ticketing / Next Best Action / Quick Action 可打开动态 CRM 业务 tab。
- CRM 固定 tab 优先加载 `code-based BANK 1 CRM fallback`，缺失时显示 fallback。
- Assistant tab 优先加载 `code-based BANK 1 Assistant fallback`，缺失时显示 fallback。
- 新增 Connection 状态面板。

回滚说明：

- 可按文件粒度回滚上述 10 个业务文件，但必须先确认用户是否仍需要当前改动。

当前风险点：

- 当前 `public/screenshots/` 不存在，两个截图资源尚未补充。
- 这些业务改动当前仍未提交。
- 本轮尚未重新执行 lint/build。

### 2026-05-19 - 修改浏览器标题和 metadata

修改页面或文件：

- `index.html`

修改原因：

- 将浏览器标题和 metadata 调整为 `BANK 1 AICC Demo`。

修改结果：

- 当前浏览器标题与演示品牌口径对齐。

回滚说明：

- 如需回滚，恢复 `index.html` 中 title 和 metadata 文案。

当前风险点：

- 无已知技术风险。

### 2026-05-19 - 建立 UI Design System

修改页面或文件：

- `src/pages/DesignSystem.tsx`
- `src/components/*`
- `src/styles/*`

修改原因：

- 为后续 Online Chat、Video Call、Dashboard、Admin、Supervisor 等页面建立统一组件与视觉规范。

修改结果：

- 新增 `/design-system` 页面。
- 建立 Base 组件体系，包括 BaseButton、BaseCard、BaseModal、BaseTable、BaseTabs、StatusBadge、ToolbarButton、SearchInput、TimelineFlow、CustomerInformationPanel。
- 旧 AppButton/AppCard/AppTable 兼容代理到新 Base 组件。

回滚说明：

- 不建议整体回滚。后续页面应复用该设计系统。

当前风险点：

- 大规模样式调整后需要持续通过浏览器验证页面无重叠和溢出。

### 2026-05-19 - GitHub 与 Vercel 部署配置

修改页面或文件：

- `DEPLOY.md`
- `vercel.json`
- Git remote `origin`

修改原因：

- 为项目部署到 Vercel 做配置。

修改结果：

- GitHub remote：`https://github.com/wuleiwulei3721-spec/bca-aicc-demo-v2.git`
- `vercel.json` 将路由重写到 `index.html`，避免 React Router 刷新 404。
- `DEPLOY.md` 记录 Vercel 推荐配置。

回滚说明：

- 如不使用 Vercel，可删除或修改 `vercel.json`。

当前风险点：

- `DEPLOY.md` 为 UTF-8 中文，读取时需注意编码。

### 2026-05-16 至 2026-05-18 - Inbound 工作台与 AICC 交互

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/*`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/*`
- `src/mock/*`
- `src/types/*`
- `src/styles/index.less`

修改原因：

- 构建银行 AICC 坐席工作台 demo。
- 实现 Inbound 电话来电弹屏、坐席状态机、话务状态机、客户资料、业务卡片和辅助弹窗。

修改结果：

- 完成 Home / Inbound tabs。
- 完成 Inbound 三栏布局。
- 完成 Customer Information、Customer Verification、Customer Journey、Ticketing History、Next Best Action、Quick Action。
- 完成 Transfer、Outbound Call、Internal Chat、Toolbar Settings、Call Flow Detail、Send Email 等弹窗。
- 完成 Ready、Incoming、Talking、Hold、Mute、Hang Up 和 ACW 状态流转。

回滚说明：

- 这是当前 demo 的主体，不建议整体回滚。
- 若需回滚单个交互，应先确认 `BasicLayout` 状态机、store 和 Inbound 页面之间的联动关系。

当前风险点：

- 页面交互多，缺少自动化测试，需要靠 lint/build 和浏览器 smoke check 验证。

### 2026-05-16 - 工程初始化与基础布局

修改页面或文件：

- Vite React TypeScript 工程文件。
- `src/App.tsx`
- `src/main.tsx`
- `src/routes.tsx`
- 基础 layout、store、styles、components、mock、types。

修改原因：

- 创建企业级前端 demo 工程骨架。

修改结果：

- 项目技术栈确定为 React + TypeScript + Vite + Ant Design + React Router + Zustand + Less。
- 建立基本目录结构、主题和路由。

回滚说明：

- 这是项目基础，不建议回滚。

当前风险点：

- README 仍偏 Vite 模板说明，后续可改为项目说明。


