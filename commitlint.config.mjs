import { defineConfig } from 'cz-git'

const types = [
  { value: 'feat', name: 'feat:     🎁新增功能', emoji: '🎁' },
  { value: 'fix', name: 'fix:      🐛Bug修复', emoji: '🐛' },
  { value: 'docs', name: 'docs:     📚文档变更', emoji: '📚' },
  { value: 'test', name: 'test:     ✅添加测试或修改已有测试', emoji: '✅' },
  {
    value: 'refactor',
    name: 'refactor:      ♻️代码重构(不包括 bug 修复、功能新增，不改动对外 api，仅改动内部代码组织方式、变量命名等)',
    emoji: '♻️',
  },
  {
    value: 'format',
    name: 'format:     🎨代码格式美化',
    emoji: '🎨',
  },
  {
    value: 'revert',
    name: 'revert:     ⏪️版本回退(老代码还原)',
    emoji: '⏪️',
  },
  {
    value: 'perf',
    name: 'perf:     🚀性能优化(不包括 bug 修复、功能新增，不改动对外 api，仅让代码更高效)',
    emoji: '🚀',
  },
  {
    value: 'build',
    name: 'build:     📦️构建流程、外部依赖变更(如升级 npm 包、修改 vite 配置等)',
    emoji: '📦️',
  },
  {
    value: 'chore',
    name: 'chore:     🔨辅助工具和库的变更(不影响源文件、测试用例，比如修改 eslint、tsconfig 配置等)',
    emoji: '🔨',
  },
]

const typesList = types.map((item) => item.value)

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      // 允许的提交类型
      2,
      'always',
      typesList,
    ],
  },
  prompt: {
    // 启用 Emoji 支持
    useEmoji: true,
    messages: {
      type: '选择提交类型或者输入关键字搜索类型:',
      scope: '选择影响范围:',
      customScope: '输入自定义范围:',
      subject: '提交标题:',
      body: '详细描述 (可选):',
      breaking: '破坏性变更说明 (可选):',
      issues: '关联 Issues (如 #123):',
    },
    allowBreakingChanges: ['feat', 'fix'], // 仅 feat/fix 允许填写 breaking change
    // 自定义提交类型
    types,
    // 预设作用域选项
    scopes: ['ec-ui', 'ec-utils', 'lint-config'],
    // 允许自定义作用域（输入非预设值时提示）
    allowCustomScopes: true,
    // 提交消息校验规则（与 commitlint 共享）
    rules: {
      'type-enum': [2, 'always', typesList],
      //'subject-max-length': [100, 'always'], // 标题最长100字符
      'scope-case': [2, 'always', 'kebab-case'], // scope 需短横线命名
    },
    // 跳过问题（如跳过 body）
    skipQuestions: ['body'],
  },
})
