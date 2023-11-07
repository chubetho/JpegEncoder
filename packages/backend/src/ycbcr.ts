export function transformRgbToYcbcrChannels(rgbImg: Image) {
  const Y: ChannelImage = []
  const Cb: ChannelImage = []
  const Cr: ChannelImage = []

  rgbImg.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const [r, g, b] = col

      const y = 0.299 * r + 0.587 * g + 0.114 * b
      const cb = -0.1687 * r + -0.3312 * g + 0.5 * b + 128
      const cr = 0.5 * r + -0.4186 * g + -0.0813 * b + 128

      Y[rowIndex] ||= []
      Y[rowIndex][colIndex] = Math.round(y)
      Cb[rowIndex] ||= []
      Cb[rowIndex][colIndex] = Math.round(cb)
      Cr[rowIndex] ||= []
      Cr[rowIndex][colIndex] = Math.round(cr)
    })
  })

  return { Y, Cb, Cr }
}

export function subsamplingCbCr(Cb: ChannelImage, Cr: ChannelImage) {
  const subCb: ChannelImage = []
  const subCr: ChannelImage = []

  function getValues(row: number[]) {
    return row.filter((_, i) => i % 2 === 0)
  }

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

export function reassembleYcbcrToRgb(Y: ChannelImage, subCb: ChannelImage, subCr: ChannelImage) {
  const img: Image = []

  const reassembleCb: ChannelImage = []
  const reassembleCr: ChannelImage = []

  function expand(sub: ChannelImage, reassemble: ChannelImage) {
    sub.forEach((r) => {
      const row = r.reduce((acc, cur) => {
        acc.push(cur)
        acc.push(cur)
        return acc
      }, [] as number[])

      reassemble.push(row)
      reassemble.push(row)
    })
  }

  function validateValue(v: number) {
    const round = Math.round(v)
    return round < 0 ? 0 : round
  }

  expand(subCb, reassembleCb)
  expand(subCr, reassembleCr)

  Y.forEach((_, y) => {
    Y[y].forEach((luma, x) => {
      img[y] ||= []
      const cb = reassembleCb[y][x] - 128
      const cr = reassembleCr[y][x] - 128
      const r = 0.99986 * luma + 0 + 1.40209 * cr
      const g = 1.00011 * luma + -0.34415 * cb + -0.714179 * cr
      const b = 0.999823 * luma + 1.77204 * cb + 0

      img[y][x] = [validateValue(r), validateValue(g), validateValue(b)]
    })
  })

  return img
}
