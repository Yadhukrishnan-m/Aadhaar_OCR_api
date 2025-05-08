import { NextFunction, Request, Response } from "express";
import { CustomError } from "./middleware/errorHandler";
import { google_Vision_OCR } from "./services/services";

interface FileFields {
  frontImage?: Express.Multer.File[];
  backImage?: Express.Multer.File[];
}

export const ExtractData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //   console.log("the files are", req.files);
    const files = req.files as FileFields; // Type assertion
    const frontImage = files.frontImage ? files.frontImage[0] : null;
    const backImage = files.backImage ? files.backImage[0] : null;

    if (!frontImage || !backImage) {
      throw new CustomError("IMAGE NOT FOUND", 404); 
    }
    const frontText = await google_Vision_OCR(frontImage.buffer);
    const backText = await google_Vision_OCR(backImage.buffer);

    if (frontText==backText) {
        throw new CustomError("upload both front and back of aadhaar", 401);
    }
    const combinedText = `${frontText}\n${backText}`;

    const nameMatch =
      combinedText.match(
        /(?<=Name[:\s]*)[A-Z][a-zA-Z\s.]+(?=\s+(?:DOB|Male|Female|\d{2}\/\d{2}))/i
      ) ||
      combinedText.match(
        /(?<=Government of India\s+)[A-Z][a-zA-Z\s.]+(?=\s+(?:DOB|Male|Female|\d{2}\/\d{2}))/i
      ) ||
      combinedText.match(/(?<=Name[:\s]*)[A-Z][a-zA-Z\s.]+/i);

    // Improved DOB pattern - handles more date formats
    const dobMatch = combinedText.match(
      /(?:DOB|D\.O\.B|Birth Date|Date of Birth)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i
    );

    // Gender pattern - unchanged, works well
    const genderMatch = combinedText.match(/\b(Male|Female|Others?)\b/i);

    // Improved Aadhaar number pattern - handles both spaced and unspaced formats
    const aadhaarMatch =
      combinedText.match(/\d{4}\s\d{4}\s\d{4}/) 
  

    // Improved phone pattern - handles both +91 and without, and various formats
    const phoneMatch =
      combinedText.match(
        /(?:Phone|Mobile|मोबाइल)[:\s]*(?:\+91\s?)?(\d{10})/i
      ) || combinedText.match(/(?:\+91[\s-]?)?\d{10}/);

    // Improved father's name pattern - handles more variations
    const fatherMatch =
      combinedText.match(
        /(?:S\/O|Son of|Father(?:'s)?\s*Name)[:\s]*([A-Z][a-zA-Z\s.]+?)(?=\s+(?:Address|DOB|Mobile|Phone|\d{6}))/i
      ) || combinedText.match(/(?:S\/O|Son of|Father[:\s]*)[^\n\r,]+/i);

    // Improved issue date pattern - handles more date formats
    const issueDateMatch = combinedText.match(
      /(?:Issue Date|Issued On|Issued Date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i
    );

    // Improved PIN code pattern - looks for actual PIN codes rather than any 6-digit number
    const pinMatch =
      combinedText.match(/PIN(?:\s*Code)?[:\s]*(\d{6})/i) ||
      combinedText.match(/\b(\d{6})\b(?=\s*(?:India|भारत))/i) ||
      combinedText.match(/\b\d{6}\b/);

  const extractAddress = (text: string): string => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const addressLines: string[] = [];
    let collecting = false;

    for (const line of lines) {
      if (/^(Address|To)\b/i.test(line)) {
        collecting = true;
        addressLines.push(line);
        continue;
      }

      if (collecting) {
        addressLines.push(line);
        if (/\b\d{6}\b/.test(line)) break; // Ends at PIN code
      }
    }

    // Remove leading keywords like "To", "Address", etc., if needed
    return addressLines
      .join(" ")
      .replace(/^(To|Address)[:,]?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const address = extractAddress(combinedText);


    res.status(200).json({
      name: nameMatch?.[0] || "",
      dob: dobMatch?.[1] || "",
      gender: genderMatch?.[0] || "",
      aadhaarNumber: aadhaarMatch?.[0] || "",
      address: address,
      pincode: pinMatch?.[0] || "",
      phoneNumber: phoneMatch?.[0] || "",
      fatherName: fatherMatch?.[0] || "",
      issuedDate: issueDateMatch?.[1] || "",
    });
  } catch (error) {
    next(error);
  }
};
