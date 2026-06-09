# Context Snapshot - 2026-06-06 14:55 +08:00

## 项目状态

- 项目：`bca-aicc-demo-v2`
- 分支：`main`
- 目标：银行 AICC 前端演示系统，客户可见版本继续保留主工作台、Channel Simulation、BankApp、WhatsApp、PSTN、Voice/Video handoff、正式 Live Chat 和 Design System。
- 本轮完成：客户身份验证从固定 10 问升级为 Customer Verification Assist，按 `Verification Channel Type + Business Type` 动态加载题库和通过规则。

## 本轮新增能力

- `CustomerInformationCard` 的 `Verify` 弹窗根据当前客户入口计算验证渠道类型：
  - PSTN / Phone -> `phone`
  - BankApp/HaloApp Voice 未完成 PIN -> `haloapp-unregistered`
  - BankApp/HaloApp Voice 完成 PIN -> `haloapp-registered`
  - WhatsApp / Webchat / Video 保留渠道类型识别，规则待客户确认。
- 坐席可在验证弹窗中修改本次业务类型，切换后题库和答题进度重置。
- 答题动作包括 `Correct / Wrong / Skip`；必问题计入总答对数，错答按一次验证会话累计，`Skip` 不计错也不计对。
- 达到通过条件后 `Apply Verified` 可用；错答达到规则上限后 `Apply Failed` 可用。
- BankApp/HaloApp 入口新增 `Send PIN Verification`，发送后客户侧 BankApp Demo 弹出 4 位 PIN 输入页，提交后坐席侧进入 `HaloApp Registered` 规则。

## 关键文件

- `src/types/inbound.ts`：新增验证渠道类型、业务类型、题目分组、业务选项、验证题目扩展字段和验证规则类型。
- `src/mock/inbound.ts`：新增 `verificationBusinessTypes` 和 `verificationRules`，覆盖 5 个优先 demo 组合。
- `src/store/appStore.ts`：新增 BankApp PIN verification status、request id 和 request/complete/reset 动作。
- `src/pages/bankapp/BankAppDemoPage.tsx`：新增 PIN 输入页和 process rail 状态。
- `src/pages/inbound/components/CustomerInformationCard.tsx`：接入动态规则选择、业务类型切换、PIN 状态和验证进度控制。
- `src/pages/inbound/components/CustomerVerificationModal.tsx`：重构为动态验证助手弹窗。
- `src/styles/index.less`：新增验证助手、PIN panel、问题列表、BankApp PIN 手机页样式。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：
  - PSTN `Phone + Perbankan` 规则可通过。
  - 同一会话错答 3 次后进入失败。
  - BankApp Voice 可发送 PIN，客户侧输入 PIN 后坐席侧变为 `HaloApp Registered`。
  - HaloApp Registered 弹窗切换 `Paylater` 后题库和进度重置。
- Browser smoke check `/design-system`：页面正常加载。

## 风险

- 当前仅为前端 demo mock，不接真实验证服务或数据源。
- Demo 显示标准答案，生产是否允许坐席看到答案需客户确认。
- HaloApp PIN 成功后的规则等同性、其它已认证入口减免范围、错答失败处置、验证记录落库和特殊场景触发条件仍未确认。
