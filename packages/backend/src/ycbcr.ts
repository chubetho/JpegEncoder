export function transformRgbToYcbcrChannels(R: Channel, G: Channel, B: Channel) {
  const Y: Channel = []
  const Cb: Channel = []
  const Cr: Channel = []

  R.forEach((row, rowIndex) => {
    Y[rowIndex] ||= []
    Cb[rowIndex] ||= []
    Cr[rowIndex] ||= []

    row.forEach((_, colIndex) => {
      const r = R[rowIndex][colIndex]
      const g = G[rowIndex][colIndex]
      const b = B[rowIndex][colIndex]

      const y = 0.299 * r + 0.587 * g + 0.114 * b
      const cb = -0.1687 * r + -0.3312 * g + 0.5 * b + 128
      const cr = 0.5 * r + -0.4186 * g + -0.0813 * b + 128

      Y[rowIndex][colIndex] = ~~y
      Cr[rowIndex][colIndex] = ~~cr
      Cb[rowIndex][colIndex] = ~~cb
    })
  })

  return { Y, Cb, Cr }
}

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
