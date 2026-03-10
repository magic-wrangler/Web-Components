## 目标

解释在 Shadow DOM 场景下（[common-component.js:L10](file:///d:/github/Web-Components/apps/my-component/src/common-component.js#L10)）如何正确使用 CSS 变量，并判断 [defined-switch.js:L49-L62](file:///d:/github/Web-Components/apps/my-component/src/defined-switch.js#L49-L62) 里写在 `:root` 下的变量是否会失效。

## 结论（先给答案）

- **不是“用了 Shadow DOM 就不能用 CSS 变量”**。CSS 自定义属性（`--xxx`）可以在 Shadow DOM 里正常使用，并且**可以从外部（宿主元素 / 文档 :root）穿透继承进 Shadow Tree**。
- 但你现在把默认变量写在 `:root { ... }`（位于 Shadow DOM 内部样式里）时，**很可能不会按你预期生效**：在 Shadow Tree 里更推荐用 `:host { ... }` 来给组件设置默认变量，或者在 `var()` 里提供 fallback。

## 原因解释（为什么 `:root` 容易踩坑）

- `:root` 的语义是“文档根元素（通常是 `<html>`）”。
- 你的样式是在组件的 Shadow Root 里渲染的，不在文档根元素作用域内。
- 因此在 Shadow DOM 内部写 `:root { --switch-w: ... }`，**选择器很可能匹配不到任何元素**，导致这些变量没有被声明出来。

## 推荐方案（执行阶段会选其一）

### 方案 A（推荐）：把默认变量从 `:root` 改到 `:host`

- 在组件内部样式中写：
  - `:host { --switch-w: 44px; ... }`
- 这样变量会定义在宿主元素上，并能被 Shadow Tree 内部正常继承使用。

### 方案 B（更稳健）：在使用处提供 fallback，避免“未定义就失效”

- 把 `width: var(--switch-w);` 改为：
  - `width: var(--switch-w, 44px);`
- 好处是：即使你完全不声明 `--switch-w`，组件也有合理默认值。
- 同时外部仍然可以通过设置 `--switch-w` 覆盖默认值。

### 外部如何覆盖（无论 A/B 都支持）

外部页面可以这样覆盖组件样式参数：

- 在宿主元素上：
  - `<defined-switch style="--switch-on: #f97316;"></defined-switch>`
- 或在全局（文档 `:root`）：
  - `:root { --switch-on: #f97316; }`

因为 CSS 自定义属性会按继承链传到宿主元素，再进入 Shadow Tree 供内部 `var(--switch-on)` 使用。

## 验收标准（自测）

- 组件使用 Shadow DOM 时，默认变量仍然生效（开关尺寸/颜色正常）。
- 外部设置 `style="--switch-w: 60px"` 后，组件内部尺寸即时变化。

## 变更范围（如果你确认执行）

- 修改：`d:\github\Web-Components\apps\my-component\src\defined-switch.js`
  - 将 `:root { ... }` 改为 `:host { ... }`（方案 A）
  - 可选：在关键 `var()` 使用处补 fallback（方案 B）
