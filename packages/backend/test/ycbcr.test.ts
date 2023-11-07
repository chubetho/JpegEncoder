import { describe, expect, it } from 'vitest'
import { reassembleYcbcrToRgb, subsamplingCbCr, transformRgbToYcbcrChannels } from '../src/ycbcr.js'
import { mockParsedPpmImg } from './mocks.js'

describe('ycbcr', () => {
  it('from RGB to YCbCr', () => {
    const { Y, Cb, Cr } = transformRgbToYcbcrChannels(mockParsedPpmImg)

    expect(Y[0]).toEqual([17, 16, 22, 14, 34, 48, 46, 74, 78, 86, 57, 45, 36, 28, 45, 45, 43, 64, 91, 61])
    expect(Cb[0]).toEqual([124, 130, 124, 130, 117, 116, 122, 106, 109, 106, 122, 121, 124, 127, 116, 127, 121, 111, 100, 129])
    expect(Cr[0]).toEqual([126, 128, 134, 125, 133, 136, 133, 148, 148, 151, 141, 136, 132, 129, 129, 142, 142, 140, 144, 136])
  })

  it('subsampling to 420', () => {
    const { Cb, Cr } = transformRgbToYcbcrChannels(mockParsedPpmImg)
    const { subCb, subCr } = subsamplingCbCr(Cb, Cr)

    expect(subCb.length).toEqual(Cb.length / 2)
    expect(subCb.length).toEqual(Cb.length / 2)

    expect(subCr[0].length).toEqual(Cb[0].length / 2)
    expect(subCr[0].length).toEqual(Cb[0].length / 2)

    expect(subCb).toEqual([
      [124, 124, 117, 122, 109, 122, 124, 116, 121, 100],
      [122, 114, 132, 130, 138, 113, 130, 124, 116, 123],
      [111, 134, 126, 106, 133, 118, 118, 127, 91, 129],
      [124, 130, 124, 119, 112, 117, 117, 130, 100, 145],
      [118, 134, 127, 127, 99, 134, 128, 123, 134, 119],
      [124, 121, 130, 130, 100, 138, 127, 109, 139, 124],
      [117, 112, 131, 117, 121, 115, 114, 127, 117, 140],
      [114, 138, 134, 112, 106, 135, 132, 133, 117, 130],
    ])

    expect(subCr).toEqual([
      [126, 134, 133, 133, 148, 141, 132, 129, 142, 144],
      [131, 135, 127, 141, 135, 139, 126, 132, 127, 130],
      [138, 127, 128, 142, 130, 134, 129, 131, 142, 130],
      [132, 128, 131, 140, 151, 142, 138, 128, 137, 127],
      [133, 126, 130, 133, 143, 135, 124, 137, 128, 129],
      [127, 135, 128, 128, 136, 129, 126, 133, 124, 128],
      [130, 133, 128, 135, 130, 134, 126, 125, 133, 125],
      [129, 132, 126, 130, 142, 125, 126, 126, 132, 124],
    ])
  })

  it('reassemble to rgb with schema 420', () => {
    const { Y, Cb, Cr } = transformRgbToYcbcrChannels(mockParsedPpmImg)
    const { subCb, subCr } = subsamplingCbCr(Cb, Cr)

    const img = reassembleYcbcrToRgb(Y, subCb, subCr)
    expect(img).toEqual([
      [[14, 20, 10], [13, 19, 9], [30, 19, 15], [22, 11, 7], [41, 34, 15], [55, 48, 28], [53, 44, 35], [81, 73, 63], [106, 70, 44], [114, 78, 52], [75, 50, 46], [63, 38, 34], [42, 35, 29], [34, 27, 21], [46, 48, 24], [46, 48, 24], [63, 35, 31], [84, 56, 52], [113, 89, 41], [83, 59, 11]],
      [[16, 22, 12], [10, 16, 6], [44, 33, 29], [34, 23, 19], [32, 25, 6], [63, 56, 36], [40, 31, 22], [69, 61, 51], [99, 63, 37], [73, 37, 11], [81, 56, 52], [62, 37, 33], [20, 13, 7], [27, 20, 14], [31, 33, 9], [69, 71, 47], [93, 65, 61], [111, 83, 79], [93, 69, 21], [67, 43, 0]],
      [[43, 39, 28], [48, 44, 33], [69, 59, 34], [42, 32, 7], [18, 18, 26], [49, 49, 57], [53, 25, 39], [124, 96, 110], [65, 47, 73], [32, 14, 40], [64, 46, 22], [39, 21, 0], [12, 16, 19], [12, 16, 19], [29, 22, 16], [71, 64, 58], [77, 83, 57], [63, 69, 43], [60, 57, 48], [56, 53, 44]],
      [[64, 60, 49], [53, 49, 38], [61, 51, 26], [44, 34, 9], [31, 31, 39], [16, 16, 24], [60, 32, 46], [123, 95, 109], [56, 38, 64], [29, 11, 37], [37, 19, 0], [42, 24, 0], [25, 29, 32], [29, 33, 36], [34, 27, 21], [56, 49, 43], [76, 82, 56], [72, 78, 52], [70, 67, 58], [66, 63, 54]],
      [[89, 74, 45], [58, 43, 14], [20, 20, 32], [23, 23, 35], [24, 25, 20], [58, 59, 54], [94, 72, 35], [114, 92, 55], [70, 64, 76], [49, 43, 55], [57, 48, 31], [49, 40, 23], [48, 50, 29], [73, 75, 54], [61, 55, 55], [52, 46, 46], [118, 101, 32], [106, 89, 20], [70, 65, 69], [42, 37, 41]],
      [[65, 50, 21], [52, 37, 8], [12, 12, 24], [11, 11, 23], [19, 20, 15], [47, 48, 43], [79, 57, 20], [79, 57, 20], [63, 57, 69], [73, 67, 79], [73, 64, 47], [64, 55, 38], [58, 60, 39], [58, 60, 39], [50, 44, 44], [46, 40, 40], [104, 87, 18], [110, 93, 24], [39, 34, 38], [27, 22, 26]],
      [[35, 28, 22], [34, 27, 21], [19, 18, 23], [18, 17, 22], [28, 23, 17], [23, 18, 12], [54, 32, 21], [87, 65, 54], [117, 74, 57], [132, 89, 72], [80, 54, 40], [70, 44, 30], [69, 52, 35], [49, 32, 16], [29, 28, 33], [38, 37, 42], [87, 77, 24], [79, 69, 16], [28, 24, 59], [37, 33, 68]],
      [[45, 38, 32], [42, 35, 29], [28, 27, 32], [27, 26, 31], [38, 33, 27], [21, 16, 10], [72, 50, 39], [97, 75, 64], [133, 90, 73], [103, 60, 43], [58, 32, 19], [54, 28, 15], [47, 30, 14], [56, 39, 23], [35, 34, 39], [57, 56, 61], [69, 59, 6], [31, 21, 0], [39, 35, 70], [41, 37, 72]],
      [[55, 48, 30], [47, 40, 22], [19, 21, 33], [12, 14, 26], [19, 15, 14], [30, 26, 25], [31, 21, 22], [29, 19, 20], [89, 67, 17], [78, 56, 6], [45, 28, 46], [40, 23, 41], [25, 34, 31], [65, 74, 71], [52, 34, 30], [56, 38, 34], [23, 21, 34], [12, 10, 23], [29, 30, 12], [17, 18, 0]],
      [[46, 39, 21], [46, 39, 21], [14, 16, 28], [19, 21, 33], [29, 25, 24], [39, 35, 34], [36, 26, 27], [37, 27, 28], [83, 61, 11], [75, 53, 3], [46, 29, 47], [36, 19, 37], [18, 27, 24], [34, 43, 40], [34, 16, 12], [39, 21, 17], [14, 12, 25], [19, 17, 30], [19, 20, 2], [13, 14, 0]],
      [[20, 23, 14], [26, 29, 20], [48, 35, 26], [51, 38, 29], [26, 25, 30], [21, 20, 25], [15, 14, 19], [25, 24, 29], [79, 72, 18], [63, 56, 2], [25, 20, 42], [21, 16, 38], [17, 22, 18], [24, 29, 25], [64, 60, 23], [74, 70, 33], [32, 37, 57], [10, 15, 35], [20, 21, 13], [19, 20, 12]],
      [[38, 41, 32], [23, 26, 17], [101, 88, 79], [84, 71, 62], [33, 32, 37], [77, 76, 81], [44, 43, 48], [15, 14, 19], [34, 27, 0], [34, 27, 0], [38, 33, 55], [33, 28, 50], [52, 57, 53], [42, 47, 43], [53, 49, 12], [58, 54, 17], [36, 41, 61], [14, 19, 39], [16, 17, 9], [24, 25, 17]],
      [[46, 45, 23], [42, 41, 20], [64, 59, 29], [87, 82, 52], [67, 66, 72], [62, 61, 67], [68, 57, 38], [40, 29, 11], [37, 35, 22], [39, 37, 24], [60, 52, 29], [65, 57, 34], [68, 77, 46], [44, 53, 22], [38, 44, 40], [28, 34, 30], [56, 49, 29], [39, 32, 13], [3, 5, 28], [19, 21, 44]],
      [[30, 29, 8], [89, 88, 66], [64, 59, 29], [83, 78, 48], [48, 47, 53], [31, 30, 36], [52, 41, 23], [39, 28, 10], [44, 42, 29], [42, 40, 27], [44, 36, 13], [64, 56, 33], [38, 47, 16], [29, 38, 7], [38, 44, 40], [36, 42, 38], [69, 62, 42], [40, 33, 14], [16, 18, 41], [25, 27, 50]],
      [[53, 56, 27], [101, 104, 75], [78, 66, 90], [53, 41, 65], [24, 26, 38], [27, 29, 41], [56, 57, 25], [82, 83, 51], [119, 97, 60], [76, 54, 17], [32, 36, 48], [44, 48, 60], [29, 32, 39], [32, 35, 42], [17, 20, 29], [15, 18, 27], [44, 39, 19], [57, 52, 31], [35, 43, 45], [23, 31, 33]],
      [[59, 62, 33], [82, 85, 56], [68, 56, 80], [41, 29, 53], [31, 33, 45], [30, 32, 44], [71, 72, 40], [115, 116, 84], [140, 118, 81], [61, 39, 2], [46, 50, 62], [63, 67, 79], [33, 36, 43], [17, 20, 27], [25, 28, 37], [46, 49, 58], [49, 44, 23], [42, 37, 17], [23, 31, 33], [13, 21, 23]],
    ])
  })
})