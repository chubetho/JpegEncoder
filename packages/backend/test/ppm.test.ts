import * as path from 'node:path'
import { expect, it } from 'vitest'
import { readPpm, writePpm } from '../src/ppm.js'

// output/big.ppm
// assets/img_1_32.ppm
it('read ppm', () => {
  const filePath = path.resolve('assets/img_1_32.ppm')
  const image = readPpm(filePath)
  expect(image).toMatchSnapshot()
})

it('write ppm', () => {
  const filePath = path.resolve('assets/img_1_32.ppm')
  const image = readPpm(filePath)
  writePpm('output/write.ppm', image)
})
