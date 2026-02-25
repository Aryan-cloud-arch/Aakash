import { useState } from 'react';
import { PaperData, Question, Subject } from './types';
import { generateQuestions, regenerateQuestion } from './geminiService';

interface DashboardProps {
  data: PaperData;
  setData: (data: PaperData) => void;
  onPreview: () => void;
}

// Color options for subjects
const colorOptions = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Indigo', value: '#6366F1' },
];

export function Dashboard({ data, setData, onPreview }: DashboardProps) {
  const [apiKeys, setApiKeys] = useState(
    'AIzaSyChMNIbtD7yJ8v7goB_nQpmIjAwmuA5SOY\nAIzaSyAhoKGWrHVvBqfJOUzeOkorp9jNvGHO6Rs\nAIzaSyC-QUgnlMD5l1L5oU22eUtj8SZp8I0z1pM\nAIzaSyBaFuWC_eKByiUQbeoRXsif-w4kClxvN2o\nAIzaSyBKkWi_bUHVgh72H2EJ02mnuajuEMPGRTY\nAIzaSyABTT3pG0AzpZVqDAYT__vqmffD_AiZucg\nAIzaSyD5rGI-Au_BX0-MKpuoYpwuH4QAM0S7-b8\nAIzaSyCLD56UHsCkFIXfL_WOXYLVJovf49J5Cj4\nAIzaSyCKRdVIEFHiQ-DaW4kdV2oSJRYp39KmQj0'
  );
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(data.subjects[0]?.name || '');
  const [questionCount, setQuestionCount] = useState(45);
  const [questionLength, setQuestionLength] = useState<'short' | 'medium' | 'long' | 'very_long'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingQuestionId, setGeneratingQuestionId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [progressText, setProgressText] = useState('');

  // New subject form
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#3B82F6');
  
  // Count API keys
  const apiKeyCount = apiKeys.split(/[,\n]/).filter(k => k.trim() !== '').length;

  const updateField = (field: keyof PaperData, value: string | number) => {
    setData({ ...data, [field]: value });
  };

  // Subject Management
  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSubject: Subject = {
      id: newSubjectName.toLowerCase().replace(/\s+/g, '_'),
      name: newSubjectName.toUpperCase(),
      syllabus: '',
      color: newSubjectColor,
    };
    setData({
      ...data,
      subjects: [...data.subjects, newSubject],
    });
    setNewSubjectName('');
    setNewSubjectColor('#3B82F6');
  };

  const updateSubject = (subjectId: string, field: keyof Subject, value: string) => {
    setData({
      ...data,
      subjects: data.subjects.map(s => 
        s.id === subjectId ? { ...s, [field]: value } : s
      ),
    });
  };

  const deleteSubject = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    // Remove subject and its questions
    setData({
      ...data,
      subjects: data.subjects.filter(s => s.id !== subjectId),
      questions: data.questions.filter(q => q.subject !== subject.name),
    });
  };

  const moveSubject = (index: number, direction: 'up' | 'down') => {
    const newSubjects = [...data.subjects];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSubjects.length) return;
    
    [newSubjects[index], newSubjects[newIndex]] = [newSubjects[newIndex], newSubjects[index]];
    setData({ ...data, subjects: newSubjects });
  };

  // Instructions Management
  const addInstruction = () => {
    setData({
      ...data,
      instructions: [...data.instructions, ''],
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...data.instructions];
    newInstructions[index] = value;
    setData({ ...data, instructions: newInstructions });
  };

  const removeInstruction = (index: number) => {
    setData({
      ...data,
      instructions: data.instructions.filter((_, i) => i !== index),
    });
  };

  // Question Management
  const addQuestion = (subject: string) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      number: data.questions.length + 1,
      text: '',
      options: ['', '', '', ''],
      subject: subject,
    };
    
    // Insert after the last question of this subject
    const subjectOrder = data.subjects.map(s => s.name);
    const currentSubjectIndex = subjectOrder.indexOf(subject);
    
    // Find the position to insert
    let insertIndex = data.questions.length;
    for (let i = currentSubjectIndex + 1; i < subjectOrder.length; i++) {
      const nextSubjectFirstQ = data.questions.findIndex(q => q.subject === subjectOrder[i]);
      if (nextSubjectFirstQ !== -1) {
        insertIndex = nextSubjectFirstQ;
        break;
      }
    }
    
    const newQuestions = [...data.questions];
    newQuestions.splice(insertIndex, 0, newQuestion);
    
    // Renumber all questions
    newQuestions.forEach((q, idx) => {
      q.number = idx + 1;
    });
    
    setData({ ...data, questions: newQuestions });
  };

  const updateQuestion = (id: string, text: string) => {
    setData({
      ...data,
      questions: data.questions.map(q =>
        q.id === id ? { ...q, text } : q
      ),
    });
  };

  const updateQuestionSubject = (id: string, subject: string) => {
    setData({
      ...data,
      questions: data.questions.map(q =>
        q.id === id ? { ...q, subject } : q
      ),
    });
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setData({
      ...data,
      questions: data.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map((o, i) => (i === optionIndex ? value : o)) }
          : q
      ),
    });
  };

  const addOption = (questionId: string) => {
    setData({
      ...data,
      questions: data.questions.map(q =>
        q.id === questionId ? { ...q, options: [...q.options, ''] } : q
      ),
    });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setData({
      ...data,
      questions: data.questions.map(q =>
        q.id === questionId && q.options.length > 2
          ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
          : q
      ),
    });
  };

  const removeQuestion = (id: string) => {
    const newQuestions = data.questions.filter(q => q.id !== id);
    newQuestions.forEach((q, idx) => {
      q.number = idx + 1;
    });
    setData({ ...data, questions: newQuestions });
  };

  const clearSubjectQuestions = (subject: string) => {
    const newQuestions = data.questions.filter(q => q.subject !== subject);
    newQuestions.forEach((q, idx) => {
      q.number = idx + 1;
    });
    setData({ ...data, questions: newQuestions });
  };

  const clearAllQuestions = () => {
    setData({ ...data, questions: [] });
  };

  // AI Generation
  const handleGenerateQuestions = async () => {
    if (!apiKeys.trim() || !selectedSubject) return;
    
    const subject = data.subjects.find(s => s.name === selectedSubject);
    if (!subject) return;

    setIsGenerating(true);
    setStatusMessage('');
    setProgressText('');

    try {
      const newQuestions = await generateQuestions({
        apiKey: apiKeys,
        subject: selectedSubject,
        syllabus: subject.syllabus,
        count: questionCount,
        length: questionLength,
        onProgress: (progress: string) => setProgressText(progress),
      });

      // Remove existing questions of this subject
      const otherQuestions = data.questions.filter(q => q.subject !== selectedSubject);
      
      // Find position to insert based on subject order
      const subjectOrder = data.subjects.map(s => s.name);
      const currentSubjectIndex = subjectOrder.indexOf(selectedSubject);
      
      let insertIndex = otherQuestions.length;
      for (let i = currentSubjectIndex + 1; i < subjectOrder.length; i++) {
        const nextSubjectFirstQ = otherQuestions.findIndex(q => q.subject === subjectOrder[i]);
        if (nextSubjectFirstQ !== -1) {
          insertIndex = nextSubjectFirstQ;
          break;
        }
      }
      
      // Insert new questions at the correct position
      const allQuestions = [
        ...otherQuestions.slice(0, insertIndex),
        ...newQuestions,
        ...otherQuestions.slice(insertIndex),
      ];
      
      // Renumber all questions
      allQuestions.forEach((q, idx) => {
        q.number = idx + 1;
      });

      setData({ ...data, questions: allQuestions });
      setStatusMessage(`Successfully generated ${newQuestions.length} ${selectedSubject} questions!`);
    } catch (error) {
      setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Failed to generate questions'}`);
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  const handleGenerateAllSubjects = async () => {
    if (!apiKeys.trim()) return;

    setIsGenerating(true);
    setStatusMessage('');
    setProgressText('');

    try {
      let allNewQuestions: Question[] = [];

      for (let i = 0; i < data.subjects.length; i++) {
        const subject = data.subjects[i];
        setProgressText(`Generating ${subject.name}...`);

        const questions = await generateQuestions({
          apiKey: apiKeys,
          subject: subject.name,
          syllabus: subject.syllabus,
          count: questionCount,
          length: questionLength,
          onProgress: (progress: string) => setProgressText(`${subject.name}: ${progress}`),
        });

        allNewQuestions = [...allNewQuestions, ...questions];

        // Delay between subjects
        if (i < data.subjects.length - 1) {
          setProgressText(`Completed ${subject.name}. Waiting before next subject...`);
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

      // Renumber all questions
      allNewQuestions.forEach((q, idx) => {
        q.number = idx + 1;
      });

      setData({ ...data, questions: allNewQuestions });
      setStatusMessage(`Successfully generated ${allNewQuestions.length} questions for all subjects!`);
    } catch (error) {
      setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Failed to generate questions'}`);
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  const handleRegenerateQuestion = async (question: Question) => {
    if (!apiKeys.trim()) return;

    const subject = data.subjects.find(s => s.name === question.subject);
    if (!subject) return;

    setGeneratingQuestionId(question.id);

    try {
      const newQuestion = await regenerateQuestion({
        apiKey: apiKeys,
        subject: question.subject,
        syllabus: subject.syllabus,
        length: questionLength,
      });

      setData({
        ...data,
        questions: data.questions.map(q =>
          q.id === question.id
            ? { ...q, text: newQuestion.text, options: newQuestion.options }
            : q
        ),
      });
    } catch (error) {
      setStatusMessage(`Error regenerating: ${error instanceof Error ? error.message : 'Failed'}`);
    } finally {
      setGeneratingQuestionId(null);
    }
  };

  const getSubjectColor = (subjectName: string): string => {
    const subject = data.subjects.find(s => s.name === subjectName);
    return subject?.color || '#6B7280';
  };

  const getQuestionsCountBySubject = (subjectName: string): number => {
    return data.questions.filter(q => q.subject === subjectName).length;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="50" height="50">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#ffffff" strokeWidth="8" />
              <circle cx="100" cy="58" r="11" fill="#ffffff" />
              <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="22" 
                    strokeLinecap="round" />
            </svg>
            <div>
              <h1 className="text-2xl font-black">Aakash Test Paper Generator</h1>
              <p className="text-gray-400 text-sm">Dashboard</p>
            </div>
          </div>
          <button
            onClick={onPreview}
            className="bg-white text-black px-6 py-3 font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview & Download
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-xl shadow-xl p-6 space-y-8">
          
          {/* Basic Details */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Basic Details
            </h2>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Code & Phase</label>
                <input
                  type="text"
                  value={data.code}
                  onChange={(e) => updateField('code', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Page Number</label>
                <input
                  type="number"
                  value={data.pageNumber}
                  onChange={(e) => updateField('pageNumber', parseInt(e.target.value) || 1)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Marks (MM)</label>
                <input
                  type="text"
                  value={data.maxMarks}
                  onChange={(e) => updateField('maxMarks', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  value={data.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Test Name */}
          <section>
            <h2 className="text-lg font-bold mb-4">Test Name</h2>
            <input
              type="text"
              value={data.testName}
              onChange={(e) => updateField('testName', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
              placeholder="e.g., Fortnightly Test for NEET-2026_RM(P3)_FT-08C"
            />
          </section>

          {/* Subjects Management */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Subjects & Syllabus
            </h2>

            {/* Add New Subject */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-sm mb-3">Add New Subject</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Subject name (e.g., Mathematics)"
                  className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                />
                <select
                  value={newSubjectColor}
                  onChange={(e) => setNewSubjectColor(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none"
                >
                  {colorOptions.map(c => (
                    <option key={c.value} value={c.value}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={addSubject}
                  disabled={!newSubjectName.trim()}
                  className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  + Add Subject
                </button>
              </div>
            </div>

            {/* Subject List */}
            <div className="space-y-4">
              {data.subjects.map((subject, index) => (
                <div 
                  key={subject.id} 
                  className="border-2 rounded-lg p-4"
                  style={{ borderColor: subject.color }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* Move buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveSubject(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-black disabled:opacity-30 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveSubject(index, 'down')}
                        disabled={index === data.subjects.length - 1}
                        className="text-gray-400 hover:text-black disabled:opacity-30 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Subject badge */}
                    <span 
                      className="px-3 py-1 rounded-full text-white text-sm font-bold"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.name}
                    </span>
                    
                    {/* Question count */}
                    <span className="text-gray-500 text-sm">
                      ({getQuestionsCountBySubject(subject.name)} questions)
                    </span>
                    
                    {/* Color selector */}
                    <select
                      value={subject.color}
                      onChange={(e) => updateSubject(subject.id, 'color', e.target.value)}
                      className="ml-auto border border-gray-200 rounded px-2 py-1 text-sm"
                    >
                      {colorOptions.map(c => (
                        <option key={c.value} value={c.value}>{c.name}</option>
                      ))}
                    </select>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Syllabus textarea */}
                  <textarea
                    value={subject.syllabus}
                    onChange={(e) => updateSubject(subject.id, 'syllabus', e.target.value)}
                    placeholder={`Enter ${subject.name} syllabus...`}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none text-sm"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* General Instructions */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                General Instructions
              </span>
              <button
                onClick={addInstruction}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
              >
                + Add Instruction
              </button>
            </h2>
            <div className="space-y-2">
              {data.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-black focus:outline-none text-sm"
                    placeholder="Enter instruction..."
                  />
                  <button
                    onClick={() => removeInstruction(index)}
                    className="text-red-500 hover:text-red-700 px-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* AI Question Generator */}
          <section className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Question Generator (Gemini)
              {apiKeyCount > 1 && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  🚀 {apiKeyCount} API Keys (Parallel Processing)
                </span>
              )}
            </h2>
            
            {/* API Keys - Textarea for multiple keys */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Gemini API Keys 
                <span className="text-gray-500 font-normal ml-2">
                  (Enter multiple keys separated by comma or newline for parallel processing)
                </span>
              </label>
              <div className="flex gap-2">
                <textarea
                  value={showApiKeys ? apiKeys : apiKeys.split(/[,\n]/).map(() => '••••••••').join('\n')}
                  onChange={(e) => setApiKeys(e.target.value)}
                  onFocus={() => setShowApiKeys(true)}
                  className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none font-mono text-sm"
                  placeholder="Enter your Gemini API keys (one per line or comma-separated)&#10;e.g.:&#10;AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&#10;AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
                  rows={4}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowApiKeys(!showApiKeys)}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    {showApiKeys ? '🙈' : '👁️'}
                  </button>
                  {apiKeyCount > 0 && (
                    <div className="px-3 py-2 bg-purple-100 rounded-lg text-center">
                      <span className="text-purple-800 font-bold text-lg">{apiKeyCount}</span>
                      <span className="text-purple-600 text-xs block">keys</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Using multiple API keys distributes requests across them, avoiding rate limits and enabling faster generation.
              </p>
            </div>

            {/* Generation Options */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                >
                  {data.subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">No. of Questions</label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                  min={1}
                  max={100}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Question Length</label>
                <select
                  value={questionLength}
                  onChange={(e) => setQuestionLength(e.target.value as 'short' | 'medium' | 'long' | 'very_long')}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
                >
                  <option value="short">Short (1-2 sentences)</option>
                  <option value="medium">Medium (2-3 sentences)</option>
                  <option value="long">Long (3-5 sentences)</option>
                  <option value="very_long">Very Long (5-8 sentences)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating || !apiKeys.trim()}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>

            {/* Generate All & Clear */}
            <div className="flex gap-3">
              <button
                onClick={handleGenerateAllSubjects}
                disabled={isGenerating || !apiKeys.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? 'Generating...' : `Generate Complete Paper (${data.subjects.length * questionCount} Qs)`}
                {apiKeyCount > 1 && !isGenerating && ` — ${apiKeyCount} keys parallel`}
              </button>
              <button
                onClick={clearAllQuestions}
                className="bg-red-100 text-red-600 px-4 py-3 rounded-lg font-semibold hover:bg-red-200 cursor-pointer"
              >
                Clear All Questions
              </button>
            </div>

            {/* Progress */}
            {progressText && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="animate-spin w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-purple-800 mb-1">⚡ Parallel Processing Active</div>
                    <div className="text-sm text-gray-700 space-y-1 font-mono bg-white/50 p-2 rounded">
                      {progressText.split('\n').map((line, i) => (
                        <div key={i} className={`${line.includes('✅') ? 'text-green-600' : line.includes('❌') ? 'text-red-600' : line.includes('🔑') ? 'text-blue-600' : ''}`}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            {statusMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                statusMessage.startsWith('Error') 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {statusMessage}
              </div>
            )}
          </section>

          {/* Questions List */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions ({data.questions.length})
              </span>
              <div className="flex gap-2">
                {data.subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => addQuestion(subject.name)}
                    className="text-sm text-white px-3 py-1 rounded cursor-pointer"
                    style={{ backgroundColor: subject.color }}
                  >
                    + {subject.name}
                  </button>
                ))}
              </div>
            </h2>

            {/* Subject Counts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {data.subjects.map(subject => (
                <div 
                  key={subject.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: subject.color }}
                >
                  <span>{subject.name}: {getQuestionsCountBySubject(subject.name)}</span>
                  <button
                    onClick={() => clearSubjectQuestions(subject.name)}
                    className="hover:bg-black/20 rounded-full p-0.5 cursor-pointer"
                    title={`Clear all ${subject.name} questions`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {data.questions.map((question) => (
                <div 
                  key={question.id} 
                  className="border-2 rounded-lg p-4"
                  style={{ borderColor: getSubjectColor(question.subject) }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-bold text-lg">{question.number}.</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={question.subject}
                          onChange={(e) => updateQuestionSubject(question.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded text-white font-semibold"
                          style={{ backgroundColor: getSubjectColor(question.subject) }}
                        >
                          {data.subjects.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRegenerateQuestion(question)}
                          disabled={generatingQuestionId === question.id || !apiKeys.trim()}
                          className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        >
                          {generatingQuestionId === question.id ? (
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : '🔄'} Regenerate
                        </button>
                      </div>
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
                        rows={2}
                        placeholder="Enter question text..."
                      />
                    </div>
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Options */}
                  <div className="ml-8 space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">({optIndex + 1})</span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                          className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() => removeOption(question.id, optIndex)}
                            className="text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addOption(question.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
