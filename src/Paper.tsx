import { forwardRef } from 'react';
import { PaperData, Question, Subject } from './types';

interface PaperProps {
  data: PaperData;
}

// Group questions by subject in the order defined by subjects array
const groupBySubject = (questions: Question[], subjects: Subject[]) => {
  const groups: { [key: string]: Question[] } = {};
  
  // Initialize groups based on subjects order
  subjects.forEach(s => {
    groups[s.name] = [];
  });
  
  questions.forEach(q => {
    if (groups[q.subject]) {
      groups[q.subject].push(q);
    }
  });
  
  return groups;
};

// Watermark component
const Watermark = () => (
  <div 
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    style={{ zIndex: 0 }}
  >
    <div style={{ opacity: 0.05, transform: 'rotate(-25deg)' }}>
      <div className="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="160" height="160">
          <circle cx="100" cy="100" r="85" fill="none" stroke="#000000" strokeWidth="8" />
          <circle cx="100" cy="58" r="11" fill="#000000" />
          <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" 
                fill="none" 
                stroke="#000000" 
                strokeWidth="22" 
                strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", fontSize: '90px', fontWeight: 900, letterSpacing: '-3px', lineHeight: '1', marginTop: '10px' }}>
          Aakash
        </div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '28px', fontWeight: 'bold', letterSpacing: '0.5px', marginTop: '10px' }}>
          Medical|IIT-JEE|Foundations
        </div>
      </div>
    </div>
  </div>
);

