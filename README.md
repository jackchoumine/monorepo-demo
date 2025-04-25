# monorepo-demo

monorepo 学习

## 使用 create-vue 初始化一个项目

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

### 创建 pnpm 创建项目

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
