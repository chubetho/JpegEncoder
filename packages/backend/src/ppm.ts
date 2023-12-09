import * as fs from 'node:fs'

export function readPpm(filePath: string) {
  const file = fs.readFileSync(filePath, { encoding: 'ascii' })
  const lines = file.split('\n')
  const [format, size, _maxColor, ..._rows] = lines
  const [_width, _height] = size.split(' ')

  if (Number.isNaN(+_maxColor))
    throw new Error('Invalid max color')

  if (Number.isNaN(+_width))
    throw new Error('Invalid width')

  if (Number.isNaN(+_height))
    throw new Error('Invalid height')

  const maxColor = +_maxColor
  const width = +_width
  const height = +_height

  const _R: number[][] = []
  const _G: number[][] = []
  const _B: number[][] = []
  const _Y: number[][] = []
  const _Cb: number[][] = []
  const _Cr: number[][] = []

  const rows = _rows.filter(r => r && r.trimStart()[0] !== '#')
  rows.forEach((r, rowIndex) => {
    const row = r.split(' ').filter(Boolean).map(Number)

    _R[rowIndex] = []
    _G[rowIndex] = []
    _B[rowIndex] = []

    _Y[rowIndex] = []
    _Cb[rowIndex] = []
    _Cr[rowIndex] = []

    let tmp = 0
    for (let colIndex = 0; colIndex < row.length; colIndex += 3) {
      const r = row[colIndex]
      const g = row[colIndex + 1]
      const b = row[colIndex + 2]

      const y = 0.299 * r + 0.587 * g + 0.114 * b - 128
      const cb = -0.1687 * r + -0.3312 * g + 0.5 * b
      const cr = 0.5 * r + -0.4186 * g + -0.0813 * b

      _R[rowIndex][tmp] = r
      _G[rowIndex][tmp] = g
      _B[rowIndex][tmp] = b

      _Y[rowIndex][tmp] = y < -128 ? -128 : y > 127 ? 127 : y
      _Cb[rowIndex][tmp] = cb < -128 ? -128 : cb > 127 ? 127 : cb
      _Cr[rowIndex][tmp] = cr < -128 ? -128 : cr > 127 ? 127 : cr

      tmp++
    }
  })

  const blocks: Block[] = []
  const blockWidth = ~~((width + 7) / 8) // 3
  const blockHeight = ~~((height + 7) / 8) // 2

  for (let i = 0; i < blockWidth * blockHeight; i++)
    blocks.push({ R: [], G: [], B: [], Y: [], Cb: [], Cr: [] })

  for (let h = 0; h < blockHeight; h++) {
    for (let w = 0; w < blockWidth; w++) {
      for (let y = h * 8; y < h * 8 + 8; y++) {
        for (let x = w * 8; x < w * 8 + 8; x++) {
          blocks[h * blockWidth + w].R.push(_R[y][x] ?? 0)
          blocks[h * blockWidth + w].G.push(_G[y][x] ?? 0)
          blocks[h * blockWidth + w].B.push(_B[y][x] ?? 0)
          blocks[h * blockWidth + w].Y.push(_Y[y][x] ?? 0)
          blocks[h * blockWidth + w].Cb.push(_Cb[y][x] ?? 0)
          blocks[h * blockWidth + w].Cr.push(_Cr[y][x] ?? 0)
        }
      }
    }
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
