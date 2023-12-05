import { it } from 'vitest'

const sqrt2 = Math.SQRT2
const one_sqrt2 = 1 / sqrt2
const sqrt = Math.sqrt
const cos = Math.cos
const round = Math.round
const abs = Math.abs
const pi = Math.PI
const pi_16 = pi / 16
const C = (x: number) => x === 0 ? one_sqrt2 : 1

const a0 = 2 * cos(1 * 2 * pi_16)
const a1 = 2 * cos(2 * 2 * pi_16)
const a3 = 2 * cos(2 * 2 * pi_16)
const a5 = 2 * cos(3 * 2 * pi_16)
const a2 = a0 - a5
const a4 = a0 + a5

const s0 = cos(0 * pi_16) / sqrt(8)
const s1 = cos(1 * pi_16) / 2
const s2 = cos(2 * pi_16) / 2
const s3 = cos(3 * pi_16) / 2
const s4 = cos(4 * pi_16) / 2
const s5 = cos(5 * pi_16) / 2
const s6 = cos(6 * pi_16) / 2
const s7 = cos(7 * pi_16) / 2

function dct(X: number[]) {
  const Y: number[] = []

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let sum = 0
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++)
          sum += X[x * 8 + y] * cos((2 * x + 1) * i * pi_16) * cos((2 * y + 1) * j * pi_16)
      }
      sum = 1 / 4 * C(i) * C(j) * sum
      Y[i * 8 + j] = round(sum)
      sum = 0
    }
  }

  return Y
}

function idct(Y: number[]) {
  const X: number[] = []

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let sum = 0
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++)
          sum += C(i) * C(j) * Y[i * 8 + j] * cos((2 * x + 1) * i * pi_16) * cos((2 * y + 1) * j * pi_16)
      }
      sum = 1 / 4 * sum
      X[x * 8 + y] = round(sum)
      sum = 0
    }
  }

  return X
}

function aan(X: number[]) {
  const Y: number[] = []

  for (let i = 0; i < 8; i++) {
    const b0 = X[0] + X[7]
    const b1 = X[1] + X[6]
    const b2 = X[2] + X[5]
    const b3 = X[3] + X[4]
    const b4 = -X[4] + X[3]
    const b5 = -X[5] + X[2]
    const b6 = -X[6] + X[1]
    const b7 = -X[7] + X[0]

    const c0 = b0 + b3
    const c1 = b1 + b2
    const c2 = -b2 + b1
    const c3 = -b3 + b0
    const c4 = -b4 - b5
    const c5 = b5 + b6
    const c6 = b6 + b7
    const c7 = b7

    const d0 = c0 + c1
    const d1 = -c1 + c0
    const d2 = c2 + c3
    const d3 = c3
    const d4 = c4
    const d5 = c5
    const d6 = c6
    const d7 = c7
    const d8 = (d4 + d6) * a5

    const e0 = d0
    const e1 = d1
    const e2 = d2 * a1
    const e3 = d3
    const e4 = -d4 * a2 - d8
    const e5 = d5 * a3
    const e6 = d6 * a4 - d8
    const e7 = d7

    const f0 = e0
    const f1 = e1
    const f2 = e2 + e3
    const f3 = e3 - e2
    const f4 = e4
    const f5 = e5 + e7
    const f6 = e6
    const f7 = e7 - e5

    const g0 = f0
    const g1 = f1
    const g2 = f2
    const g3 = f3
    const g4 = f4 + f7
    const g5 = f5 + f6
    const g6 = -f6 + f5
    const g7 = f7 - f4

    Y[i * 8 + 0] = g0 * s0
    Y[i * 8 + 4] = g1 * s4
    Y[i * 8 + 2] = g2 * s2
    Y[i * 8 + 6] = g3 * s6
    Y[i * 8 + 5] = g4 * s5
    Y[i * 8 + 1] = g5 * s1
    Y[i * 8 + 7] = g6 * s7
    Y[i * 8 + 3] = g7 * s3
  }

  return Y
}

function compare(X1: number[], X2: number[]) {
  return X1.reduce((acc, cur, idx) => acc + cur - X2[idx], 0) / X1.length
}

it('dct', () => {
  /* eslint-disable */
  const O = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77,
    24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101,
    72, 92, 95, 98, 112, 100, 103, 99,
  ]
  /* eslint-enable */

  const Y = dct(O)
  console.log(Y)
  console.log(aan(O))
  console.log(idct(aan(O)))
  const X = idct(Y)
  console.log(compare(O, X))
})
