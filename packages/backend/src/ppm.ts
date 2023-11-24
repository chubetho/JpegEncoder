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
  const R: Channel = []
  const G: Channel = []
  const B: Channel = []

  rows.forEach((r, x) => {
    const row = r.split(' ').filter(Boolean).map(Number)

    R[x] ||= []
    G[x] ||= []
    B[x] ||= []
    for (let i = 0; i <= row.length - 3; i += 3) {
      R[x][i / 3] = row[i]
      G[x][i / 3] = row[i + 1]
      B[x][i / 3] = row[i + 2]
    }
  })

  return { R, G, B }
}
