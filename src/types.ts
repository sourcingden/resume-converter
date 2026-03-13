export interface ResumeData {
  jobTitle: string;
  name: string;
  hrSummary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    role: string;
    company: string;
    dates: string;
    description: string;
    responsibilities: string[];
    techStack: string;
  }[];
  education: {
    degree: string;
    institution: string;
    dates: string;
  }[];
  languages: {
    language: string;
    level: string;
  }[];
}
