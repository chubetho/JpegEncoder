interface Block {
  R: number[][]
  G: number[][]
  B: number[][]
  Y: number[][]
  Cb: number[][]
  Cr: number[][]
}

interface Image {
  blocks: Block[]
  metadata: {
    imageWidth: number
    imageHeight: number
    maxColor: number
    format: string
    blockWidth: number
    blockHeight: number
  }
}
