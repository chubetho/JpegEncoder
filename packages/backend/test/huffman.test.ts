import { describe, expect, it } from 'vitest'
import { computeBinaryMap, computeRightTree, computeTree, useHuffman } from '../src/huffman.js'
import { useStream } from '../src/stream.js'

const str = 'aabbccccdeeeeef'

describe('huffmann', () => {
  it('compute tree', () => {
    const root = computeTree(str)
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 15,
        "left": {
          "count": 6,
          "left": {
            "count": 2,
            "left": {
              "count": 1,
              "symbol": "d",
            },
            "right": {
              "count": 1,
              "symbol": "f",
            },
          },
          "right": {
            "count": 4,
            "symbol": "c",
          },
        },
        "right": {
          "count": 9,
          "left": {
            "count": 4,
            "left": {
              "count": 2,
              "symbol": "a",
            },
            "right": {
              "count": 2,
              "symbol": "b",
            },
          },
          "right": {
            "count": 5,
            "symbol": "e",
          },
        },
      }
    `)
  })

  it('compute binary map', () => {
    const root = computeTree(str)
    const { map, level, reversedMap } = computeBinaryMap(root)

    expect(level).toEqual(3)
    expect(map).toMatchInlineSnapshot(`
      Map {
        "d" => "000",
        "f" => "001",
        "c" => "01",
        "a" => "100",
        "b" => "101",
        "e" => "11",
      }
    `)
    expect(reversedMap).toMatchInlineSnapshot(`
      Map {
        "000" => "d",
        "001" => "f",
        "01" => "c",
        "100" => "a",
        "101" => "b",
        "11" => "e",
      }
    `)
  })

  it('useHuffman with invalid input', () => {
    expect(() => useHuffman('')).toThrowErrorMatchingInlineSnapshot('"Invalid input"')
  })

  it('encode', () => {
    const { encode } = useHuffman(str)
    expect(encode()).toMatchInlineSnapshot('"100100101101010101010001111111111001"')
  })

  it('decode', () => {
    const { encode, decode } = useHuffman(str)
    const encoded = encode()

    expect(decode(encoded)).toEqual(str)
    expect(decode('00111101011010')).toMatchInlineSnapshot('"febcb"')
  })

  it('buffer', () => {
    const { encode, decode } = useHuffman(str)
    encode()

    const { getBuffer, writeBit } = useStream()

    encode().split('').forEach(c => writeBit(+c))

    const head = getBuffer().slice(0, 10)
    expect(head).toMatchInlineSnapshot(`
      Uint8Array [
        146,
        213,
        81,
        255,
        9,
        0,
        0,
        0,
        0,
        0,
      ]
    `)

    const encoded = head.reduce((acc, cur) => acc + cur.toString(2), '')
    expect(encoded).toMatchInlineSnapshot('"1001001011010101101000111111111100100000"')
    expect(decode(encoded)).toMatchInlineSnapshot('"aabbccbdeeeeefd"')
  })

  it.skip('compute right tree', () => {
    const root = computeRightTree('aaabbccccdeef')
  })
})
