import { describe, expect, it } from 'vitest'
import { computeBinaryMap, computeTree, useHuffman } from '../src/huffman.js'
import { useStream } from '../src/stream.js'

const str = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit reiciendis perspiciatis expedita nemo a libero, quas in maiores placeat. Dolore quam ipsa iure fugiat veniam? Blanditiis magni eveniet minus nesciunt ea corrupti optio rerum obcaecati distinctio maxime deleniti, quo molestiae unde est, tempore ad labore dolorum cum tempora consectetur quia incidunt facilis. Fugiat est magnam fuga cumque, architecto pariatur asperiores ad qui similique, cum tenetur laboriosam sed placeat ullam, omnis nulla. Tenetur rerum molestiae quod esse labore consequatur laudantium officiis aliquam. Consequatur veritatis saepe nisi, unde voluptatibus at sequi adipisci. Maxime officiis exercitationem id aliquam ullam iusto fugiat autem laudantium?'

describe('huffmann', () => {
  it('compute tree', () => {
    const root = computeTree(str)
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 739,
        "left": {
          "count": 300,
          "left": {
            "count": 139,
            "left": {
              "count": 67,
              "symbol": "e",
            },
            "right": {
              "count": 72,
              "left": {
                "count": 35,
                "symbol": "m",
              },
              "right": {
                "count": 37,
                "symbol": "o",
              },
            },
          },
          "right": {
            "count": 161,
            "left": {
              "count": 80,
              "symbol": "i",
            },
            "right": {
              "count": 81,
              "left": {
                "count": 39,
                "symbol": "s",
              },
              "right": {
                "count": 42,
                "left": {
                  "count": 19,
                  "symbol": "d",
                },
                "right": {
                  "count": 23,
                  "left": {
                    "count": 10,
                    "left": {
                      "count": 4,
                      "left": {
                        "count": 2,
                        "left": {
                          "count": 1,
                          "symbol": "B",
                        },
                        "right": {
                          "count": 1,
                          "symbol": "h",
                        },
                      },
                      "right": {
                        "count": 2,
                        "left": {
                          "count": 1,
                          "symbol": "T",
                        },
                        "right": {
                          "count": 1,
                          "symbol": "C",
                        },
                      },
                    },
                    "right": {
                      "count": 6,
                      "symbol": ".",
                    },
                  },
                  "right": {
                    "count": 13,
                    "symbol": "q",
                  },
                },
              },
            },
          },
        },
        "right": {
          "count": 439,
          "left": {
            "count": 199,
            "left": {
              "count": 99,
              "symbol": " ",
            },
            "right": {
              "count": 100,
              "left": {
                "count": 50,
                "symbol": "u",
              },
              "right": {
                "count": 50,
                "symbol": "t",
              },
            },
          },
          "right": {
            "count": 240,
            "left": {
              "count": 112,
              "left": {
                "count": 53,
                "left": {
                  "count": 26,
                  "symbol": "c",
                },
                "right": {
                  "count": 27,
                  "symbol": "l",
                },
              },
              "right": {
                "count": 59,
                "left": {
                  "count": 29,
                  "left": {
                    "count": 13,
                    "left": {
                      "count": 6,
                      "symbol": "b",
                    },
                    "right": {
                      "count": 7,
                      "left": {
                        "count": 3,
                        "left": {
                          "count": 1,
                          "symbol": "M",
                        },
                        "right": {
                          "count": 2,
                          "symbol": "F",
                        },
                      },
                      "right": {
                        "count": 4,
                        "symbol": "x",
                      },
                    },
                  },
                  "right": {
                    "count": 16,
                    "left": {
                      "count": 8,
                      "symbol": ",",
                    },
                    "right": {
                      "count": 8,
                      "symbol": "g",
                    },
                  },
                },
                "right": {
                  "count": 30,
                  "symbol": "n",
                },
              },
            },
            "right": {
              "count": 128,
              "left": {
                "count": 62,
                "symbol": "a",
              },
              "right": {
                "count": 66,
                "left": {
                  "count": 33,
                  "symbol": "r",
                },
                "right": {
                  "count": 33,
                  "left": {
                    "count": 16,
                    "left": {
                      "count": 8,
                      "symbol": "f",
                    },
                    "right": {
                      "count": 8,
                      "left": {
                        "count": 4,
                        "symbol": "v",
                      },
                      "right": {
                        "count": 4,
                        "left": {
                          "count": 2,
                          "symbol": "?",
                        },
                        "right": {
                          "count": 2,
                          "left": {
                            "count": 1,
                            "symbol": "L",
                          },
                          "right": {
                            "count": 1,
                            "symbol": "D",
                          },
                        },
                      },
                    },
                  },
                  "right": {
                    "count": 17,
                    "symbol": "p",
                  },
                },
              },
            },
          },
        },
      }
    `)
  })

  it('compute binary map', () => {
    const root = computeTree(str)
    const { map, level } = computeBinaryMap(root)
    expect(level).toEqual(10)
    expect(map).toMatchSnapshot()
  })

  it('useHuffman with invalid input', () => {
    expect(() => useHuffman('')).toThrowErrorMatchingInlineSnapshot('"Invalid input"')
  })

  it('encode', () => {
    const { encode, encoded } = useHuffman(str)
    encode()
    expect(encoded).toMatchSnapshot()
  })

  it('decode', () => {
    const { encode, decode } = useHuffman(str)
    expect(() => decode()).toThrowErrorMatchingInlineSnapshot('"encode function must be called first"')

    encode()
    expect(decode()).toEqual(str)
  })

  it('buffer', () => {
    const { encode, encoded, level } = useHuffman(str)
    encode()

    const { getBuffer, writeWord } = useStream()

    encoded.forEach((symbol) => {
      const byte = symbol.padStart(16, '1')
      writeWord(Number.parseInt(byte, 2))
    })
    console.log(getBuffer())
  })
})
