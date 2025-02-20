import axios from "axios";
import pdfParse from "pdf-parse";
import fs from "fs-extra";
import {response} from '../../utils/utils'


 async function extractTextFromPDF(pdfUrl: string): Promise<response> {
  try {
    
    const tempFilePath = "temp_resume.pdf";

  
    const pdf = await axios({
      url: pdfUrl,
      method: "GET",
      responseType: "arraybuffer",
    });

    if(!pdf) {
        return new response(400, "Failed to process the PDF file. Ensure it's a valid PDF.",null);
    }
   
    await fs.writeFile(tempFilePath, pdf.data);

    
    const dataBuffer = await fs.readFile(tempFilePath);
    const pdfData = await pdfParse(dataBuffer);

    
    await fs.remove(tempFilePath);

    return new response(200, "Successfully extracted text from PDF.", pdfData.text.trim());
  } catch (error) {
    console.error("Error extracting text from PDF:", (error as Error).message);
    throw new Error("Failed to process the PDF file. Ensure it's a valid PDF.");
  }
}
export default extractTextFromPDF;