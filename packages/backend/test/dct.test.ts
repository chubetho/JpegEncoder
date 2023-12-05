import { it } from 'vitest'

const sqrt2 = Math.SQRT2
const one_sqrt2 = 1 / sqrt2
const cos = Math.cos
const round = Math.round
const abs = Math.abs
const pi = Math.PI
const pi_16 = pi / 16
const C = (x: number) => x === 0 ? one_sqrt2 : 1

function dct(X: number[][]) {
  const Y: number[][] = []

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let sum = 0
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++)
          sum = sum + X[x][y] * cos((2 * x + 1) * i * pi_16) * cos((2 * y + 1) * j * pi_16)
      }
      sum = 1 / 4 * C(i) * C(j) * sum
      Y[i] ??= [] as number[]
      Y[i][j] = round(sum)
      sum = 0
    }
  }

  return Y
}

function idct(Y: number[][]) {
  const X: number[][] = []

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let sum = 0
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++)
          sum = sum + C(i) * C(j) * Y[i][j] * cos((2 * x + 1) * i * pi_16) * cos((2 * y + 1) * j * pi_16)
      }
      sum = 1 / 4 * sum
      X[x] ??= [] as number[]
      X[x][y] = round(sum)
      sum = 0
    }
  }

  return X
}

function compare(O: number[][], X: number[][]) {
  let diff = 0
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++)
      diff = diff + abs(O[x][y] - X[x][y])
  }

  return diff / 64
}

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

  const Y = dct(O)
  const X = idct(Y)
  console.log(compare(O, X))
})
