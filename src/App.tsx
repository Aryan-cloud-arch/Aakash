import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dashboard } from './Dashboard';
import { Paper } from './Paper';
import { PaperData, Subject } from './types';
import { allQuestions } from './questionBank';
import './premium.css';

// ═══════════════════════════════════════════════════════════════
// GATE 1 — Ultra Premium Light Theme (Warm Ivory + Subtle Gold)
// ═══════════════════════════════════════════════════════════════
function Gate1({ onPass }: { onPass: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (password === 'mumbai') {
        onPass();
      } else {
        setError('The city whispers... but that\'s not its name. Try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F2F0EC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating gradient orbs */}
      <div className="gate1-orb-1" style={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(199,178,153,0.25) 0%, rgba(199,178,153,0.08) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="gate1-orb-2" style={{
        position: 'absolute', bottom: '-20%', left: '-15%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,160,130,0.2) 0%, rgba(180,160,130,0.05) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="gate1-orb-3" style={{
        position: 'absolute', top: '40%', left: '60%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(215,200,180,0.15) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
      }} />

      <div className="gate1-container" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Gate Badge */}
        <div className="gate-badge" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            padding: '10px 24px',
            borderRadius: '100px',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          }}>
            <div style={{
              width: '7px', height: '7px',
              background: 'linear-gradient(135deg, #C4A265, #D4B878)',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(196,162,101,0.5)',
            }} />
            <span style={{
              color: '#8C8279',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase' as const,
            }}>Gate 1 of 2</span>
          </div>
        </div>

        {/* Logo */}
        <div className="gate1-logo" style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
            {/* Glow ring behind logo */}
            <div style={{
              position: 'absolute', inset: '-8px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(196,162,101,0.12) 0%, transparent 70%)',
            }} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="72" height="72" style={{ position: 'relative' }}>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#2C2824" strokeWidth="5" />
              <circle cx="100" cy="58" r="11" fill="#2C2824" />
              <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" fill="none" stroke="#2C2824" strokeWidth="22" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="gate1-title" style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#1A1714',
            letterSpacing: '-0.5px',
            marginBottom: '6px',
          }}>Aakash</h1>
          <p style={{
            color: '#A09890',
            fontSize: '12.5px',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase' as const,
          }}>Test Paper Generator</p>
        </div>

        {/* Poetic Hint Card */}
        <div className="gate1-hint" style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          border: '1px solid rgba(0,0,0,0.04)',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 8px 40px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #E8DDD0, #D4C8B8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px',
            }}>✦</div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase' as const,
              color: '#A09890',
            }}>A Whispered Riddle</span>
          </div>
          <p style={{
            color: '#3D3530',
            fontSize: '15.5px',
            fontStyle: 'italic',
            lineHeight: '1.75',
            fontWeight: 400,
          }}>
            Where the sea meets the city of dreams,<br/>
            Where starlight dances on silver streams,<br/>
            <span style={{ fontWeight: 600, color: '#1A1714' }}>Meri bhabhi</span> calls it home, they say—<br/>
            Name the city, and you'll find the way.
          </p>
          <div style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '5px', height: '5px',
              background: 'linear-gradient(135deg, #C4A265, #D4B878)',
              borderRadius: '50%',
            }} />
            <p style={{ color: '#A09890', fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.5px' }}>
              small letters only · one word
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="gate1-card" style={{
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          borderRadius: '24px',
          padding: '36px 32px',
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 12px 48px rgba(0,0,0,0.05)',
        }}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="gate1pass" style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#6B6058',
              marginBottom: '10px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
            }}>
              Your Answer
            </label>
            <div style={{ position: 'relative', marginBottom: error ? '6px' : '24px' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="gate1pass"
                className="premium-input"
                value={password}
                onChange={(e) => setPassword(e.target.value.toLowerCase())}
                style={{
                  width: '100%',
                  padding: '16px 52px 16px 18px',
                  border: error ? '1.5px solid #D4453A' : '1.5px solid rgba(0,0,0,0.06)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#1A1714',
                  background: error ? 'rgba(212,69,58,0.04)' : 'rgba(0,0,0,0.02)',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxSizing: 'border-box' as const,
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.border = '1.5px solid #B8A080';
                    e.target.style.background = 'rgba(255,255,255,0.8)';
                    e.target.style.boxShadow = '0 0 0 5px rgba(196,162,101,0.1), 0 4px 16px rgba(0,0,0,0.04)';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.border = '1.5px solid rgba(0,0,0,0.06)';
                    e.target.style.background = 'rgba(0,0,0,0.02)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Type the city name..."
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn" style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                color: '#A09890', display: 'flex', alignItems: 'center', opacity: 0.7,
              }} tabIndex={-1}>
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p style={{
                marginBottom: '18px', fontSize: '13px', color: '#C44030',
                fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(196,64,48,0.06)', padding: '10px 14px',
                borderRadius: '12px',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
            <button type="submit" disabled={isLoading} className="gate1-btn" style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              color: '#FFFFFF',
              background: isLoading
                ? '#C4B8A8'
                : 'linear-gradient(135deg, #2C2824 0%, #1A1714 50%, #3D3530 100%)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: isLoading ? 'none' : '0 4px 20px rgba(28,24,20,0.25), 0 1px 3px rgba(0,0,0,0.1)',
              fontFamily: 'inherit',
              letterSpacing: '0.3px',
            }}>
              {isLoading ? (
                <><svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Checking...</>
              ) : (
                <>Unlock Gate 1<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
              )}
            </button>
          </form>
        </div>

        <p className="gate-footer" style={{
          textAlign: 'center',
          color: 'rgba(0,0,0,0.15)',
          fontSize: '11px',
          marginTop: '36px',
          fontWeight: 500,
          letterSpacing: '1px',
        }}>© 2026 Aakash Educational Services Ltd.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GATE 2 — Ultra Premium Dark Theme (Deep Space + Aurora)
// ═══════════════════════════════════════════════════════════════
function Gate2({ onPass }: { onPass: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (password === 'aryanmarchuka') {
        onPass();
      } else {
        setError('The key doesn\'t fit. Read the verse once more.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Aurora background */}
      <div className="gate2-aurora" style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(88,86,214,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(120,80,220,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(60,50,180,0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(48,209,88,0.03) 0%, transparent 40%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Mesh grid lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Top light beam */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '1px', height: '400px',
        background: 'linear-gradient(180deg, transparent, rgba(120,100,230,0.15), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="gate2-container" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Gate Badge */}
        <div className="gate-badge" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            padding: '10px 24px',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '7px', height: '7px',
                background: 'linear-gradient(135deg, #7B68EE, #9B8AFB)',
                borderRadius: '50%',
                boxShadow: '0 0 12px rgba(123,104,238,0.6)',
              }} />
              <div className="gate2-pulse-ring" style={{
                position: 'absolute', inset: '-4px',
                border: '1px solid rgba(123,104,238,0.3)',
                borderRadius: '50%',
              }} />
            </div>
            <span style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase' as const,
            }}>Final Gate · 2 of 2</span>
          </div>
        </div>

        {/* Logo */}
        <div className="gate2-logo" style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
            {/* Glow ring behind logo */}
            <div style={{
              position: 'absolute', inset: '-12px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(123,104,238,0.1) 0%, transparent 70%)',
            }} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="72" height="72" style={{ position: 'relative' }}>
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="5" />
              <circle cx="100" cy="58" r="11" fill="rgba(255,255,255,0.85)" />
              <path d="M 55 128 C 72 122 86 102 100 85 C 114 102 128 122 145 128" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="22" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="gate2-title" style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#EEEDF5',
            letterSpacing: '-0.5px',
            marginBottom: '6px',
          }}>Aakash</h1>
          <p style={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: '12.5px',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase' as const,
          }}>Almost There...</p>
        </div>

        {/* Poetic Dedication Card */}
        <div className="gate2-hint" style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(123,104,238,0.15), rgba(155,138,251,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', border: '1px solid rgba(123,104,238,0.15)',
            }}>⟡</div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.3)',
            }}>A Sacred Trust</span>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '15.5px',
            fontStyle: 'italic',
            lineHeight: '1.75',
            fontWeight: 400,
          }}>
            Dear <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Mr. Hardin</span>, dear <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Mr. Rohan</span>,<br/>
            This room was built with you in mind,<br/>
            A vault of knowledge, one of a kind.<br/>
            I place this key into your hands alone—<br/>
            Guard it well, let it never be shown.<br/>
            For trust, once broken, can't be sewn.<br/>
            <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Speak the creator's name to enter.</span>
          </p>
          <div style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '5px', height: '5px',
              background: 'linear-gradient(135deg, #7B68EE, #9B8AFB)',
              borderRadius: '50%',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.5px' }}>
              small letters only · no spaces
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="gate2-card" style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          borderRadius: '24px',
          padding: '36px 32px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="gate2pass" style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '10px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
            }}>
              The Creator's Name
            </label>
            <div style={{ position: 'relative', marginBottom: error ? '6px' : '24px' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="gate2pass"
                className="premium-input"
                value={password}
                onChange={(e) => setPassword(e.target.value.toLowerCase())}
                style={{
                  width: '100%',
                  padding: '16px 52px 16px 18px',
                  border: error ? '1.5px solid rgba(255,69,58,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#EEEDF5',
                  background: error ? 'rgba(255,69,58,0.06)' : 'rgba(255,255,255,0.04)',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxSizing: 'border-box' as const,
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.border = '1.5px solid rgba(123,104,238,0.4)';
                    e.target.style.background = 'rgba(255,255,255,0.06)';
                    e.target.style.boxShadow = '0 0 0 5px rgba(123,104,238,0.08), 0 4px 16px rgba(0,0,0,0.2)';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.border = '1.5px solid rgba(255,255,255,0.08)';
                    e.target.style.background = 'rgba(255,255,255,0.04)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                placeholder="Enter the key..."
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn" style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', opacity: 0.7,
              }} tabIndex={-1}>
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p style={{
                marginBottom: '18px', fontSize: '13px', color: '#FF6B6B',
                fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,69,58,0.06)', padding: '10px 14px',
                borderRadius: '12px', border: '1px solid rgba(255,69,58,0.1)',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
            <button type="submit" disabled={isLoading} className="gate2-btn" style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              color: '#FFFFFF',
              background: isLoading
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #5B52D5 0%, #7B68EE 30%, #9B8AFB 60%, #8B7AEB 100%)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: isLoading
                ? 'none'
                : '0 4px 20px rgba(123,104,238,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              fontFamily: 'inherit',
              letterSpacing: '0.3px',
            }}>
              {isLoading ? (
                <><svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Verifying...</>
              ) : (
                <>Enter the Vault<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg></>
              )}
            </button>
          </form>
        </div>

        <p className="gate-footer" style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.08)',
          fontSize: '11px',
          marginTop: '36px',
          fontWeight: 500,
          letterSpacing: '1px',
        }}>© 2026 Aakash Educational Services Ltd.</p>
      </div>
    </div>
  );
}

