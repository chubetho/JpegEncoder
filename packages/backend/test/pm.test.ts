import { describe, expect, it } from 'vitest'
import { buildTree, computeCodeBook, computeLengthBook } from '../src/pm'

describe('pm', () => {
  const str = 'abccccccddddddddddeeeeeeeeeeeeeeeeeeeeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

  it('compute tree with maxlength 4', () => {
    const lengthBook = computeLengthBook(str, 4)
    expect(lengthBook).toEqual(
      [
        { length: 4, symbol: 'a' },
        { length: 4, symbol: 'b' },
        { length: 4, symbol: 'c' },
        { length: 4, symbol: 'd' },
        { length: 2, symbol: 'e' },
        { length: 1, symbol: 'f' },
      ],
    )

    expect(computeCodeBook(lengthBook)).toEqual(
      {
        a: '11110',
        b: '1110',
        c: '1101',
        d: '1100',
        e: '10',
        f: '0',
      },
    )
  })

  it('compute tree with maxlength 3', () => {
    const lengthBook = computeLengthBook(str, 3)
    expect(lengthBook).toEqual(
      [
        { length: 3, symbol: 'a' },
        { length: 3, symbol: 'b' },
        { length: 3, symbol: 'c' },
        { length: 3, symbol: 'd' },
        { length: 2, symbol: 'e' },
        { length: 2, symbol: 'f' },
      ],
    )

    expect(computeCodeBook(lengthBook)).toEqual(
      {
        a: '1110',
        b: '110',
        c: '101',
        d: '100',
        e: '01',
        f: '00',
      },
    )
  })

  it('compute tree with maxlength 2', () => {
    const lengthBook = computeLengthBook(str, 2)
    expect(lengthBook).toMatchInlineSnapshot('[]')
    expect(computeCodeBook(lengthBook)).toMatchInlineSnapshot('{}')
  })

  it('build tree with maxLength 6 and anti', () => {
    const tree = buildTree(str, 6, true)
    expect(tree).toMatchInlineSnapshot(`
      {
        "left": {
          "symbol": "f",
        },
        "right": {
          "left": {
            "symbol": "e",
          },
          "right": {
            "left": {
              "symbol": "d",
            },
            "right": {
              "left": {
                "symbol": "c",
              },
              "right": {
                "left": {
                  "symbol": "b",
                },
                "right": {
                  "left": {
                    "symbol": "a",
                  },
                },
              },
            },
          },
        },
      }
    `)
  })

  it('build tree with maxLength 4', () => {
    const tree = buildTree(str, 4)
    expect(tree).toEqual(
      {
        left: { symbol: 'f' },
        right: {
          left: { symbol: 'e' },
          right: {
            left: {
              left: { symbol: 'd' },
              right: { symbol: 'c' },
            },
            right: {
              left: { symbol: 'b' },
              right: { symbol: 'a' },
            },
          },
        },
      },
    )
  })

  it('build tree with maxLength 3', () => {
    const tree = buildTree(str, 3)
    expect(tree).toEqual(
      {
        left: {
          left: { symbol: 'f' },
          right: { symbol: 'e' },
        },
        right: {
          left: {
            left: { symbol: 'd' },
            right: { symbol: 'c' },
          },
          right: {
            left: { symbol: 'b' },
            right: { symbol: 'a' },
          },
        },
      },
    )
  })

  it('build tree with maxLength 2', () => {
    const tree = buildTree(str, 2)
    expect(tree).toEqual({})
  })
})
