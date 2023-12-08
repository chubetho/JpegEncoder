import * as fs from 'node:fs'

export function readPpm(filePath: string) {
  const file = fs.readFileSync(filePath, { encoding: 'ascii' })
  const lines = file.split('\n')
  const [format, size, _maxColor, ..._rows] = lines

  const maxColor = Number.isNaN(Number.parseInt(_maxColor)) ? 0 : Number.parseInt(_maxColor)
  const [width, height] = size.split(' ')
  const rows = _rows.filter(r => r.trimStart()[0] !== '#')

  const R: number[] = []
  const G: number[] = []
  const B: number[] = []
  const Y: number[] = []
  const Cb: number[] = []
  const Cr: number[] = []

  rows.forEach((r, x) => {
    const row = r.split(' ').filter(Boolean).map(Number)
    const rowIdx = x * rows.length

    for (let i = 0; i <= row.length - 3; i += 3) {
      const r = row[i]
      const g = row[i + 1]
      const b = row[i + 2]

      const y = 0.299 * r + 0.587 * g + 0.114 * b - 128
      const cb = -0.1687 * r + -0.3312 * g + 0.5 * b
      const cr = 0.5 * r + -0.4186 * g + -0.0813 * b

      R[rowIdx + i / 3] = r
      G[rowIdx + i / 3] = g
      B[rowIdx + i / 3] = b

      Y[rowIdx + i / 3] = y < -128 ? -128 : y > 127 ? 127 : y
      Cb[rowIdx + i / 3] = cb < -128 ? -128 : cb > 127 ? 127 : cb
      Cr[rowIdx + i / 3] = cr < -128 ? -128 : cr > 127 ? 127 : cr
    }
  })

  return {
    R,
    G,
    B,
    Y,
    Cb,
    Cr,
    metadata: {
      width,
      height,
      maxColor,
      format,
    },
  }
}
