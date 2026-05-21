# Context Snapshot - 2026-05-21 11:43 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统，核心是企业级客服坐席工作台。当前重点是 Inbound 电话来电弹屏、CRM workspace、AI Assistant、客户资料、工单、下一步行动建议、坐席状态机和话务工具条。

## 本次修改

- 全局可见品牌统一为 `BANK 1`。
- Browser Title 与 metadata 改为 `BANK 1 AICC Demo`。
- 重建 Enterprise Workspace Surface Hierarchy：
  - L0 App Background：蓝灰应用背景。
  - L1 Workspace Surface：主工作区浮现层。
  - L2 Card Surface：卡片与 CRM/Assistant 面板层。
  - L3 Modal Surface：轻量浅灰蓝浮层。
  - L4 Header / Active Surface：Header、Active tab、Selected button。
- Header 从重色块改为轻量 L4 surface。
- Modal 降低 header 高度，使用浅灰蓝 surface 和轻 divider。
- CRM/Assistant 停止加载公开截图，改为代码内 BANK 1 fallback。

## 关键文件

- `src/styles/tokens.less`
- `src/styles/theme.ts`
- `src/styles/index.less`
- `src/layouts/BasicLayout.tsx`
- `src/pages/DesignSystem.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/mock/inbound.ts`
- `index.html`
- `public/favicon.svg`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- 浏览器检查：
  - `/`：Title 为 `BANK 1 AICC Demo`，DOM 中无旧品牌。
  - 签入后 Inbound 自动打开：CRM/Assistant fallback 显示 BANK 1 文案，DOM 中无旧品牌。
  - `/design-system`：显示 BANK 1 AICC 与 L0-L4 surface tokens，DOM 中无旧品牌。

## 风险

- in-app browser pane 在后续 modal 点击验证时不可用，Modal 仍建议继续做一次可视检查。
- 旧公开截图已从 `public/screenshots/` 移除；如后续需要截图展示，必须补充已脱敏 BANK 1 资源。
- 当前工作区仍有较多历史未提交改动，不要回滚用户或历史会话改动。
