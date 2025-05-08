import { ImageAnnotatorClient } from "@google-cloud/vision";
import path from "path";
import { Buffer } from "buffer";
import dotenv from "dotenv";

dotenv.config();
// Create the Vision client with your credentials file
const client = new ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "vision-key.json"),
});
// Log the environment variables (but not sensitive ones like private_key)


// Function to perform OCR on an image buffer
export async function google_Vision_OCR(imageBuffer: Buffer): Promise<string | undefined | null> {
  try {
    // Pass the buffer to the Vision API for text detection
    const [result] = await client.textDetection({
      image: { content: imageBuffer },
    });

    // Check if textAnnotations is defined and has content
    const text =
      result.textAnnotations && result.textAnnotations.length > 0
        ? result.textAnnotations[0].description
        : "No text found";

    return text;
  } catch (error) {
    console.error("Error during OCR:", error);
    throw new Error("OCR processing failed");
  }
}
