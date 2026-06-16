# Context Snapshot - 2026-06-13 12:10 +08:00

## 项目目标

- 继续收敛管理台页面布局规范，重点修正 `Routing Config > Skill Routing Rules` 查询区宽屏空位问题。

## 本轮修改

- 确认 `Status` 字段并非宽度不足；此前右侧 `Batch Add` grid 主操作列提前挤压了第一行筛选区。
- `Skill Routing Rules` 桌面 toolbar 改为 filters 使用完整宽度，`Batch Add` 绝对定位到底部右侧。
- 1400px 以上宽屏时，`Search / Reset` 独立换到第二行左侧，避免与右侧 `Batch Add` 重叠。
- 960px 以下仍恢复普通静态堆叠，避免移动端绝对定位。

## 关键文件

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 验证

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 chunk size warning。
- Chrome CDP 检查：1366x768 保持 6+Status 行布局；1600x768 下 Status 进入第一行，Search/Reset 与 Batch Add 第二行左右对齐且无重叠。
