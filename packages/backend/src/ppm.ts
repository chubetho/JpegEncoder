import * as fs from 'node:fs'

export function readPpm(filePath: string) {
  const file = fs.readFileSync(filePath, { encoding: 'ascii' })
  const lines = file.split('\n')
  const [format, size, _maxColor, ..._rows] = lines

  const maxColor = Number.isNaN(Number.parseInt(_maxColor)) ? 0 : Number.parseInt(_maxColor)
  const [width, height] = size.split(' ')
  const rows = _rows.filter(r => r.trimStart()[0] !== '#')

  const _R: number[] = []
  const _G: number[] = []
  const _B: number[] = []
  const _Y: number[] = []
  const _Cb: number[] = []
  const _Cr: number[] = []

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

      _R[rowIdx + i / 3] = r
      _G[rowIdx + i / 3] = g
      _B[rowIdx + i / 3] = b

      _Y[rowIdx + i / 3] = y < -128 ? -128 : y > 127 ? 127 : y
      _Cb[rowIdx + i / 3] = cb < -128 ? -128 : cb > 127 ? 127 : cb
      _Cr[rowIdx + i / 3] = cr < -128 ? -128 : cr > 127 ? 127 : cr
    }
  })

  const blockCount = Math.ceil(_R.length / 64)
  const blocks: Block[] = []
  for (let i = 0; i < blockCount; i++) {
    const R = _R.splice(0, 64)
    while (R.length < 64)
      R.push(0)

    const G = _G.splice(0, 64)
    while (G.length < 64)
      G.push(0)

    const B = _B.splice(0, 64)
    while (B.length < 64)
      B.push(0)

    const Y = _Y.splice(0, 64)
    while (Y.length < 64)
      Y.push(0)

    const Cb = _Cb.splice(0, 64)
    while (Cb.length < 64)
      Cb.push(0)

    const Cr = _Cr.splice(0, 64)
    while (Cr.length < 64)
      Cr.push(0)

    blocks.push({ R, G, B, Y, Cb, Cr })
  }

  return {
    blocks,
    metadata: {
      width,
      height,
      maxColor,
      format,
    },
  }
}

export function writePpm(path: string, { blocks, metadata }: Image) {
  let data = `${metadata.format}\n${metadata.width} ${metadata.height}\n${metadata.maxColor}
  `

  const R: number[] = []
  const G: number[] = []
  const B: number[] = []
  blocks.forEach((block) => {
    R.push(...block.R)
    G.push(...block.G)
    B.push(...block.B)
  })

  for (let i = 0; i < +metadata.height; i++) {
    let row = ''
    for (let j = 0; j < +metadata.width; j++) {
      const colIdx = i * +metadata.height + j
      row += `${R[colIdx]} ${G[colIdx]} ${B[colIdx]} `
    }

    data += `${row}\n`
    row = ''
  }

  fs.writeFileSync(path, data)
}
