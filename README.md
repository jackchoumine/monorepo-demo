# monorepo-demo

monorepo 学习

## 创建 monorepo 环境

### 使用 create-vue 初始化一个项目

为何使用它呢？

因为不想从零配置各种环境，比如 eslint、playwright等环境。

在 monorepo-demo 执行命令：

```bash
npm create vue@latest
```

输入项目名称 vue3-ui，所有选项都选上。

把 package.json、.editorconfig、.prettierrc.json、eslint.config.ts、tsconfig.vitest.json、tsconfig.node.json 和`.vscode`移动到 monorepo-demo 中，新增 package.json 为：

```json
{
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {},
  "dependencies": {
    "pinia": "~3.0.1",
    "vue": "~3.5.13",
    "vue-router": "~4.5.0"
  },
  "devDependencies": {
    "@playwright/test": "~1.51.1",
    "@tsconfig/node22": "~22.0.1",
    "@types/jsdom": "~21.1.7",
    "@types/node": "~22.14.0",
    "@vitejs/plugin-vue": "~5.2.3",
    "@vitejs/plugin-vue-jsx": "~4.1.2",
    "@vitest/eslint-plugin": "~1.1.39",
    "@vue/eslint-config-prettier": "~10.2.0",
    "@vue/eslint-config-typescript": "~14.5.0",
    "@vue/test-utils": "~2.4.6",
    "@vue/tsconfig": "~0.7.0",
    "eslint": "~9.22.0",
    "eslint-plugin-oxlint": "~0.16.0",
    "eslint-plugin-playwright": "~2.2.0",
    "eslint-plugin-vue": "~10.0.0",
    "jiti": "~2.4.2",
    "jsdom": "~26.0.0",
    "npm-run-all2": "~7.0.2",
    "oxlint": "~0.16.0",
    "prettier": "3.5.3",
    "typescript": "~5.8.0",
    "vite": "~6.2.4",
    "vite-plugin-vue-devtools": "~7.7.2",
    "vitest": "~3.1.1",
    "vue-tsc": "~2.2.8"
  }
}
```

> 为何要把这些配置移动到根目录?

因为希望这些配置被多个项目共享。

> 为何使用`~`依赖版本范围？

因为希望保持依赖版本稳定，又能得到 bug 修复。

希望后续安装的依赖都使用`~`，创建`monorepo/.npmrc`:

```bash
# save-exact 的优先级更加高
# save-exact=true
# 相似版本
save-prefix=~
# 从淘宝镜像下载
registry=https://registry.npmmirror.com
```

### 搭建 pnpm workspace 环境

在目录创建`pnpm-workspace.yaml`:

```yaml
packages:
  # 子包目录
  - 'packages/*'
  # 放置测试项目
  - 'examples/**'
  # exclude packages that are inside test directories
  - '!**/test/**'
```

把刚才创建的 vue3-ui 移动到 packages 中。

修改 package.json 如下：

```json
{
  "name": "vue3-ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "test:unit": "vitest",
    "test:e2e": "playwright test",
    "test:unit:q": "vitest --watch=false",
    "build-only": "vite build",
    "type-check": "vue-tsc --build",
    "lint:oxlint": "oxlint . --fix -D correctness --ignore-path .gitignore",
    "lint:eslint": "eslint . --fix",
    "lint": "run-s lint:*",
    "format": "prettier --write src/"
  },
  "peerDependencies": {
    "pinia": "~3.0.1",
    "vue": "~3.5.13",
    "vue-router": "~4.5.0"
  },
  "devDependencies": {
    "pinia": "~3.0.1",
    "vue": "~3.5.13",
    "vue-router": "~4.5.0"
  }
}
```

修改 `packages/vue3-ui/tsconfig.json`:

```json
{
  "files": [],
  "references": [
    {
      "path": "../../tsconfig.node.json"
    },
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "../../tsconfig.vitest.json"
    }
  ]
}
```

修改`monorepo/tsconfig.vitest.json`:

