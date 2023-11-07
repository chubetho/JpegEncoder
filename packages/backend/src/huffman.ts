export interface Node {
  char?: string
  count: number
  left?: Node
  right?: Node
}

export function useHuffman() {
  function encode(text: string, codes: Map<string, string>): Array<string> {
    const result: Array<string> = []
    for (const char of text)
      result.push(codes.get(char)!)

    return result
  }

  function decode(encodedText: Array<string>, codes: Map<string, string>): string {
    let result = ''

    const reversedCodes: Record<string, string> = {}
    Array.from(codes.entries()).forEach(([key, value]) => {
      reversedCodes[value] = key
    })

    for (const code of encodedText)
      result += reversedCodes[code]

    return result
  }

  function getCharCodesFromSource(text: string): Map<string, string> {
    const freqArr = computedFrequencyTable(text)
    const tree = getTree(freqArr)

    const codes: Map<string, string> = new Map() // Array with symbols and codes

    getCodes(tree, (char, code) => {
      codes.set(char, code)
    })
    return codes
  }

  function getCodes(tree: Node | undefined, cb: (char: string, code: string) => void, code = ''): void {
    if (!tree)
      return

    if (!tree.left && !tree.right) {
      cb(tree.char ?? '', code)
      return
    }

    getCodes(tree.left, cb, `${code}0`)
    getCodes(tree.right, cb, `${code}1`)
  }

  function computedFrequencyTable(str: string) {
    const map = new Map<string, number>()

    for (const c of str)
      map.set(c, (map.get(c) ?? 0) + 1)

    return Array.from(map)
  }

  function getTree(freq: [string, number][]): Node {
    const nodes: Node[] = []

    for (const [char, weight] of freq)
      nodes.push({ char, count: weight })

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.count - b.count)

      const left = nodes.shift()!
      const right = nodes.shift()!

      const parent: Node = { char: '', count: left?.count + right?.count, left, right }

      nodes.push(parent)
    }

    return nodes[0]
  }

  return { getCharCodesFromSource, encode, decode, computedFrequencyTable }
}
