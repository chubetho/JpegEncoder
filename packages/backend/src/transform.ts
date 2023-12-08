const sqrt2 = Math.SQRT2
const one_sqrt2 = 1 / sqrt2
const sqrt = Math.sqrt
const cos = Math.cos
const round = Math.round
const pi = Math.PI
const pi_16 = pi / 16

const m0 = 2 * cos(1 * 2 * pi_16)
const m1 = 2 * cos(2 * 2 * pi_16)
const m3 = 2 * cos(2 * 2 * pi_16)
const m5 = 2 * cos(3 * 2 * pi_16)
const m2 = m0 - m5
const m4 = m0 + m5

const s0 = cos(0 * pi_16) / sqrt(8)
const s1 = cos(1 * pi_16) / 2
const s2 = cos(2 * pi_16) / 2
const s3 = cos(3 * pi_16) / 2
const s4 = cos(4 * pi_16) / 2
const s5 = cos(5 * pi_16) / 2
const s6 = cos(6 * pi_16) / 2
const s7 = cos(7 * pi_16) / 2

export function dct(X: number[]) {
  const C = (x: number) => x === 0 ? one_sqrt2 : 1

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

export function idct(Y: number[]) {
  const C = (x: number) => x === 0 ? one_sqrt2 : 1

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

export function separate(X: number[][]) {
  const A: number[][] = []
  for (let k = 0; k < 8; k++) {
    const c0 = k === 0 ? one_sqrt2 : 1
    A[k] = []
    for (let n = 0; n < 8; n++)
      A[k][n] = c0 * 0.5 * cos((2 * n + 1) * k * pi_16)
  }

  return dot(A, dot(X, transpose(A))).flat()
}

export function aan(X: number[]) {
  function cal(a0: number, a1: number, a2: number, a3: number, a4: number, a5: number, a6: number, a7: number) {
    const b0 = a0 + a7
    const b1 = a1 + a6
    const b2 = a2 + a5
    const b3 = a3 + a4
    const b4 = a3 - a4
    const b5 = a2 - a5
    const b6 = a1 - a6
    const b7 = a0 - a7

    const c0 = b0 + b3
    const c1 = b1 + b2
    const c2 = b1 - b2
    const c3 = b0 - b3
    const c4 = b4
    const c5 = b5 - b4
    const c6 = b6 - c5
    const c7 = b7 - b6

    const d0 = c0 + c1
    const d1 = c0 - c1
    const d2 = c2
    const d3 = c3 - c2
    const d4 = c4
    const d5 = c5
    const d6 = c6
    const d7 = c5 + c7
    const d8 = c4 - c6

    const e0 = d0
    const e1 = d1
    const e2 = d2 * m1
    const e3 = d3
    const e4 = d4 * m2
    const e5 = d5 * m3
    const e6 = d6 * m4
    const e7 = d7
    const e8 = d8 * m5

    const f0 = e0
    const f1 = e1
    const f2 = e2 + e3
    const f3 = e3 - e2
    const f4 = e4 + e8
    const f5 = e5 + e7
    const f6 = e6 + e8
    const f7 = e7 - e5

    const g0 = f0
    const g1 = f1
    const g2 = f2
    const g3 = f3
    const g4 = f4 + f7
    const g5 = f5 + f6
    const g6 = f5 - f6
    const g7 = f7 - f4

    return {
      y0: g0 * s0,
      y4: g1 * s4,
      y2: g2 * s2,
      y6: g3 * s6,
      y5: g4 * s5,
      y1: g5 * s1,
      y7: g6 * s7,
      y3: g7 * s3,
    }
  }

  for (let i = 0; i < 8; i++) {
    const a0 = X[0 * 8 + i]
    const a1 = X[1 * 8 + i]
    const a2 = X[2 * 8 + i]
    const a3 = X[3 * 8 + i]
    const a4 = X[4 * 8 + i]
    const a5 = X[5 * 8 + i]
    const a6 = X[6 * 8 + i]
    const a7 = X[7 * 8 + i]

    const { y0, y1, y2, y3, y4, y5, y6, y7 } = cal(a0, a1, a2, a3, a4, a5, a6, a7)

    X[0 * 8 + i] = y0
    X[4 * 8 + i] = y4
    X[2 * 8 + i] = y2
    X[6 * 8 + i] = y6
    X[5 * 8 + i] = y5
    X[1 * 8 + i] = y1
    X[7 * 8 + i] = y7
    X[3 * 8 + i] = y3
  }

  for (let i = 0; i < 8; i++) {
    const a0 = X[i * 8 + 0]
    const a1 = X[i * 8 + 1]
    const a2 = X[i * 8 + 2]
    const a3 = X[i * 8 + 3]
    const a4 = X[i * 8 + 4]
    const a5 = X[i * 8 + 5]
    const a6 = X[i * 8 + 6]
    const a7 = X[i * 8 + 7]

    const { y0, y1, y2, y3, y4, y5, y6, y7 } = cal(a0, a1, a2, a3, a4, a5, a6, a7)

    X[i * 8 + 0] = y0
    X[i * 8 + 4] = y4
    X[i * 8 + 2] = y2
    X[i * 8 + 6] = y6
    X[i * 8 + 5] = y5
    X[i * 8 + 1] = y1
    X[i * 8 + 7] = y7
    X[i * 8 + 3] = y3
  }
}

export function transpose(matrix: number[][]) {
  const transposed: number[][] = []
  matrix.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      transposed[colIdx] ??= []
      transposed[colIdx][rowIdx] = col
    })
  })
  return transposed
}

export function dot(X: number[][], Y: number[][]) {
  if (X[0].length !== Y.length)
    throw new Error('Can\'t dot')

  const xRowCount = X.length
  const yColCount = Y[0].length
  const res: number[][] = []

  for (let i = 0; i < xRowCount; i++) {
    const xRow = X[i % xRowCount]
    res[i] = []
    for (let j = 0; j < yColCount; j++) {
      const yCol = Y.map(row => row[j % yColCount])
      const v = xRow.reduce((acc, cur, idx) => acc + cur * yCol[idx], 0)
      res[i][j] = v
    }
  }

  return res
}
