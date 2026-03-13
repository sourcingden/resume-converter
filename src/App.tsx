import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Download, Edit2, Check, Copy } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { ResumeData } from './types';
import { parseResume } from './services/geminiService';
import { extractTextFromPDF } from './utils/pdfParser';
import { ResumePreview } from './components/ResumePreview';
import { ResumeEditor } from './components/ResumeEditor';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [rawText, setRawText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = async () => {
    if (!componentRef.current) return;
    
    setIsLoading(true);
    setProgress(50);
    setProgressText('Generating PDF...');
    
    const element = componentRef.current;
    const filename = resumeData?.name ? `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';
    
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const },
      pagebreak:    { mode: 'css', before: '.print\\:break-before-page', avoid: '.print\\:break-inside-avoid' }
    };
    
    // Create a clone to avoid modifying the actual DOM
    const clone = element.cloneNode(true) as HTMLElement;
    
    // We need to make sure the clone is visible for html2canvas but off-screen
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    // Ensure it has the exact A4 dimensions for the PDF
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    
    document.body.appendChild(clone);
    
    try {
      await html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF');
    } finally {
      document.body.removeChild(clone);
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!componentRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(componentRef.current);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
      setError('Failed to copy to clipboard');
    }
    
    selection?.removeAllRanges();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setProgress(5);
    setProgressText('Reading file...');

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        setProgressText('Extracting text from PDF...');
        setProgress(15);
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }
      
      setRawText(text);
      await processText(text, true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsLoading(false);
    }
  };

  const processText = async (text: string, isFromFile = false) => {
    if (!text.trim()) {
      setError('Please provide some text to process.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    if (!isFromFile) {
      setProgress(10);
      setProgressText('Preparing text...');
    }
    
    // Small delay to allow UI to update
    await new Promise(r => setTimeout(r, 100));
    
    setProgress(30);
    setProgressText('Analyzing content with AI (this takes about 10-15 seconds)...');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + (95 - prev) * 0.05; // Asymptotic approach to 95%
      });
    }, 500);

    try {
      const data = await parseResume(text);
      clearInterval(interval);
      setProgress(100);
      setProgressText('Formatting results...');
      await new Promise(r => setTimeout(r, 400)); // Let user see 100%
      setResumeData(data);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError('Failed to parse resume with AI. Please try again.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Resume Converter</h1>
          </div>
          
          {resumeData && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                <span>{isEditing ? 'Done Editing' : 'Edit Data'}</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span className={isCopied ? "text-green-600" : ""}>{isCopied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!resumeData && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload your resume</h2>
              <p className="text-gray-500 mb-8">
                Upload a PDF or text file, and our AI will convert it into the Newxel format.
              </p>
              
              <div className="space-y-4">
                <label className="block w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                  <span>Select File (PDF, TXT)</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.txt" 
                    onChange={handleFileUpload}
                  />
                </label>
                
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR PASTE TEXT</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                
                <button
                  onClick={() => processText(rawText)}
                  disabled={!rawText.trim()}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Convert Text
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {error}
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 max-w-md mx-auto">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">Processing Resume</h3>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between w-full text-sm text-gray-500">
              <span>{progressText}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {resumeData && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {isEditing && (
              <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[calc(100vh-8rem)] overflow-y-auto sticky top-24">
                <h3 className="text-lg font-bold mb-4">Edit Data</h3>
                <ResumeEditor data={resumeData} onChange={setResumeData} />
              </div>
            )}
            
            <div className={`flex justify-center ${isEditing ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200">
                <ResumePreview data={resumeData} ref={componentRef} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
