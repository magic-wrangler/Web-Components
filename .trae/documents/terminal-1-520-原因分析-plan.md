## 目标
分析 Terminal#1（第 1-520 行）报错原因，给出可复现的定位路径与对应修复方案，并在修复后用仓库既有脚本验证。

## 已知背景（基于仓库检索）
- 仓库使用 pnpm workspace，且开启 engine-strict；Node/pnpm 版本不满足会在安装阶段直接失败。
- 根脚本入口：`pnpm build/dev/test/lint:*`；构建走 `scripts/build.js` + `scripts/buildBase.js`（rollup 打包多个 packages）。
- `pnpm -r test` 可能失败：`packages/utils` 与 `packages/components` 的 `test` 脚本当前是占位并 `exit 1`。
- Vitest 配置含 browser 项目（chromium）；环境缺失会导致测试阶段报错。
- Husky hook 通过 `sh` 执行；某些 Windows/CI 环境可能出现 `sh not found`。
- workspace 覆盖 `apps/*`；若目录下存在非包目录（无 package.json），pnpm 扫描可能产生告警/异常（与 pnpm 版本/配置相关）。

## 输入要求（用于精确定位）
需要从 Terminal#1 第 1-520 行中抽取以下信息：
1) 触发命令：你当时运行的是 `pnpm i` / `pnpm build` / `pnpm test` / `git commit` 等哪一个
2) 首个 ERROR 的完整堆栈/报错块（包含文件路径与行号/包名）
3) 报错发生阶段：install / build / test / lint / husky hook / 运行时

> 说明：目前对话里没有包含 Terminal#1 的具体文本内容，因此计划会先以“可复现定位流程”为主；执行阶段会以终端输出为准做定点修复。

## 分析与定位步骤（执行阶段按顺序做，确保不遗漏）
1) 复现/回放报错
   - 若你能直接粘贴 Terminal#1(1-520) 文本：直接解析并定位到首个根因。
   - 若无法粘贴：根据你运行的命令在本地复跑同一命令，拿到一致的报错输出（保留完整日志）。
2) 归类报错类型（按“最早出现的失败点”归类）
   - 引擎/安装类：出现 `Unsupported engine`、`ERR_PNPM_*`、`engine-strict` 等。
   - workspace 扫描类：出现 `No package.json found`、`workspace package`、`filter`、`recursive` 相关提示。
   - 构建链路类（rollup/ts）：出现 `RollupError`、`TSxxxx`、`Cannot find module`、`buildOptions` 相关异常。
   - 测试链路类（vitest/browser）：出现 `vitest`、`chromium`、`playwright`、`browser` 相关错误。
   - Git hooks 类：出现 `husky`、`sh: not found`、`pre-commit`、`lint-staged` 等。
3) 映射到仓库入口与配置
   - install：根 `package.json` 的 `engines` + `.npmrc(engine-strict)`。
   - build/dev：`scripts/build.js`、`scripts/buildBase.js`，以及目标 package 的 `package.json buildOptions`。
   - test：根 `vitest.config.ts` + 被递归执行的子包 `package.json scripts.test`。
   - lint：根 `eslint.config.js`、`prettier`、`cspell` 配置与匹配到的文件路径。
   - hooks：`.husky/pre-commit` 与本机 shell 能力。
4) 确认“根因”而非“表象”
   - 只看第一处失败：后续错误往往是级联（例如构建失败导致测试找不到产物）。
   - 若有多处 error：以最先出现且能解释后续错误的那一条为根因。

## 预期输出（交付物）
1) 对 Terminal#1(1-520) 的根因定位说明：指出是哪条错误信息触发、对应仓库哪个入口/配置。
2) 具体修复方案（代码/配置/命令级别），并解释为什么能解决问题。
3) 验证步骤：用仓库现有脚本验证（例如 `pnpm build` / `pnpm test` / `pnpm lint:*`），确保无回归。

## 常见根因 → 修复方向（作为对照表，执行阶段按日志精确选择）
1) Node/pnpm 版本不满足
   - 方向：升级到满足 `node>=22.14.0`、`pnpm>=10.15.0`；或在明确允许的情况下调整 engines/engine-strict（更偏向升级环境）。
2) `pnpm -r test` 递归执行导致占位脚本失败
   - 方向：避免递归跑 test；或为子包补齐真实 test 脚本/改为 noop（取决于期望的 CI 行为）。
3) workspace 扫描到非包目录
   - 方向：收紧 `pnpm-workspace.yaml` 的 glob；或在非包目录补齐 `package.json`（一般不建议）。
4) Vitest browser/chromium 环境缺失
   - 方向：补齐 browser 运行依赖（如需要时安装/初始化）；或将 browser 项目拆分为可选任务。
5) Husky 在 Windows/CI 缺少 sh
   - 方向：确保运行环境提供 sh；或将 hook 改为跨平台方式（如用 node 执行脚本）。

