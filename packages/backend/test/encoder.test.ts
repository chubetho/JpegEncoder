import { readFileSync } from 'node:fs'
import { describe, it } from 'vitest'
import { useEncoder } from '../src/encoder.js'

describe('encoder', () => {
  it('encoder', () => {
    const content = readFileSync('assets/big.txt')
    const data = { width: 100, height: 100, content }
    const { save } = useEncoder(data)
    // save('temp/test.jpg')
  })
})