// Combined Login Flow
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [gate, setGate] = useState(1);

  if (gate === 1) {
    return <Gate1 onPass={() => setGate(2)} />;
  }
  return <Gate2 onPass={onLogin} />;
}

// Default subjects
const defaultSubjects: Subject[] = [
  {
    id: 'physics',
    name: 'PHYSICS',
    syllabus: 'Alternating Current, Electromagnetic Waves, Ray Optics & Optical Instruments, Wave Optics.',
    color: '#3B82F6',
  },
  {
    id: 'chemistry',
    name: 'CHEMISTRY',
    syllabus: 'Amines (Organic Compound containing Nitrogen), The d & f-Block Elements, Coordination Compounds.',
    color: '#10B981',
  },
  {
    id: 'zoology',
    name: 'ZOOLOGY',
    syllabus: 'Molecular Basis of Inheritance II: From transcription to DNA fingerprinting, Evolution, Human Health & Diseases.',
    color: '#8B5CF6',
  },
  {
    id: 'botany',
    name: 'BOTANY',
    syllabus: 'Microbes in Human Welfare, Organisms and Populations.',
    color: '#F97316',
  },
];

const defaultData: PaperData = {
  date: '25/02/2026',
  code: 'Code-C Phase-3',
  testName: 'Fortnightly Test for NEET-2026_RM(P3)_FT-08C',
  maxMarks: '720',
  time: '180 Min.',
  subjects: defaultSubjects,
  instructions: [
    'This question paper contains 180 questions divided into four sections A, B, C and D.',
    'Section A contains 45 questions from Physics, Section B contains 45 questions from Chemistry, Section C contains 45 questions from Zoology and Section D contains 45 questions from Botany.',
    'Each question carries 4 marks. For each correct response, the candidate will get 4 marks.',
    'For each incorrect response, one mark will be deducted from the total score.',
    'No deduction from the total score will be made if no response is indicated for an item.',
    'There is only one correct response for each question.',
    'Use of calculator is not permitted.',
  ],
  questions: allQuestions,
  pageNumber: 1,
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'dashboard' | 'preview'>('dashboard');
  const [paperData, setPaperData] = useState<PaperData>(defaultData);
  const paperRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleDownload = async () => {
    if (!paperRef.current) return;
    const pages = paperRef.current.querySelectorAll('.paper-page');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      const canvas = await html2canvas(page, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save('Aakash_NEET_Test_Paper.pdf');
  };

  const handlePrint = () => { window.print(); };

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
      <div className="mb-4 flex gap-4 no-print">
        <button onClick={() => setView('dashboard')} className="bg-gray-600 text-white px-6 py-3 font-bold text-base hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-3 rounded cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Editor
        </button>
        <button onClick={handleDownload} className="bg-black text-white px-8 py-3 font-bold text-base hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-3 rounded cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download PDF
        </button>
        <button onClick={handlePrint} className="bg-white text-black border-2 border-black px-8 py-3 font-bold text-base hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-3 rounded cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print PDF
        </button>
      </div>
      <Paper ref={paperRef} data={paperData} />
    </div>
  );
}
