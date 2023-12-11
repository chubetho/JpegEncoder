import * as fs from 'node:fs'

export function readPpm(filePath: string) {
  const file = fs.readFileSync(filePath, { encoding: 'ascii' })
  const lines = file.split('\n')
  const [format, size, _maxColor, ..._rows] = lines
  const [_width, _height] = size.split(' ')

  if (format !== 'P3' || Number.isNaN(+_maxColor) || Number.isNaN(+_width) || Number.isNaN(+_height))
    throw new Error('Invalid file')

  const maxColor = +_maxColor
  const imageWidth = +_width
  const imageHeight = +_height

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
  const blockWidth = ~~((imageWidth + 7) / 8)
  const blockHeight = ~~((imageHeight + 7) / 8)

  for (let i = 0; i < blockWidth * blockHeight; i++)
    blocks.push({ R: [], G: [], B: [], Y: [], Cb: [], Cr: [] })

  for (let h = 0; h < blockHeight; h++) {
    for (let w = 0; w < blockWidth; w++) {
      const blockIndex = h * blockWidth + w
      for (let y = h * 8; y < h * 8 + 8; y++) {
        blocks[blockIndex].R[y - h * 8] ??= []
        blocks[blockIndex].G[y - h * 8] ??= []
        blocks[blockIndex].B[y - h * 8] ??= []
        blocks[blockIndex].Y[y - h * 8] ??= []
        blocks[blockIndex].Cb[y - h * 8] ??= []
        blocks[blockIndex].Cr[y - h * 8] ??= []

        for (let x = w * 8; x < w * 8 + 8; x++) {
          blocks[blockIndex].R[y - h * 8][x - w * 8] = _R[y][x] ?? 0
          blocks[blockIndex].G[y - h * 8][x - w * 8] = _G[y][x] ?? 0
          blocks[blockIndex].B[y - h * 8][x - w * 8] = _B[y][x] ?? 0
          blocks[blockIndex].Y[y - h * 8][x - w * 8] = _Y[y][x] ?? 0
          blocks[blockIndex].Cb[y - h * 8][x - w * 8] = _Cb[y][x] ?? 0
          blocks[blockIndex].Cr[y - h * 8][x - w * 8] = _Cr[y][x] ?? 0
        }
      }
    }
  }

  return {
    blocks,
    metadata: {
      imageWidth,
      imageHeight,
      maxColor,
      format,
      blockWidth,
      blockHeight,
    },
  }
}

export function foo(path: string) {
  const content = fs.readFileSync(path, 'ascii')
  const lines = content.split('\n')
  const [format, size, _maxColor, ...rest] = lines
  const [width, height] = size.trim().split(' ').map(Number)
  const maxColor = Number.parseInt(_maxColor)
  // const image = rest
  //   .map(r => r.split(/\s+/).map(Number)).flat()
  //   .reduce((acc, _, idx, arr) => {
  //     if (idx % 3 !== 0)
  //       return acc

  //     acc.push([arr[idx], arr[idx + 1], arr[idx + 2]])
  //     return acc
  //   }, [] as number[][])

  // const blockHeight = ~~((height + 7) / 8)
  // const blockWidth = ~~((width + 7) / 8)
  // const blocks = Array.from(
  //   { length: blockHeight * blockWidth },
  //   () => (
  //     { R: Array.from({ length: 64 }, () => 0), G: Array.from({ length: 64 }, () => 0), B: Array.from({ length: 64 }, () => 0), Y: Array.from({ length: 64 }, () => 0), Cb: Array.from({ length: 64 }, () => 0), Cr: Array.from({ length: 64 }, () => 0) }
  //   ),
  // )
  // for (let h = 0; h < height; h++) {
  //   const blockRow = ~~(h / 8)
  //   const pixelRow = h % 8
  //   for (let w = 0; w < width; w++) {
  //     const blockColumn = ~~(w / 8)
  //     const pixelColumn = w % 8
  //     const blockIndex = blockRow * blockWidth + blockColumn
  //     const pixelIndex = pixelRow * 8 + pixelColumn

  //     const r = image[h * width + w][0]
  //     const g = image[h * width + w][1]
  //     const b = image[h * width + w][2]

  //     blocks[blockIndex].R[pixelIndex] = r
  //     blocks[blockIndex].G[pixelIndex] = g
  //     blocks[blockIndex].B[pixelIndex] = b

  //     const y = 0.299 * r + 0.587 * g + 0.114 * b - 128
  //     const cb = -0.1687 * r + -0.3312 * g + 0.5 * b
  //     const cr = 0.5 * r + -0.4186 * g + -0.0813 * b

  //     blocks[blockIndex].Y[pixelIndex] = y
  //     blocks[blockIndex].Cb[pixelIndex] = cb
  //     blocks[blockIndex].Cr[pixelIndex] = cr
  //   }
  // }
}

export function writePpm(path: string, { blocks, metadata }: Image) {
  let data = `${metadata.format}\n${metadata.imageWidth} ${metadata.imageHeight}\n${metadata.maxColor}\n`

  const paddingRight = metadata.imageWidth % 8

  for (let i = 0; i < metadata.imageHeight; i++) {
    let row = ''
    const blockRowIndex = ~~(i / 8)

    for (let w = 0; w < metadata.blockWidth; w++) {
      const blockIndex = blockRowIndex * metadata.blockWidth + w
      blocks[blockIndex].R[i % 8].forEach((x, xi) => {
        if (xi >= blocks[blockIndex].R[i % 8].length - paddingRight)
          return
        row += `${x} ${blocks[blockIndex].G[i % 8][xi]} ${blocks[blockIndex].B[i % 8][xi]}  `
      })
    }

    data += `${row}\n`
    row = ''
  }

  fs.writeFileSync(path, data)
}
