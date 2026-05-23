# BANK 1 AICC Demo V2 - 开发日志

最后更新：2026-05-23 19:33 +08:00
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


