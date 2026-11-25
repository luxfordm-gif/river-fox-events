// Every face in one image, with Apple Vision. Usage: faces img.jpg
// -> one line per face: "x y w h browTop" (0 to 1 of the image, origin top-left). browTop is the top of the higher
// eyebrow, or -1 if Vision found no eyebrows. Used by blocks.cjs: a colour block may sit over hair and the upper
// forehead (the pack: "over a face, above the eyes") but never from the eyebrows down.
// Compiled on first use (swiftc -O faces.swift -o faces).
import Foundation
import Vision
import ImageIO
guard let p = CommandLine.arguments.dropFirst().first,
      let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: p) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { exit(0) }
let req = VNDetectFaceLandmarksRequest()
try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
for f in req.results ?? [] {
    let b = f.boundingBox
    var brow: Double = -1
    for region in [f.landmarks?.leftEyebrow, f.landmarks?.rightEyebrow] {
        guard let r = region else { continue }
        for pt in r.normalizedPoints {
            let y = 1 - (b.minY + Double(pt.y) * b.height)   // to image fraction, top-left origin
            if brow < 0 || y < brow { brow = y }
        }
    }
    print(String(format: "%.4f %.4f %.4f %.4f %.4f", b.minX, 1 - b.maxY, b.width, b.height, brow))
}
