import { expect, it } from 'vitest'
import { aan, dct, idct, sep } from '../src/transform'

it('dct', () => {
  const O = [
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99],
  ]

  const aanO = structuredClone(O)

  function compare(X1: number[][], X2: number[][]) {
    let sum = 0
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++)
        sum += Math.abs(X1[i][j] - X2[i][j])
    }

    return sum / 64
  }

  expect(compare(idct(dct(O)), O)).toMatchInlineSnapshot(`5.007105841059456e-14`)
  expect(compare(idct(sep(O)), O)).toMatchInlineSnapshot(`4.365952044338428e-14`)
  expect(compare(idct(aan(aanO)), O)).toMatchInlineSnapshot(`3.558264793923627e-14`)
})
