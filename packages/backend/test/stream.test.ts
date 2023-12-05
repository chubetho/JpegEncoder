import * as fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { useStream } from '../src/stream.js'

describe('useStream', () => {
  it('write bit', () => {
    const { getBuffer, writeBit } = useStream()

    expect(() => writeBit(8)).toThrowErrorMatchingInlineSnapshot(`[Error: Invalid value for bit]`)

    Array.from({ length: 8 }).forEach(() => writeBit(1))
    expect(getBuffer()[0]).toEqual(255)

    expect(getBuffer().length).toEqual(1024)
    Array.from({ length: 10_000 }).forEach(() => writeBit(1))
    expect(getBuffer().length).toEqual(2048)

    expect(getBuffer().slice(1, 1024).every(v => v === 255)).toBeTruthy()
  })

  it('write byte', () => {
    const { getBuffer, writeByte } = useStream()
    const values = [300, -1, 0.5]

    values.forEach((n) => {
      expect(() => writeByte(n)).toThrowErrorMatchingInlineSnapshot(`[Error: Value must be a 8 bit integer]`)
    })

    writeByte(0x4A)
    writeByte(0x46)
    writeByte(0x49)
    writeByte(0x46)

    expect(getBuffer().slice(0, 8)).toMatchInlineSnapshot(`
      Uint8Array [
        74,
        70,
        73,
        70,
        0,
        0,
        0,
        0,
      ]
    `)

    expect(getBuffer().length).toEqual(1024)

    Array.from({ length: 1024 }).forEach(() => writeByte(0x46))
    expect(getBuffer().length).toEqual(2048)

    expect(getBuffer().slice(4, 1024).every(v => v === 70)).toBeTruthy()
  })

  it('write word', () => {
    const { getBuffer, writeWord } = useStream()
    const values = [70000, -1, 0.5]

    values.forEach((n) => {
      expect(() => writeWord(n)).toThrowErrorMatchingInlineSnapshot(`[Error: Value must be a 16 bit integer]`)
    })

    writeWord(0x4A46)
    writeWord(0x4946)

    expect(getBuffer().slice(0, 8)).toMatchInlineSnapshot(`
    Uint8Array [
      74,
      70,
      73,
      70,
      0,
      0,
      0,
      0,
    ]
  `)

    expect(getBuffer().length).toEqual(1024)

    Array.from({ length: 512 }).forEach(() => writeWord(0x4646))
    expect(getBuffer().length).toEqual(2048)

    expect(getBuffer().slice(4, 1024).every(v => v === 70)).toBeTruthy()
  })

  it('read bit', () => {
    const { readBit, writeBit } = useStream()

    expect(() => readBit()).toThrowErrorMatchingInlineSnapshot(`[Error: Buffer is empty]`)

    Array.from({ length: 8 }).forEach((_, i) => writeBit((i + 1) % 2))

    expect(Array.from({ length: 8 }).map(() => readBit()).join(''))
      .toEqual('10101010')
  })

  it('save', () => {
    const path = 'test/buffer.dat'
    const { save, writeByte } = useStream()

    writeByte(70)
    writeByte(79)
    writeByte(79)
    save(path)

    const content = fs.readFileSync(path, { encoding: 'ascii' })
    expect(content).toEqual('FOO')

    fs.unlinkSync(path)
  })

  it.skip('performance', () => {
    const lim = 10_000_000
    const { readBit, writeBit } = useStream()

    console.time('writeBit')
    for (let i = 0; i < lim; i++)
      writeBit(1)
    console.timeEnd('writeBit')

    console.time('readBit')
    for (let i = 0; i < lim; i++)
      readBit()
    console.timeEnd('readBit')
  })
})
