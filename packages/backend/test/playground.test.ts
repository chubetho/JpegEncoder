import * as path from 'node:path'
import { it } from 'vitest'
import { readPpm } from '../src/ppm.js'
import { aan, idct } from '../src/transform.js'

it.skip('playground', () => {
  const filePath = path.resolve('assets/img_1_1.ppm')
  const image = readPpm(filePath)
  for (let i = 0; i < image.blocks.length; i++) {
    image.blocks[i].R = aan(image.blocks[i].R)
    image.blocks[i].R = idct(image.blocks[i].R)
    image.blocks[i].G = aan(image.blocks[i].G)
    image.blocks[i].G = idct(image.blocks[i].G)
    image.blocks[i].B = aan(image.blocks[i].B)
    image.blocks[i].B = idct(image.blocks[i].B)
  }

  // writePpm('assets/abc.ppm', image)
})

it('foo', () => {
  /* eslint-disable */
  const arr = [
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
    1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,
  ]
  /* eslint-enable */
  const width = 24
  const height = 8

  const blockWidth = ~~((width + 7) / 8)
  const blockHeight = ~~((height + 7) / 8)
  const padding = width % 4

  const blocks: number[][] = []

  for (let y = 0; y < height; y++) {
    const blockRow = ~~(y / 8) // 0
    const pixelRow = y % 8
    for (let x = 0; x < width; x++) {
      const blockColumn = ~~(x / 8) // 0 1 2
      const blockIndex = blockRow * blockWidth + blockColumn

      const pixelColumn = x % 8
      const pixelIndex = pixelRow * 8 + pixelColumn
      blocks[blockIndex] ??= []
      blocks[blockIndex].push(arr[pixelIndex])
    }
  }

  console.log(blocks)
})
