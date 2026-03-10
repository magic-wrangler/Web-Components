## 目标

让 `DefinedSwitch` 的 `state.checked`（[defined-switch.js:L18-L20](file:///d:/github/Web-Components/apps/my-component/src/defined-switch.js#L18-L20)）真正控制开关的 UI（input 的 checked 状态），并且能在点击后切换、对外可用（属性/事件）且能重新渲染。

## 现状与问题定位

- 组件继承的 `CommonComponent` 仅在 `connectedCallback` 时渲染一次（[common-component.js](file:///d:/github/Web-Components/apps/my-component/src/common-component.js)），之后 `state` 变化不会自动触发 rerender。
- 模板里 `@click=${this.change(this)}` 会在渲染时立即执行 `change`，并把返回值（`undefined`）当成事件处理器，导致点击不生效或行为异常（[defined-switch.js:L192](file:///d:/github/Web-Components/apps/my-component/src/defined-switch.js#L192)）。
- `<input ... />` 没有绑定 `checked`，所以即使 `state.checked` 变化，也不会影响 UI（[defined-switch.js:L193](file:///d:/github/Web-Components/apps/my-component/src/defined-switch.js#L193)）。
- `attributeChangedCallback` 里 `newValue` 是字符串或 `null`，直接赋给 `state.checked` 会变成 `"true"`/`""`/`null` 这类值，不稳定（[defined-switch.js:L207-L212](file:///d:/github/Web-Components/apps/my-component/src/defined-switch.js#L207-L212)）。

## 实施方案

### 1) 建立“状态 -> 视图”的单向绑定

- 在模板的 `<input>` 上使用 lit-html 的布尔 attribute 绑定：
  - `?checked=${this.state.checked}`
  - 这样 `state.checked === true` 时，input 会呈现开启状态；反之关闭。

### 2) 修正点击事件绑定方式

- 将 `@click=${this.change(this)}` 改为“传函数引用”，保证点击时才执行：
  - 推荐：`@click=${this.change.bind(this)}`
  - 或：`@click=${() => this.change()}`（更直观，但会在每次渲染创建新函数）

### 3) 在状态变化后触发 rerender（关键）

由于当前 `CommonComponent` 不会自动 rerender，需要在 `DefinedSwitch` 里显式刷新 UI：

- 引入 lit-html 的 `render`，在 `change()` 内切换 `state.checked` 后，调用 `render(this.render(), this)` 重新渲染。
- 同理，在 `attributeChangedCallback` 里同步 `state.checked` 后也 rerender，确保外部通过 attribute 控制时 UI 会更新。

> 说明：这是最小改动方案，不引入复杂状态管理，仅补齐“状态改变后重新渲染”的能力。

### 4) 让属性 `checked` 与 `state.checked` 互相同步（可声明式控制）

目的：允许外部这样用：`<defined-switch checked></defined-switch>` 或运行时 `el.setAttribute('checked','')` 控制开关。

- 约定：`checked` attribute 存在即为 true（HTML 布尔属性语义）。
- 实现点：
  - 在 `attributeChangedCallback` 中使用 `this.state.checked = newValue !== null`（而不是直接赋 `newValue`）。
  - 在 `change()` 中切换 `state.checked` 后，同步反射到 attribute：
    - true：`this.setAttribute('checked', '')`
    - false：`this.removeAttribute('checked')`
  - 为避免“attributeChangedCallback -> rerender -> 再 setAttribute -> 循环”，需要确保 set/remove 只在状态真正变化时执行（比较当前 attribute 状态）。

### 5) 对外派发 change 事件（可选但推荐）

- 在 `change()` 切换完成并 rerender 后，派发事件：
  - `this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.state.checked } }))`
- 这样外部可以监听：`el.addEventListener('change', (e) => ...)`

## 验收标准（自测）

- 点击 label 区域，开关视觉（轨道颜色/滑块位置）随 `state.checked` 切换。
- 外部手动加/删 `checked` attribute 时，UI 立即同步变化。
- `change` 事件可被外部监听，且 `detail.checked` 与 UI 一致。

## 变更范围（执行阶段会改哪些地方）

- 修改：`d:\github\Web-Components\apps\my-component\src\defined-switch.js`
- 可选修改（若要更通用）：`d:\github\Web-Components\apps\my-component\src\common-component.js` 增加一个 `update()`/`requestUpdate()` 方法供子类调用（但最小方案不强制动它）。
