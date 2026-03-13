import React from 'react';
import { ResumeData } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function ResumeEditor({ data, onChange }: Props) {
  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateArrayItem = (arrayField: keyof ResumeData, index: number, itemField: string, value: any) => {
    const newArray = [...(data[arrayField] as any[])];
    newArray[index] = { ...newArray[index], [itemField]: value };
    updateField(arrayField, newArray);
  };

  const addArrayItem = (arrayField: keyof ResumeData, defaultItem: any) => {
    const newArray = [...(data[arrayField] as any[]), defaultItem];
    updateField(arrayField, newArray);
  };

  const removeArrayItem = (arrayField: keyof ResumeData, index: number) => {
    const newArray = [...(data[arrayField] as any[])];
    newArray.splice(index, 1);
    updateField(arrayField, newArray);
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-4">
        <h4 className="font-bold text-gray-900 border-b pb-2">Basic Info</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HR Summary</label>
          <textarea
            value={data.hrSummary}
            onChange={(e) => updateField('hrSummary', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-bold text-gray-900">Skills</h4>
          <button onClick={() => addArrayItem('skills', { category: 'New Category', items: [] })} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Category
          </button>
        </div>
        {data.skills.map((skill, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
            <button onClick={() => removeArrayItem('skills', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateArrayItem('skills', index, 'category', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Items (comma separated)</label>
                <input
                  type="text"
                  value={skill.items.join(', ')}
                  onChange={(e) => updateArrayItem('skills', index, 'items', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-bold text-gray-900">Experience</h4>
          <button onClick={() => addArrayItem('experience', { role: 'New Role', company: 'Company', dates: '2020 - Present', description: '', responsibilities: [], techStack: '' })} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Role
          </button>
        </div>
        {data.experience.map((exp, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group space-y-3">
            <button onClick={() => removeArrayItem('experience', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                <input type="text" value={exp.role} onChange={(e) => updateArrayItem('experience', index, 'role', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                <input type="text" value={exp.company} onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Dates</label>
              <input type="text" value={exp.dates} onChange={(e) => updateArrayItem('experience', index, 'dates', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea value={exp.description} onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md h-20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Responsibilities (one per line)</label>
              <textarea 
                value={exp.responsibilities.join('\n')} 
                onChange={(e) => updateArrayItem('experience', index, 'responsibilities', e.target.value.split('\n').filter(s => s.trim() !== ''))} 
                className="w-full p-2 text-sm border border-gray-300 rounded-md h-32" 
                placeholder="Implemented feature X...&#10;Optimized database Y..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tech Stack</label>
              <input type="text" value={exp.techStack} onChange={(e) => updateArrayItem('experience', index, 'techStack', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-bold text-gray-900">Education</h4>
          <button onClick={() => addArrayItem('education', { degree: 'Degree', institution: 'Institution', dates: '2016 - 2020' })} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Education
          </button>
        </div>
        {data.education.map((edu, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group space-y-3">
            <button onClick={() => removeArrayItem('education', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Degree</label>
              <input type="text" value={edu.degree} onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Institution</label>
              <input type="text" value={edu.institution} onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Dates</label>
              <input type="text" value={edu.dates} onChange={(e) => updateArrayItem('education', index, 'dates', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        ))}
      </section>

      {/* Languages */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-bold text-gray-900">Languages</h4>
          <button onClick={() => addArrayItem('languages', { language: 'Language', level: 'Native' })} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Language
          </button>
        </div>
        {data.languages.map((lang, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group grid grid-cols-2 gap-3">
            <button onClick={() => removeArrayItem('languages', index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
              <input type="text" value={lang.language} onChange={(e) => updateArrayItem('languages', index, 'language', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Level</label>
              <input type="text" value={lang.level} onChange={(e) => updateArrayItem('languages', index, 'level', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
