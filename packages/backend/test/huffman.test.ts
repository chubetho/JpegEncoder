import { describe, expect, it } from 'vitest'
import type { Node } from '../src/huffman.js'
import { useHuffman } from '../src/huffman.js'

describe('huffman', () => {
  it('test', () => {
    const { decode, encode, getCharCodesFromSource, computedFrequencyTable } = useHuffman()

    const text = 'something just like this'
    const codes = getCharCodesFromSource(text)
    const encoded = encode(text, codes)
    const decoded = decode(encoded, codes)

    expect(decoded).toEqual(text)

    function computeTree(table: ReturnType<typeof computedFrequencyTable>) {
      const nodes: Node[] = table
        .map(([char, count]) => ({ char, count }))
        .sort((a, b) => a.count - b.count)

      while (nodes.length > 1) {
        const left = nodes.shift()
        const right = nodes.shift()

        const parent: Node = {
          count: (left?.count ?? 0) + (right?.count ?? 0),
          left,
          right,
        }

        nodes.push(parent)
      }

      return nodes[0]
    }

    // console.log(computeTree(computedFrequencyTable(text)))
  })
})
