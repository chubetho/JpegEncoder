import { sort } from 'fast-sort'

interface Item { symbol?: string; count: number; isPackage?: boolean }
interface LengthBookItem { symbol: string; length: number }

export function packageMerge(str: string, maxLength = 16) {
  const hg = new Map<string, number>()
  for (const c of str)
    hg.set(c, (hg.get(c) ?? 0) + 1)

  if (hg.size < 2)
    return []

  const original: Item[] = sort(Array.from(hg)
    .map(([k, v]) => ({ symbol: k, count: v })))
    .asc(i => i.count)
  const originalLegth = original.length

  const table: Item[][] = [original]
  for (let i = 0; i < maxLength - 1; i++)
    table.push(computeRow(table[i], original))

  const codeLength = Array.from(({ length: originalLegth })).fill(0) as number[]
  const numToProcess = [originalLegth * 2 - 2]
  let symbolCount = 0
  let mergedCount = 0

  for (let i = table.length - 1; i >= 0; i--) {
    const toProcessCount = numToProcess[table.length - 1 - i]

    const row = [...table[i]]
    row.splice(toProcessCount)
    row.forEach((x) => {
      if (x.isPackage) {
        mergedCount += 1
      }
      else {
        codeLength[symbolCount] += 1
        symbolCount += 1
      }
    })
    numToProcess.push(2 * mergedCount)
    symbolCount = 0
    mergedCount = 0
  }

  return original.reduce((acc, curr, index) => {
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

export function getCodeBook(lengthBook: LengthBookItem[]) {
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
