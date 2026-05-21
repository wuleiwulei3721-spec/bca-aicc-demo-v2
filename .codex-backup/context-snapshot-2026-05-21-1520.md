# Context Snapshot - 2026-05-21 15:20 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。当前主 Workspace 保持旧版稳定视觉，本轮完成左侧系统菜单构建，要求不影响 Inbound、Design System 和现有 AICC 话务工作台逻辑。

## 本次修改

- `BasicLayout` 左侧菜单由旧的单层 Ant Design `Menu` 改为项目内自绘菜单结构。
- 左侧菜单默认收起，顶部按钮可展开/收起。
- 展开态显示一级菜单图标和文字，点击含子项的一级菜单后在下方展开二级菜单。
- 收起态只显示一级菜单图标，图标保持居中；含子项的一级菜单支持右侧悬浮子菜单。
- `appStore.collapsed` 默认值改为 `true`。

## 菜单结构

- 测试菜单：PSTN/voice、chat、video。
- 个人中心：个人信息、我的服务记录。
- 运营管理：预警指标管理、现场管理。
- 呼叫管理：暂不配置二级菜单。
- 报表：暂不配置二级菜单。

## 关键文件

- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- 本地 dev server：`http://127.0.0.1:5176/`。
- Browser 检查 `/`：默认收起、展开按钮、展开态二级菜单正常。
- Browser 检查 `/design-system`：页面可访问，展开菜单后未发现页面不可用。
- 收起态浮层：CSS 覆盖 hover/focus；自动化侧已通过 focus 路径确认右侧浮层可见。

## 风险

- 菜单点击目前只维护选中态，不绑定实际路由、权限或渠道模拟逻辑。
- 展开菜单会占用 `220px` 左侧宽度，仍需在最终演示分辨率下复查 Inbound 三栏宽度。
