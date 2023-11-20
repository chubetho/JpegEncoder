import { describe, expect, it } from 'vitest'
import { buildTree, computeCodeBook, computeLengthBook } from '../src/pm'

describe('pm', () => {
  let str = 'ab'
  for (let i = 1; i <= 6; i++)
    str += 'c'
  for (let i = 1; i <= 10; i++)
    str += 'd'
  for (let i = 1; i <= 20; i++)
    str += 'e'
  for (let i = 1; i <= 270; i++)
    str += 'f'

  it('compute tree with maxlength 4', () => {
    const lengthBook = computeLengthBook(str, 4)
    expect(lengthBook).toMatchInlineSnapshot(`
      [
        {
          "length": 4,
          "symbol": "a",
        },
        {
          "length": 4,
          "symbol": "b",
        },
        {
          "length": 4,
          "symbol": "c",
        },
        {
          "length": 4,
          "symbol": "d",
        },
        {
          "length": 2,
          "symbol": "e",
        },
        {
          "length": 1,
          "symbol": "f",
        },
      ]
    `)

    expect(computeCodeBook(lengthBook)).toMatchInlineSnapshot(`
    {
      "a": "1111",
      "b": "1110",
      "c": "1101",
      "d": "1100",
      "e": "10",
      "f": "0",
    }
  `)
  })

  it.skip('compute tree with maxlength 3', () => {
    const lengthBook = computeLengthBook(str, 3)
    expect(lengthBook).toMatchInlineSnapshot(`
      [
        {
          "length": 3,
          "symbol": "a",
        },
        {
          "length": 3,
          "symbol": "b",
        },
        {
          "length": 3,
          "symbol": "c",
        },
        {
          "length": 3,
          "symbol": "d",
        },
        {
          "length": 2,
          "symbol": "e",
        },
        {
          "length": 2,
          "symbol": "f",
        },
      ]
    `)

    expect(computeCodeBook(lengthBook)).toEqual(
      {
        a: '111',
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

  it('build tree', () => {
    const tree = buildTree(str, 4)
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
              "left": {
                "symbol": "d",
              },
              "right": {
                "symbol": "c",
              },
            },
            "right": {
              "left": {
                "symbol": "b",
              },
              "right": {
                "symbol": "a",
              },
            },
          },
        },
      }
    `)
  })
})
