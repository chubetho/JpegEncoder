import { it } from 'vitest'
import { aan, dct } from '../src/transform'

function compare(X1: number[], X2: number[]) {
  return X1.reduce((acc, cur, idx) => acc + Math.abs(cur - X2[idx]), 0) / X1.length
}

it('dct', () => {
  /* eslint-disable */
  const O1d = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77,
    24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101,
    72, 92, 95, 98, 112, 100, 103, 99,
  ]

  const O2d = [
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99],
  ]
  /* eslint-enable */

  const Y = dct(O1d)
  const foo = [...O1d]
  aan(foo)
  console.log(Y)
  console.log(foo.map(x => Math.round(x)))
  // expect(compare(Y, foo.map(x => Math.round(x)))).toMatchInlineSnapshot(`0.015625`)
})