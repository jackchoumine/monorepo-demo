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

采用[约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83)，让代码的历史记录更加清晰。

安装依赖：

```bash
pnpm add -g commitizen # 全局安装
pnpm add commitlint @commitlint/config-conventional cz-conventional-changelog -Dw
```

增加`monorepo/package.json`的脚本命令：

```json
{
  "scripts": {
    "cz": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

验证环境是否可用：

先`git add .`，在 `pnpm cz` 或者 git-cz，会看到如下信息：

```bash
cz-cli@4.3.1, cz-conventional-changelog@3.3.0

? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
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
