import FastPriorityQueue from 'fastpriorityqueue'

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
  const { map, level, reversedMap } = computeBinaryMap(root)

  function encode() {
    let result = ''

    for (const c of str) {
      const v = map.get(c)
      if (v)
        result += v
    }
    return result
  }

  function decode(value: string) {
    let offset = 0
    let index = 0
    let result = ''

    while (offset < value.length && index < value.length) {
      const substr = value.substring(offset, offset + index)
      const decodedBinary = reversedMap.get(substr)

      if (decodedBinary) {
        result += decodedBinary
        offset += index
        index = 0
      }
      else {
        index += 1
      }
    }

    return result
  }

  return { encode, decode, level }
}

export function computeTree(str: string) {
  const map = new Map<string, number>()
  for (const c of str)
    map.set(c, (map.get(c) ?? 0) + 1)

  const queue = new FastPriorityQueue<Node>((a, b) => a.count < b.count)
  map.forEach((count, symbol) => queue.add({ count, symbol }))

  while (queue.size > 1) {
    const left = queue.poll() ?? { count: 0 }
    const right = queue.poll() ?? { count: 0 }
    const count = left.count + right.count
    queue.add({ left, right, count })
  }

  const root = queue.poll()
  if (!root)
    throw new Error('Error')

  return root
}

export function computeBinaryMap(root: Node) {
  const map = new Map<string, string>()

  const getBinary = (node: Node, binary = '') => {
    if (!node.left && !node.right && node.symbol) {
      map.set(node.symbol, binary)
      return
    }

    node.left && getBinary(node.left, binary.concat('0'))
    node.right && getBinary(node.right, binary.concat('1'))
  }

  getBinary(root)

  let level = 0
  const reversedMap = new Map<string, string>()

  map.forEach((binary, symbol) => {
    if (binary.length > level)
      level = binary.length

    reversedMap.set(binary, symbol)
  })

  return { map, reversedMap, level }
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
  nodes.sort((a, b) => a.count - b.count)

  while (nodes.length > 1) {
    const left = nodes.shift() ?? { count: 0 }
    const right = nodes.shift() ?? { count: 0 }

    nodes.unshift({
      count: left.count + right.count,
      left,
      right,
    })
  }

  console.log(JSON.stringify(nodes, undefined, 2))

  return nodes[0]
}
