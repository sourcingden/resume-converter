import { GoogleGenAI, Type } from '@google/genai';
import { ResumeData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseResume(text: string): Promise<ResumeData> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Extract the following resume information into the requested JSON format.
    The output should be tailored for a senior developer profile, with a focus on technical skills and achievements.
    Generate a professional HR Summary based on the experience if one is not explicitly provided.
    Group skills into logical categories (e.g., Web frameworks, Databases, Public Cloud).
    
    Resume Text:
    ${text}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobTitle: { type: Type.STRING, description: 'The target job title (e.g., SENIOR PYTHON DEVELOPER)' },
          name: { type: Type.STRING, description: 'Full name' },
          hrSummary: { type: Type.STRING, description: 'A short professional summary' },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: 'Skill category (e.g., Web frameworks)' },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['category', 'items']
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                dates: { type: Type.STRING },
                description: { type: Type.STRING, description: 'A brief description of the role and project' },
                responsibilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key responsibilities and achievements' },
                techStack: { type: Type.STRING, description: 'Comma-separated list of technologies used' }
              },
              required: ['role', 'company', 'dates', 'description', 'responsibilities', 'techStack']
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                dates: { type: Type.STRING }
              },
              required: ['degree', 'institution', 'dates']
            }
          },
          languages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                level: { type: Type.STRING }
              },
              required: ['language', 'level']
            }
          }
        },
        required: ['jobTitle', 'name', 'hrSummary', 'skills', 'experience', 'education', 'languages']
      }
    }
  });

  return JSON.parse(response.text || '{}') as ResumeData;
}
