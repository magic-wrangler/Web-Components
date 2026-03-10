## 目标

在 `d:\github\Web-Components\apps\demo1` **新增**一个“简单但可用”的 Switch（开关）示例：提供清晰的 HTML 结构与 CSS 样式（含 hover / focus / disabled / checked 状态），并保持可访问性。

约束：**不修改现有 `index.html` / `index.js`**，避免影响原有 demo。

## 当前现状（已确认）

- 现有 demo 入口为 [index.html](file:///d:/github/Web-Components/apps/demo1/index.html)，引用 [index.js](file:///d:/github/Web-Components/apps/demo1/index.js) 并渲染 `<defined-switch>`。
- 现有组件未实现 UI，但本次不触碰其代码。

## 实施方案（新增文件）

### 1) 新增一个独立的演示页面 `switch.html`

- 新建 `apps/demo1/switch.html`，页面内直接写入：
  - Switch 的 **HTML 结构**：`<label class="switch">` 包裹 `input[type="checkbox"]` + “轨道/滑块”元素。
  - Switch 的 **CSS 样式**：使用 CSS 变量控制尺寸与色值；通过 `:checked` / `:disabled` / `:focus-visible` 等选择器完成状态样式；点击区域完整、键盘可操作。
- 页面提供 2~3 个示例：默认、默认开、禁用（便于一次看全状态）。

### 2)（可选）新增极少量 JS，仅用于展示状态

如果你希望页面能实时展示“当前是否开启”，则：

- 新增 `apps/demo1/switch-demo.js`（或直接内联在 `switch.html`），只做事件监听与文本更新，不改动 UI 结构与样式。

## 验收标准（自测）

- 打开 `switch.html` 后能看到开关 UI，默认/选中/禁用的差异明显。
- 鼠标点击能切换，键盘 Tab 聚焦后按 Space 也能切换。
- `disabled` 时不可切换、呈灰态、鼠标指针反馈正确。
- 聚焦时有明显 focus ring（`:focus-visible`）。

## 变更范围

- 新增：`d:\github\Web-Components\apps\demo1\switch.html`
- 可选新增：`d:\github\Web-Components\apps\demo1\switch-demo.js`
