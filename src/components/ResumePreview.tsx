import React, { forwardRef } from 'react';
import { ResumeData } from '../types';

interface Props {
  data: ResumeData;
}

export const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-[#ffffff] w-[210mm] min-h-[297mm] mx-auto relative text-[#000000] font-sans pb-40"
    >
      {/* Header */}
      <div className="w-full print:break-inside-avoid">
        <img src="/header.png" alt="Newxel Header" className="w-full block" />
      </div>

      {/* Content */}
      <div className="px-16 py-12">
        <h1 className="text-xl font-bold uppercase tracking-wide text-[#111827] mb-2">
          {data.jobTitle}
        </h1>
        <h2 className="text-4xl font-bold uppercase tracking-wider mb-10">
          {data.name}
        </h2>

        {data.hrSummary && (
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase mb-4">HR Summary</h3>
            <p className="text-sm leading-relaxed">{data.hrSummary}</p>
          </div>
        )}

        {data.skills && data.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase mb-4">Skills</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {data.skills.map((skill, index) => (
                <li key={index}>
                  <span className="font-bold">{skill.category}:</span> {skill.items.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold uppercase mb-4">Job Experience</h3>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="print:break-inside-avoid">
                  <h4 className="font-bold text-base">{exp.role}</h4>
                  <h5 className="font-bold text-base uppercase">{exp.company}</h5>
                  <p className="text-sm text-[#1f2937] mb-4">{exp.dates}</p>
                  <p className="text-sm mb-4 leading-relaxed">{exp.description}</p>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <>
                      <p className="text-sm font-bold mb-2">Key responsibilities & achievements:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {exp.techStack && (
                    <p className="text-sm">
                      <span className="font-bold">Tech stack:</span> {exp.techStack}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div className="mb-8 print:break-inside-avoid">
            <h3 className="text-lg font-bold uppercase mb-4">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-bold text-base">{edu.degree}</h4>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-sm text-[#1f2937]">{edu.dates}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div className="mb-8 print:break-inside-avoid">
            <h3 className="text-lg font-bold uppercase mb-4">Languages</h3>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <p key={index} className="text-sm">
                  <span className="font-bold">{lang.language}:</span> {lang.level}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full print:break-inside-avoid">
        <img src="/footer.png" alt="Newxel Footer" className="w-full block" />
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
