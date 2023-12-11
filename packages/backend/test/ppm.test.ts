import * as path from 'node:path'
import { it } from 'vitest'
import { foo } from '../src/ppm.js'

// it('read ppm', () => {
//   const filePath = path.resolve('output/big.ppm')
//   const image = readPpm(filePath)
//   // expect(image).toMatchSnapshot()
// })

// output/big.ppm
// assets/img_1_32.ppm
it('foo', () => {
  const filePath = path.resolve('output/big.ppm')
  const image = foo(filePath)
  // expect(image).toMatchSnapshot()
})
