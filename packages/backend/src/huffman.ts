export interface Node {
  symbol?: string
  count: number
  left?: Node
  right?: Node
}

export function useHuffman(str: string) {
  if (!str)
    throw new Error('Invalid input')

  const root = computeTree(str)
  const { map, level } = computeBinaryMap(root)
  const encoded: string[] = []

  function encode() {
    for (const c of str) {
      const v = map.get(c)
      if (v)
        encoded.push(v)
    }
  }

  function decode() {
    if (!encoded.length)
      throw new Error('encode function must be called first')

    const reverseMap = new Map<string, string>()
    map.forEach((binary, symbol) => reverseMap.set(binary, symbol))

    return encoded.reduce((acc, cur) => `${acc}${reverseMap.get(cur)}`, '')
  }

  return { encode, decode, encoded, level }
}

export function computeTree(str: string) {
  const map = new Map<string, number>()

  for (const c of str)
    map.set(c, (map.get(c) ?? 0) + 1)

  const nodes: Node[] = Array.from(map).map(([symbol, count]) => ({ symbol, count }))

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.count - b.count)

    const left = nodes.shift() ?? { count: 0 }
    const right = nodes.shift() ?? { count: 0 }

    nodes.push({
      count: left.count + right.count,
      left,
      right,
    })
  }

  return nodes[0]
}

export function computeBinaryMap(root: Node) {
  const map = new Map<string, string>()
  let level = 0

  const max = Math.max
  const getBinary = (node: Node, binary = '') => {
    if (!node.left && !node.right && node.symbol) {
      map.set(node.symbol, binary)
      level = max(binary.length, level)
      return
    }

    node.left && getBinary(node.left, `${binary}0`)
    node.right && getBinary(node.right, `${binary}1`)
  }

  getBinary(root)

  return { map, level }
}

function computeCharTable() {
  const table: string[] = Array.from({ length: 256 })
  const fn = String.fromCharCode
  for (let i = 0; i < 256; i++)
    table[i] = fn(i)

  return table
}

export function computeRightTree(str: string) {
  const map = new Map<string, number>()

  for (const c of str)
    map.set(c, (map.get(c) ?? 0) + 1)

  const nodes: Node[] = Array.from(map).map(([symbol, count]) => ({ symbol, count }))

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.count - b.count)

    const left = nodes.shift() ?? { count: 0 }
    const right = nodes.shift() ?? { count: 0 }

    nodes.push({
      count: left.count + right.count,
      left,
      right,
    })
  }

  return nodes[0]
}