```json
{
  "extends": "./packages/vue3-ui/tsconfig.app.json",
  "include": ["src/**/__tests__/*", "env.d.ts"],
  "exclude": [],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.vitest.tsbuildinfo",

    "lib": [],
    "types": ["node", "jsdom"]
  }
}
```

然后在跟目录安装依赖：

```bash
pnpm i -r # -r 表示递归安装
```

增加 vue3-ui 项目启动脚本：

`monorepo-demo/package.json`:

```json
{
  "scripts": {
    "dev:ui": "pnpm --filter=vue3-ui run dev",
    "build:ui": "pnpm --filter=vue3-ui run build",
    "test:unit:ui": "pnpm --filter=vue3-ui run test:unit:q",
    "test:e2e:ui": "pnpm --filter=vue3-ui run test:e2e"
  }
}
```

依次执行以上脚本，验证环境是否可用。

一切都正确了，就说明环境搭建好了。

## 搭建 husky + lint-stage 代码质量检查工作量流

### husky 是什么？

[husky](https://typicode.github.io/husky/zh/) 的读音为 /ˈhʌski/，一个现代化的 git 钩子管理工具，在代码提交或推送前自动执行校验脚本，确保代码符合项目规范。

工作流

![husky-run.png](https://cdn.jsdelivr.net/npm/zqj-pics/code-style/husky-run.png)

> 典型的是一个场景：

- git 钩子简化管理：

  - 提供简单的方式添加和管理 git 钩子
  - 支持所有 Git 钩子（pre-commit、commit-msg、pre-push 等）

- 质量保障自动化：

  - 在提交前自动运行代码检查（如 ESLint）
  - 在推送前运行测试
  - 校验提交信息格式（配合 Commitlint）
  - 支持 npm/Yarn/pnpm 脚本

### lint-staged 是什么？

lint-staged 是一个专门用于在 Git 暂存区（staged files） 运行代码检查（Lint）和格式化（Format）的工具，通常与 Husky 的 Git 钩子（如 pre-commit）结合使用，确保只有即将提交的代码符合规范，而不是全量检查整个项目。

主要功能

1. 仅检查 Git 暂存区的文档（git add 添加的文档），提高检查速度。

2. 支持多种 Linter（ESLint、Prettier、Stylelint 等）。

3. 自动修复可修复的问题（如 ESLint --fix 或 Prettier 格式化）。

4. 与 Husky 无缝集成，在提交前强制执行代码规范。

> 只检查修改过的文档，而不是整个项目，大幅提高速度。

### 搭建 husky + lint-staged 执行环境

在`monorepo`安装依赖：

```bash
pnpm add lint-staged husky -Dw # w 表示安装到根录目
# 此时 lint-staged 的版本是 15.5.1 husky 的版本为 9.1.7
```

执行`pnpx husky init`，会在根目录创建`.husky`目录，用于存放 git hook。

`monorepo/package.json` 增加脚本：

```json
{
  "type": "commonjs",
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["oxlint --fix", "eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

修改`monorepo/.prettierrc.json` 改为 `.prettierrc.cjs`:

```js
module.exports = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 90,
  arrowParens: 'always',
  vueIndentScriptAndStyle: false,
}
```

验证 lint 是否就绪：`pnpm -F=vue3-ui lint`，验证 prettier `pnpm -F=vue3-ui format`，没报错，就说明环境就行了。

修改`.husky/pre-commit`:

```bash
echo "🐶 Running linters on staged files."

pnpm lint-staged # 使用 pnpm 执行 lint-staged
# 检査 lint-staged 命令的退出码
if [$? -ne 0]; then
   echo "❌ Linters found errors. commit aborted." >&2  # 输出到 stderr
   exit 1 # 非零退出码，阻止提交
fi

echo "✅ Linters passed!"

exit 0 # 零退出码，允许提交
```

修改`packages/vue3-ui/components/HelloWorld.vue` 的 script 为：

```html
<script setup>
  const props = defineProps({
    msg: { type: String, default: '' },
  })
</script>
```

看到错误：

```bash

✖ eslint --fix:

/Users/jack/front/monorepo-demo/packages/vue3-ui/src/components/HelloWorld.vue
  8:1  error  The 'lang' attribute of '<script>' is missing  vue/block-lang

✖ 1 problem (1 error, 0 warnings)
```

说明 husky + lint-staged 环境可用。

下面来消除这个错误，在 `monorepo/eslint-config.ts` 中增加规则：

```ts
defineConfigWithVueTs(
{
  skipFormatting,
  // 在最后添加规则
  {
    rules: {
      'vue/block-lang': 0,
    },
  },
})
```

## husky + commitLint git 提交规范工作流

采用[约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83)，让代码的历史记录更加清晰，同时可根据提交历史自动生成变更日志。

```text
feat(button): add rounded corners
^    ^       ^
|    |       |-- 描述
|    |-- 作用域（可选）
|-- 类型（feat/fix/docs/style/等）
```

看看两个知名库的提交：

![element-plus-github.png](https://cdn.jsdelivr.net/npm/zqj-pics/git/element-plus-github.png)

> element-plus 一眼能看出每个提交的修改范围，修改类型，是功能还是修复bug。

![lodash.png](https://cdn.jsdelivr.net/npm/zqj-pics/git/lodash.png)

> lodash 的提交信息就凌乱得多，无法一眼看出来提交的改动。

安装依赖：

```bash
pnpm add  commitizen -Dw
```

> commitizen 是做什么的？

一个命令行交互式的 git commit 替代工具，包含一个 git-cz 的命令，通过 git-cz 可交互式的实现按照【约定式提交规范】编写 commit message 的目的。

修改`monorepo/package.json`，增加 config 配置：

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/commitizen"
    }
  }
}
```

config 的作用是指定适配器。

验证配置是否生效：`pnpx git-cz`，看到如下的内容：

```bash
? Select the type of change that you're committing: (Use arrow keys or type to search)
> 💍  test:       Adding missing tests
  🎸  feat:       A new feature
  🐛  fix:        A bug fix
  🤖  chore:      Build process or auxiliary tool changes
  ✏️  docs:       Documentation only changes
  💡  refactor:   A code change that neither fixes a bug or adds a feature
  💄  style:      Markup, white-space, formatting, missing semi-colons...
(Move up and down to reveal more choices)
```

就说明成功了。

> 执行 `npx git-cz`，可能得到如下信息：

```bash
Could not find prompter method in the provided adapter module: node_modules/commitizen
```

这是一个 bug，[How to define Commitizen adapter when using "npx git-cz"?](https://stackoverflow.com/questions/54055891/how-to-define-commitizen-adapter-when-using-npx-git-cz)

修复办法：

```bash
pnpm add commitizen -g # 全局安装
commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact --force # --force 表示强制
```

commitizen 做了两件事：

1. 安装 cz-conventional-changelog 为开发依赖
2. 修改 commitizen 的适配器为`cz-conventional-changelog`

package.json 变化如下：

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

此时执行`git-cz`或者`npx git-cz`，控制台输出如下信息：

```bash
cz-cli@4.3.1, cz-conventional-changelog@3.3.0

? Select the type of change that you're committing: (Use arrow keys)
> feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space,
formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
(Move up and down to reveal more choices)
```

这是适配器`cz-conventional-changelog`提示信息。

### 什么是 commitizen 的适配器？

commitizen 是一个git commit 命令行工具，内置一些了规则，不同的团队有不同的规则偏好，为了保持扩展和开发，提供了适配器来扩展。

commitizen 类似 eslint，适配器类似自定义的 eslint 规则扩展。

[开源社区的出色适配器](https://github.com/commitizen/cz-cli?tab=readme-ov-file#adapters)

commitizen 是一个总管，负责发起提交信息生成。

适配器是实现具体规范的插件，它告诉 commitizen 应该怎么写这个信息。

### 添加 cz-git 适配器

[cz-git](https://cz-git.qbb.sh/zh/) 是一个强大的高度自定义的适配器，交互更加友好，支持表情，支持中文，被`element-plus`、`nx`等知名项目采用。

安装适配器:

```bash
pnpm rm cz-conventional-changelog -w # 移除刚才安装的适配器
pnpm add cz-git -Dw
```

修改 package.json 中的适配器和命令：

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-git",
      "czConfig": "./cz.config.mjs"
    }
  }
}
```

提交一个信息，检查适配器是否生效：`pnpm cz`，看到如下信息：

```bash
? 选择提交类型或者输入关键字搜索类型: Use arrow keys or type to search
❯ feat:     🎁新增功能
  fix:      🐛Bug修复
  docs:     📚文档变更
  test:     ✅添加测试或修改已有测试
  refactor:      ♻️代码重构(不包括 bug 修复、功能新增，不改动对外 api，仅改动内部代码组织方式、变量命名等)
  format:     🎨代码格式美化
  revert:     ⏪️版本回退(老代码还原)
(Move up and down to reveal more choices)
```

就说明 cz-git 配置成功了！

### husky + commitlint 检查提交信息是否符合规范

有了提交规范，如何保证团队成员都按照规范提交呢？这就是 commitlint 发挥的作用。

commitlint 结合 git commit-msg 钩子用于检查提交信息是否符合规范。

安装 @commitlint/cli

```bash
pnpm add commitlint -Dw # commitlint 是 @commitlint/cli 别名，也可以安装 @commitlint/cli
```

创建`.husky/commit-msg` 钩子：

```bash
echo "🐶 Running commitlint on staged files."

npx  commitlint --edit "$1"
```

提交一次不规范的 commit，验证`.husky/commit-msg` 是否可用：

```bash
git commit -m '验证 .husky/commit-msg 是否可用'
```

看到类似的错误：

```bash
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg script failed (code 1)
```

说明可用了。

> 禁用 husky

某一次提交想要禁用husky，可以添加参数--no-verify:

```bash
git commit --no-verify -m "xxx"
```

## 根据 git commit 生成日志记录

安装依赖：

```bash
pnpm add conventional-changelog conventional-changelog-cli -Dw
```

配置命令：

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p cz-config.js -i CHANGELOG.md -s -r 0"
  }
}
```

验证可用性：`pnpm changelog`，在根目录下生成 `CHANGELOG.md`，就表明可用了。

## 增加一个子包 utils

在 packages 中创建 `utils/package.json`:

```json
{
  "name": "utils",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "scripts": {
    "build": "tsdown ./src",
    "test": "vitest",
    "test:q": "vitest --watch=false"
  },
  "devDependencies": {
    "typescript": "~5.7.2"
  }
}
```

monorepo/package.json 新增脚本：

```json
{
  "test:unit:utils": "pnpm --filter=utils run test:q",
  "test:unit": "run-p test:unit:ui test:unit:utils"
}
```

安装 tsdown 打包 utils:

```bash
pnpm add tsdown -Dw
```

vue3-ui 依赖 utils，把 utils 安装到 vue3-ui:

```bash
pnpm -F=vue3-ui add utils --workspace
```

在 vue3-ui 中使用 utils:

```html
<script setup lang="ts">
  import TheWelcome from '../components/TheWelcome.vue'
  import { sum } from 'utils'
  const total = sum(1, 2)
</script>

<template>
  <main>
    <p>{{ total }}</p>
    <TheWelcome />
  </main>
</template>
```

正常显示 3。

## 使用 changesets 管理版本

似乎没有这样的需求，不配置了。

<!--  TODO -->

## 参考

[Conventional Changelog 生态探索](https://zhuanlan.zhihu.com/p/392303778)

[[保姆级] Vite+Vue 3 终极代码规范：ESLint+Prettier+Husky 全覆盖，拯救强迫症！](https://mp.weixin.qq.com/s/J6HlSPyjlk56dFj5uHan9Q)
