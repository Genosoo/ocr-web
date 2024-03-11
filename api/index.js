const express = require("express");
const bodyParser = require("body-parser");
const { ocrSpace } = require("ocr-space-api-wrapper");

const app = express();
const PORT = process.env.PORT || 3000;

const genderRegex = /(F|M)/i; // Matches "F" or "M" in a case-insensitive manner
const birthDateRegex = /(\d{4}\/\d{2}\/\d{2})/; // Matches a date in the format "YYYY/MM/DD"

// Middleware to parse JSON bodies with a higher limit (e.g., 10MB)
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/api/ocr", async (req, res) => {
  try {
    // Extract image URL or base64 data from request body
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64 data" });
    }

    // Make sure to securely set your API key
    const apiKey = process.env.API_KEY;

    // Call OCR.space API based on the provided data
    let ocrResult;
    ocrResult = await ocrSpace(base64Image, {
      apiKey,
      language: "eng",
      isCreateSearchablePdf: true,
      isSearchablePdfHideTextLayer: false,
      isOverlayRequired: true,
      isTable: true,
    });

    // Extract first name, last name, and birth date
    const extractedNames = extractNames(ocrResult.ParsedResults[0].ParsedText);
    const firstName = extractedNames.firstName;
    const lastName = extractedNames.lastName;

    const genderMatch = genderRegex.exec(ocrResult.ParsedResults[0].ParsedText);
    const gender = genderMatch ? genderMatch[0] : "Unknown";

    const birthDateMatch = birthDateRegex.exec(
      ocrResult.ParsedResults[0].ParsedText
    );
    const birthDate = birthDateMatch ? birthDateMatch[0] : "Unknown";

    // Return OCR result along with first name, last name, and birth date
    res.json({
      ...ocrResult,
      details: {
        firstName,
        lastName,
        gender,
        birthDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to extract first name and last name from OCR text
function extractNames(text) {
  const regex = /([A-Z]+)\s*,\s*([A-Z]+)/;
  const match = regex.exec(text);
  if (match && match.length === 3) {
    return { firstName: match[2], lastName: match[1] };
  }
  return { firstName: "", lastName: "" };
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
