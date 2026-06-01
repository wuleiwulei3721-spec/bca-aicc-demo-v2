# Context Snapshot - 2026-05-27 03:02 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/livechat2-popup`

## 当前状态

- 在 `livechat2` 并行弹屏基础上补齐客户列表顶部能力。
- 本轮只调整 `livechat2` 客户列表、局部状态和样式，不修改旧 `Live Chat`。
- 当前分支仍未 push 到 GitHub。

## 本轮关键修改

- `LiveChat2CustomerPanel` 顶部新增 ALL / WhatsApp / BankApp / Webchat 渠道筛选。
- `LiveChat2CustomerPanel` 顶部新增收起/展开按钮。
- `LiveChat2Page` 新增本地状态：客户列表收起态、渠道筛选、Current/History 当前视图。
- Current / History 从上下两段展示改为左右切换。
- 客户卡片从三行压缩为两行，移除第三行渠道名称和业务类型。
- 渠道图标恢复为方形图标样式。
- 收起态第一列缩到 56px，仅保留渠道筛选和客户图标。

## 验证状态

- `npm run lint`：通过。
- Browser `/`：`livechat2` 顶部渠道筛选存在。
- Browser `/`：Current / History 左右切换可用。
- Browser `/`：客户行不再显示 `WhatsApp Card Services`、`BankApp Digital Banking` 这类第三行组合信息。
- Browser `/`：收起态可用，显示展开按钮并隐藏 `Serving` 文案。

## 风险

- 渠道筛选、收起态和 Current/History 视图为页面本地 UI 状态，刷新后恢复默认。
- 仍需在目标演示分辨率下人工复查两行客户卡片和收起态图标密度。
