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

  const root = computeTree({ str })
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

export function computeTree(config: { str?: string; nodes?: Node[]; maxDepth?: number }): Node {
  const _config = {
    str: undefined,
    nodes: undefined,
    maxDepth: 16,
    ...config,
  }

  const queue = new FastPriorityQueue<Node>((a, b) => a.count < b.count)

  if (_config.nodes) {
    _config.nodes.forEach(({ count, symbol }) => queue.add({ count, symbol }))
  }
  else if (_config.str) {
    const map = new Map<string, number>()
    for (const c of _config.str)
      map.set(c, (map.get(c) ?? 0) + 1)

    map.forEach((count, symbol) => queue.add({ count, symbol }))
  }
  else {
    throw new Error('Invalid config')
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

  const rootDepth = getDepth(root) - 1

  if (rootDepth <= _config.maxDepth)
    return root

  const prunedRoot = adaptTree(root, _config.maxDepth)
  return prunedRoot
}

function getDepth(node?: Node): number {
  if (!node)
    return 0

  const leftDepth = getDepth(node.left)
  const rightDepth = getDepth(node.right)
  return Math.max(leftDepth, rightDepth) + 1
}

function getNodesAtDepth(node: Node, depth: number, cb: (node: Node) => void) {
  if (depth === 0) {
    node && cb(node)
    return
  }

  node.left && getNodesAtDepth(node.left, depth - 1, cb)
  node.right && getNodesAtDepth(node.right, depth - 1, cb)
}

function adaptTree(toPruneRoot: Node, maxDepth: number) {
  const root = structuredClone(toPruneRoot)
  const removedNodes: Node[] = []
  getNodesAtDepth(root, maxDepth, (n) => {
    removedNodes.push(n)
    delete n?.left
    delete n?.right
  })

  const subRoot = computeTree({ nodes: removedNodes })
  const subRootDepth = getDepth(subRoot) - 1

  const appendDepth = maxDepth - 1 - subRootDepth
  if (appendDepth < 1)
    return root

  const nodesAtAppendDepth: Node[] = []
  getNodesAtDepth(root, appendDepth, n => nodesAtAppendDepth.push(n))
  nodesAtAppendDepth.sort((a, b) => a.count - b.count)

  const targetNode = nodesAtAppendDepth[0]
  const targetNodeClone = structuredClone(targetNode)

  targetNode.left = subRoot
  targetNode.right = targetNodeClone
  targetNode.count = targetNode.left.count + targetNode.right.count
  delete targetNode.symbol

  if (getDepth(root) - 1 > maxDepth)
    return adaptTree(root, maxDepth)

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
  const root = computeTree({ str })

  const getMostRight = (node: Node): Node => node.right ? getMostRight(node.right) : node
  const mostRight = getMostRight(root)
  mostRight.left = { ...mostRight }
  mostRight.right = { count: 0, symbol: '' }
  delete mostRight.symbol

  return root
}
