const sqrt2 = Math.SQRT2
const one_sqrt2 = 1 / sqrt2
const sqrt = Math.sqrt
const cos = Math.cos
const round = Math.round
const pi = Math.PI
const pi_16 = pi / 16

const Ck = (x: number) => cos(x * pi_16)
const Sk = (x: number) => 1 / (4 * Ck(x))

const m0 = Ck(2)
const m1 = Ck(4)
const m3 = m1
const m5 = Ck(6)
const m2 = m0 - m5
const m4 = m0 + m5

const s0 = 0.5 * one_sqrt2
const s1 = Sk(1)
const s2 = Sk(2)
const s3 = Sk(3)
const s4 = Sk(4)
const s5 = Sk(5)
const s6 = Sk(6)
const s7 = Sk(7)

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
  const e2 = d2 * m1
  const e3 = d3
  const e4 = -d4 * m2 - d8
  const e5 = d5 * m3
  const e6 = d6 * m4 - d8
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

function testAan(X: number[]) {
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
