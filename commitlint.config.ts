/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-26 01:24:14
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-27 00:21:33
 * @Description : commitlint 配置
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs']],
  },
}
