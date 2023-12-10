import * as path from 'node:path'
import { it } from 'vitest'
import { readPpm, writePpm } from '../src/ppm.js'

it('playground', () => {
  const filePath = path.resolve('assets/img_1_1.ppm')
  const image = readPpm(filePath)
  // for (let i = 0; i < image.blocks.length; i++) {
  //   image.blocks[i].R = aan(image.blocks[i].R)
  //   image.blocks[i].R = idct(image.blocks[i].R)
  //   image.blocks[i].G = aan(image.blocks[i].G)
  //   image.blocks[i].G = idct(image.blocks[i].G)
  //   image.blocks[i].B = aan(image.blocks[i].B)
  //   image.blocks[i].B = idct(image.blocks[i].B)
  // }

  writePpm('assets/abc.ppm', image)
})
