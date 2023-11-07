import * as fs from 'node:fs'

export function readPpm(filePath: string) {
  const file = fs.readFileSync(filePath, { encoding: 'ascii' })
  const lines = file.split('\n')
  const [format, size, _maxColor, ..._rows] = lines

  const maxColor = Number.isNaN(Number.parseInt(_maxColor)) ? 0 : Number.parseInt(_maxColor)
  const [width, height] = size.split(' ')
  const rows = _rows.filter(r => r.trimStart()[0] !== '#')

  return { format, width, height, maxColor, rows }
}

export function parsePpm(rows: string[]) {
  const img: Image = []

  rows.forEach((r, rowIndex) => {
    const row = r.split(' ').filter(Boolean).map(Number)

    let colIndex = 0
    let rgb: number[] = []

    row.forEach((col) => {
      rgb.push(col)

      if (rgb.length === 3) {
        img[rowIndex] ||= []
        img[rowIndex][colIndex] = rgb
        colIndex++
        rgb = []
      }
    })
  })

  return img
}

export function exportPpm(rgbImg: Image, filePath?: string) {
  const header = `P3\n${rgbImg[0].length} ${rgbImg.length}\n255\n`
  const content
  = rgbImg.map(r => r
    .map(col => col.reduce((acc, cur) => `${acc} ${cur}`, '')).join(''))
    .join('\n')

  if (!filePath)
    return header + content

  fs.writeFileSync(filePath, header + content, { encoding: 'ascii' })
}
