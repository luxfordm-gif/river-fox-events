// Face finder for the punch-in crop. Usage: face img1.png img2.png ...  -> one line per image: "<path> <cx> <cy> <w> <h>" (0 to 1, origin top-left, largest face) or "<path> none"
import Foundation
import Vision
import ImageIO
for p in CommandLine.arguments.dropFirst() {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: p) as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("\(p) none"); continue }
    let req = VNDetectFaceRectanglesRequest()
    let h = VNImageRequestHandler(cgImage: img, options: [:])
    try? h.perform([req])
    let faces = (req.results ?? []).sorted { $0.boundingBox.width * $0.boundingBox.height > $1.boundingBox.width * $1.boundingBox.height }
    if let f = faces.first { let b = f.boundingBox; print(String(format: "%@ %.4f %.4f %.4f %.4f", p, b.midX, 1 - b.midY, b.width, b.height)) } else { print("\(p) none") }
}
