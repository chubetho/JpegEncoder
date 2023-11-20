import { describe, it } from 'vitest'
import { packageMerge } from '../src/pm'

interface Item { symbol?: string; count: number; isPackage?: boolean }

describe('pm', () => {
  it('package merge', () => {
    packageMerge('', 4)
  })

  it('canonical', () => {
    const codeBook = [
      ['o', '000'],
      ['t', '00100'],
      ['b', '001010'],
      ['e', '001011'],
      ['i', '0011'],
      ['a', '01'],
      ['y', '10000'],
      ['v', '10001'],
      ['x', '1001000'],
      ['w', '1001001'],
      ['r', '100101'],
      ['u', '10011'],
      ['p', '101'],
      ['s', '11'],
    ]

    codeBook.sort((a, b) => {
      const aLength = a[1].length
      const bLength = b[1].length
      return aLength === bLength ? a[0].localeCompare(b[0]) : aLength - bLength
    })
    const lengthBook = codeBook.map(([k, v]) => [k, v.length])

    let current = 0
    const map: Record<string, string> = {
      [lengthBook[0][0]]: Array.from({ length: +lengthBook[0][1] }).fill('0').join(''),
    }

    for (let i = 1; i < lengthBook.length; i++) {
      current++
      if (current.toString(2).length < +lengthBook[i][1])
        current <<= 1

      map[lengthBook[i][0]] = current.toString(2)
    }
  })
})
