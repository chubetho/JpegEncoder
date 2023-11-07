import { describe, expect, it } from 'vitest'
import { useEncoder } from '../src/encoder.js'

describe('encoder', () => {
  it('encoder', () => {
    const data = { width: 100, height: 100, content: [] }
    const { buffer } = useEncoder(data)
    expect(buffer.subarray(0, 50).toString('hex')).toMatchInlineSnapshot('"ffd8ffe000104a46494600010100004800480000ffc000110800640064030111000211000311000000000000000000000000"')
  })
})
