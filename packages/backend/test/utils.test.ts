import { describe, expect, it } from 'vitest'
import { snipImage } from '../src/utils.js'
import { mockParsedPpmImg } from './mocks.js'

describe('utils', () => {
  it('snip image', () => {
    expect(mockParsedPpmImg[0].length).toEqual(20)
    expect(mockParsedPpmImg.length).toEqual(16)

    expect(snipImage(mockParsedPpmImg, { x: 14, y: 14, rangeX: 1, rangeY: 1 })).toEqual([
      [[17, 20, 29]],
    ])
    expect(snipImage(mockParsedPpmImg, { x: 14, y: 14, rangeX: 4, rangeY: 2 })).toEqual([
      [[17, 20, 29], [15, 19, 18], [44, 39, 18], [50, 56, 30]],
      [[29, 29, 19], [59, 49, 23], [55, 39, 36], [39, 36, 29]],
    ])
    expect(snipImage(mockParsedPpmImg, { x: 14, y: 14, rangeX: 4, rangeY: 100 })).toEqual([
      [[17, 20, 29], [15, 19, 18], [44, 39, 18], [50, 56, 30]],
      [[29, 29, 19], [59, 49, 23], [55, 39, 36], [39, 36, 29]],
    ])
    expect(snipImage(mockParsedPpmImg, { x: 14, y: 14, rangeX: 100, rangeY: 100 })).toEqual([
      [[17, 20, 29], [15, 19, 18], [44, 39, 18], [50, 56, 30], [35, 43, 45], [26, 29, 36]],
      [[29, 29, 19], [59, 49, 23], [55, 39, 36], [39, 36, 29], [26, 31, 30], [15, 19, 28]],
    ])
  })

  it('snip image with error', () => {
    expect(() => snipImage(mockParsedPpmImg, { x: 1, y: 1, rangeX: 0, rangeY: 1 }))
      .toThrowErrorMatchingInlineSnapshot('"Invalid config"')
    expect(() => snipImage(mockParsedPpmImg, { x: 1, y: 1, rangeX: -1, rangeY: 1 }))
      .toThrowErrorMatchingInlineSnapshot('"Invalid config"')
    expect(() => snipImage(mockParsedPpmImg, { x: -1, y: 1, rangeX: 1, rangeY: -1 }))
      .toThrowErrorMatchingInlineSnapshot('"Invalid config"')
  })
})
