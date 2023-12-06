const sqrt2 = Math.SQRT2
const one_sqrt2 = 1 / sqrt2
const sqrt = Math.sqrt
const cos = Math.cos
const round = Math.round
const abs = Math.abs
const pi = Math.PI
const pi_16 = pi / 16
const C = (x: number) => x === 0 ? one_sqrt2 : 1

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
      A[k][n] = c0 * 1 / 4 * cos((2 * n + 1) * k * pi_16)
  }
  const At = transpose(A)
  return multiply(A, multiply(X, At))
}

export function aan(X: number[]) {
  const Y = [...X]

  for (let i = 0; i < 8; i++) {
    const a0 = Y[0 * 8 + i]
    const a1 = Y[1 * 8 + i]
    const a2 = Y[2 * 8 + i]
    const a3 = Y[3 * 8 + i]
    const a4 = Y[4 * 8 + i]
    const a5 = Y[5 * 8 + i]
    const a6 = Y[6 * 8 + i]
    const a7 = Y[7 * 8 + i]

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

    Y[0 * 8 + i] = g0 * s0
    Y[4 * 8 + i] = g1 * s4
    Y[2 * 8 + i] = g2 * s2
    Y[6 * 8 + i] = g3 * s6
    Y[5 * 8 + i] = g4 * s5
    Y[1 * 8 + i] = g5 * s1
    Y[7 * 8 + i] = g6 * s7
    Y[3 * 8 + i] = g7 * s3
  }

  for (let i = 0; i < 8; i++) {
    const a0 = Y[i * 8 + 0]
    const a1 = Y[i * 8 + 1]
    const a2 = Y[i * 8 + 2]
    const a3 = Y[i * 8 + 3]
    const a4 = Y[i * 8 + 4]
    const a5 = Y[i * 8 + 5]
    const a6 = Y[i * 8 + 6]
    const a7 = Y[i * 8 + 7]

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

export function multiply(X: number[][], Y: number[][]) {
  if (X[0].length !== Y.length)
    throw new Error('Can\'t multiply')

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
