import { sort } from 'fast-sort'

interface Item { symbol?: string; count: number; isPackage?: boolean }
interface LengthBookItem { symbol: string; length: number }
export interface Node {
  symbol?: string
  left?: Node
  right?: Node
}

export function computeLengthBook(str: string, maxLength = 16) {
  if (maxLength < 0)
    return []

  const hg = new Map<string, number>()
  for (const c of str)
    hg.set(c, (hg.get(c) ?? 0) + 1)

  if (hg.size < 2)
    return []

  const originalRow: Item[] = sort(
    Array.from(hg).map(([k, v]) => ({ symbol: k, count: v })),
  ).asc(i => i.count)
  const originalLegth = originalRow.length

  const table: Item[][] = [originalRow]
  for (let i = 0; i < maxLength - 1; i++)
    table.push(computeRow(table[i], originalRow))

  const codeLength = Array.from(({ length: originalLegth })).fill(0) as number[]
  const numProcess = [originalLegth * 2 - 2]
  let symbolCount = 0
  let mergedCount = 0

  for (let i = table.length - 1; i >= 0; i--) {
    const row = [...table[i]]
    row.splice(numProcess[table.length - 1 - i])
    row.forEach((x) => {
      if (x.isPackage) {
        mergedCount += 1
      }
      else {
        codeLength[symbolCount] += 1
        symbolCount += 1
      }
    })
    numProcess.push(2 * mergedCount)
    symbolCount = 0
    mergedCount = 0
  }

  return originalRow.reduce((acc, curr, index) => {
    curr.symbol && acc.push({ symbol: curr.symbol, length: codeLength[index] })
    return acc
  }, [] as { symbol: string; length: number }[])
}

function computeRow(arr: Item[], original: Item[]) {
  const row = [...original]
  arr.forEach((item, index) => {
    if ((index & 1) !== 0)
      return

    const left = arr.at(index)
    if (!left)
      return

    const right = arr.at(index + 1)
    if (!right)
      return

    row.push({
      count: left.count + right.count,
      isPackage: true,
    })
  })
  return sort(row).asc(i => i.count)
}

export function computeCodeBook(lengthBook: LengthBookItem[]) {
  let current = 0
  const codeBook: Record<string, string> = {}
  for (let i = lengthBook.length - 1; i >= 0; i--) {
    if (i === lengthBook.length - 1) {
      codeBook[lengthBook[i].symbol] = Array.from({ length: lengthBook[i].length }).fill('0').join()
      continue
    }

    current += 1
    while (current.toString(2).length < lengthBook[i].length)
      current <<= 1

    codeBook[lengthBook[i].symbol] = current.toString(2)
  }

  return codeBook
}

export function buildTree(str: string, maxLength = 16) {
  const lengthBook = computeLengthBook(str, maxLength)
  const codeBook = computeCodeBook(lengthBook)
  const root: Node = {}

  for (const [key, val] of Object.entries(codeBook)) {
    let currentNode = root
    for (const char of val) {
      if (char === '1') {
        currentNode.right ??= {}
        currentNode = currentNode.right
      }
      else {
        currentNode.left ??= {}
        currentNode = currentNode.left
      }
    }
    currentNode.symbol = key
  }

  return root
}
