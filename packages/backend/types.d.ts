interface Block {
  R: number[]
  G: number[]
  B: number[]
  Y: number[]
  Cb: number[]
  Cr: number[]
}

interface Image {
  blocks: Block[]
  metadata: {
    width: string
    height: string
    maxColor: number
    format: string
  }
}
