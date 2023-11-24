import type { Buffer } from 'node:buffer'
import { sort } from 'fast-sort'
import { useStream } from './stream.js'
import { computeLengthBook } from './huffman.js'

interface Data {
  width: number
  height: number
  content: Buffer
}

export function useEncoder(data: Data) {
  const { getBuffer, writeByte, writeWord, save } = useStream()

  const writeSOI = () => writeWord(0xFFD8)
  const writeAPP0 = () => {
    writeWord(0xFFE0)
    writeWord(16)

    writeByte(0x4A) // J
    writeByte(0x46) // F
    writeByte(0x49) // I
    writeByte(0x46) // F
    writeByte(0) // \0

    writeWord(0x0101) // Version 1.01

    writeByte(0) // Density units

    writeWord(0x0048) // Xdensity
    writeWord(0x0048) // Ydensity

    writeByte(0) // Xthumbnail
    writeByte(0) // Ythumbnail
  }

  const writeDQT = () => {
    writeWord(0xFFDB)
  }

  const writeSOF0 = () => {
    writeWord(0xFFC0)
    writeWord(17)

    writeByte(8) // Precision

    writeWord(data.height)
    writeWord(data.width)

    writeByte(3) // Number of components

    writeByte(1) // Y ID
    writeByte(0x11) // Y Subsampling
    writeByte(0) // Y QT

    writeByte(2) // Cb ID
    writeByte(0x11)// Cb Subsampling
    writeByte(0) // Cb QT

    writeByte(3) // Cr ID
    writeByte(0x11)// Cr Subsampling
    writeByte(0) // Cr QT
  }

  const writeDHT = () => {
    const lengthBook = computeLengthBook(data.content)
    const lengthArr = Array.from({ length: 256 }).fill(0) as number[]
    lengthBook.forEach(x => lengthArr[x.symbol] = x.length)
    const sortedLengthArr = sort(lengthArr).asc()
    const lengthGroups = sortedLengthArr.reduce((acc, curr) => {
      acc[curr] += 1
      return acc
    }, Array.from({ length: 16 }).fill(0) as number[])

    writeWord(0xFFC4)
    writeWord((1 + 16 + 256) * 4 + 2) // 2

    writeByte(0x00) // 1
    lengthGroups.forEach(x => writeByte(x)) // 16
    sortedLengthArr.forEach(x => writeByte(x)) // 256

    writeByte(0x10) // 1
    lengthGroups.forEach(x => writeByte(x)) // 16
    sortedLengthArr.forEach(x => writeByte(x)) // 256

    writeByte(0x01) // 1
    lengthGroups.forEach(x => writeByte(x)) // 16
    sortedLengthArr.forEach(x => writeByte(x)) // 256

    writeByte(0x11) // 1
    lengthGroups.forEach(x => writeByte(x)) // 16
    sortedLengthArr.forEach(x => writeByte(x)) // 256
  }

  const writeSOS = () => {
    writeWord(0xFFDA)
  }

  const writeEOI = () => writeWord(0xFFD9)

  writeSOI()
  writeAPP0()
  // writeDQT()
  writeSOF0()
  writeDHT()
  // writeSOS()
  writeEOI()

  return {
    save,
  }
}
