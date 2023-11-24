import { Buffer } from 'node:buffer'
import { describe, expect, it } from 'vitest'
import { computeCodeBook, computeLengthBook } from '../src/huffman'

describe('pm', () => {
  const str = 'abccccccddddddddddeeeeeeeeeeeeeeeeeeeeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  const buffer = Buffer.from(str)

  it('compute tree with maxlength 4', () => {
    const lengthBook = computeLengthBook(buffer, 4)
    expect(lengthBook).toEqual(
      [
        { length: 4, symbol: 97 },
        { length: 4, symbol: 98 },
        { length: 4, symbol: 99 },
        { length: 4, symbol: 100 },
        { length: 2, symbol: 101 },
        { length: 1, symbol: 102 },
      ],
    )

    expect(computeCodeBook(lengthBook)).toEqual(
      {
        97: '11110',
        98: '1110',
        99: '1101',
        100: '1100',
        101: '10',
        102: '0',
      },
    )
  })

  it('compute tree with maxlength 3', () => {
    const lengthBook = computeLengthBook(buffer, 3)
    expect(lengthBook).toEqual(
      [
        { length: 3, symbol: 97 },
        { length: 3, symbol: 98 },
        { length: 3, symbol: 99 },
        { length: 3, symbol: 100 },
        { length: 2, symbol: 101 },
        { length: 2, symbol: 102 },
      ],
    )

    expect(computeCodeBook(lengthBook)).toEqual(
      {
        97: '1110',
        98: '110',
        99: '101',
        100: '100',
        101: '01',
        102: '00',
      },
    )
  })

  it('compute tree with maxlength 2', () => {
    const lengthBook = computeLengthBook(buffer, 2)
    expect(lengthBook).toMatchInlineSnapshot('[]')
    expect(computeCodeBook(lengthBook)).toMatchInlineSnapshot('{}')
  })
})
