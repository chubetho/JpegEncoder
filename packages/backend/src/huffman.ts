import type { Buffer } from 'node:buffer'
import { sort } from 'fast-sort'

interface Item { symbol?: number, count: number, isPackage?: boolean }
interface LengthBookItem { symbol: number, length: number }
export interface Node {
  symbol?: number
  left?: Node
  right?: Node
}

export function computeLengthBook(buffer: Buffer, maxLength = 15) {
  const hg = new Map<number, number>()

  buffer.forEach(x => hg.set(x, (hg.get(x) ?? 0) + 1))

  if (hg.size < 2 || Math.ceil(Math.log2(hg.size)) > maxLength)
    return []

  const originalRow: Item[] = sort(
    Array.from(hg).map(([k, v]) => ({ symbol: k, count: v })),
  ).asc(i => i.count)
  const originalLength = originalRow.length

  const table: Item[][] = [originalRow]
  for (let i = 0; i < maxLength - 1; i++)
    table.push(computeRow(table[i], originalRow))

  const codeLength = Array.from(({ length: originalLength })).fill(0) as number[]
  const numProcess = [originalLength * 2 - 2]
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

  const merged = originalRow.reduce((acc, curr, index) => {
    curr.symbol && acc.push({ symbol: curr.symbol, length: codeLength[index] })
    return acc
  }, [] as { symbol: number, length: number }[])

  const check = merged.map(x => x.length).reduce((acc, curr) => acc + 2 ** -curr, 0) === 1

  return check ? merged : []
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

export function computeCodeBook(lengthBook: LengthBookItem[], maxLength = 15, anti = true) {
  if (!lengthBook.length)
    return {}

  let code = 0
  const codeBook: Record<number, string> = {}

  const shortestIndex = lengthBook.length - 1
  const shortestIndexLength = lengthBook[shortestIndex].length
  codeBook[lengthBook[shortestIndex].symbol] = ''.padStart(shortestIndexLength, '0')

  for (let i = lengthBook.length - 2; i >= 0; i--) {
    code += 1
    if (lengthBook[i].length === shortestIndexLength) {
      codeBook[lengthBook[i].symbol] = code.toString(2).padStart(shortestIndexLength, '0')
      continue
    }

    while (code.toString(2).length < lengthBook[i].length)
      code <<= 1

    codeBook[lengthBook[i].symbol] = code.toString(2)
  }

  if (anti) {
    const target = Object.entries(codeBook)
      .find(([_, value]) => value.split('').every(char => char === '1'))

    if (target && target[0].length + 1 <= maxLength)
      codeBook[+target[0]] = `${target[1]}0`
  }

  return codeBook
}

export function computeCharTable() {
  const table: string[] = Array.from({ length: 256 })
  const fn = String.fromCharCode
  for (let i = 0; i < 256; i++)
    table[i] = fn(i)

  return table
}
