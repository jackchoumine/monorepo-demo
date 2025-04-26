/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-26 23:12:22
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-26 23:14:25
 * @Description :
 */
import { expect, it, describe } from 'vitest'
import { sum } from '.'

describe('math', () => {
  it('sum', () => {
    const total = sum(1, 2)
    expect(total).toBe(3)
  })
})
