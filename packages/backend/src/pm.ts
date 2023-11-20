interface Item { symbol?: string; count: number; isPackage?: boolean }

export function packageMerge(str: string, maxLength = 16) {
  const map = new Map([
    ['0', 270],
    ['1', 20],
    ['2', 10],
    ['4', 1],
    ['5', 6],
    ['6', 1],
  ])

  const original: Item[] = Array.from(map)
    .map(([k, v]) => ({ symbol: k, count: v }))
    .sort((a: Item, b: Item) => a.count - b.count)
  const table: Item[][] = [original]

  for (let i = 0; i < maxLength - 1; i++)
    table.push(computeRow(table[i], original))

  console.log(table)
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

  return row.sort((a: Item, b: Item) => a.count - b.count)
}

export function canonical(book: Map<string, string>) {
  const codeBook = Array.from(book)
  codeBook.sort((a, b) => {
    const aLength = a[1].length
    const bLength = b[1].length
    return aLength === bLength ? a[0].localeCompare(b[0]) : aLength - bLength
  })
  const lengthBook = codeBook.map(([k, v]) => [k, v.length])

  let current = 0
  const map: Record<string, string> = {
    [lengthBook[0][0]]: Array.from({ length: +lengthBook[0][1] }).fill('0').join(''),
  }

  for (let i = 1; i < lengthBook.length; i++) {
    current++
    if (current.toString(2).length < +lengthBook[i][1])
      current <<= 1

    map[lengthBook[i][0]] = current.toString(2)
  }

  return map
}
