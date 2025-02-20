import { asyncHandler, response } from "../../utils/utils";
import { z as zod } from "zod";
import axios from "axios";
import extractTextFromPDF from "./pdftotext";
import convertApplicant from "../../utils/output";
import { PrismaClient } from '@prisma/client';
import e from "express";
const addResumeSchema = zod.object({
    url: zod.string(),
})

const prisma = new PrismaClient();
const addResume = asyncHandler(async (req, res) => {
    const body = req.body;
    const parsedBody = addResumeSchema.safeParse(body);
    if (!parsedBody.success) {
        return res.status(400).json({ message: parsedBody.error });
    }
    const { url } = parsedBody.data;
    try {
        const resumeInfo = await extractTextFromPDF(url);
        if (resumeInfo.statusCode !== 200) {
            return res.status(resumeInfo.statusCode).json(new response(resumeInfo.statusCode, resumeInfo.message, resumeInfo.data));
        }
        const prompt = `Extract and structure the following details from the provided resume text:
      - Full Name
      - Email Address
      - Education details (Degree, Branch, Institution, Graduation Year)
      - Work Experience (Job Title, Company Name, Start Date, End Date)
      - Technical & Soft Skills (as a list)
      - A short professional summary based on the candidate’s profile

      Ensure the output follows this exact JSON format:
      {
        "name": "<Extracted Name>",
        "email": "<Extracted Email>",
        "education": {
          "degree": "<Degree>",
          "branch": "<Branch>",
          "institution": "<Institution>",
          "year": "<Graduation Year>"
        },
        "experience": {
          "job_title": "<Job Title>",
          "company": "<Company Name>",
          "start_date": "<Start Date>",
          "end_date": "<End Date>"
        },
        "skills": [
          "<Skill 1>",
          "<Skill 2>",
          "<Skill 3>"
        ],
        "summary": "<Concise candidate profile summary>"
      }
      If any field is missing or cannot be inferred, set it as null. Do NOT add any extra fields beyond the specified JSON format.
      
      Resume Text: ${resumeInfo.data}`;

        const requestBody = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        };
        if (!process.env.GEMINI_URL) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        const gemini_response = await axios.post(process.env.GEMINI_URL, requestBody, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        const convertedApplicant = convertApplicant(gemini_response.data.candidates[0].content.parts[0].text);
        const newApplicant = await prisma.applicant.create({
            data:{
                name:convertedApplicant.name,
                email:convertedApplicant.email,
                education:convertedApplicant.education,
                experience: Array.isArray(convertedApplicant.experience) ? 
                    convertedApplicant.experience : [convertedApplicant.experience],
                skills:convertedApplicant.skills
                ,
                summary:convertedApplicant.summary

                
            }
        })
        if(!newApplicant){
            return res.status(500).json({message:"Internal Server Error"});
        }


        return res.status(200).json(new response(200, "Successfully extracted and saved resume details.", convertedApplicant));

    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });

    }






})


export default addResume;
