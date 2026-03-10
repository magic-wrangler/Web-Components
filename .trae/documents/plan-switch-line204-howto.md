## 目标

把 [defined-switch.js:L204](file:///d:/github/Web-Components/apps/my-component/src/defined-switch.js#L204) 的 `<input>` 写法改成 lit-html 正确的“状态绑定 + 事件绑定”，从而让 `this.state.checked` 真正控制 input 的开关状态，并能响应用户操作。

## 问题说明（为什么你现在那行不行）

你选中的写法类似：

```js
<input ... ${this.state.checked ? 'checked' : ''} @click=${...} />
```

在 lit-html 里，`${...}` 直接插在标签属性区域，**它不是“拼字符串生成属性”**的语义；通常会变成无意义的插值位置，达不到稳定设置 `checked` 属性的效果。

正确做法是使用 lit-html 的专用语法：

- **布尔属性**：`?checked=${boolean}`
- **普通属性**：`.value=${...}` / `attr=${...}`（视情况）
- **事件绑定**：`@click=${handler}` / `@change=${handler}`

## 实施方案（推荐写法）

### 方案 A（推荐）：用 `@change`，由 input 自己驱动状态

1. 将 `checked` 的控制改成布尔绑定：
   - `?checked=${this.state.checked}`
2. 将事件从 `@click` 改为 `@change`：
   - `@change=${this.onInputChange.bind(this)}`
3. 新增一个方法 `onInputChange(e)`：
   - 读取 `e.target.checked` 得到真实状态
   - 同步到 `this.state.checked`
   - 同步到 `checked` attribute（如需要对外可声明式控制）
   - 触发 rerender（因为当前基类不会自动更新）

这样做的好处：

- checkbox 的“键盘操作/鼠标点击/辅助技术”都会触发 change，更符合语义
- 不会出现 label 点击/冒泡导致的重复切换问题

### 方案 B：仍然用 label 点击切换（不推荐，但最少改动）

1. input 只负责展示：
   - `?checked=${this.state.checked}`
2. 点击绑定放在 label：
   - `@click=${this.change.bind(this)}`
3. `change()` 内切换状态、同步 attribute、并 rerender

注意：如果 input 同时也绑定 click/change，容易出现一次操作切两次的情况，需要显式避免重复触发。

## 验收标准（自测）

- 初始渲染：`this.state.checked === true` 时 UI 为开；false 时为关
- 用户交互：点击/键盘 Space 切换后 UI 正确更新
- 外部控制：增删 `checked` attribute 时 UI 能同步变化（如果你启用了 attribute 同步）

## 变更范围（执行阶段会改哪些地方）

- 修改：`d:\github\Web-Components\apps\my-component\src\defined-switch.js`
  - 重写 L204 的 `<input>` 绑定方式（使用 `?checked=...`）-（若采用方案 A）新增 `onInputChange` 并把事件绑到 `@change`
