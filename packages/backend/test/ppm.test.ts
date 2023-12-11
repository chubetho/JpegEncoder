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

it.skip('write ppm', () => {
  const filePath = path.resolve('assets/img_1_1.ppm')
  const image = readPpm(filePath)
  writePpm('output/write.ppm', image)
})

it.skip('read big ppm', () => {
  const filePath = path.resolve('output/big.ppm')
  readPpm(filePath)
})
