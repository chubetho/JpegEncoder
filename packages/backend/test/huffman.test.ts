import { describe, expect, it } from 'vitest'
import { computeAntiPatternTree, computeBinaryMap, computeLimitLevelTree, computeRightTree, computeTree, useHuffman } from '../src/huffman.js'
import { useStream } from '../src/stream.js'

describe('huffmann', () => {
  const str = 'aabbccccdeeeeef'

  it('compute tree', () => {
    const root = computeTree(str)
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 15,
        "left": {
          "count": 6,
          "left": {
            "count": 2,
            "symbol": "b",
          },
          "right": {
            "count": 4,
            "left": {
              "count": 2,
              "symbol": "a",
            },
            "right": {
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
          },
        },
        "right": {
          "count": 9,
          "left": {
            "count": 4,
            "symbol": "c",
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

    expect(level).toEqual(4)
    expect(map).toMatchInlineSnapshot(`
      Map {
        "b" => "00",
        "a" => "010",
        "d" => "0110",
        "f" => "0111",
        "c" => "10",
        "e" => "11",
      }
    `)
    expect(reversedMap).toMatchInlineSnapshot(`
      Map {
        "00" => "b",
        "010" => "a",
        "0110" => "d",
        "0111" => "f",
        "10" => "c",
        "11" => "e",
      }
    `)
  })

  it('useHuffman with invalid input', () => {
    expect(() => useHuffman('')).toThrowErrorMatchingInlineSnapshot('"Invalid input"')
  })

  it('encode', () => {
    const { encode } = useHuffman(str)
    expect(encode()).toMatchInlineSnapshot('"010010000010101010011011111111110111"')
  })

  it('decode', () => {
    const { encode, decode } = useHuffman(str)
    const encoded = encode()

    expect(decode(encoded)).toEqual(str)
    expect(decode('00111101011010')).toMatchInlineSnapshot('"beeaea"')
  })

  it('buffer', () => {
    const { encode, decode } = useHuffman(str)
    const { getBuffer, writeBit } = useStream()

    encode().split('').forEach(c => writeBit(+c))

    const head = getBuffer().slice(0, 10)
    expect(head).toMatchInlineSnapshot(`
      Uint8Array [
        72,
        42,
        155,
        255,
        7,
        0,
        0,
        0,
        0,
        0,
      ]
    `)

    const encoded = head.reduce((acc, cur) => acc + cur.toString(2), '')
    expect(encoded).toMatchInlineSnapshot('"1001000101010100110111111111111100000"')
    expect(decode(encoded)).toMatchInlineSnapshot('"cabccccdeeeeeecbb"')
  })

  it('compute right tree', () => {
    const root = computeRightTree(str)
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 15,
        "left": {
          "count": 5,
          "symbol": "e",
        },
        "right": {
          "count": 10,
          "left": {
            "count": 4,
            "symbol": "c",
          },
          "right": {
            "count": 6,
            "left": {
              "count": 2,
              "symbol": "b",
            },
            "right": {
              "count": 4,
              "left": {
                "count": 2,
                "symbol": "a",
              },
              "right": {
                "count": 2,
                "left": {
                  "count": 1,
                  "symbol": "f",
                },
                "right": {
                  "count": 1,
                  "symbol": "d",
                },
              },
            },
          },
        },
      }
    `)
  })

  it('compute pattern tree', () => {
    const root = computeAntiPatternTree(str)
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 15,
        "left": {
          "count": 6,
          "left": {
            "count": 2,
            "symbol": "b",
          },
          "right": {
            "count": 4,
            "left": {
              "count": 2,
              "symbol": "a",
            },
            "right": {
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
          },
        },
        "right": {
          "count": 9,
          "left": {
            "count": 4,
            "symbol": "c",
          },
          "right": {
            "count": 5,
            "left": {
              "count": 5,
              "symbol": "e",
            },
            "right": {
              "count": 0,
              "symbol": "",
            },
          },
        },
      }
    `)
  })

  it('compute limit level tree', () => {
    const root = computeLimitLevelTree('qwweeerrrrtttttyyyyyyuuuuuuuuuiiiiiiiiiiiiooooooooooooooooooppppppppppppppppppppppppppppppaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 5)
  })
})
