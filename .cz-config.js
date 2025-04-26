/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-26 14:34:34
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-27 00:33:11
 * @Description :
 */
module.exports = {
  types: [
    {
      //value: ':gift: feat',
      value: 'feat',
      name: '🎁 feat:     新功能',
    },
    {
      //value: ':bug: fix',
      value: 'fix',
      name: '🐛 fix:      修复bug',
    },
    {
      //value: ':recycle: refactor',
      value: 'refactor',
      name: '♻️ refactor: 重构',
    },
    {
      //value: ':books: docs',
      value: 'docs',
      name: '📚  docs:     文档变更',
    },
    {
      //value: ':package: build',
      value: 'build',
      name: '📦️ build:    打包',
    },
    {
      //value: ':rocket: perf',
      value: 'perf',
      name: '🚀 perf:     性能优化',
    },
    {
      //value: ':tada: release',
      value: 'release',
      name: '🎉 release:  发布正式版',
    },
    {
      //value: ':art: style',
      value: 'style',
      name: '🎨 style:    代码的样式美化',
    },
    {
      //value: ':white_check_mark: test',
      value: 'test',
      name: '✅ test:     测试',
    },
    //{
    //  value: ':rewind: revert',
    //  name: '⏪️ revert:   回退',
    //},
    {
      //value: ':wrench: chore',
      value: 'chore',
      name: '🔧 chore:    构建/工程依赖/工具',
    },
    //{
    //  value: ':construction_worker: ci',
    //  name: '👷 ci:       CI related changes',
    //},
  ],
  messages: {
    type: '请选择提交类型(必填)',
    customScope: '请输入文档修改范围(可选)',
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    breaking: '列出任何BREAKING CHANGES(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确定提交此说明吗？',
  },
  allowCustomScopes: true,
  // 跳过问题
  skipQuestions: ['body', 'footer'],
  subjectLimit: 72,
}
