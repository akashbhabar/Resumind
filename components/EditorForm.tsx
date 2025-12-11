import React, { useState } from 'react';
import { ResumeData, Education, Experience, Project, CustomSection, CustomItem } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface EditorFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

const AccordionItem: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );
};

export const EditorForm: React.FC<EditorFormProps> = ({ data, onChange }) => {
  const [openSection, setOpenSection] = useState<string | null>('personal');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personal: { ...data.personal, [name]: value },
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(',').map((s) => s.trim());
    onChange({ ...data, skills });
  };

  // Generic handler for array updates
  const updateItem = <K extends 'education' | 'experience' | 'projects'>(
    section: K,
    id: string,
    field: keyof (ResumeData[K] extends (infer U)[] ? U : never),
    value: any
  ) => {
    const newArray = (data[section] as any[]).map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, [section]: newArray });
  };

  const deleteItem = (section: 'education' | 'experience' | 'projects', id: string) => {
    const newArray = (data[section] as any[]).filter((item) => item.id !== id);
    onChange({ ...data, [section]: newArray });
  };

  const addItem = (section: 'education' | 'experience' | 'projects') => {
    const id = Date.now().toString();
    if (section === 'education') {
      const newItem: Education = {
        id,
        institution: 'New School',
        degree: 'Degree',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      };
      onChange({ ...data, education: [...data.education, newItem] });
    } else if (section === 'experience') {
      const newItem: Experience = {
        id,
        company: 'New Company',
        position: 'Position',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      };
      onChange({ ...data, experience: [...data.experience, newItem] });
    } else {
       const newItem: Project = {
         id,
         name: 'New Project',
         link: '',
         description: '',
       };
       onChange({ ...data, projects: [...data.projects, newItem] });
    }
  };

  // Layout & Custom Section Handlers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...data.sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    onChange({ ...data, sectionOrder: newOrder });
  };

  const addCustomSection = () => {
    const id = `custom-${Date.now()}`;
    const newSection: CustomSection = {
      id,
      title: 'Custom Section',
      items: [],
    };
    onChange({
      ...data,
      customSections: [...data.customSections, newSection],
      sectionOrder: [...data.sectionOrder, id],
    });
  };

  const removeCustomSection = (id: string) => {
    onChange({
      ...data,
      customSections: data.customSections.filter(s => s.id !== id),
      sectionOrder: data.sectionOrder.filter(sId => sId !== id),
    });
  };

  const updateCustomSectionTitle = (id: string, title: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => s.id === id ? { ...s, title } : s),
    });
  };

  const addCustomItem = (sectionId: string) => {
    const newItem: CustomItem = {
      id: Date.now().toString(),
      name: 'Item Name',
      subtitle: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange({
      ...data,
      customSections: data.customSections.map(s => s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s),
    });
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: keyof CustomItem, value: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? {
          ...s,
          items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
        } : s
      ),
    });
  };

  const deleteCustomItem = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => 
        s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
      ),
    });
  };

  const getSectionLabel = (id: string) => {
    switch (id) {
      case 'summary': return 'Professional Summary';
      case 'experience': return 'Experience';
      case 'education': return 'Education';
      case 'projects': return 'Projects';
      case 'skills': return 'Skills';
      default:
        const custom = data.customSections.find(c => c.id === id);
        return custom ? `${custom.title} (Custom)` : 'Unknown Section';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Editor</h2>

      <AccordionItem
        title="Layout & Sections"
        isOpen={openSection === 'layout'}
        onToggle={() => toggleSection('layout')}
      >
        <div className="space-y-2 mb-6">
          <p className="text-xs text-gray-500 mb-2">Reorder sections to change the resume layout.</p>
          {data.sectionOrder.map((sectionId, index) => (
            <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="text-sm font-medium text-gray-700 capitalize truncate w-40">
                {getSectionLabel(sectionId)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === data.sectionOrder.length - 1}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
                {sectionId.startsWith('custom-') && (
                  <button
                    onClick={() => removeCustomSection(sectionId)}
                    className="p-1 text-gray-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addCustomSection}
            className="w-full py-2 mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-purple-500 hover:text-purple-500 transition-colors text-sm"
          >
            <Plus size={16} /> Add Custom Section
          </button>
        </div>
      </AccordionItem>

      <AccordionItem
        title="Personal Details"
        isOpen={openSection === 'personal'}
        onToggle={() => toggleSection('personal')}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
            <input
              name="fullName"
              value={data.personal.fullName}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
            <input
              name="jobTitle"
              value={data.personal.jobTitle}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input
                name="email"
                value={data.personal.email}
                onChange={handlePersonalChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
              <input
                name="phone"
                value={data.personal.phone}
                onChange={handlePersonalChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
              <input
                name="address"
                value={data.personal.address}
                onChange={handlePersonalChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Website</label>
              <input
                name="website"
                value={data.personal.website}
                onChange={handlePersonalChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
           </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">LinkedIn</label>
            <input
              name="linkedin"
              value={data.personal.linkedin}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Professional Summary</label>
            <textarea
              name="summary"
              rows={4}
              value={data.personal.summary}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem
        title="Experience"
        isOpen={openSection === 'experience'}
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="relative p-4 bg-gray-50 rounded border border-gray-200">
               <button
                  onClick={() => deleteItem('experience', exp.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              <div className="grid grid-cols-1 gap-3">
                <input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                  className="font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                />
                <input
                  placeholder="Position / Title"
                  value={exp.position}
                  onChange={(e) => updateItem('experience', exp.id, 'position', e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-gray-500">Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                      className="w-full text-sm bg-white border border-gray-300 rounded p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-gray-500">End Date</label>
                     <div className="flex items-center gap-2">
                         <input
                          type="month"
                          disabled={exp.current}
                          value={exp.endDate}
                          onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                          className={`w-full text-sm bg-white border border-gray-300 rounded p-1 ${exp.current ? 'opacity-50' : ''}`}
                        />
                     </div>
                  </div>
                </div>
                 <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateItem('experience', exp.id, 'current', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    I currently work here
                  </label>
                <textarea
                  placeholder="Description of responsibilities..."
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                  className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem('experience')}
            className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Plus size={16} /> Add Experience
          </button>
        </div>
      </AccordionItem>

      <AccordionItem
        title="Education"
        isOpen={openSection === 'education'}
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className="relative p-4 bg-gray-50 rounded border border-gray-200">
              <button
                  onClick={() => deleteItem('education', edu.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              <div className="grid grid-cols-1 gap-3">
                <input
                  placeholder="Institution / School"
                  value={edu.institution}
                  onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)}
                  className="font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                />
                <input
                  placeholder="Degree / Major"
                  value={edu.degree}
                  onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                  className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-gray-500">Start Date</label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)}
                      className="w-full text-sm bg-white border border-gray-300 rounded p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-gray-500">End Date</label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)}
                      className="w-full text-sm bg-white border border-gray-300 rounded p-1"
                    />
                  </div>
                </div>
                 <textarea
                  placeholder="Additional details (optional)..."
                  rows={2}
                  value={edu.description}
                  onChange={(e) => updateItem('education', edu.id, 'description', e.target.value)}
                  className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem('education')}
            className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Plus size={16} /> Add Education
          </button>
        </div>
      </AccordionItem>
      
      <AccordionItem
          title="Projects"
          isOpen={openSection === 'projects'}
          onToggle={() => toggleSection('projects')}
      >
          <div className="space-y-6">
              {data.projects.map((proj) => (
                  <div key={proj.id} className="relative p-4 bg-gray-50 rounded border border-gray-200">
                      <button
                          onClick={() => deleteItem('projects', proj.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                          <Trash2 size={16}/>
                      </button>
                      <div className="grid grid-cols-1 gap-3">
                          <input
                              placeholder="Project Name"
                              value={proj.name}
                              onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)}
                              className="font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                          />
                          <input
                              placeholder="Link (e.g. github.com/...)"
                              value={proj.link}
                              onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)}
                              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                          />
                          <textarea
                              placeholder="Description..."
                              rows={3}
                              value={proj.description}
                              onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)}
                              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                      </div>
                  </div>
              ))}
              <button
                  onClick={() => addItem('projects')}
                  className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                  <Plus size={16}/> Add Project
              </button>
          </div>
      </AccordionItem>
      
      {/* Custom Sections Editor */}
      {data.customSections.map((section) => (
        <AccordionItem
          key={section.id}
          title={`${section.title} (Custom)`}
          isOpen={openSection === section.id}
          onToggle={() => toggleSection(section.id)}
        >
          <div className="mb-4">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title</label>
             <input
               value={section.title}
               onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
               placeholder="e.g. Certifications, Volunteering"
             />
          </div>
          
          <div className="space-y-6">
            {section.items.map(item => (
              <div key={item.id} className="relative p-4 bg-gray-50 rounded border border-gray-200">
                <button
                    onClick={() => deleteCustomItem(section.id, item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 gap-3">
                   <input
                      placeholder="Item Name (e.g. Certificate Name)"
                      value={item.name}
                      onChange={(e) => updateCustomItem(section.id, item.id, 'name', e.target.value)}
                      className="font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                   />
                   <input
                      placeholder="Subtitle (e.g. Issuer)"
                      value={item.subtitle}
                      onChange={(e) => updateCustomItem(section.id, item.id, 'subtitle', e.target.value)}
                      className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                   />
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase text-gray-500">Start Date (Optional)</label>
                        <input
                          type="month"
                          value={item.startDate}
                          onChange={(e) => updateCustomItem(section.id, item.id, 'startDate', e.target.value)}
                          className="w-full text-sm bg-white border border-gray-300 rounded p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase text-gray-500">End Date (Optional)</label>
                        <input
                          type="month"
                          value={item.endDate}
                          onChange={(e) => updateCustomItem(section.id, item.id, 'endDate', e.target.value)}
                          className="w-full text-sm bg-white border border-gray-300 rounded p-1"
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Description..."
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateCustomItem(section.id, item.id, 'description', e.target.value)}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
              </div>
            ))}
            <button
                onClick={() => addCustomItem(section.id)}
                className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Plus size={16}/> Add Item to {section.title}
            </button>
          </div>
        </AccordionItem>
      ))}

      <AccordionItem
        title="Skills"
        isOpen={openSection === 'skills'}
        onToggle={() => toggleSection('skills')}
      >
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Skills (comma separated)
          </label>
          <textarea
            rows={4}
            value={data.skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="React, TypeScript, Leadership, ..."
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </AccordionItem>
    </div>
  );
};