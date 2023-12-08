import * as path from 'node:path'
import { expect, it } from 'vitest'
import { readPpm } from '../src/ppm.js'

it('read ppm', () => {
  const filePath = path.resolve('assets/img_1_32.ppm')
  const image = readPpm(filePath)
  expect(image).toMatchSnapshot()
})
