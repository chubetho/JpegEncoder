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

export function computeTree(str: string, nodes?: Node[]) {
  const queue = new FastPriorityQueue<Node>((a, b) => a.count < b.count)

  if (nodes) {
    nodes.forEach(n => queue.add(n))
  }
  else {
    const map = new Map<string, number>()
    for (const c of str)
      map.set(c, (map.get(c) ?? 0) + 1)

    map.forEach((count, symbol) => queue.add({ count, symbol }))
  }

  while (queue.size > 1) {
    const left = queue.poll() ?? { count: 0 }
    const right = queue.poll() ?? { count: 0 }
    const count = left.count + right.count
    queue.add({ count, left, right })
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
    const right = nodes.shift() ?? { count: 0 }
    const left = nodes.shift() ?? { count: 0 }
    const count = left.count + right.count
    nodes.unshift({ count, left, right })
  }

  return nodes[0]
}

export function computeAntiPatternTree(str: string) {
  const root = computeTree(str)

  const getMostRight = (node: Node): Node => node.right ? getMostRight(node.right) : node
  const mostRight = getMostRight(root)
  mostRight.left = { ...mostRight }
  mostRight.right = { count: 0, symbol: '' }
  delete mostRight.symbol

  return root
}

export function computeLimitLevelTree(str: string, limit: number): { limitedTree: Node; smallTree?: Node } {
  const root = computeTree(str)

  let level = 0
  const pruneNodes: Node[] = []
  const getLevel = (node: Node, cb: (l: number, node: Node) => void, l = 0) => {
    if (!node.left && !node.right && node.symbol)
      return cb(l, node)

    node.left && getLevel(node.left, cb, l + 1)
    node.right && getLevel(node.right, cb, l + 1)
  }

  getLevel(root, (l, node) => {
    if (l > level)
      level = l

    if (l >= limit)
      pruneNodes.push(node)
  })

  if (level < limit)
    return { limitedTree: root }

  const pruneSymbols = pruneNodes.map(n => n.symbol ?? '').filter(Boolean)
  const prune = (node: Node) => {
    if (
      pruneSymbols.includes(node.left?.symbol ?? '')
      || pruneSymbols.includes(node.right?.symbol ?? '')) {
      delete node.left
      delete node.right
      return
    }

    node.left && prune(node.left)
    node.right && prune(node.right)
  }

  prune(root)

  const smallRoot = computeTree('', pruneNodes)
  let smallLevel = 0
  getLevel(smallRoot, (l) => {
    if (l > smallLevel)
      smallLevel = l
  })

  const targetLevel = limit - smallLevel - 1
  console.log(limit)
  console.log(smallLevel)
  console.log(targetLevel)

  let targetNode: Node = { count: Number.MAX_SAFE_INTEGER }
  getLevel(root, (l, node) => {
    if (l === targetLevel && targetNode.count > node.count)
      targetNode = node
  })

  if (smallRoot.count < targetNode.count) {
    targetNode.right = { ...targetNode }
    targetNode.left = smallRoot
  }
  else {
    targetNode.left = { ...targetNode }
    targetNode.right = smallRoot
  }

  delete targetNode.symbol

  return { limitedTree: root, smallTree: smallRoot }
}
