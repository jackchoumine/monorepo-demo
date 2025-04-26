/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-26 23:03:29
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-27 00:52:26
 * @Description :
 */
export function sum(...rest: number[]) {
  return rest.reduce((curr, total) => (total += curr), 0)
}

export function hello(greet: string) {
  console.log('Jack', greet)
}
