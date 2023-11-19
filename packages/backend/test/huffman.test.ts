import { describe, expect, it } from 'vitest'
import { computeAntiPatternTree, computeBinaryMap, computeRightTree, computeTree, useHuffman } from '../src/huffman.js'
import { useStream } from '../src/stream.js'

describe('huffmann', () => {
  const str = 'wweeerrrrtttttyyyyyyuuuuuuuuuiiiiiiiiiiiiooooooooooooooooooppppppppppppppppppppppppppppppaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssvvvvvvvbbx'

  it('compute tree', () => {
    const root = computeTree({ str })
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 200,
        "left": {
          "count": 81,
          "left": {
            "count": 40,
            "left": {
              "count": 18,
              "symbol": "o",
            },
            "right": {
              "count": 22,
              "left": {
                "count": 10,
                "left": {
                  "count": 5,
                  "symbol": "t",
                },
                "right": {
                  "count": 5,
                  "left": {
                    "count": 2,
                    "symbol": "b",
                  },
                  "right": {
                    "count": 3,
                    "symbol": "e",
                  },
                },
              },
              "right": {
                "count": 12,
                "symbol": "i",
              },
            },
          },
          "right": {
            "count": 41,
            "symbol": "a",
          },
        },
        "right": {
          "count": 119,
          "left": {
            "count": 59,
            "left": {
              "count": 29,
              "left": {
                "count": 13,
                "left": {
                  "count": 6,
                  "symbol": "y",
                },
                "right": {
                  "count": 7,
                  "symbol": "v",
                },
              },
              "right": {
                "count": 16,
                "left": {
                  "count": 7,
                  "left": {
                    "count": 3,
                    "left": {
                      "count": 1,
                      "symbol": "x",
                    },
                    "right": {
                      "count": 2,
                      "symbol": "w",
                    },
                  },
                  "right": {
                    "count": 4,
                    "symbol": "r",
                  },
                },
                "right": {
                  "count": 9,
                  "symbol": "u",
                },
              },
            },
            "right": {
              "count": 30,
              "symbol": "p",
            },
          },
          "right": {
            "count": 60,
            "symbol": "s",
          },
        },
      }
    `)
  })

  it('compute tree with maxDepth', () => {
    const root = computeTree({ str, maxDepth: 5 })
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 200,
        "left": {
          "count": 120,
          "left": {
            "count": 39,
            "left": {
              "count": 16,
              "left": {
                "count": 7,
                "symbol": undefined,
              },
              "right": {
                "count": 9,
                "symbol": "u",
              },
            },
            "right": {
              "count": 23,
              "left": {
                "count": 10,
                "left": {
                  "count": 5,
                  "symbol": "t",
                },
                "right": {
                  "count": 5,
                  "symbol": undefined,
                },
              },
              "right": {
                "count": 13,
                "left": {
                  "count": 6,
                  "symbol": "y",
                },
                "right": {
                  "count": 7,
                  "symbol": "v",
                },
              },
            },
          },
          "right": {
            "count": 81,
            "left": {
              "count": 40,
              "left": {
                "count": 18,
                "symbol": "o",
              },
              "right": {
                "count": 22,
                "left": {
                  "count": 10,
                },
                "right": {
                  "count": 12,
                  "symbol": "i",
                },
              },
            },
            "right": {
              "count": 41,
              "symbol": "a",
            },
          },
        },
        "right": {
          "count": 119,
          "left": {
            "count": 59,
            "left": {
              "count": 29,
              "left": {
                "count": 13,
                "left": {
                  "count": 6,
                  "symbol": "y",
                },
                "right": {
                  "count": 7,
                  "symbol": "v",
                },
              },
              "right": {
                "count": 16,
                "left": {
                  "count": 7,
                },
                "right": {
                  "count": 9,
                  "symbol": "u",
                },
              },
            },
            "right": {
              "count": 30,
              "symbol": "p",
            },
          },
          "right": {
            "count": 60,
            "symbol": "s",
          },
        },
      }
    `)
  })

  it('compute binary map', () => {
    const root = computeTree({ str })
    const { map, level, reversedMap } = computeBinaryMap(root)

    expect(level).toEqual(7)
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
    expect(reversedMap).toMatchInlineSnapshot(`
      Map {
        "000" => "o",
        "00100" => "t",
        "001010" => "b",
        "001011" => "e",
        "0011" => "i",
        "01" => "a",
        "10000" => "y",
        "10001" => "v",
        "1001000" => "x",
        "1001001" => "w",
        "100101" => "r",
        "10011" => "u",
        "101" => "p",
        "11" => "s",
      }
    `)
  })

  it('useHuffman with invalid input', () => {
    expect(() => useHuffman('')).toThrowErrorMatchingInlineSnapshot('"Invalid input"')
  })

  it('encode', () => {
    const { encode } = useHuffman(str)
    expect(encode()).toMatchInlineSnapshot('"1001001100100100101100101100101110010110010110010110010100100001000010000100001001000010000100001000010000100001001110011100111001110011100111001110011100110011001100110011001100110011001100110011001100110000000000000000000000000000000000000000000000000000001011011011011011011011011011011011011011011011011011011011011011011011011011011011011011010101010101010101010101010101010101010101010101010101010101010101010101010101010101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111100011000110001100011000110001100010010100010101001000"')
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
    const root = computeRightTree(str)
    expect(root).toMatchInlineSnapshot(`
      {
        "count": 200,
        "left": {
          "count": 60,
          "symbol": "s",
        },
        "right": {
          "count": 140,
          "left": {
            "count": 41,
            "symbol": "a",
          },
          "right": {
            "count": 99,
            "left": {
              "count": 30,
              "symbol": "p",
            },
            "right": {
              "count": 69,
              "left": {
                "count": 18,
                "symbol": "o",
              },
              "right": {
                "count": 51,
                "left": {
                  "count": 12,
                  "symbol": "i",
                },
                "right": {
                  "count": 39,
                  "left": {
                    "count": 9,
                    "symbol": "u",
                  },
                  "right": {
                    "count": 30,
                    "left": {
                      "count": 7,
                      "symbol": "v",
                    },
                    "right": {
                      "count": 23,
                      "left": {
                        "count": 6,
                        "symbol": "y",
                      },
                      "right": {
                        "count": 17,
                        "left": {
                          "count": 5,
                          "symbol": "t",
                        },
                        "right": {
                          "count": 12,
                          "left": {
                            "count": 4,
                            "symbol": "r",
                          },
                          "right": {
                            "count": 8,
                            "left": {
                              "count": 3,
                              "symbol": "e",
                            },
                            "right": {
                              "count": 5,
                              "left": {
                                "count": 2,
                                "symbol": "b",
                              },
                              "right": {
                                "count": 3,
                                "left": {
                                  "count": 2,
                                  "symbol": "w",
                                },
                                "right": {
                                  "count": 1,
                                  "symbol": "x",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
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
        "count": 200,
        "left": {
          "count": 81,
          "left": {
            "count": 40,
            "left": {
              "count": 18,
              "symbol": "o",
            },
            "right": {
              "count": 22,
              "left": {
                "count": 10,
                "left": {
                  "count": 5,
                  "symbol": "t",
                },
                "right": {
                  "count": 5,
                  "left": {
                    "count": 2,
                    "symbol": "b",
                  },
                  "right": {
                    "count": 3,
                    "symbol": "e",
                  },
                },
              },
              "right": {
                "count": 12,
                "symbol": "i",
              },
            },
          },
          "right": {
            "count": 41,
            "symbol": "a",
          },
        },
        "right": {
          "count": 119,
          "left": {
            "count": 59,
            "left": {
              "count": 29,
              "left": {
                "count": 13,
                "left": {
                  "count": 6,
                  "symbol": "y",
                },
                "right": {
                  "count": 7,
                  "symbol": "v",
                },
              },
              "right": {
                "count": 16,
                "left": {
                  "count": 7,
                  "left": {
                    "count": 3,
                    "left": {
                      "count": 1,
                      "symbol": "x",
                    },
                    "right": {
                      "count": 2,
                      "symbol": "w",
                    },
                  },
                  "right": {
                    "count": 4,
                    "symbol": "r",
                  },
                },
                "right": {
                  "count": 9,
                  "symbol": "u",
                },
              },
            },
            "right": {
              "count": 30,
              "symbol": "p",
            },
          },
          "right": {
            "count": 60,
            "left": {
              "count": 60,
              "symbol": "s",
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
})
