// Person matte per frame. Usage: seg inDir outDir  (reads *.png, writes same name 8-bit grayscale PNG, white = person)
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers
let inDir = CommandLine.arguments[1], outDir = CommandLine.arguments[2]
let files = try! FileManager.default.contentsOfDirectory(atPath: inDir).filter { $0.hasSuffix(".png") }.sorted()
let ctx = CIContext()
let gray = CGColorSpaceCreateDeviceGray()
let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
for f in files {
    let url = URL(fileURLWithPath: inDir + "/" + f)
    let handler = VNImageRequestHandler(url: url, options: [:])
    try! handler.perform([req])
    guard let obs = req.results?.first else { print("no result \(f)"); continue }
    var m = CIImage(cvPixelBuffer: obs.pixelBuffer)
    let src = CIImage(contentsOf: url)!
    m = m.transformed(by: CGAffineTransform(scaleX: src.extent.width / m.extent.width, y: src.extent.height / m.extent.height))
    let cg = ctx.createCGImage(m, from: src.extent, format: .L8, colorSpace: gray)!
    let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: outDir + "/" + f) as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, cg, nil); CGImageDestinationFinalize(dest)
}
print("done \(files.count)")
