import { forwardRef } from 'react';
import { PaperData } from './types';

interface PaperProps {
  data: PaperData;
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(({ data }, ref) => {
  const halfLength = Math.ceil(data.questions.length / 2);
  const leftColumnQuestions = data.questions.slice(0, halfLength);
  const rightColumnQuestions = data.questions.slice(halfLength);

  return (
    <div 
      ref={ref}
      className="bg-white shadow-2xl relative overflow-hidden paper-page"
      style={{ 
        width: '794px', 
        height: '1123px',
        padding: '28px 36px 40px 36px',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div style={{ opacity: 0.05, transform: 'rotate(-25deg)' }}>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="140" height="140">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#000000" strokeWidth="8" />
              <circle cx="100" cy="58" r="11" fill="#000000" />
              <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="22" 
                    strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", fontSize: '80px', fontWeight: 900, letterSpacing: '-3px', lineHeight: '1', marginTop: '8px' }}>
              Aakash
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px', marginTop: '8px' }}>
              Medical|IIT-JEE|Foundations
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col" style={{ zIndex: 1 }}>
        {/* Header Section */}
        <div className="flex justify-between items-start" style={{ marginBottom: '6px' }}>
          {/* Left Tag - Date */}
          <div className="border border-black px-3 py-1" style={{ borderWidth: '1px' }}>
            <span className="font-bold" style={{ fontSize: '11px' }}>{data.date}</span>
          </div>

          {/* Center Logo Complex */}
          <div className="flex flex-col items-center flex-1" style={{ marginTop: '-2px' }}>
            {/* Circular Emblem Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="44" height="44">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#000000" strokeWidth="8" />
              <circle cx="100" cy="58" r="11" fill="#000000" />
              <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="22" 
                    strokeLinecap="round" />
            </svg>
            {/* Logotype */}
            <div style={{ fontFamily: "'Arial Black', 'Impact', sans-serif", fontSize: '32px', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: '1', marginTop: '2px' }}>
              Aakash
            </div>
            {/* Divider */}
            <div style={{ width: '120px', height: '0.75px', backgroundColor: '#000000', marginTop: '1px' }}></div>
            {/* Sub-text */}
            <div style={{ fontSize: '8.5px', fontWeight: 'bold', letterSpacing: '0.2px', marginTop: '2px' }}>
              Medical|IIT-JEE|Foundations
            </div>
          </div>

          {/* Right Tag - Code */}
          <div className="border border-black px-3 py-1" style={{ borderWidth: '1px' }}>
            <span className="font-bold" style={{ fontSize: '11px' }}>{data.code}</span>
          </div>
        </div>

        {/* Corporate Office Block */}
        <div className="text-center" style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '9px', lineHeight: '1.4' }}>
            <span className="font-bold">Corporate Office : </span>
            <span>Plot No. 8, Pusa Road, Sector-44, Gurugram (Haryana)-122003.</span>
          </p>
          <p style={{ fontSize: '9px' }}>Ph.+91-1244168300</p>
        </div>

        {/* Metadata Baseline */}
        <div className="flex justify-between items-center" style={{ fontSize: '11px', marginBottom: '18px' }}>
          <span className="font-bold">MM : {data.maxMarks}</span>
          <span className="text-center">{data.testName}</span>
          <span className="font-bold">Time : {data.time}</span>
        </div>

        {/* Box 1: Topics Covered */}
        <div className="border border-black" style={{ borderWidth: '1px', padding: '8px 10px', marginBottom: '10px' }}>
          <p style={{ fontSize: '10px', lineHeight: '1.6', marginBottom: '0' }}>
            <span className="font-bold">Topics Covered:</span>
          </p>
          <p style={{ fontSize: '10px', lineHeight: '1.6' }}>
            <span className="font-bold">Physics: </span>
            {data.physicsSyllabus}
          </p>
          <p style={{ fontSize: '10px', lineHeight: '1.6' }}>
            <span className="font-bold">Chemistry: </span>
            {data.chemistrySyllabus}
          </p>
          <p style={{ fontSize: '10px', lineHeight: '1.6' }}>
            <span className="font-bold">Biology: </span>
            {data.biologySyllabus}
          </p>
        </div>

        {/* Box 2: General Instructions */}
        <div className="border border-black" style={{ borderWidth: '1px', padding: '8px 10px', marginBottom: '20px' }}>
          <p className="font-bold" style={{ fontSize: '10px', marginBottom: '4px' }}>General Instructions :</p>
          <div style={{ fontSize: '10px', lineHeight: '1.5' }}>
            {data.instructions.map((instruction, index) => (
              <p key={index}>{instruction}</p>
            ))}
          </div>
        </div>

        {/* Subject Header - PHYSICS */}
        <div className="flex justify-center" style={{ marginBottom: '16px' }}>
          <div className="border border-black px-6 py-1" style={{ borderWidth: '1px' }}>
            <span className="font-bold" style={{ fontSize: '11px' }}>PHYSICS</span>
          </div>
        </div>

        {/* Two Column Question Layout */}
        <div className="flex-1" style={{ fontSize: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '56px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {leftColumnQuestions.map((question) => (
              <div key={question.id}>
                <p style={{ lineHeight: '1.6', marginBottom: '8px' }}>
                  <span className="font-bold">{question.number}. </span>
                  {question.text}
                </p>
                <div style={{ paddingLeft: '16px', lineHeight: '2.0' }}>
                  {question.options.map((option, optIndex) => (
                    <p key={optIndex}>({optIndex + 1}) {option}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {rightColumnQuestions.map((question) => (
              <div key={question.id}>
                <p style={{ lineHeight: '1.6', marginBottom: '8px' }}>
                  <span className="font-bold">{question.number}. </span>
                  {question.text}
                </p>
                <div style={{ paddingLeft: '16px', lineHeight: '2.0' }}>
                  {question.options.map((option, optIndex) => (
                    <p key={optIndex}>({optIndex + 1}) {option}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <div className="border-t border-black" style={{ borderTopWidth: '1px' }}></div>
          <p className="text-center font-bold" style={{ fontSize: '12px', marginTop: '8px' }}>{data.pageNumber}</p>
        </div>
      </div>
    </div>
  );
});

Paper.displayName = 'Paper';
