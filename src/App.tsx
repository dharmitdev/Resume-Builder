import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface Education { degree: string; school: string; startYear: string; endYear: string; desc: string; }
interface Experience { role: string; company: string; startDate: string; endDate: string; desc: string; }
interface Project { title: string; desc: string; tech: string; link: string; }
interface ResumeData {
  name: string; jobTitle: string; email: string; phone: string; address: string; summary: string;
  linkedin: string; github: string; portfolio: string;
  education: Education[]; experience: Experience[]; skills: string[];
  projects: Project[]; certifications: string[]; languages: string[];
}

const STEPS = ['Personal', 'Education', 'Experience', 'Skills', 'Projects', 'Extras'];
const defaultData: ResumeData = {
  name: '', jobTitle: '', email: '', phone: '', address: '', summary: '',
  linkedin: '', github: '', portfolio: '',
  education: [{ degree: '', school: '', startYear: '', endYear: '', desc: '' }],
  experience: [{ role: '', company: '', startDate: '', endDate: '', desc: '' }],
  skills: [],
  projects: [{ title: '', desc: '', tech: '', link: '' }],
  certifications: [''],
  languages: ['']
};

interface ToastMessage { id: number; type: 'success' | 'error' | 'info'; msg: string; }

const ResumeT4 = ({ data, photo }: { data: ResumeData; photo: string }) => (
  <div className="t4">
    <div className="t4-header">
      {photo && <img src={photo} alt="" style={{width: 100, height: 100, borderRadius: '50%', marginBottom: 20, border: '3px solid white', objectFit: 'cover'}} />}
      <h1>{data.name || 'Your Name'}</h1>
      <div className="job-title">{data.jobTitle || 'Your Profession'}</div>
      <div className="t4-contact">
        {data.email && <div>{data.email}</div>}
        {data.phone && <div>• {data.phone}</div>}
        {data.address && <div>• {data.address}</div>}
        {data.linkedin && <div>• {data.linkedin}</div>}
      </div>
    </div>
    
    <div className="t4-content">
      <div className="t4-main">
        {data.summary && (
          <>
            <h3>Profile</h3>
            <p style={{lineHeight: 1.6, color: '#4b5563', marginBottom: 30}}>{data.summary}</p>
          </>
        )}
        
        {data.experience.length > 0 && (
          <>
            <h3>Experience</h3>
            {data.experience.map((e, i) => (
              <div key={i} className="t-item">
                <div className="t-title">{e.role}</div>
                <div className="t-org">{e.company}</div>
                <div className="t-date">{e.startDate} - {e.endDate}</div>
                <p style={{fontSize: 14, color: '#4b5563', lineHeight: 1.5}}>{e.desc}</p>
              </div>
            ))}
          </>
        )}

        {data.projects.length > 0 && (
          <>
            <h3>Projects</h3>
            {data.projects.map((p, i) => (
              <div key={i} className="t-item">
                <div className="t-title">{p.title}</div>
                <div className="t-date">{p.tech}</div>
                <p style={{fontSize: 14, color: '#4b5563', lineHeight: 1.5}}>{p.desc}</p>
              </div>
            ))}
          </>
        )}
      </div>
      
      <div className="t4-side">
        {data.skills.length > 0 && (
          <>
            <h3>Skills</h3>
            <div className="t4-skills" style={{marginBottom: 30}}>
              {data.skills.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </>
        )}
        
        {data.education.length > 0 && (
          <>
            <h3>Education</h3>
            {data.education.map((e, i) => (
              <div key={i} className="t-item">
                <div className="t-title" style={{fontSize: 14}}>{e.degree}</div>
                <div className="t-org" style={{fontSize: 13}}>{e.school}</div>
                <div className="t-date">{e.startYear} - {e.endYear}</div>
              </div>
            ))}
          </>
        )}
        
        {data.certifications.length > 0 && data.certifications[0] !== '' && (
          <>
            <h3>Certifications</h3>
            <ul style={{paddingLeft: 20, color: '#4b5563', fontSize: 14}}>
              {data.certifications.map((c, i) => c && <li key={i} style={{marginBottom: 8}}>{c}</li>)}
            </ul>
          </>
        )}
        
        {data.languages.length > 0 && data.languages[0] !== '' && (
          <>
            <h3 style={{marginTop: 30}}>Languages</h3>
            <ul style={{paddingLeft: 20, color: '#4b5563', fontSize: 14}}>
              {data.languages.map((l, i) => l && <li key={i} style={{marginBottom: 8}}>{l}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  </div>
);

const ResumeT5 = ({ data, photo }: { data: ResumeData; photo: string }) => (
  <div className="t5">
    <div className="t5-header">
       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
         <div>
            <h1>{data.name || 'Your Name'}</h1>
            <div className="job-title">{data.jobTitle || 'Your Profession'}</div>
            <div className="t5-contact">
              {data.email && <div>{data.email}</div>}
              {data.phone && <div>{data.phone}</div>}
              {data.address && <div>{data.address}</div>}
              {data.linkedin && <div>{data.linkedin}</div>}
            </div>
         </div>
         {photo && <img src={photo} alt="" style={{width: 120, height: 120, objectFit: 'cover', border: '5px solid #fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />}
       </div>
    </div>
    
    {data.summary && (
      <div style={{marginBottom: 40}}>
        <p style={{lineHeight: 1.8, color: '#404040', fontSize: 15}}>{data.summary}</p>
      </div>
    )}
    
    <div className="t5-grid">
       <div>
          {data.experience.length > 0 && (
            <>
              <h3>Professional Experience</h3>
              {data.experience.map((e, i) => (
                <div key={i} className="t-item">
                  <div className="title-row">
                    <div className="t-title">{e.role}</div>
                    <div className="t-date">{e.startDate} - {e.endDate}</div>
                  </div>
                  <div className="t-org">{e.company}</div>
                  <p style={{fontSize: 14, color: '#525252', lineHeight: 1.6}}>{e.desc}</p>
                </div>
              ))}
            </>
          )}

          {data.projects.length > 0 && (
            <>
              <h3 style={{marginTop: 40}}>Key Projects</h3>
              {data.projects.map((p, i) => (
                <div key={i} className="t-item">
                  <div className="title-row">
                    <div className="t-title">{p.title}</div>
                    <div className="t-date">{p.tech}</div>
                  </div>
                  <p style={{fontSize: 14, color: '#525252', lineHeight: 1.6}}>{p.desc}</p>
                </div>
              ))}
            </>
          )}
       </div>
       
       <div>
         {data.skills.length > 0 && (
            <>
              <h3>Core Competencies</h3>
              <div className="t5-skills" style={{marginBottom: 40}}>
                {data.skills.map((s, i) => <span key={i}>{s}</span>)}
              </div>
            </>
          )}
          
          {data.education.length > 0 && (
            <>
              <h3>Education</h3>
              {data.education.map((e, i) => (
                <div key={i} className="t-item">
                  <div className="t-title" style={{fontSize: 15}}>{e.degree}</div>
                  <div className="t-org" style={{fontSize: 14, marginBottom: 4}}>{e.school}</div>
                  <div className="t-date">{e.startYear} - {e.endYear}</div>
                </div>
              ))}
            </>
          )}
          
          {data.certifications.length > 0 && data.certifications[0] !== '' && (
            <>
              <h3>Certifications</h3>
              <ul style={{listStyle: 'none', padding: 0, color: '#525252', fontSize: 14}}>
                {data.certifications.map((c, i) => c && <li key={i} style={{marginBottom: 10, paddingLeft: 12, borderLeft: '2px solid #991b1b'}}>{c}</li>)}
              </ul>
            </>
          )}

          {data.languages.length > 0 && data.languages[0] !== '' && (
            <>
              <h3 style={{marginTop: 40}}>Languages</h3>
              <ul style={{listStyle: 'none', padding: 0, color: '#525252', fontSize: 14}}>
                {data.languages.map((l, i) => l && <li key={i} style={{marginBottom: 10, paddingLeft: 12, borderLeft: '2px solid #991b1b'}}>{l}</li>)}
              </ul>
            </>
          )}
       </div>
    </div>
  </div>
);

const ResumeT6 = ({ data, photo }: { data: ResumeData; photo: string }) => (
  <div className="t6">
    <div className="t6-container">
      <div className="t6-header">
        <div>
          <h1>{data.name || 'Your Name'}</h1>
          <div className="job-title">&gt; {data.jobTitle || 'Your Profession'} _</div>
        </div>
        <div className="t6-contact">
           {data.email && <div>{data.email}</div>}
           {data.phone && <div>{data.phone}</div>}
           {data.github && <div>{data.github}</div>}
           {data.portfolio && <div>{data.portfolio}</div>}
        </div>
      </div>
      
      {data.summary && (
        <div style={{marginBottom: 30}}>
          <h3>// About</h3>
          <p style={{lineHeight: 1.6, fontSize: 14, color: '#a7f3d0'}}>{data.summary}</p>
        </div>
      )}
      
      {data.skills.length > 0 && (
         <div style={{marginBottom: 30}}>
           <h3>// Stack</h3>
           <div className="t6-skills">
             {data.skills.map((s, i) => <span key={i}>{s}</span>)}
           </div>
         </div>
      )}
      
      <div className="t6-grid">
         {data.experience.length > 0 && (
            <div>
              <h3>// Experience</h3>
              {data.experience.map((e, i) => (
                <div key={i} className="t-item">
                  <div className="t-title">{e.role}</div>
                  <div className="t-org">@ {e.company}</div>
                  <div className="t-date">[{e.startDate} - {e.endDate}]</div>
                  <p style={{fontSize: 13, color: '#a7f3d0', lineHeight: 1.5}}>{e.desc}</p>
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div>
              <h3>// Projects</h3>
              {data.projects.map((p, i) => (
                <div key={i} className="t-item">
                  <div className="t-title">{p.title}</div>
                  <div className="t-date">[{p.tech}]</div>
                  <p style={{fontSize: 13, color: '#a7f3d0', lineHeight: 1.5}}>{p.desc}</p>
                </div>
              ))}
            </div>
          )}
          
          {data.education.length > 0 && (
            <div>
              <h3>// Education</h3>
              {data.education.map((e, i) => (
                <div key={i} className="t-item">
                  <div className="t-title" style={{fontSize: 16}}>{e.degree}</div>
                  <div className="t-org">@ {e.school}</div>
                  <div className="t-date">[{e.startYear} - {e.endYear}]</div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  </div>
);

const ResumeT9 = ({ data }: { data: ResumeData }) => (
  <div className="t9">
    <div className="t9-header">
      <h1>{data.name || 'Your Name'}</h1>
      <div className="job-title">{data.jobTitle || 'Your Profession'}</div>
      
      <div className="t9-contact">
        {data.phone && <div>{data.phone}</div>}
        {data.phone && data.email && <div>•</div>}
        {data.email && <div>{data.email}</div>}
        {data.email && data.address && <div>•</div>}
        {data.address && <div>{data.address}</div>}
        {data.address && data.linkedin && <div>•</div>}
        {data.linkedin && <div>{data.linkedin}</div>}
      </div>
    </div>
    
    {data.summary && (
      <div className="t9-section">
        <h3>About Me</h3>
        <p className="t9-summary">{data.summary}</p>
      </div>
    )}
    
    {data.education.length > 0 && (
      <div className="t9-section">
        <h3>Education</h3>
        {data.education.map((e, i) => (
          <div key={i} className="t-item">
            <div className="t-org-row">
              <div>{e.school}</div>
              <span>{e.endYear}</span>
            </div>
            <div className="t-title">{e.degree}</div>
          </div>
        ))}
      </div>
    )}
    
    {data.experience.length > 0 && (
      <div className="t9-section">
        <h3>Work Experience</h3>
        {data.experience.map((e, i) => (
          <div key={i} className="t-item">
            <div className="t-org-row">
              <div>{e.company}</div>
              <span>{e.startDate} - {e.endDate}</span>
            </div>
            <div className="t-title">{e.role}</div>
            <p className="t-desc">{e.desc}</p>
          </div>
        ))}
      </div>
    )}
    
    {data.skills.length > 0 && (
      <div className="t9-section">
        <h3>Skills</h3>
        <ul className="skills-grid">
          {data.skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    )}
  </div>
);

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState<'t1' | 't2' | 't3' | 't4' | 't5' | 't6' | 't9'>('t1');
  const [data, setData] = useState<ResumeData>(defaultData);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const builderRef = useRef<HTMLElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({
          ...defaultData,
          ...parsed,
          education: parsed.education?.length ? parsed.education : defaultData.education,
          experience: parsed.experience?.length ? parsed.experience : defaultData.experience,
          projects: parsed.projects?.length ? parsed.projects : defaultData.projects,
          certifications: parsed.certifications?.length ? parsed.certifications : defaultData.certifications,
          languages: parsed.languages?.length ? parsed.languages : defaultData.languages,
        });
      } catch (e) {
        // ignore
      }
    }
    const savedPhoto = localStorage.getItem('resumePhoto');
    if (savedPhoto) setPhotoDataUrl(savedPhoto);

    document.documentElement.setAttribute('data-theme', 'dark');

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        loadFromCloud(u.uid);
      }
    });

    // Test offline connection to firestore according to best practices
    getDoc(doc(db, 'test', 'connection')).catch(e => {
       if (e instanceof Error && e.message.includes('the client is offline')) {
           console.error("Please check your Firebase configuration.");
       }
    });

    return () => unsubscribe();
  }, []);

  const loadFromCloud = async (uid: string) => {
    setIsLoadingCloud(true);
    try {
      const d = await getDoc(doc(db, 'users', uid, 'resume', 'data'));
      if (d.exists()) {
        const dbData = d.data();
        setData({
          ...defaultData,
          name: dbData.name || '',
          jobTitle: dbData.jobTitle || '',
          email: dbData.email || '',
          phone: dbData.phone || '',
          address: dbData.address || '',
          summary: dbData.summary || '',
          linkedin: dbData.linkedin || '',
          github: dbData.github || '',
          portfolio: dbData.portfolio || '',
          education: JSON.parse(dbData.education || '[]').length ? JSON.parse(dbData.education || '[]') : defaultData.education,
          experience: JSON.parse(dbData.experience || '[]').length ? JSON.parse(dbData.experience || '[]') : defaultData.experience,
          skills: dbData.skills || [],
          projects: JSON.parse(dbData.projects || '[]').length ? JSON.parse(dbData.projects || '[]') : defaultData.projects,
          certifications: dbData.certifications || [''],
          languages: dbData.languages || [''],
        });
        if (dbData.photo) setPhotoDataUrl(dbData.photo);
        showToast('success', 'Resume loaded from cloud');
      }
    } catch (err: any) {
      console.error(err);
      if(err.message.includes('Missing or insufficient permissions')) {
        showToast('error', 'Sync failed. Permission denied.');
      }
    } finally {
      setIsLoadingCloud(false);
    }
  };

  const saveToCloud = async (uid: string) => {
    try {
      await setDoc(doc(db, 'users', uid, 'resume', 'data'), {
        userId: uid,
        name: data.name,
        jobTitle: data.jobTitle,
        email: data.email,
        phone: data.phone,
        address: data.address,
        summary: data.summary,
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio,
        education: JSON.stringify(data.education),
        experience: JSON.stringify(data.experience),
        skills: data.skills,
        projects: JSON.stringify(data.projects),
        certifications: data.certifications,
        languages: data.languages,
        photo: photoDataUrl || '',
        updatedAt: serverTimestamp()
      });
      console.log('Saved to cloud');
    } catch (err: any) {
      console.error(err);
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (isLoadingCloud) return; // don't sync while loading from cloud

    const timeoutId = setTimeout(() => {
      localStorage.setItem('resumeData', JSON.stringify(data));
      if (photoDataUrl) localStorage.setItem('resumePhoto', photoDataUrl);
      else localStorage.removeItem('resumePhoto');

      if (user) {
        saveToCloud(user.uid);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [data, photoDataUrl, user, isLoadingCloud]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    showToast('info', 'Logged out');
  };

  const showToast = (type: 'success' | 'error' | 'info', msg: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, disappearing: true } : t) as any);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 3000);
  };

  const scrollToBuilder = () => builderRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPhotoDataUrl(ev.target.result as string);
        showToast('success', 'Photo uploaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadPDF = () => {
    if (!data.name) {
      showToast('error', 'Please enter your name before downloading');
      return;
    }
    showToast('info', 'Generating PDF...');
    const el = document.getElementById('resumeOutput');
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      showToast('error', 'PDF generator not loaded yet. Please try again.');
      return;
    }
    const opt = {
      margin: 0,
      filename: `${data.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(el).save().then(() => {
      showToast('success', 'PDF downloaded successfully! 🎉');
    });
  };

  const pct = Math.round((currentStep / STEPS.length) * 100);

  let score = 0;
  if (data.name) score += 15;
  if (data.jobTitle) score += 5;
  if (data.email) score += 5;
  if (data.summary && data.summary.length > 30) score += 10;
  if (data.education.some(e => e.degree && e.school)) score += 15;
  if (data.experience.some(e => e.role && e.company)) score += 20;
  if (data.skills.length >= 3) score += 15;
  if (data.projects.some(p => p.title)) score += 10;
  if (data.linkedin || data.github || data.portfolio) score += 5;

  const scoreTitles = ['Getting started', 'Looking good!', 'Nice progress', 'Great resume!', 'Outstanding! 🎉'];
  const scoreDescs = ['Add your name and job title', 'Keep going — add more details', 'Almost there — fill in skills', 'Your resume looks professional', 'Perfect score — ready to download!'];
  const scoreIdx = Math.min(4, Math.floor(score / 25));

  const addSkill = () => {
    if (!skillInputRef.current) return;
    const val = skillInputRef.current.value.trim();
    if (val && !data.skills.includes(val)) {
      setData({ ...data, skills: [...data.skills, val] });
      skillInputRef.current.value = '';
    }
  };

  const scoreDashOffset = 150.8 - (score / 100) * 150.8;

  return (
    <div>
      <nav className="nav">
        <div className="nav-logo">resumé.io</div>
        <div className="nav-right">
          <button className="theme-btn" onClick={() => setIsDark(!isDark)}>
            <span>{isDark ? '☀️' : '🌙'}</span> <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          {user ? (
            <button className="nav-cta" onClick={logout}>Sign Out ({user.displayName?.split(' ')[0] || user.email})</button>
          ) : (
            <button className="nav-cta" onClick={login}>Sign In to Save</button>
          )}
          <button className="nav-cta" onClick={scrollToBuilder}>Build</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="blob blob3"></div>
          <div className="grid-overlay"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-badge"><span className="badge-dot"></span> Free · No signup required</div>
          <h1>Build a Resume<br />that <span>Gets Hired</span></h1>
          <p className="hero-sub">Craft a stunning, ATS-optimized resume in minutes. Seven professional templates. Real-time preview. One-click PDF export.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={scrollToBuilder}>Start Building Now →</button>
            <button className="btn-outline" onClick={scrollToBuilder}>View Templates</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">7</div><div className="stat-label">Pro Templates</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">ATS Friendly</div></div>
            <div className="stat"><div className="stat-num">PDF</div><div className="stat-label">Export Ready</div></div>
          </div>
        </div>
      </section>

      <section className="builder-section" id="builder" ref={builderRef}>
        <div className="section-header">
          <h2>Build Your Resume</h2>
          <p>Fill in the details and watch your resume come to life</p>
        </div>

        <div className="progress-container">
          <div className="progress-steps">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div 
                  className={`step-circle ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
                  onClick={() => { if (i <= currentStep + 1) setCurrentStep(i); }}
                >
                  {i < currentStep ? '✓' : (i + 1)}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-line ${i < currentStep ? 'done' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="progress-info">
            <div className="progress-pct">{pct}%</div>
            <div className="progress-label">Complete</div>
          </div>
          <div className="progress-bar-outer">
            <div className="progress-bar-inner" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        <div className="score-bar">
          <svg className="score-circle" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24" fill="none" stroke="var(--border)" strokeWidth="4" />
            <circle 
              cx="30" cy="30" r="24" fill="none" 
              stroke={score > 70 ? 'var(--green)' : score > 40 ? 'var(--gold)' : 'var(--accent2)'} 
              strokeWidth="4" strokeDasharray="150.8" 
              strokeDashoffset={scoreDashOffset} strokeLinecap="round" 
              style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
            <text x="30" y="30" className="score-text">{score}</text>
          </svg>
          <div className="score-info">
            <div className="score-title">{scoreTitles[scoreIdx]}</div>
            <div className="score-desc">{scoreDescs[scoreIdx]}</div>
          </div>
        </div>

        <div className="builder-layout">
          <div className="form-panel">
            <div className="form-tabs">
              {STEPS.map((s, i) => (
                <div key={s} className={`form-tab ${i === currentStep ? 'active' : ''}`} onClick={() => setCurrentStep(i)}>
                  {s}
                </div>
              ))}
            </div>
            <div className="form-body">
              {currentStep === 0 && (
                <>
                  <div className="photo-upload">
                    <div className="photo-preview">
                      {photoDataUrl ? <img src={photoDataUrl} alt="Photo" /> : '👤'}
                    </div>
                    <div className="photo-info">
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Profile Photo</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>Optional · JPEG/PNG</div>
                      <button className="photo-btn" onClick={() => document.getElementById('photoInput')?.click()}>Upload Photo</button>
                      {photoDataUrl && <button className="photo-btn" style={{ marginLeft: '8px' }} onClick={() => setPhotoDataUrl('')}>Remove</button>}
                    </div>
                  </div>
                  <input type="file" id="photoInput" accept="image/*" onChange={handlePhoto} />
                  
                  <div className="field-row">
                    <div className="field-group">
                      <label>Full Name *</label>
                      <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="e.g. Alexandra Chen" />
                    </div>
                    <div className="field-group">
                      <label>Job Title</label>
                      <input type="text" value={data.jobTitle} onChange={e => setData({...data, jobTitle: e.target.value})} placeholder="e.g. Senior Product Designer" />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label>Email *</label>
                      <input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="you@example.com" />
                    </div>
                    <div className="field-group">
                      <label>Phone</label>
                      <input type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Location / Address</label>
                    <input type="text" value={data.address} onChange={e => setData({...data, address: e.target.value})} placeholder="e.g. San Francisco, CA" />
                  </div>
                  <div className="field-group">
                    <label>Professional Summary</label>
                    <textarea maxLength={600} value={data.summary} onChange={e => setData({...data, summary: e.target.value})} placeholder="A passionate product designer with 5+ years..."></textarea>
                    <div className="char-count">{data.summary.length}/600</div>
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label>LinkedIn</label>
                      <input type="url" value={data.linkedin} onChange={e => setData({...data, linkedin: e.target.value})} placeholder="https://linkedin.com/in/you" />
                    </div>
                    <div className="field-group">
                      <label>GitHub</label>
                      <input type="url" value={data.github} onChange={e => setData({...data, github: e.target.value})} placeholder="https://github.com/you" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Portfolio Website</label>
                    <input type="url" value={data.portfolio} onChange={e => setData({...data, portfolio: e.target.value})} placeholder="https://yoursite.com" />
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  {data.education.map((e, i) => (
                    <div className="entry-card" key={i}>
                      <div className="entry-header">
                        <div className="entry-title">Education #{i + 1}</div>
                        {data.education.length > 1 && (
                          <button className="remove-entry" onClick={() => setData({...data, education: data.education.filter((_, idx) => idx !== i)})}>✕ Remove</button>
                        )}
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label>Degree / Qualification</label>
                          <input type="text" value={e.degree} onChange={ev => { const n = [...data.education]; n[i].degree = ev.target.value; setData({...data, education: n})}} placeholder="e.g. B.Sc. Computer Science" />
                        </div>
                        <div className="field-group">
                          <label>School / University</label>
                          <input type="text" value={e.school} onChange={ev => { const n = [...data.education]; n[i].school = ev.target.value; setData({...data, education: n})}} placeholder="e.g. MIT" />
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label>Start Year</label>
                          <input type="text" value={e.startYear} onChange={ev => { const n = [...data.education]; n[i].startYear = ev.target.value; setData({...data, education: n})}} placeholder="2018" />
                        </div>
                        <div className="field-group">
                          <label>End Year</label>
                          <input type="text" value={e.endYear} onChange={ev => { const n = [...data.education]; n[i].endYear = ev.target.value; setData({...data, education: n})}} placeholder="2022 or Present" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Description (optional)</label>
                        <textarea value={e.desc} onChange={ev => { const n = [...data.education]; n[i].desc = ev.target.value; setData({...data, education: n})}} placeholder="Relevant coursework, achievements, GPA..."></textarea>
                      </div>
                    </div>
                  ))}
                  <button className="add-entry-btn" onClick={() => setData({...data, education: [...data.education, {degree:'',school:'',startYear:'',endYear:'',desc:''}]})}>+ Add Another Education</button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {data.experience.map((e, i) => (
                    <div className="entry-card" key={i}>
                      <div className="entry-header">
                        <div className="entry-title">Experience #{i + 1}</div>
                        {data.experience.length > 1 && (
                          <button className="remove-entry" onClick={() => setData({...data, experience: data.experience.filter((_, idx) => idx !== i)})}>✕ Remove</button>
                        )}
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label>Job Title / Role</label>
                          <input type="text" value={e.role} onChange={ev => { const n = [...data.experience]; n[i].role = ev.target.value; setData({...data, experience: n})}} placeholder="e.g. Senior UX Designer" />
                        </div>
                        <div className="field-group">
                          <label>Company</label>
                          <input type="text" value={e.company} onChange={ev => { const n = [...data.experience]; n[i].company = ev.target.value; setData({...data, experience: n})}} placeholder="e.g. Google" />
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label>Start Date</label>
                          <input type="text" value={e.startDate} onChange={ev => { const n = [...data.experience]; n[i].startDate = ev.target.value; setData({...data, experience: n})}} placeholder="Jan 2020" />
                        </div>
                        <div className="field-group">
                          <label>End Date</label>
                          <input type="text" value={e.endDate} onChange={ev => { const n = [...data.experience]; n[i].endDate = ev.target.value; setData({...data, experience: n})}} placeholder="Present" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Responsibilities & Achievements</label>
                        <textarea style={{minHeight:'110px'}} value={e.desc} onChange={ev => { const n = [...data.experience]; n[i].desc = ev.target.value; setData({...data, experience: n})}} placeholder="• Led end-to-end design..."></textarea>
                      </div>
                    </div>
                  ))}
                  <button className="add-entry-btn" onClick={() => setData({...data, experience: [...data.experience, {role:'',company:'',startDate:'',endDate:'',desc:''}]})}>+ Add Another Experience</button>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="field-group">
                    <label>Your Skills</label>
                    <div className="helper-text">Add skills as individual tags. Press Enter or click Add.</div>
                    <div className="skills-area">
                      {data.skills.map((s, i) => (
                        <div className="skill-chip" key={i}>
                          {s} <span className="remove-chip" onClick={() => setData({...data, skills: data.skills.filter((_, idx) => idx !== i)})}>×</span>
                        </div>
                      ))}
                      {data.skills.length === 0 && <span style={{color:'var(--text3)', fontSize:'13px'}}>No skills added yet</span>}
                    </div>
                    <div className="skill-input-row">
                      <input type="text" ref={skillInputRef} placeholder="e.g. Figma, React, Python..." onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addSkill(); }}} />
                      <button className="add-skill-btn" onClick={addSkill}>+ Add</button>
                    </div>
                  </div>
                  <div className="field-group" style={{marginTop:'24px'}}>
                    <label>Suggested Skills</label>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px'}}>
                      {['JavaScript','Python','React','Node.js','Figma','SQL','AWS','Docker','TypeScript','Vue.js','Project Management','Communication'].map(s => (
                        <div key={s} className="skill-chip" style={{cursor:'pointer', opacity:0.7}} onClick={() => { if(!data.skills.includes(s)) { setData({...data, skills: [...data.skills, s]}); showToast('success', `"${s}" added to skills`); } }}>
                          {s} +
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  {data.projects.map((p, i) => (
                    <div className="entry-card" key={i}>
                      <div className="entry-header">
                        <div className="entry-title">Project #{i + 1}</div>
                        {data.projects.length > 1 && (
                          <button className="remove-entry" onClick={() => setData({...data, projects: data.projects.filter((_, idx) => idx !== i)})}>✕ Remove</button>
                        )}
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label>Project Title</label>
                          <input type="text" value={p.title} onChange={ev => { const n = [...data.projects]; n[i].title = ev.target.value; setData({...data, projects: n})}} placeholder="e.g. E-commerce Platform Redesign" />
                        </div>
                        <div className="field-group">
                          <label>Tech Stack Used</label>
                          <input type="text" value={p.tech} onChange={ev => { const n = [...data.projects]; n[i].tech = ev.target.value; setData({...data, projects: n})}} placeholder="e.g. React, Firebase, Tailwind" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Description</label>
                        <textarea value={p.desc} onChange={ev => { const n = [...data.projects]; n[i].desc = ev.target.value; setData({...data, projects: n})}} placeholder="Describe what you built..."></textarea>
                      </div>
                      <div className="field-group">
                        <label>Project Link</label>
                        <input type="url" value={p.link} onChange={ev => { const n = [...data.projects]; n[i].link = ev.target.value; setData({...data, projects: n})}} placeholder="https://github.com/you/project" />
                      </div>
                    </div>
                  ))}
                  <button className="add-entry-btn" onClick={() => setData({...data, projects: [...data.projects, {title:'',desc:'',tech:'',link:''}]})}>+ Add Another Project</button>
                </>
              )}

              {currentStep === 5 && (
                <>
                  <div className="field-group">
                    <label>Certifications</label>
                    <div>
                      {data.certifications.map((c, i) => (
                        <div className="lang-cert-row" key={'c'+i}>
                          <input type="text" value={c} onChange={e => { const n = [...data.certifications]; n[i] = e.target.value; setData({...data, certifications: n})}} placeholder="e.g. AWS Certified Solutions Architect" />
                          {data.certifications.length > 1 && <button onClick={() => setData({...data, certifications: data.certifications.filter((_, idx) => idx !== i)})}>×</button>}
                        </div>
                      ))}
                    </div>
                    <button className="add-simple-btn" onClick={() => setData({...data, certifications: [...data.certifications, '']})}>+ Add Certification</button>
                  </div>
                  <div className="field-group" style={{marginTop:'24px'}}>
                    <label>Languages</label>
                    <div>
                      {data.languages.map((l, i) => (
                        <div className="lang-cert-row" key={'l'+i}>
                          <input type="text" value={l} onChange={e => { const n = [...data.languages]; n[i] = e.target.value; setData({...data, languages: n})}} placeholder="e.g. English (Native), Spanish (B2)" />
                          {data.languages.length > 1 && <button onClick={() => setData({...data, languages: data.languages.filter((_, idx) => idx !== i)})}>×</button>}
                        </div>
                      ))}
                    </div>
                    <button className="add-simple-btn" onClick={() => setData({...data, languages: [...data.languages, '']})}>+ Add Language</button>
                  </div>
                </>
              )}
            </div>
            <div className="form-nav">
              <button className="btn-prev" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}>← Back</button>
              <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Step {currentStep + 1} of {STEPS.length}</span>
              <button className="btn-next" onClick={() => {
                if (currentStep === STEPS.length - 1) showToast('success', 'Resume complete! Download your PDF 🎉');
                else { setCurrentStep(currentStep + 1); document.querySelector('.form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
              }}>{currentStep === STEPS.length - 1 ? '✓ Done' : 'Next →'}</button>
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="preview-actions">
                <button className="btn-download" onClick={downloadPDF}>⬇ Download PDF</button>
              </div>
            </div>
            
            <div className="template-grid">
              <div className={`template-card ${template === 't1' ? 'selected' : ''}`} onClick={() => { setTemplate('t1'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t1">📄</div>
                <div className="template-name">Modern Minimal</div>
              </div>
              <div className={`template-card ${template === 't2' ? 'selected' : ''}`} onClick={() => { setTemplate('t2'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t2">🌿</div>
                <div className="template-name">Elegant Pro</div>
              </div>
              <div className={`template-card ${template === 't3' ? 'selected' : ''}`} onClick={() => { setTemplate('t3'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t3">✨</div>
                <div className="template-name">Creative Sidebar</div>
              </div>
              <div className={`template-card ${template === 't4' ? 'selected' : ''}`} onClick={() => { setTemplate('t4'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t4" style={{background: 'linear-gradient(135deg, #1e3a8a, #312e81)'}}>🟦</div>
                <div className="template-name">Corporate Blue</div>
              </div>
              <div className={`template-card ${template === 't5' ? 'selected' : ''}`} onClick={() => { setTemplate('t5'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t5" style={{background: 'linear-gradient(135deg, #7f1d1d, #991b1b)'}}>🟥</div>
                <div className="template-name">Executive Red</div>
              </div>
              <div className={`template-card ${template === 't6' ? 'selected' : ''}`} onClick={() => { setTemplate('t6'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t6" style={{background: 'linear-gradient(135deg, #064e3b, #065f46)'}}>🟩</div>
                <div className="template-name">Tech Emerald</div>
              </div>
              <div className={`template-card ${template === 't9' ? 'selected' : ''}`} onClick={() => { setTemplate('t9'); showToast('info', 'Template switched!'); }}>
                <div className="template-thumb template-t9" style={{background: 'linear-gradient(135deg, #e5e7eb, #4b5563)'}}>⬛</div>
                <div className="template-name">Minimalist Centered</div>
              </div>
            </div>

            <div className="resume-wrapper">
              <div id="resumeOutput" className={template}>
                {template === 't1' && <ResumeT1 data={data} photo={photoDataUrl} />}
                {template === 't2' && <ResumeT2 data={data} photo={photoDataUrl} />}
                {template === 't3' && <ResumeT3 data={data} photo={photoDataUrl} />}
                {template === 't4' && <ResumeT4 data={data} photo={photoDataUrl} />}
                {template === 't5' && <ResumeT5 data={data} photo={photoDataUrl} />}
                {template === 't6' && <ResumeT6 data={data} photo={photoDataUrl} />}
                {template === 't9' && <ResumeT9 data={data} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="toast-container" id="toastContainer">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item ${t.type}`} style={{ animation: (t as any).disappearing ? 'slideOut 0.3s ease forwards' : undefined }}>
            <span className="toast-icon">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumeT1({ data, photo }: { data: ResumeData; photo: string }) {
  return (
    <>
      <div className="r-header">
        <div>
          <div className="r-name">{data.name || 'Your Name'}</div>
          <div className="r-title">{data.jobTitle || ''}</div>
          <div className="r-contact" style={{ marginTop: '12px', alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: '8px 16px' }}>
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.address && <span>{data.address}</span>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {data.github && <a href={data.github} target="_blank" rel="noreferrer">GitHub</a>}
            {data.portfolio && <a href={data.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
          </div>
        </div>
        {photo && <img className="r-photo" src={photo} alt="Photo" />}
      </div>
      <div className="r-body">
        <div className="r-main">
          {data.summary && <div className="r-section"><div className="r-sec-title">Summary</div><div className="r-summary">{data.summary}</div></div>}
          {data.experience.some(e => e.role || e.company) && (
            <div className="r-section">
              <div className="r-sec-title">Experience</div>
              {data.experience.filter(e => e.role || e.company).map((e, i) => (
                <div className="r-entry" key={i}>
                  <div className="r-entry-head">
                    <div className="r-entry-title">{e.role}</div>
                    <div className="r-entry-date">{e.startDate}{e.endDate ? ' – ' + e.endDate : ''}</div>
                  </div>
                  <div className="r-entry-sub">{e.company}</div>
                  {e.desc && <div className="r-entry-desc">{e.desc}</div>}
                </div>
              ))}
            </div>
          )}
          {data.education.some(e => e.degree || e.school) && (
            <div className="r-section">
              <div className="r-sec-title">Education</div>
              {data.education.filter(e => e.degree || e.school).map((e, i) => (
                <div className="r-entry" key={i}>
                  <div className="r-entry-head">
                    <div className="r-entry-title">{e.degree}</div>
                    <div className="r-entry-date">{e.startYear}{e.endYear ? ' – ' + e.endYear : ''}</div>
                  </div>
                  <div className="r-entry-sub">{e.school}</div>
                  {e.desc && <div className="r-entry-desc">{e.desc}</div>}
                </div>
              ))}
            </div>
          )}
          {data.projects.some(p => p.title) && (
            <div className="r-section">
              <div className="r-sec-title">Projects</div>
              {data.projects.filter(p => p.title).map((p, i) => (
                <div className="r-entry" key={i}>
                  <div className="r-entry-head">
                    <div className="r-entry-title">{p.title}</div>
                    {p.link && <a href={p.link} className="r-link r-entry-date" target="_blank" rel="noreferrer">Link ↗</a>}
                  </div>
                  {p.tech && <div className="r-entry-sub">{p.tech}</div>}
                  {p.desc && <div className="r-entry-desc">{p.desc}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="r-side">
          {data.skills.length > 0 && (
            <div className="r-section">
              <div className="r-sec-title">Skills</div>
              {data.skills.map((s, i) => <span key={i} className="r-skill-chip">{s}</span>)}
            </div>
          )}
          {data.certifications.some(Boolean) && (
            <div className="r-section">
              <div className="r-sec-title">Certifications</div>
              {data.certifications.filter(Boolean).map((c, i) => <div key={i} className="r-side-item">{c}</div>)}
            </div>
          )}
          {data.languages.some(Boolean) && (
            <div className="r-section">
              <div className="r-sec-title">Languages</div>
              {data.languages.filter(Boolean).map((l, i) => <div key={i} className="r-side-item">{l}</div>)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ResumeT2({ data, photo }: { data: ResumeData; photo: string }) {
  return (
    <>
      <div className="r-header">
        <div className="r-header-top">
          {photo && <img className="r-photo" src={photo} alt="Photo" />}
          <div>
            <div className="r-name">{data.name || 'Your Name'}</div>
            <div className="r-title">{data.jobTitle || ''}</div>
          </div>
        </div>
        <div className="r-contact-row">
          {data.email && <div className="r-contact-item">✉ {data.email}</div>}
          {data.phone && <div className="r-contact-item">📞 {data.phone}</div>}
          {data.address && <div className="r-contact-item">📍 {data.address}</div>}
          {data.linkedin && <div className="r-contact-item"><a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>}
          {data.github && <div className="r-contact-item"><a href={data.github} target="_blank" rel="noreferrer">GitHub ↗</a></div>}
          {data.portfolio && <div className="r-contact-item"><a href={data.portfolio} target="_blank" rel="noreferrer">Portfolio ↗</a></div>}
        </div>
      </div>
      <div className="r-body">
        {data.summary && <div className="r-section"><div className="r-sec-title">Profile</div><div className="r-summary">{data.summary}</div></div>}
        {data.experience.some(e => e.role || e.company) && (
          <div className="r-section">
            <div className="r-sec-title">Work Experience</div>
            {data.experience.filter(e => e.role || e.company).map((e, i) => (
              <div className="r-entry" key={i}>
                <div className="r-entry-head">
                  <div className="r-entry-title">{e.role}</div>
                  <div className="r-entry-date">{e.startDate}{e.endDate ? ' – ' + e.endDate : ''}</div>
                </div>
                <div className="r-entry-sub">{e.company}</div>
                {e.desc && <div className="r-entry-desc">{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {data.education.some(e => e.degree || e.school) && (
          <div className="r-section">
            <div className="r-sec-title">Education</div>
            {data.education.filter(e => e.degree || e.school).map((e, i) => (
              <div className="r-entry" key={i}>
                <div className="r-entry-head">
                  <div className="r-entry-title">{e.degree}</div>
                  <div className="r-entry-date">{e.startYear}{e.endYear ? ' – ' + e.endYear : ''}</div>
                </div>
                <div className="r-entry-sub">{e.school}</div>
                {e.desc && <div className="r-entry-desc">{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div className="r-section">
            <div className="r-sec-title">Skills</div>
            <div className="r-skills-grid">
              {data.skills.map((s, i) => <div key={i} className="r-skill-chip">{s}</div>)}
            </div>
          </div>
        )}
        {data.projects.some(p => p.title) && (
          <div className="r-section">
            <div className="r-sec-title">Projects</div>
            {data.projects.filter(p => p.title).map((p, i) => (
              <div className="r-entry" key={i}>
                <div className="r-entry-head">
                  <div className="r-entry-title">{p.title}</div>
                  {p.link && <a href={p.link} className="r-link r-entry-date" target="_blank" rel="noreferrer">Link ↗</a>}
                </div>
                {p.tech && <div className="r-entry-sub">{p.tech}</div>}
                {p.desc && <div className="r-entry-desc">{p.desc}</div>}
              </div>
            ))}
          </div>
        )}
        {data.certifications.some(Boolean) && (
          <div className="r-section">
            <div className="r-sec-title">Certifications</div>
            {data.certifications.filter(Boolean).map((c, i) => <div key={i} className="r-entry-desc" style={{marginBottom: '6px'}}>• {c}</div>)}
          </div>
        )}
        {data.languages.some(Boolean) && (
          <div className="r-section">
            <div className="r-sec-title">Languages</div>
            {data.languages.filter(Boolean).map((l, i) => <div key={i} className="r-entry-desc" style={{marginBottom: '6px'}}>• {l}</div>)}
          </div>
        )}
      </div>
    </>
  );
}

function ResumeT3({ data, photo }: { data: ResumeData; photo: string }) {
  return (
    <>
      <div className="r-side">
        <div className="r-photo-wrap">
          {photo ? <img className="r-photo" src={photo} alt="Photo" /> : <div style={{width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(196,184,255,0.1)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px'}}>👤</div>}
          <div className="r-name">{data.name || 'Your Name'}</div>
          <div className="r-title">{data.jobTitle || ''}</div>
        </div>
        
        {(data.email || data.phone || data.address || data.linkedin || data.github || data.portfolio) && (
          <div className="r-side-section">
            <div className="r-side-sec-title">Contact</div>
            {data.email && <div className="r-contact-item">✉ {data.email}</div>}
            {data.phone && <div className="r-contact-item">📞 {data.phone}</div>}
            {data.address && <div className="r-contact-item">📍 {data.address}</div>}
            {data.linkedin && <div className="r-contact-item"><a href={data.linkedin} className="r-link" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>}
            {data.github && <div className="r-contact-item"><a href={data.github} className="r-link" target="_blank" rel="noreferrer">GitHub ↗</a></div>}
            {data.portfolio && <div className="r-contact-item"><a href={data.portfolio} className="r-link" target="_blank" rel="noreferrer">Portfolio ↗</a></div>}
          </div>
        )}
        
        {data.skills.length > 0 && (
          <div className="r-side-section">
            <div className="r-side-sec-title">Skills</div>
            {data.skills.map((s, i) => <span key={i} className="r-side-skill">{s}</span>)}
          </div>
        )}
        
        {data.languages.some(Boolean) && (
          <div className="r-side-section">
            <div className="r-side-sec-title">Languages</div>
            {data.languages.filter(Boolean).map((l, i) => <div key={i} className="r-lang-item">• {l}</div>)}
          </div>
        )}
        
        {data.certifications.some(Boolean) && (
          <div className="r-side-section">
            <div className="r-side-sec-title">Certifications</div>
            {data.certifications.filter(Boolean).map((c, i) => <div key={i} className="r-lang-item">• {c}</div>)}
          </div>
        )}
      </div>
      
      <div className="r-main">
        {data.summary && <div className="r-section"><div className="r-sec-title">About Me</div><div className="r-summary">{data.summary}</div></div>}
        
        {data.experience.some(e => e.role || e.company) && (
          <div className="r-section">
            <div className="r-sec-title">Experience</div>
            {data.experience.filter(e => e.role || e.company).map((e, i) => (
              <div className="r-entry" key={i}>
                <div className="r-entry-head">
                  <div className="r-entry-title">{e.role}</div>
                  <div className="r-entry-date">{e.startDate}{e.endDate ? ' – ' + e.endDate : ''}</div>
                </div>
                <div className="r-entry-sub">{e.company}</div>
                {e.desc && <div className="r-entry-desc">{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        
        {data.education.some(e => e.degree || e.school) && (
          <div className="r-section">
            <div className="r-sec-title">Education</div>
            {data.education.filter(e => e.degree || e.school).map((e, i) => (
              <div className="r-entry" key={i}>
                <div className="r-entry-head">
                  <div className="r-entry-title">{e.degree}</div>
                  <div className="r-entry-date">{e.startYear}{e.endYear ? ' – ' + e.endYear : ''}</div>
                </div>
                <div className="r-entry-sub">{e.school}</div>
                {e.desc && <div className="r-entry-desc">{e.desc}</div>}
              </div>
            ))}
          </div>
        )}
        
        {data.projects.some(p => p.title) && (
          <div className="r-section">
            <div className="r-sec-title">Projects</div>
            {data.projects.filter(p => p.title).map((p, i) => (
              <div className="r-entry" key={i}>
                <div className="r-entry-head">
                  <div className="r-entry-title">{p.title}</div>
                  {p.link && <a href={p.link} className="r-link r-entry-date" target="_blank" rel="noreferrer">Link ↗</a>}
                </div>
                {p.tech && <div className="r-entry-sub">{p.tech}</div>}
                {p.desc && <div className="r-entry-desc">{p.desc}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
