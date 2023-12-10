import * as path from 'node:path'
import { bench } from 'vitest'
import { readPpm, writePpm } from '../src/ppm.js'
import { aan, dct, idct, sep } from '../src/transform.js'

bench('dct', () => {
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
}, { iterations: 1 })

bench('sep', () => {
  const filePath = path.resolve('assets/img_1_1.ppm')
  const image = readPpm(filePath)
  for (let i = 0; i < image.blocks.length; i++) {
    image.blocks[i].R = sep(image.blocks[i].R)
    image.blocks[i].R = idct(image.blocks[i].R)
    image.blocks[i].G = sep(image.blocks[i].G)
    image.blocks[i].G = idct(image.blocks[i].G)
    image.blocks[i].B = sep(image.blocks[i].B)
    image.blocks[i].B = idct(image.blocks[i].B)
  }
  writePpm('output/sep.ppm', image)
}, { iterations: 1 })

bench('aan', () => {
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
  writePpm('output/ann.ppm', image)
}, { iterations: 1 })
