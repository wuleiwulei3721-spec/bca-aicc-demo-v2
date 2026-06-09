# Context Snapshot - 2026-06-06 15:47 +08:00

## 项目状态

- 项目：`bca-aicc-demo-v2`
- 分支：`main`
- 本轮基于 14:55 动态题库实现继续优化 Customer Verification Assist。
- 目标：把验证弹窗从“规则说明页”压缩为坐席操作优先的紧凑弹窗。

## 本轮完成

- Customer Verification Assist 顶部改为一行紧凑信息栏：`Channel Type`、`Business Type`、`Correct/Wrong/Skip/Status`。
- 规则和进度合并为轻量 rule bar；详细规则 notes 放入问号 popover。
- 题目行只显示序号、题目分组、问题文本和操作按钮。
- 坐席 UI 不展示 `Demo answer`、`Source`、标准答案或答案来源。
- 单题状态可覆盖修改：`Wrong -> Correct`、`Skip -> Correct` 等都会实时更新统计。
- 错答达到上限后，在点击 `Apply Failed` 前仍可修正；错答数低于上限后恢复 `In Progress`。
- `Reset Progress` 改名为 `Clear All`，只用于主动清空整次验证进度。

## 关键文件

- `src/pages/inbound/components/CustomerVerificationModal.tsx`：紧凑验证弹窗、规则 popover、无答案展示、通过/失败前可改题。
- `src/pages/inbound/components/CustomerInformationCard.tsx`：单题状态覆盖后重新计算下一个 active question。
- `src/styles/index.less`：紧凑 toolbar、rule bar、题目行、PIN 提示和空态样式。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- Browser smoke check `/`：
  - PSTN `Phone + Perbankan` 紧凑弹窗正常。
  - `Demo answer` 和 `Source` 在弹窗中计数为 0。
  - `Wrong -> Correct`、`Skip -> Correct` 可直接改选并更新统计。
  - 错答 3 次后显示 `Apply Failed`，改一题后恢复 `In Progress`。
  - 达标后 `Apply Verified` 可用。
  - BankApp Voice 未 PIN 时显示紧凑 PIN 提示；客户提交 PIN 后坐席侧加载 `HaloApp Registered` 规则。
- Browser smoke check `/design-system`：页面正常加载。

## 风险

- 本轮只改前端展示和状态覆盖逻辑，不改变真实生产答案校验方案。
- `answer` / `answerSource` 仍保留在 mock/type 中供内部讨论；生产环境是否允许前端持有答案仍需客户确认。
