import React, { useState } from 'react';
import { EditorForm } from './components/EditorForm';
import { 
  ModernTemplate, ClassicTemplate, MinimalTemplate, ProfessionalTemplate, 
  ExecutiveTemplate, CreativeTemplate, TechTemplate, ElegantTemplate, 
  CompactTemplate, TimelineTemplate 
} from './components/TemplateComponents';
import { getResumeSuggestions } from './services/geminiService';
import { ResumeData, INITIAL_RESUME_DATA, TemplateType, SuggestionResult } from './types';
import { FileDown, Sparkles, Loader2, Check, ArrowRight, X } from 'lucide-react';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.MODERN);
  const [suggestions, setSuggestions] = useState<SuggestionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowSuggestions(true);
    setSuggestions(null);
    const results = await getResumeSuggestions(resumeData);
    setSuggestions(results);
    setIsAnalyzing(false);
  };

  const applySummary = (newSummary: string) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, summary: newSummary }
    });
  };

  const applyExperience = (id: string, newDesc: string) => {
    const newExp = resumeData.experience.map(e => e.id === id ? { ...e, description: newDesc } : e);
    setResumeData({ ...resumeData, experience: newExp });
  };

  const renderTemplate = () => {
    switch (activeTemplate) {
      case TemplateType.CLASSIC: return <ClassicTemplate data={resumeData} />;
      case TemplateType.MINIMAL: return <MinimalTemplate data={resumeData} />;
      case TemplateType.PROFESSIONAL: return <ProfessionalTemplate data={resumeData} />;
      case TemplateType.EXECUTIVE: return <ExecutiveTemplate data={resumeData} />;
      case TemplateType.CREATIVE: return <CreativeTemplate data={resumeData} />;
      case TemplateType.TECH: return <TechTemplate data={resumeData} />;
      case TemplateType.ELEGANT: return <ElegantTemplate data={resumeData} />;
      case TemplateType.COMPACT: return <CompactTemplate data={resumeData} />;
      case TemplateType.TIMELINE: return <TimelineTemplate data={resumeData} />;
      case TemplateType.MODERN:
      default: return <ModernTemplate data={resumeData} />;
    }
  };

  return (
    // Reset height and overflow for print to ensure full page content renders
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      {/* Header - Hide on print */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">ResuMinds</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto max-w-[50%] no-scrollbar">
           <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
             {Object.values(TemplateType).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTemplate(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap capitalize ${
                    activeTemplate === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {t}
                </button>
             ))}
           </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors border border-purple-200"
          >
             {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
             AI Suggestions
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
            title="Use the Print dialog to Save as PDF"
          >
            <FileDown size={18} />
            Print / PDF
          </button>
        </div>
      </header>

      {/* Main Content - Reset layout for print */}
      <div className="flex-1 flex overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Left Panel: Editor - Hide on print */}
        <div className="w-[450px] border-r border-gray-200 bg-white flex flex-col shadow-[2px_0_5px_rgba(0,0,0,0.03)] z-10 shrink-0 print:hidden">
          <EditorForm data={resumeData} onChange={setResumeData} />
        </div>

        {/* Center Panel: Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8 relative flex justify-center print:p-0 print:overflow-visible print:h-auto print:block print:bg-white">
          
          {/* AI Suggestions Overlay - Hide on print */}
          {showSuggestions && (
            <div className="absolute top-4 right-4 w-[400px] bg-white rounded-xl shadow-2xl border border-purple-100 z-20 animate-in slide-in-from-right duration-300 max-h-[85vh] flex flex-col print:hidden">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-xl shrink-0">
                 <h3 className="font-bold text-purple-900 flex items-center gap-2">
                   <Sparkles size={16}/> Gemini Insights
                 </h3>
                 <button onClick={() => setShowSuggestions(false)} className="text-gray-400 hover:text-gray-700 p-1 hover:bg-white rounded-full transition-colors"><X size={16}/></button>
               </div>
               
               <div className="p-4 overflow-y-auto flex-1 space-y-6 bg-slate-50">
                 {isAnalyzing ? (
                   <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
                     <Loader2 className="animate-spin text-purple-500" size={32} />
                     <span className="text-sm font-medium">Analyzing your resume...</span>
                   </div>
                 ) : !suggestions || (Object.keys(suggestions).length === 0) ? (
                    <div className="text-center text-gray-500 py-8">No specific suggestions found. Try adding more content first.</div>
                 ) : (
                   <>
                     {suggestions.summary && (
                       <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Summary Refinement</h4>
                         </div>
                         <p className="text-xs text-gray-500 mb-2 italic">"{suggestions.summary.critique}"</p>
                         <div className="bg-red-50 p-2 rounded text-xs text-red-700 mb-2 border-l-2 border-red-300">
                            <span className="font-bold block text-[10px] uppercase text-red-400 mb-1">Original</span>
                            {suggestions.summary.original}
                         </div>
                         <div className="bg-green-50 p-2 rounded text-xs text-green-700 mb-3 border-l-2 border-green-300">
                             <div className="flex justify-between items-start">
                                <span className="font-bold block text-[10px] uppercase text-green-400 mb-1">Suggested</span>
                             </div>
                            {suggestions.summary.improved}
                         </div>
                         <button 
                           onClick={() => applySummary(suggestions.summary!.improved)}
                           className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                         >
                           <Check size={12}/> Apply Suggestion
                         </button>
                       </div>
                     )}

                     {suggestions.experiences?.map((exp, i) => (
                       <div key={i} className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Experience: {exp.company}</h4>
                         </div>
                         <p className="text-xs text-gray-500 mb-2 italic">"{exp.critique}"</p>
                         <div className="bg-red-50 p-2 rounded text-xs text-red-700 mb-2 border-l-2 border-red-300 max-h-24 overflow-y-auto">
                            <span className="font-bold block text-[10px] uppercase text-red-400 mb-1">Original</span>
                            {exp.original}
                         </div>
                         <div className="bg-green-50 p-2 rounded text-xs text-green-700 mb-3 border-l-2 border-green-300">
                            <span className="font-bold block text-[10px] uppercase text-green-400 mb-1">Suggested</span>
                            {exp.improved}
                         </div>
                         <button 
                           onClick={() => applyExperience(exp.id, exp.improved)}
                           className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                         >
                           <Check size={12}/> Apply Suggestion
                         </button>
                       </div>
                     ))}
                   </>
                 )}
               </div>
            </div>
          )}

          {/* Resume Page Preview */}
          <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] mx-auto overflow-hidden print:shadow-none print:w-full print:min-h-0 print:h-auto print:m-0 print:overflow-visible">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;