// Question Row component - renders a pair of questions aligned at top
const QuestionRow = ({ leftQuestion, rightQuestion }: { leftQuestion: Question | null; rightQuestion: Question | null }) => (
  <div 
    style={{ 
      display: 'flex', 
      gap: '48px',
      marginBottom: '20px',
      alignItems: 'flex-start', // Both questions align at top
    }}
  >
    {/* Left column */}
    <div style={{ flex: 1, minWidth: 0 }}>
      {leftQuestion && (
        <div>
          <p style={{ 
            lineHeight: '1.5', 
            marginBottom: '8px', 
            fontSize: '11px', 
            textAlign: 'justify' 
          }}>
            <span className="font-bold">{leftQuestion.number}. </span>
            {leftQuestion.text}
          </p>
          <div style={{ paddingLeft: '16px', lineHeight: '1.7', fontSize: '10.5px' }}>
            {leftQuestion.options.map((option, optIndex) => (
              <p key={optIndex} style={{ marginBottom: '3px' }}>({optIndex + 1}) {option}</p>
            ))}
          </div>
        </div>
      )}
    </div>
    
    {/* Right column */}
    <div style={{ flex: 1, minWidth: 0 }}>
      {rightQuestion && (
        <div>
          <p style={{ 
            lineHeight: '1.5', 
            marginBottom: '8px', 
            fontSize: '11px', 
            textAlign: 'justify' 
          }}>
            <span className="font-bold">{rightQuestion.number}. </span>
            {rightQuestion.text}
          </p>
          <div style={{ paddingLeft: '16px', lineHeight: '1.7', fontSize: '10.5px' }}>
            {rightQuestion.options.map((option, optIndex) => (
              <p key={optIndex} style={{ marginBottom: '3px' }}>({optIndex + 1}) {option}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Create pairs of questions (left, right)
const createQuestionPairs = (questions: Question[]): [Question | null, Question | null][] => {
  const pairs: [Question | null, Question | null][] = [];
  for (let i = 0; i < questions.length; i += 2) {
    pairs.push([questions[i] || null, questions[i + 1] || null]);
  }
  return pairs;
};

export const Paper = forwardRef<HTMLDivElement, PaperProps>(({ data }, ref) => {
  const groupedQuestions = groupBySubject(data.questions, data.subjects);
  
  // Build page structure
  // First page: 2 rows (4 questions) due to header
  // Other pages: 5 rows (10 questions) to ensure no overflow and proper spacing
  const rowsPerFirstPage = 2;
  const rowsPerOtherPage = 5;
  
  interface PageData {
    pageNum: number;
    subject: string;
    questionPairs: [Question | null, Question | null][];
    showHeader: boolean;
    showSubjectHeader: boolean;
  }
  
  const pages: PageData[] = [];
  let currentPageNum = 1;
  let isGlobalFirstPage = true;
  
  data.subjects.forEach((subject) => {
    const subjectQuestions = groupedQuestions[subject.name] || [];
    if (subjectQuestions.length === 0) return;
    
    // Create pairs for this subject
    const pairs = createQuestionPairs(subjectQuestions);
    let pairIndex = 0;
    let isFirstPageOfSubject = true;
    
    while (pairIndex < pairs.length) {
      const rowsPerPage = isGlobalFirstPage ? rowsPerFirstPage : rowsPerOtherPage;
      const pagePairs = pairs.slice(pairIndex, pairIndex + rowsPerPage);
      
      pages.push({
        pageNum: currentPageNum,
        subject: subject.name,
        questionPairs: pagePairs,
        showHeader: isGlobalFirstPage,
        showSubjectHeader: isFirstPageOfSubject,
      });
      
      pairIndex += rowsPerPage;
      currentPageNum++;
      isGlobalFirstPage = false;
      isFirstPageOfSubject = false;
    }
  });

  return (
    <div ref={ref}>
      {pages.map((page, pageIndex) => {
        const isFirstPage = page.showHeader;
        
        return (
          <div 
            key={pageIndex}
            className="bg-white shadow-2xl relative overflow-hidden paper-page"
            style={{ 
              width: '794px', 
              height: '1123px',
              padding: '20px 30px 28px 30px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              marginBottom: '24px',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
              pageBreakInside: 'avoid',
            }}
          >
            <Watermark />
            
            <div className="relative flex flex-col" style={{ zIndex: 1, height: '100%' }}>
              {isFirstPage ? (
                <>
                  {/* Header Section */}
                  <div className="flex justify-between items-start" style={{ marginBottom: '8px' }}>
                    <div className="border border-black px-3 py-1" style={{ borderWidth: '1.5px' }}>
                      <span className="font-bold" style={{ fontSize: '11px' }}>{data.date}</span>
                    </div>
                    <div className="flex flex-col items-center flex-1" style={{ marginTop: '-2px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="44" height="44">
                        <circle cx="100" cy="100" r="85" fill="none" stroke="#000000" strokeWidth="8" />
                        <circle cx="100" cy="58" r="11" fill="#000000" />
                        <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" 
                              fill="none" 
                              stroke="#000000" 
                              strokeWidth="22" 
                              strokeLinecap="round" />
                      </svg>
                      <div style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", fontSize: '30px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: '1', marginTop: '2px' }}>
                        Aakash
                      </div>
                      <div style={{ width: '115px', height: '1px', backgroundColor: '#000000', marginTop: '2px' }}></div>
                      <div style={{ fontSize: '8px', fontWeight: 'bold', letterSpacing: '0.2px', marginTop: '2px' }}>
                        Medical|IIT-JEE|Foundations
                      </div>
                    </div>
                    <div className="border border-black px-3 py-1" style={{ borderWidth: '1.5px' }}>
                      <span className="font-bold" style={{ fontSize: '11px' }}>{data.code}</span>
                    </div>
                  </div>

                  {/* Corporate Office */}
                  <div className="text-center" style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '9px', lineHeight: '1.3' }}>
                      <span className="font-bold">Corporate Office : </span>
                      <span>Plot No. 8, Pusa Road, Sector-44, Gurugram (Haryana)-122003.</span>
                    </p>
                    <p style={{ fontSize: '9px' }}>Ph.+91-1244168300</p>
                  </div>

                  {/* Metadata */}
                  <div className="flex justify-between items-center" style={{ fontSize: '11px', marginBottom: '14px' }}>
                    <span className="font-bold">MM : {data.maxMarks}</span>
                    <span className="text-center" style={{ fontSize: '10.5px' }}>{data.testName}</span>
                    <span className="font-bold">Time : {data.time}</span>
                  </div>

                  {/* Topics Covered - Dynamic based on subjects */}
                  <div className="border border-black" style={{ borderWidth: '1.5px', padding: '10px 12px', marginBottom: '10px' }}>
                    <p className="font-bold" style={{ fontSize: '10px', marginBottom: '5px' }}>Topics Covered:</p>
                    {data.subjects.map((subject) => (
                      <p key={subject.id} style={{ fontSize: '10px', lineHeight: '1.6' }}>
                        <span className="font-bold">{subject.name}: </span>{subject.syllabus}
                      </p>
                    ))}
                  </div>

                  {/* Instructions */}
                  <div className="border border-black" style={{ borderWidth: '1.5px', padding: '10px 12px', marginBottom: '16px' }}>
                    <p className="font-bold" style={{ fontSize: '10px', marginBottom: '5px' }}>General Instructions :</p>
                    <div style={{ fontSize: '10px', lineHeight: '1.6' }}>
                      {data.instructions.map((instruction, index) => (
                        <p key={index}>{instruction}</p>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Mini header for continuation pages */
                <div className="flex justify-between items-center" style={{ marginBottom: '16px', paddingBottom: '10px', borderBottom: '1.5px solid #000' }}>
                  <span className="font-bold" style={{ fontSize: '10px' }}>{data.testName}</span>
                  <span className="font-bold" style={{ fontSize: '10px' }}>{page.subject}</span>
                </div>
              )}

              {/* Subject Header */}
              {page.showSubjectHeader && (
                <div className="flex justify-center" style={{ marginBottom: '18px' }}>
                  <div className="border border-black px-6 py-1.5" style={{ borderWidth: '1.5px' }}>
                    <span className="font-bold" style={{ fontSize: '11px' }}>{page.subject}</span>
                  </div>
                </div>
              )}

              {/* Questions as aligned rows - flex-1 to fill remaining space */}
              <div className="flex-1" style={{ display: 'flex', flexDirection: 'column' }}>
                {page.questionPairs.map((pair, rowIndex) => (
                  <QuestionRow 
                    key={rowIndex} 
                    leftQuestion={pair[0]} 
                    rightQuestion={pair[1]} 
                  />
                ))}
              </div>

              {/* Footer - always at bottom */}
              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <div style={{ borderTop: '1.5px solid #000' }}></div>
                <p className="text-center font-bold" style={{ fontSize: '12px', marginTop: '10px' }}>{page.pageNum}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

Paper.displayName = 'Paper';
