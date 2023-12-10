import * as path from 'node:path'
import * as fs from 'node:fs'
import { it } from 'vitest'
import { readPpm, writePpm } from '../src/ppm.js'
import { aan, dct, idct, sep } from '../src/transform.js'

it.skip('dct', () => {
  const filePath = path.resolve('assets/img_1_1.ppm')
  const image = readPpm(filePath)

  for (let i = 0; i < image.blocks.length; i++) {
    image.blocks[i].R = dct(image.blocks[i].R)
    image.blocks[i].R = idct(image.blocks[i].R)
    image.blocks[i].G = dct(image.blocks[i].G)
    image.blocks[i].G = idct(image.blocks[i].G)
    image.blocks[i].B = dct(image.blocks[i].B)
    image.blocks[i].B = idct(image.blocks[i].B)
  }
  writePpm('output/dct.ppm', image)

  for (let i = 0; i < image.blocks.length; i++) {
    image.blocks[i].R = sep(image.blocks[i].R)
    image.blocks[i].R = idct(image.blocks[i].R)
    image.blocks[i].G = sep(image.blocks[i].G)
    image.blocks[i].G = idct(image.blocks[i].G)
    image.blocks[i].B = sep(image.blocks[i].B)
    image.blocks[i].B = idct(image.blocks[i].B)
  }
  writePpm('output/sep.ppm', image)

  for (let i = 0; i < image.blocks.length; i++) {
    aan(image.blocks[i].R)
    image.blocks[i].R = idct(image.blocks[i].R)
    aan(image.blocks[i].G)
    image.blocks[i].G = idct(image.blocks[i].G)
    aan(image.blocks[i].B)
    image.blocks[i].B = idct(image.blocks[i].B)
  }
  writePpm('output/ann.ppm', image)
})

it.skip('create image', () => {
  let data = 'P3\n3840 2160\n255\n'
  for (let y = 0; y < 2160; y++) {
    let row = ''
    for (let x = 0; x < 3840; x++)
      row += `${(x + y * 8) % 256} 0 0 `

    data += `${row} \n`
    row = ''
  }
  fs.writeFileSync('assets/big.ppm', data)
})

it.skip('performance', () => {
  const filePath = path.resolve('assets/big.ppm')
  const image = readPpm(filePath)

  for (let i = 0; i < image.blocks.length; i++) {
    aan(image.blocks[i].R)
    aan(image.blocks[i].G)
    aan(image.blocks[i].B)
  }
})
