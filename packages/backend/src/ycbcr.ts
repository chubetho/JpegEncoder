export function subsamplingCbCr(Cb: Channel, Cr: Channel) {
  const subCb: Channel = []
  const subCr: Channel = []
  const getValues = (row: number[]) => row.filter((_, i) => i % 2 === 0)

  Cb.forEach((row, rowIndex) => {
    if (rowIndex % 2 !== 0)
      return

    const cbValues = getValues(row)
    subCb.push(cbValues)

    const crValues = getValues(Cr[rowIndex])
    subCr.push(crValues)
  })

  return { subCb, subCr }
}
