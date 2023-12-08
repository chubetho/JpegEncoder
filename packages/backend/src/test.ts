const sqrt2 = Math.SQRT2
const one_sqrt2 = 1 / sqrt2
const sqrt = Math.sqrt
const cos = Math.cos
const round = Math.round
const pi = Math.PI
const pi_16 = pi / 16

const m0 = cos(2 * pi_16)
const m1 = cos(4 * pi_16)
const m5 = cos(6 * pi_16)
const m2 = m0 - m5
const m3 = m1
const m4 = m0 + m5

const s0 = 0.5 * one_sqrt2
const s1 = 1 / (4 * cos(1 * pi_16))
const s2 = 1 / (4 * cos(2 * pi_16))
const s3 = 1 / (4 * cos(3 * pi_16))
const s4 = 1 / (4 * cos(4 * pi_16))
const s5 = 1 / (4 * cos(5 * pi_16))
const s6 = 1 / (4 * cos(6 * pi_16))
const s7 = 1 / (4 * cos(7 * pi_16))

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
  const d8 = d4 + d6

  const e8 = d8 * m5
  const e0 = d0
  const e1 = d1
  const e2 = d2 * m1
  const e3 = d3
  const e4 = -d4 * m2 - e8
  const e5 = d5 * m3
  const e6 = d6 * m4 - e8
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

export function testAan(X: number[]) {
  const Y: number[] = [...X]

  for (let i = 0; i < 8; i++) {
    const { y0, y1, y2, y3, y4, y5, y6, y7 } = cal(
      Y[i * 8 + 0],
      Y[i * 8 + 1],
      Y[i * 8 + 2],
      Y[i * 8 + 3],
      Y[i * 8 + 4],
      Y[i * 8 + 5],
      Y[i * 8 + 6],
      Y[i * 8 + 7],
    )

    Y[i * 8 + 0] = y0
    Y[i * 8 + 1] = y1
    Y[i * 8 + 2] = y2
    Y[i * 8 + 3] = y3
    Y[i * 8 + 4] = y4
    Y[i * 8 + 5] = y5
    Y[i * 8 + 6] = y6
    Y[i * 8 + 7] = y7
  }

  for (let i = 0; i < 8; i++) {
    const { y0, y1, y2, y3, y4, y5, y6, y7 } = cal(
      Y[0 * 8 + i],
      Y[1 * 8 + i],
      Y[2 * 8 + i],
      Y[3 * 8 + i],
      Y[4 * 8 + i],
      Y[5 * 8 + i],
      Y[6 * 8 + i],
      Y[7 * 8 + i],
    )

    Y[0 * 8 + i] = y0
    Y[1 * 8 + i] = y1
    Y[2 * 8 + i] = y2
    Y[3 * 8 + i] = y3
    Y[4 * 8 + i] = y4
    Y[5 * 8 + i] = y5
    Y[6 * 8 + i] = y6
    Y[7 * 8 + i] = y7
  }

  return Y
}
