import React, { useState, useEffect, useRef } from 'react';
import { EditorForm } from './components/EditorForm';
import { 
  ModernTemplate, ClassicTemplate, MinimalTemplate, ProfessionalTemplate, 
  ExecutiveTemplate, CreativeTemplate, TechTemplate, ElegantTemplate, 
  CompactTemplate, TimelineTemplate, LatexAcademicTemplate, LatexModernTemplate
} from './components/TemplateComponents';
import { getResumeSuggestions, getNextInterviewQuestion, processInterviewAnswer } from './services/geminiService';
import { ResumeData, INITIAL_RESUME_DATA, TemplateType, SuggestionResult } from './types';
import { FileDown, Sparkles, Loader2, Check, X, MessageSquare, Edit3, Send } from 'lucide-react';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.MODERN);
  const [suggestions, setSuggestions] = useState<SuggestionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Interview Mode State
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInterviewMode && interviewHistory.length === 0) {
      triggerBotQuestion();
    }
  }, [isInterviewMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewHistory]);

  const triggerBotQuestion = async () => {
    setIsBotTyping(true);
    const question = await getNextInterviewQuestion(resumeData, interviewHistory);
    setInterviewHistory(prev => [...prev, { role: 'model', text: question }]);
    setIsBotTyping(false);
  };

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isBotTyping) return;

    const answer = userInput.trim();
    setUserInput('');
    setInterviewHistory(prev => [...prev, { role: 'user', text: answer }]);
    
    setIsBotTyping(true);
    const updates = await processInterviewAnswer(answer, resumeData);
    
    // Merge updates into resume data
    setResumeData(prev => {
      const newData = { ...prev };
      if (updates.personal) newData.personal = { ...prev.personal, ...updates.personal };
      if (updates.experience) newData.experience = [...prev.experience, ...updates.experience];
      if (updates.education) newData.education = [...prev.education, ...updates.education];
      if (updates.skills) newData.skills = Array.from(new Set([...prev.skills, ...updates.skills]));
      return newData;
    });

    await triggerBotQuestion();
  };

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
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, summary: newSummary } }));
  };

  const applyExperience = (id: string, newDesc: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, description: newDesc } : e)
    }));
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
      case TemplateType.LATEX_ACADEMIC: return <LatexAcademicTemplate data={resumeData} />;
      case TemplateType.LATEX_MODERN: return <LatexModernTemplate data={resumeData} />;
      case TemplateType.MODERN:
      default: return <ModernTemplate data={resumeData} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">ResuMinds</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setIsInterviewMode(false)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${!isInterviewMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            <Edit3 size={14}/> Editor
          </button>
          <button 
            onClick={() => setIsInterviewMode(true)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${isInterviewMode ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
          >
            <MessageSquare size={14}/> AI Interview
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto max-w-64 no-scrollbar">
             {Object.values(TemplateType).slice(0, 12).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTemplate(t)}
                  className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter transition-all whitespace-nowrap ${
                    activeTemplate === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
             ))}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors border border-purple-200"
          >
             {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FileDown size={18} />
            Export PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Left Panel: Editor or Interview */}
        <div className="w-[450px] border-r border-gray-200 bg-white flex flex-col shadow-lg z-10 shrink-0 print:hidden overflow-hidden">
          {isInterviewMode ? (
            <div className="flex flex-col h-full bg-slate-50">
              <div className="p-4 border-b bg-white">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-500"/> AI Career Coach
                </h2>
                <p className="text-xs text-slate-500">Answer questions to build your professional profile automatically.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {interviewHistory.map((h, i) => (
                  <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${h.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 shadow-sm rounded-tl-none'}`}>
                      {h.text}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleInterviewSubmit} className="p-4 bg-white border-t flex gap-2">
                <input 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1 p-2 bg-slate-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button type="submit" disabled={!userInput.trim() || isBotTyping} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  <Send size={18}/>
                </button>
              </form>
            </div>
          ) : (
            <EditorForm data={resumeData} onChange={setResumeData} />
          )}
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-auto bg-gray-200 p-8 relative flex justify-center print:p-0 print:overflow-visible print:h-auto print:block print:bg-white">
          {showSuggestions && suggestions && !isAnalyzing && (
            <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-purple-100 z-20 animate-in slide-in-from-right duration-300 max-h-[85vh] flex flex-col print:hidden">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-xl shrink-0">
                 <h3 className="font-bold text-purple-900 flex items-center gap-2"><Sparkles size={16}/> Gemini Insights</h3>
                 <button onClick={() => setShowSuggestions(false)} className="text-gray-400 hover:text-gray-700 p-1 hover:bg-white rounded-full transition-colors"><X size={16}/></button>
               </div>
               <div className="p-4 overflow-y-auto flex-1 space-y-4">
                 {suggestions.summary && (
                   <div className="p-3 bg-slate-50 rounded-lg border">
                     <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Summary Suggestion</p>
                     <p className="text-xs text-slate-700 mb-3 leading-relaxed">"{suggestions.summary.improved}"</p>
                     <button onClick={() => applySummary(suggestions.summary!.improved)} className="w-full py-1.5 bg-purple-600 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2">Apply Changes</button>
                   </div>
                 )}
                 {suggestions.experiences?.map((exp, i) => (
                   <div key={i} className="p-3 bg-slate-50 rounded-lg border">
                     <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Exp Suggestion</p>
                     <p className="text-xs text-slate-700 mb-3 leading-relaxed">"{exp.improved}"</p>
                     <button onClick={() => applyExperience(exp.id, exp.improved)} className="w-full py-1.5 bg-purple-600 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2">Apply Changes</button>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* High Fidelity Print Container */}
          <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] h-fit mx-auto print:shadow-none print:w-full print:m-0 print:overflow-visible overflow-hidden">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;