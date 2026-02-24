import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dashboard } from './Dashboard';
import { Paper } from './Paper';
import { PaperData } from './types';

// Login Component
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === 'aryanmarchuka') {
        onLogin();
      } else {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="80" height="80">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#ffffff" strokeWidth="8" />
              <circle cx="100" cy="58" r="11" fill="#ffffff" />
              <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="22" 
                    strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-1">Aakash</h1>
          <p className="text-gray-400 text-sm font-semibold">Test Paper Generator</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">Enter password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 cursor-pointer hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 Aakash Educational Services Ltd.
        </p>
      </div>
    </div>
  );
}

const defaultData: PaperData = {
  date: '25/02/2026',
  code: 'Code-C Phase-3',
  testName: 'Fortnightly Test for NEET-2026_RM(P3)_FT-08C',
  maxMarks: '720',
  time: '180 Min.',
  physicsSyllabus: 'Alternating Current, Electromagnetic Waves, Ray Optics & Optical Instruments, Wave Optics.',
  chemistrySyllabus: 'Amines (Organic Compound containing Nitrogen), The d & f-Block Elements, Coordination Compounds.',
  biologySyllabus: 'Molecular Basis of Inheritance II: From transcription to DNA fingerprinting, Microbes in Human Welfare, Organisms and Populations, Evolution, Human Health & Diseases.',
  instructions: [
    'This question paper contains 180 questions divided into four sections A, B, C and D.',
    'Section A contains 45 questions from Physics, Section B contains 45 questions from Chemistry, Section C contains 45 questions from Botany and Section D contains 45 questions from Zoology.',
    'Each question carries 4 marks. For each correct response, the candidate will get 4 marks.',
    'For each incorrect response, one mark will be deducted from the total score.',
    'No deduction from the total score will be made if no response is indicated for an item.',
    'There is only one correct response for each question.',
    'Use of calculator is not permitted.',
  ],
  questions: [
    {
      id: 'q1',
      number: 1,
      text: 'An alternating voltage V = 200√2 sin(100πt) is applied to a series LCR circuit containing a resistance R = 50Ω, an inductor of inductance L = 0.3 H and a capacitor of capacitance C = 20μF. The impedance of the circuit and the phase difference between the voltage and current in the circuit are respectively (Take π² = 10):',
      options: [
        '50Ω, tan⁻¹(1)',
        '50√2 Ω, tan⁻¹(1)',
        '100Ω, tan⁻¹(2)',
        '200Ω, tan⁻¹(3)',
      ],
    },
    {
      id: 'q2',
      number: 2,
      text: 'An electromagnetic wave travelling in the positive x-direction has a wavelength of 5 mm. The variation in the electric field occurs in the y-direction with an amplitude 66 V/m. The equations for the electric and magnetic fields as a function of x and t are given respectively by (Take c = 3 × 10⁸ m/s):',
      options: [
        'E = 66 sin[2π(6 × 10¹⁰t - x/5 × 10⁻³)] V/m, B = 2.2 × 10⁻⁷ sin[2π(6 × 10¹⁰t - x/5 × 10⁻³)] T',
        'E = 66 sin[2π(3 × 10¹⁰t - x/2.5 × 10⁻³)] V/m, B = 1.1 × 10⁻⁷ sin[2π(3 × 10¹⁰t - x/2.5 × 10⁻³)] T',
        'E = 33 sin[2π(6 × 10¹⁰t - x/5 × 10⁻³)] V/m, B = 1.1 × 10⁻⁷ sin[2π(6 × 10¹⁰t - x/5 × 10⁻³)] T',
        'E = 66 sin[2π(4 × 10¹⁰t - x/5 × 10⁻³)] V/m, B = 2.2 × 10⁻⁷ sin[2π(4 × 10¹⁰t - x/5 × 10⁻³)] T',
      ],
    },
    {
      id: 'q3',
      number: 3,
      text: 'A convex lens of focal length 20 cm and a concave lens of focal length 10 cm are placed coaxially 20 cm apart from each other. An object is placed at a distance of 60 cm in front of the convex lens. The final image formed by this combination will be at a distance from the concave lens equal to:',
      options: [
        '10 cm on the side of the object',
        '20 cm on the side of the object',
        '30 cm on the side opposite to the object',
        '15 cm on the side opposite to the object',
      ],
    },
    {
      id: 'q4',
      number: 4,
      text: 'In Young\'s double slit experiment, the slits are separated by 0.28 mm and the screen is placed at a distance of 1.4 m away from the slits. The distance between the central bright fringe and the fourth bright fringe is measured to be 1.2 cm. The wavelength of the light used in the experiment is approximately:',
      options: [
        '600 nm',
        '500 nm',
        '450 nm',
        '400 nm',
      ],
    },
  ],
  pageNumber: 1,
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'dashboard' | 'preview'>('dashboard');
  const [paperData, setPaperData] = useState<PaperData>(defaultData);
  const paperRef = useRef<HTMLDivElement>(null);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleDownload = async () => {
    if (!paperRef.current) return;
    
    const canvas = await html2canvas(paperRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Aakash_NEET_Test_Paper.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  if (view === 'dashboard') {
    return (
      <Dashboard 
        data={paperData} 
        setData={setPaperData} 
        onPreview={() => setView('preview')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 py-6 flex flex-col items-center print-container">
      {/* Action Buttons */}
      <div className="mb-4 flex gap-4 no-print">
        <button
          onClick={() => setView('dashboard')}
          className="bg-gray-600 text-white px-6 py-3 font-bold text-base hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-3 rounded cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Editor
        </button>
        <button
          onClick={handleDownload}
          className="bg-black text-white px-8 py-3 font-bold text-base hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-3 rounded cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-white text-black border-2 border-black px-8 py-3 font-bold text-base hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-3 rounded cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print PDF
        </button>
      </div>

      {/* Paper Container */}
      <Paper ref={paperRef} data={paperData} />
    </div>
  );
}
