import { describe, expect, it } from 'vitest'
import { getCodeBook, packageMerge } from '../src/pm'

describe('pm', () => {
  it('package merge', () => {
    let str = 'ab'
    for (let i = 1; i <= 6; i++)
      str += 'c'
    for (let i = 1; i <= 10; i++)
      str += 'd'
    for (let i = 1; i <= 20; i++)
      str += 'e'
    for (let i = 1; i <= 270; i++)
      str += 'f'

    expect(packageMerge(str, 4)).toMatchInlineSnapshot(`
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
  })

  it('compute codebook', () => {
    let str = 'ab'
    for (let i = 1; i <= 6; i++)
      str += 'c'
    for (let i = 1; i <= 10; i++)
      str += 'd'
    for (let i = 1; i <= 20; i++)
      str += 'e'
    for (let i = 1; i <= 270; i++)
      str += 'f'
    const lengthBook = packageMerge(str, 4)
    expect(getCodeBook(lengthBook)).toMatchInlineSnapshot(`
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
})
