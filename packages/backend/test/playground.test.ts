import * as path from 'node:path'
import * as fs from 'node:fs'
import { it } from 'vitest'
import { readPpm, writePpm } from '../src/ppm.js'
import { aan, dct, idct } from '../src/transform.js'

it('dct', () => {
  const filePath = path.resolve('assets/img_1_1.ppm')
  const image = readPpm(filePath)

  for (let i = 0; i < image.blocks.length; i++) {
    image.blocks[i].R = Uint8Array.from(idct(dct(Array.from(image.blocks[i].R))))
    image.blocks[i].G = Uint8Array.from(idct(dct(Array.from(image.blocks[i].G))))
    image.blocks[i].B = Uint8Array.from(idct(dct(Array.from(image.blocks[i].B))))
  }
  writePpm('output/dct.ppm', image)

  // for (let i = 0; i < image.blocks.length; i++) {
  //   image.blocks[i].R = Uint8Array.from(idct(aan(Array.from(image.blocks[i].R))))
  //   image.blocks[i].G = Uint8Array.from(idct(aan(Array.from(image.blocks[i].G))))
  //   image.blocks[i].B = Uint8Array.from(idct(aan(Array.from(image.blocks[i].B))))
  // }

  for (let i = 0; i < image.blocks.length; i++) {
    image.blocks[i].R = Uint8Array.from(idct(aan(Array.from(image.blocks[i].R))))
    image.blocks[i].G = Uint8Array.from(idct(aan(Array.from(image.blocks[i].G))))
    image.blocks[i].B = Uint8Array.from(idct(aan(Array.from(image.blocks[i].B))))
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
