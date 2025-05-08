import { ImageAnnotatorClient } from "@google-cloud/vision";
import path from "path";
import { Buffer } from "buffer";
import dotenv from "dotenv";
import { CustomError } from "../middleware/errorHandler";

dotenv.config();
// Create the Vision client with your credentials file

// if (!process.env.GOOGLE_PRIVATE_KEY) {
//     throw new CustomError("ENV not loaded",500)
// }   

console.log();

const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};
// Create the Vision client with the embedded credentials
const client = new ImageAnnotatorClient({
  credentials: credentials, // Use the embedded credentials 
});
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
