# Context Snapshot - 2026-05-21 15:55 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。本轮继续只细化左侧系统菜单，避免影响 Inbound、Design System 和现有 AICC 话务工作台逻辑。

## 本次修改

- 侧栏 `Call Management` 电话图标水平翻转。
- 收起态二级菜单浮层保留鼠标 hover 打开。
- 点击一级菜单或二级菜单后，当前浮层会被关闭并抑制显示。
- 鼠标移出当前菜单/浮层区域后，抑制状态重置，下次悬浮可再次打开。

## 关键文件

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- Browser smoke check `/`：页面可加载，左侧菜单默认收起，`Call Management` 菜单项存在。

## 风险

- 本轮按用户要求处理鼠标交互关闭逻辑，未新增完整键盘导航触发/关闭规则。
- 菜单仍未绑定真实路由、权限或渠道模拟流程。
