import { describe, expect, it } from 'vitest'
import { computeAntiPatternTree, computeBinaryMap, computeRightTree, computeTree, useHuffman } from '../src/huffman.js'
import { useStream } from '../src/stream.js'

describe('huffmann', () => {
  const str = 'wweeerrrrtttttyyyyyyuuuuuuuuuiiiiiiiiiiiiooooooooooooooooooppppppppppppppppppppppppppppppaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssvvvvvvvbbx'

  it('compute tree', () => {
    expect(computeTree({ str })).toMatchSnapshot()
  })

  it('compute tree with maxDepth', () => {
    expect(computeTree({ str, maxDepth: 5 })).toMatchSnapshot()
  })

  it('compute binary map', () => {
    const { root } = computeTree({ str })
    const { map, reversedMap } = computeBinaryMap(root)

    expect(map).toMatchInlineSnapshot(`
      Map {
        "o" => "000",
        "t" => "00100",
        "b" => "001010",
        "e" => "001011",
        "i" => "0011",
        "a" => "01",
        "y" => "10000",
        "v" => "10001",
        "x" => "1001000",
        "w" => "1001001",
        "r" => "100101",
        "u" => "10011",
        "p" => "101",
        "s" => "11",
      }
    `)
    expect(reversedMap).toMatchSnapshot()
  })

  it('useHuffman with invalid input', () => {
    expect(() => useHuffman('')).toThrowErrorMatchingInlineSnapshot('"Invalid input"')
  })

  it('encode', () => {
    const { encode } = useHuffman(str)
    expect(encode()).toMatchSnapshot()
  })

  it('decode', () => {
    const { encode, decode } = useHuffman(str)
    const encoded = encode()

    expect(decode(encoded)).toEqual(str)
    expect(decode('00111101011010')).toMatchInlineSnapshot('"isaap"')
  })

  it('buffer', () => {
    const { encode, decode } = useHuffman(str)
    const { getBuffer, writeBit } = useStream()

    encode().split('').forEach(c => writeBit(+c))

    const head = getBuffer().slice(0, 10)
    expect(head).toMatchInlineSnapshot(`
      Uint8Array [
        147,
        36,
        178,
        203,
        150,
        89,
        101,
        33,
        8,
        66,
      ]
    `)

    const encoded = head.reduce((acc, cur) => acc + cur.toString(2), '')
    expect(encoded).toMatchInlineSnapshot('"100100111001001011001011001011100101101011001110010110000110001000010"')
    expect(decode(encoded)).toMatchInlineSnapshot('"wstprrseaaurysoy"')
  })

  it('compute right tree', () => {
    expect(computeRightTree(str)).toMatchSnapshot()
  })

  it('compute pattern tree', () => {
    expect(computeAntiPatternTree(str)).toMatchSnapshot()
  })
})
