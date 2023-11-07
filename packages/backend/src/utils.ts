import * as fs from 'node:fs'

export function snipImage(src: Image, config: { x: number; y: number; rangeX: number; rangeY: number }): Image {
  const { rangeX, rangeY, x, y } = config

  if (x < 0 || y < 0 || rangeX <= 0 || rangeY <= 0)
    throw new Error ('Invalid config')

  const img: Image = []

  for (let _y = y; _y < y + rangeY; _y++) {
    let row: number[][] = []

    for (let _x = x; _x < x + rangeX; _x++)
      src[_y]?.[_x] && row.push(src[_y][_x])

    row.length && img.push(row)
    row = []
  }

  return img
}

export function benchmark(originImg: string, encodedImg: string, originData: string, encodedData: string) {
  const originImgSize = getFileSize(originImg)
  const encodedImgSize = getFileSize(encodedImg)
  const originDataSize = getFileSize(originData)
  const encodedDataSize = getFileSize(encodedData)

  const table = [
    ['ppm', encodedImgSize, originImgSize, `↓ ${100 - Math.round(encodedImgSize * 100 / originImgSize)}%`],
    ['data', encodedDataSize, originDataSize, `↓ ${100 - Math.round(encodedDataSize * 100 / originDataSize)}%`],
  ]
  console.table(table)
}

function getFileSize(filePath: string) {
  const size = fs.statSync(filePath).size / (1000 * 1000)
  return Math.round(size * 100) / 100
}
