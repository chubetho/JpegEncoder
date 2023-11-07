import * as fs from 'node:fs'

export function useStream() {
  let buffer = new Uint8Array(1024)
  let byte = 0
  let bitCount = 0
  let bytePos = 0

  function writeBit(bit: number) {
    if (bit !== 0 && bit !== 1)
      throw new Error('Invalid value for bit')

    byte = (byte << 1) | bit
    bitCount++

    if (bitCount === 8) {
      buffer[bytePos++] = byte
      reset()

      checkBuffer()
    }
  }

  function readBit() {
    if (bytePos === 0 && bitCount === 0 && byte === 0)
      throw new Error('Buffer is empty')

    if (bitCount === 0) {
      bytePos--
      byte = buffer[bytePos]
      bitCount = 8
    }

    bitCount--
    return (byte >> bitCount) & 1
  }

  function save(path: string) {
    if (bitCount && byte) {
      buffer[bytePos] = byte
      bytePos++
      reset()
    }

    fs.writeFileSync(path, buffer.subarray(0, bytePos))
  }

  function writeByte(v: number) {
    if (!Number.isInteger(v) || v < 0 || v > 255)
      throw new Error('Value must be a 8 bit integer')

    buffer[bytePos++] = v
    checkBuffer()
  }

  function writeWord(v: number) {
    if (!Number.isInteger(v) || v < 0 || v > 65535)
      throw new Error('Value must be a 16 bit integer')

    writeByte((v >> 8) & 0xFF)
    writeByte(v & 0xFF)
  }

  function checkBuffer() {
    if (bytePos < buffer.length)
      return

    const newBuffer = new Uint8Array(buffer.length * 2)
    newBuffer.set(buffer)
    buffer = newBuffer
  }

  function reset() {
    byte = 0
    bitCount = 0
  }

  function getBuffer() {
    return buffer
  }

  return { writeBit, writeByte, writeWord, readBit, save, getBuffer }
}
