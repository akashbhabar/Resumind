import React from 'react';
import { ResumeData, CustomSection } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink, Calendar, Briefcase, GraduationCap, Award } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

// Helper to format dates
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + '-01');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const formatRange = (start: string, end: string, current: boolean) => {
  if (!start && !end) return '';
  const startFmt = start ? formatDate(start) : '';
  const endFmt = current ? 'Present' : (end ? formatDate(end) : '');
  if (!startFmt) return endFmt;
  if (!endFmt) return startFmt;
  return `${startFmt} – ${endFmt}`;
};

// Generic Renderer to loop through section order
const renderSection = (
  sectionId: string, 
  data: ResumeData, 
  styles: {
    sectionTitle: string;
    sectionContainer: string;
    itemContainer?: string;
    title: string;
    subtitle: string;
    date: string;
    desc: string;
  }
) => {
  const { customSections } = data;

  if (sectionId === 'summary' && data.personal.summary) {
    return (
      <div key="summary" className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Profile</h3>
        <p className={styles.desc}>{data.personal.summary}</p>
      </div>
    );
  }

  if (sectionId === 'experience' && data.experience.length > 0) {
    return (
      <div key="experience" className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Experience</h3>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className={`${styles.itemContainer || ''} break-inside-avoid`}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className={styles.title}>{exp.position}</h4>
                <span className={styles.date}>{formatRange(exp.startDate, exp.endDate, exp.current)}</span>
              </div>
              <div className={styles.subtitle}>{exp.company}</div>
              <p className={styles.desc}>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionId === 'education' && data.education.length > 0) {
    return (
      <div key="education" className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Education</h3>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className={`${styles.itemContainer || ''} break-inside-avoid`}>
              <div className="flex justify-between items-baseline">
                <h4 className={styles.title}>{edu.institution}</h4>
                <span className={styles.date}>{formatRange(edu.startDate, edu.endDate, edu.current)}</span>
              </div>
              <div className={styles.subtitle}>{edu.degree}</div>
              {edu.description && <p className={`${styles.desc} mt-1`}>{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sectionId === 'projects' && data.projects.length > 0) {
    return (
      <div key="projects" className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>Projects</h3>
        <div className="space-y-4">
          {data.projects.map((proj) => (
            <div key={proj.id} className={`${styles.itemContainer || ''} break-inside-avoid`}>
              <div className="flex items-center gap-2 mb-1">
                 <h4 className={styles.title}>{proj.name}</h4>
                 {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1 opacity-70"><ExternalLink size={10}/> {proj.link}</a>}
              </div>
              <p className={styles.desc}>{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle Custom Sections
  const custom = customSections.find(c => c.id === sectionId);
  if (custom && custom.items.length > 0) {
    return (
      <div key={custom.id} className={styles.sectionContainer}>
        <h3 className={styles.sectionTitle}>{custom.title}</h3>
        <div className="space-y-4">
          {custom.items.map((item) => (
            <div key={item.id} className={`${styles.itemContainer || ''} break-inside-avoid`}>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className={styles.title}>{item.name}</h4>
                {(item.startDate || item.endDate) && (
                   <span className={styles.date}>{formatRange(item.startDate, item.endDate, false)}</span>
                )}
              </div>
              {item.subtitle && <div className={styles.subtitle}>{item.subtitle}</div>}
              {item.description && <p className={styles.desc}>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};


// --- 1. Modern Template ---
export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col md:flex-row min-h-[1000px] print:min-h-0 print:h-auto">
      <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 print:bg-slate-900 print:text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 leading-tight">{data.personal.fullName}</h1>
          <p className="text-slate-400 text-lg">{data.personal.jobTitle}</p>
        </div>
        <div className="space-y-4 mb-8 text-sm">
          {data.personal.email && <div className="flex items-center gap-3"><Mail size={16} /> <span>{data.personal.email}</span></div>}
          {data.personal.phone && <div className="flex items-center gap-3"><Phone size={16} /> <span>{data.personal.phone}</span></div>}
          {data.personal.address && <div className="flex items-center gap-3"><MapPin size={16} /> <span>{data.personal.address}</span></div>}
          {data.personal.linkedin && <div className="flex items-center gap-3"><Linkedin size={16} /> <span>{data.personal.linkedin}</span></div>}
          {data.personal.website && <div className="flex items-center gap-3"><Globe size={16} /> <span>{data.personal.website}</span></div>}
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold uppercase border-b border-slate-700 pb-2 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-slate-800 px-2 py-1 rounded text-xs print:text-white print:border-slate-700">{skill}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3 p-8">
        {data.sectionOrder.map(id => renderSection(id, data, {
            sectionContainer: 'mb-8',
            sectionTitle: 'text-xl font-bold text-slate-900 uppercase tracking-wide border-b-2 border-slate-200 pb-2 mb-4',
            title: 'font-bold text-lg text-slate-800',
            date: 'text-sm text-slate-500 italic whitespace-nowrap ml-2',
            subtitle: 'text-slate-700 font-medium mb-1',
            desc: 'text-slate-600 text-sm whitespace-pre-line leading-relaxed'
        }))}
      </div>
    </div>
  );
};

// --- 2. Classic Template ---
export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white text-gray-900 p-12 min-h-[1000px] font-serif print:min-h-0 print:h-auto">
    <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
      <h1 className="text-4xl font-bold mb-2">{data.personal.fullName}</h1>
      <p className="text-xl italic text-gray-700 mb-4">{data.personal.jobTitle}</p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-sans">
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.phone && <span>• {data.personal.phone}</span>}
        {data.personal.linkedin && <span>• {data.personal.linkedin}</span>}
      </div>
    </div>
    
    {data.sectionOrder.map(id => renderSection(id, data, {
        sectionContainer: 'mb-6',
        sectionTitle: 'text-lg font-bold uppercase border-b border-gray-300 mb-4 font-sans',
        title: 'font-bold text-gray-900', // For Classic, generic render might need tweaks, but this structure works for most
        date: 'font-normal text-gray-600 font-sans text-sm',
        subtitle: 'italic mb-1',
        desc: 'text-sm leading-relaxed whitespace-pre-line text-gray-800'
    }))}

    <div className="flex gap-8 break-inside-avoid">
        {data.skills.length > 0 && (
          <div className="flex-1">
             <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 font-sans">Skills</h3>
             <p className="leading-relaxed">{data.skills.join(', ')}</p>
          </div>
        )}
    </div>
  </div>
);

// --- 3. Minimal Template ---
export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white text-black p-12 min-h-[1000px] font-mono text-sm print:min-h-0 print:h-auto">
    <header className="mb-12">
      <h1 className="text-4xl font-bold tracking-tighter mb-2">{data.personal.fullName}</h1>
      <p className="text-lg text-gray-600 mb-4">{data.personal.jobTitle}</p>
      <div className="grid grid-cols-2 gap-2 text-gray-500 max-w-md">
         {data.personal.email && <div>{data.personal.email}</div>}
         {data.personal.phone && <div>{data.personal.phone}</div>}
         {data.personal.website && <div>{data.personal.website}</div>}
         {data.personal.linkedin && <div>{data.personal.linkedin}</div>}
      </div>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
      <aside>
         {data.skills.length > 0 && (
           <div className="mb-8 break-inside-avoid">
             <h3 className="font-bold mb-3 uppercase tracking-widest text-xs text-gray-500">Skills</h3>
             <ul className="space-y-1">
               {data.skills.map((s,i) => <li key={i}>{s}</li>)}
             </ul>
           </div>
         )}
      </aside>
      <main>
         {data.sectionOrder.map(id => renderSection(id, data, {
             sectionContainer: 'mb-10',
             sectionTitle: 'font-bold mb-3 uppercase tracking-widest text-xs text-gray-500',
             title: 'font-bold text-base',
             date: 'text-gray-400 text-xs',
             subtitle: 'text-gray-600 font-bold mb-1',
             desc: 'text-gray-700 leading-relaxed',
             itemContainer: 'relative pl-4 border-l-2 border-gray-100'
         }))}
      </main>
    </div>
  </div>
);

// --- 4. Professional Template ---
export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white text-gray-800 p-8 min-h-[1000px] font-sans print:min-h-0 print:h-auto">
    <div className="flex border-b-4 border-blue-800 pb-6 mb-8 items-center justify-between">
      <div>
        <h1 className="text-4xl font-extrabold text-blue-900 uppercase tracking-tight">{data.personal.fullName}</h1>
        <p className="text-xl text-blue-600 font-medium mt-1">{data.personal.jobTitle}</p>
      </div>
      <div className="text-right text-sm text-gray-600 space-y-1">
        <div>{data.personal.email}</div>
        <div>{data.personal.phone}</div>
        <div>{data.personal.address}</div>
      </div>
    </div>

    <div className="grid grid-cols-[1fr_2fr] gap-8">
      <div className="space-y-8 border-r border-gray-200 pr-6">
        <div className="break-inside-avoid">
           <h3 className="text-blue-900 font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><Award size={18}/> Skills</h3>
           <div className="flex flex-wrap gap-2">
             {data.skills.map((s,i) => <span key={i} className="bg-blue-50 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full print:border print:border-blue-100">{s}</span>)}
           </div>
        </div>
        
        {data.personal.linkedin && (
           <div className="break-inside-avoid">
              <h3 className="text-blue-900 font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><Globe size={18}/> Links</h3>
              <div className="text-sm truncate"><a href={`https://${data.personal.linkedin}`} className="text-blue-600 hover:underline">{data.personal.linkedin}</a></div>
              {data.personal.website && <div className="text-sm truncate mt-2"><a href={`https://${data.personal.website}`} className="text-blue-600 hover:underline">{data.personal.website}</a></div>}
           </div>
        )}
      </div>

      <div className="space-y-8">
        {data.sectionOrder.map(id => renderSection(id, data, {
            sectionContainer: '',
            sectionTitle: 'text-blue-900 font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-2',
            title: 'font-bold text-lg text-gray-900',
            date: 'text-blue-600 font-semibold text-sm',
            subtitle: 'text-gray-700 font-medium italic mb-1',
            desc: 'text-gray-600 text-sm leading-relaxed whitespace-pre-line'
        }))}
      </div>
    </div>
  </div>
);

// --- 5. Executive Template ---
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white text-gray-900 p-10 min-h-[1000px] font-serif print:min-h-0 print:h-auto">
     <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>{data.personal.fullName}</h1>
        <div className="h-1 w-24 bg-gray-900 mx-auto mb-4"></div>
        <p className="text-lg uppercase tracking-widest text-gray-600">{data.personal.jobTitle}</p>
        <div className="flex justify-center gap-6 mt-4 text-sm font-sans text-gray-500">
           <span>{data.personal.email}</span>
           <span>|</span>
           <span>{data.personal.phone}</span>
           <span>|</span>
           <span>{data.personal.address}</span>
        </div>
     </div>

     <div className="space-y-8 max-w-4xl mx-auto">
        {data.sectionOrder.map(id => renderSection(id, data, {
            sectionContainer: '',
            sectionTitle: 'text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-500 font-sans',
            title: 'font-bold text-lg text-gray-900',
            date: 'text-gray-500 text-sm',
            subtitle: 'text-gray-800 font-semibold italic mb-2',
            desc: 'text-gray-700 leading-relaxed text-sm text-justify'
        }))}
        
        <section className="break-inside-avoid">
           <h3 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 text-gray-500 font-sans">Core Competencies</h3>
           <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700 font-sans">
              {data.skills.map((s,i) => <span key={i}>• {s}</span>)}
           </div>
        </section>
     </div>
  </div>
);

// --- 6. Creative Template ---
export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white min-h-[1000px] flex print:min-h-0 print:h-auto">
     <div className="w-1/3 bg-teal-500 text-white p-8 flex flex-col items-center text-center print:bg-teal-500 print:text-white">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-teal-600 text-4xl font-bold mb-6 border-4 border-teal-200">
           {data.personal.fullName.charAt(0)}
        </div>
        <h2 className="text-xl font-bold uppercase mb-8">Contact</h2>
        <div className="space-y-4 text-sm w-full">
           {data.personal.email && <div className="bg-teal-600 p-2 rounded break-all">{data.personal.email}</div>}
           {data.personal.phone && <div className="bg-teal-600 p-2 rounded">{data.personal.phone}</div>}
           {data.personal.website && <div className="bg-teal-600 p-2 rounded break-all">{data.personal.website}</div>}
           {data.personal.address && <div className="bg-teal-600 p-2 rounded">{data.personal.address}</div>}
        </div>
        
        <h2 className="text-xl font-bold uppercase mt-12 mb-6">Skills</h2>
        <div className="w-full flex flex-wrap gap-2 justify-center">
           {data.skills.map((s,i) => <span key={i} className="bg-teal-700 px-3 py-1 rounded-full text-xs font-medium">{s}</span>)}
        </div>
     </div>
     
     <div className="w-2/3 p-10 bg-gray-50 print:bg-white">
        <h1 className="text-5xl font-black text-gray-800 mb-2 uppercase">{data.personal.fullName}</h1>
        <p className="text-2xl text-teal-500 font-light mb-10">{data.personal.jobTitle}</p>
        
        {data.sectionOrder.map(id => renderSection(id, data, {
            sectionContainer: 'mb-10',
            sectionTitle: 'text-2xl font-bold text-gray-800 uppercase mb-4 flex items-center gap-3',
            title: 'text-xl font-bold text-gray-800',
            date: 'text-teal-600 font-bold text-sm',
            subtitle: 'text-gray-500 font-medium mb-1',
            desc: 'text-gray-600 leading-relaxed',
            itemContainer: 'relative pl-8 border-l-2 border-teal-200 ml-2'
        }))}
     </div>
  </div>
);

// --- 7. Tech Template ---
export const TechTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-zinc-100 text-zinc-900 p-8 min-h-[1000px] font-sans print:bg-white print:min-h-0 print:h-auto">
     <div className="bg-zinc-800 text-zinc-100 p-8 rounded-lg shadow-lg mb-8 print:bg-zinc-800 print:text-zinc-100">
        <h1 className="text-4xl font-mono font-bold text-green-400 mb-2">&lt;{data.personal.fullName} /&gt;</h1>
        <p className="text-xl font-mono text-zinc-400 mb-6">// {data.personal.jobTitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono text-zinc-300">
           {data.personal.email && <div>Email: {data.personal.email}</div>}
           {data.personal.phone && <div>Tel: {data.personal.phone}</div>}
           {data.personal.linkedin && <div>Li: {data.personal.linkedin}</div>}
           {data.personal.website && <div>Web: {data.personal.website}</div>}
        </div>
     </div>

     <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
           {data.sectionOrder.map(id => renderSection(id, data, {
               sectionContainer: 'bg-white p-6 rounded-lg shadow-sm border border-zinc-200 print:border-zinc-300 print:shadow-none',
               sectionTitle: 'font-mono font-bold text-lg text-indigo-600 mb-4 border-b border-zinc-100 pb-2',
               title: 'font-bold text-zinc-800',
               date: 'bg-zinc-100 px-2 py-1 rounded text-xs font-mono',
               subtitle: 'text-indigo-600 font-mono text-sm',
               desc: 'mt-2 text-sm text-zinc-600'
           }))}
        </div>

        <div className="col-span-1 space-y-8">
           <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 print:border-zinc-300 print:shadow-none">
              <h3 className="font-mono font-bold text-lg text-indigo-600 mb-4 border-b border-zinc-100 pb-2">skills array</h3>
              <div className="flex flex-wrap gap-2">
                 {data.skills.map((s,i) => <span key={i} className="bg-zinc-100 text-zinc-800 px-2 py-1 rounded text-xs font-mono border border-zinc-300">{s}</span>)}
              </div>
           </div>
        </div>
     </div>
  </div>
);

// --- 8. Elegant Template ---
export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-[#fdfbf7] text-gray-800 p-12 min-h-[1000px] font-serif border-t-8 border-gold-500 print:bg-white print:min-h-0 print:h-auto" style={{borderColor: '#d4af37'}}>
     <div className="text-center mb-12">
        <div className="inline-block border-2 border-gray-800 p-1 mb-4 rounded-full">
           <div className="w-16 h-16 bg-gray-800 text-[#fdfbf7] rounded-full flex items-center justify-center text-2xl font-bold print:bg-gray-800 print:text-white">
              {data.personal.fullName.split(' ').map(n => n[0]).join('')}
           </div>
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{data.personal.fullName}</h1>
        <p className="text-md italic text-gray-600">{data.personal.jobTitle}</p>
     </div>

     <div className="flex gap-10">
        <div className="w-2/3 pr-10 border-r border-gray-200">
           {data.sectionOrder.map(id => renderSection(id, data, {
               sectionContainer: 'mb-8',
               sectionTitle: 'text-center font-bold uppercase tracking-widest text-xs mb-6 text-[#d4af37]',
               title: 'font-bold',
               date: 'italic text-sm text-gray-600', // Combining subtitle + date in renderer logic might be needed for perfect match, but this is close
               subtitle: 'italic text-sm text-gray-600',
               desc: 'text-sm leading-6 text-justify',
               itemContainer: 'text-center mb-6'
           }))}
        </div>

        <div className="w-1/3 text-center">
           <div className="mb-8 break-inside-avoid">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-4 text-[#d4af37]">Contact</h3>
              <div className="text-sm space-y-2 text-gray-600">
                 <div>{data.personal.email}</div>
                 <div>{data.personal.phone}</div>
                 <div>{data.personal.address}</div>
                 <div className="text-xs break-all">{data.personal.linkedin}</div>
              </div>
           </div>

           <div className="mb-8 break-inside-avoid">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-4 text-[#d4af37]">Skills</h3>
              <div className="text-sm space-y-1 text-gray-600">
                 {data.skills.map((s,i) => <div key={i}>{s}</div>)}
              </div>
           </div>
        </div>
     </div>
  </div>
);

// --- 9. Compact Template ---
export const CompactTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white text-gray-900 p-6 min-h-[1000px] text-xs leading-snug print:min-h-0 print:h-auto">
     <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
        <div>
           <h1 className="text-3xl font-bold uppercase">{data.personal.fullName}</h1>
           <p className="text-base font-semibold text-gray-700">{data.personal.jobTitle}</p>
        </div>
        <div className="text-right text-gray-600">
           <div>{data.personal.email} • {data.personal.phone}</div>
           <div>{data.personal.linkedin}</div>
        </div>
     </div>

     <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
           {data.sectionOrder.map(id => renderSection(id, data, {
               sectionContainer: 'mb-4',
               sectionTitle: 'font-bold uppercase border-b border-gray-300 mb-2',
               title: 'font-bold',
               date: '', // Compact handles date inline with title usually
               subtitle: 'font-bold', // Compact often merges title/company
               desc: 'mt-1'
           }))}
        </div>

        <div className="col-span-1 bg-gray-50 p-3 rounded print:bg-white print:border print:border-gray-200">
           <div className="mb-4 break-inside-avoid">
              <h3 className="font-bold uppercase mb-2 text-gray-700">Skills</h3>
              <div className="flex flex-col gap-1">
                 {data.skills.map((s,i) => <span key={i} className="border-b border-gray-200 pb-0.5">{s}</span>)}
              </div>
           </div>
        </div>
     </div>
  </div>
);

// --- 10. Timeline Template ---
export const TimelineTemplate: React.FC<TemplateProps> = ({ data }) => (
  <div className="w-full h-full bg-white text-gray-800 p-8 min-h-[1000px] print:min-h-0 print:h-auto">
     <div className="flex items-center gap-6 mb-10">
        <div className="flex-1">
           <h1 className="text-4xl font-bold text-indigo-900">{data.personal.fullName}</h1>
           <p className="text-xl text-indigo-600">{data.personal.jobTitle}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
           <div className="flex items-center justify-end gap-2"><Mail size={14}/> {data.personal.email}</div>
           <div className="flex items-center justify-end gap-2"><Phone size={14}/> {data.personal.phone}</div>
           <div className="flex items-center justify-end gap-2"><MapPin size={14}/> {data.personal.address}</div>
        </div>
     </div>

     <div className="grid grid-cols-[1fr_2fr] gap-10">
        <div className="space-y-10">
           <section className="break-inside-avoid">
              <h3 className="text-indigo-900 font-bold uppercase tracking-wider mb-4 border-b-2 border-indigo-100 pb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {data.skills.map((s,i) => <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 text-xs rounded-full font-bold print:border print:border-indigo-200">{s}</span>)}
              </div>
           </section>
        </div>

        <div>
           {data.sectionOrder.map(id => renderSection(id, data, {
               sectionContainer: 'mb-10',
               sectionTitle: 'text-indigo-900 font-bold uppercase tracking-wider mb-6 border-b-2 border-indigo-100 pb-2',
               title: 'text-lg font-bold text-gray-800',
               date: 'text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded',
               subtitle: 'text-indigo-600 font-medium mb-2',
               desc: 'text-sm text-gray-600 leading-relaxed',
               itemContainer: 'pl-8 relative border-l-2 border-indigo-200 ml-2'
           }))}
        </div>
     </div>
  </div>
);