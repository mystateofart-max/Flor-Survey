'use client';

import { useState, useEffect, useRef } from 'react';
import { centres } from '@/lib/centres';
import { supabase } from '@/lib/db';

const uiText = {
  en: {
    title: 'Flor survey',
    subtitle: 'Please take a moment to answer these questions about your retention processes.',
    applicationsSubmitted: 'applications submitted',
    thankYou: 'Thank You!',
    thankYouMessage: 'Your responses have been saved gracefully.',
    submitAnother: 'Submit Another Response',
    submitting: 'Submitting...',
    submitSurvey: 'Submit Survey',
    switchLang: 'বাংলায় দেখুন',
    centreNameLabel: 'Name of the Centre',
    centreNamePlaceholder: 'Enter centre name',
  },
  bn: {
    title: 'Flor সার্ভে',
    subtitle: 'দয়া করে আপনার মেম্বার রিটেনশন প্রক্রিয়াগুলো সম্পর্কে এই প্রশ্নগুলোর উত্তর দেওয়ার জন্য একটু সময় দিন।',
    applicationsSubmitted: 'টি আবেদন জমা দেওয়া হয়েছে',
    thankYou: 'আপনাকে ধন্যবাদ!',
    thankYouMessage: 'আপনার উত্তরসমূহ সফলভাবে সেভ করা হয়েছে।',
    submitAnother: 'আরেকটি উত্তর জমা দিন',
    submitting: 'জমা দেওয়া হচ্ছে...',
    submitSurvey: 'সার্ভে জমা দিন',
    switchLang: 'ইংরেজিতে দেখুন',
    centreNameLabel: 'সেন্টারের নাম',
    centreNamePlaceholder: 'সেন্টারের নাম লিখুন',
  }
};

const questions = [
  {
    id: 'q_member_count',
    en: {
      text: 'How many active members do you currently have?',
      options: ['<100', '100-250', '250-500', '500+']
    },
    bn: {
      text: 'বর্তমানে আপনার মোট কতজন সক্রিয় মেম্বার আছেন?',
      options: ['১০০ এর কম', '১০০-২৫০', '২৫০-৫০০', '৫০০ এর বেশি']
    }
  },
  {
    id: 'q_identify_member',
    en: {
      text: 'How do you usually figure out if a member is losing interest or might drop out? Do you have a system, or is it mostly based on observation?',
      options: ['Software', 'Relies on guesswork / observation', 'Only realizes when they don\'t renew']
    },
    bn: {
      text: 'আপনি সাধারণত কীভাবে বোঝেন যে কোনো মেম্বার আগ্রহ হারিয়ে ফেলছে বা ছেড়ে দিতে পারে? আপনি কি কোনো সিস্টেম ব্যবহার করেন, নাকি কেবল নজরে রাখলেই বোঝেন?',
      options: ['সফটওয়্যার', 'অনুমান বা নজরে রেখে', 'রিনিউ না করলে তবেই বুঝতে পারি']
    }
  },
  {
    id: 'q_try_to_save',
    en: {
      text: 'Do you take any specific steps to try and retain them?',
      options: ['Yes', 'No', 'Sometimes']
    },
    bn: {
      text: 'আপনি কি তাদের ধরে রাখার জন্য বিশেষ কোনো পদক্ষেপ নেন?',
      options: ['হ্যাঁ', 'না', 'মাঝে মাঝে']
    }
  },
  {
    id: 'q_does_it_work',
    en: {
      text: 'How effective are those efforts?',
      options: ['Yes - Effective', 'No - Not Effective', 'Sometimes']
    },
    bn: {
      text: 'আপনার সেই প্রচেষ্টাগুলো কি আশানুরূপ কাজে দেয়?',
      options: ['হ্যাঁ - সফল', 'না - ব্যর্থ', 'মাঝে মাঝে']
    }
  },
  {
    id: 'q_track_attendance',
    en: {
      text: 'How do members currently check in or register their attendance when they visit?',
      options: ['Biometric/Fingerprint/REID', 'Mobile App / QR Code', 'Manual', 'None']
    },
    bn: {
      text: 'মেম্বাররা যখন সেন্টারে আসেন, তখন তারা সাধারণত কীভাবে নিজেদের উপস্থিতি নথিভুক্ত করেন বা চেক-ইন করেন?',
      options: ['বায়োমেট্রিক/ফিঙ্গারপ্রিন্ট', 'মোবাইল অ্যাপ/কিউআর কোড', 'ম্যানুয়ালি', 'কোনওটিই নয়']
    }
  },
  {
    id: 'q_frustration_rating',
    en: {
      text: 'Do you have a rough idea of what percentage of your members drop out every month?',
      options: ['Less than 5%', '5-10%', 'More than 10%', 'Not sure / Hard to track']
    },
    bn: {
      text: 'প্রতি মাসে আপনার মেম্বারদের মধ্যে আনুমানিক কত শতাংশ আসা বন্ধ করে দেয়, তার কোনো ধারণা আছে কি?',
      options: ['৫% এর কম', '৫-১০%', '১০% এর বেশি', 'সঠিক জানা নেই / ট্র্যাক করা কঠিন']
    }
  },
  {
    id: 'q_trainers_identify',
    en: {
      text: 'During a busy shift, how do your trainers know who really needs extra attention that day?',
      options: ['They rely on memory/relationships', 'We use software to give them a list', 'They just handle whoever asks for help']
    },
    bn: {
      text: 'শিফটে যখন ভিড় থাকে, তখন আপনার ট্রেনাররা কীভাবে বোঝেন যে কার ওপর বাড়তি মনোযোগ দেওয়া দরকার?',
      options: ['তারা নিজেদের স্মৃতি ও সম্পর্কের উপর নির্ভর করে', 'সফটওয়্যার থেকে লিস্ট দেওয়া হয়', 'যে সাহায্য চায় শুধু তাকেই সাহায্য করে']
    }
  },
  {
    id: 'q_feature_help',
    en: {
      text: 'If an AI tool could automatically identify members who are likely to disengage — and reach out to them before they leave — would that be useful, or is that something you already handle well enough?',
      options: ['Yes, very useful', 'Maybe', 'No, we handle it well enough']
    },
    bn: {
      text: 'যদি একটি এআই টুল স্বয়ংক্রিয়ভাবে চিহ্নিত করতে পারে কোন মেম্বাররা আসা বন্ধ করতে পারে — এবং চলে যাওয়ার আগেই তাদের সাথে যোগাযোগ করতে সাহায্য করে — এটি কি আপনার কাজে আসবে, নাকি আপনি এখন যেভাবে সামলান তাতেই যথেষ্ট?',
      options: ['হ্যাঁ, খুবই কাজে আসবে', 'হয়তো', 'না, আমরা এখন যেভাবে করি তাতেই চলে']
    }
  },
  {
    id: 'q_software_manual_labor',
    en: {
      text: 'The software you are using right now—is it mostly helping you handle billing and admin tasks, or does it actually help you retain your members?',
      options: ['Mainly Billing/Admin tool', 'Helps with retention', 'Not using any software']
    },
    bn: {
      text: 'বর্তমানে আপনারা যে সফটওয়্যারটা ব্যবহার করছেন, সেটা কি শুধু বিলিং বা ম্যানেজমেন্টের কাজেই লাগে, নাকি মেম্বারদের ধরে রাখতেও সাহায্য করে?',
      options: ['মূলত বিলিং এবং অ্যাডমিনের জন্য', 'এটি মেম্বার ধরে রাখতেও সাহায্য করে', 'আমরা সফটওয়্যার ব্যবহার করি না']
    }
  },
  {
    id: 'q_software_wishlist',
    en: {
      text: 'What is one feature you wish your current software had? (Optional)',
      isText: true,
      isOptional: true
    },
    bn: {
      text: 'আপনার বর্তমান সফটওয়্যারে এমন কোন ফিচার আছে যা আপনি থাকলে খুশি হতেন? (ঐচ্ছিক)',
      isText: true,
      isOptional: true
    }
  },
  {
    id: 'q_churn_drop_rating',
    en: {
      text: 'As an owner, what would you say is your biggest headache right now—getting new walk-ins, or trying to stop existing members from leaving?',
      options: ['Getting new members', 'Retaining existing ones', 'Both equally']
    },
    bn: {
      text: 'একজন ওনার হিসেবে এই মুহূর্তে আপনার কাছে সবচেয়ে বড় চ্যালেঞ্জ কোনটা—নতুন মেম্বার আনা, নাকি যারা আছে তাদের ধরে রাখা?',
      options: ['নতুন মেম্বার আনা', 'পুরনো মেম্বার ধরে রাখা', 'দুটোই সমান কঠিন']
    }
  }
];

const categoryMap = {
  'Gym': ['Boutique Gym', 'Independent Gym', 'Strength/Gym', 'Strength Floor', 'Upscale', 'Gym', 'Personal Training', 'Private Studio'],
  'Yoga': ['Yoga', 'Yoga/Wellness', 'Yoga/Cardio', 'Holistic'],
  'Pilates': ['Pilates', 'Pilates/Gym', 'Yoga/Pilates', 'Shape Studio'],
  'CrossFit': ['CrossFit', 'CrossFit/Boutique', 'The Grid', 'The Arena'],
  'Dance/Zumba': ['Zumba/Fitness', 'Dance/Fitness', 'Dance/Aerobics', 'Zumba/HIIT', 'The Studio'],
  'Functional': ['Functional Training', 'Functional', 'The Workshop', 'HIIT', 'The Lab', 'Athletic', 'Peak Performance', 'Scientific Training'],
  'MMA/Boxing': ['MMA/Functional', 'The Box', 'Kickstart Fitness'],
  'Wellness': ['Wellness Center', 'Wellness/Gym', 'Physio/Fitness', 'Mind & Body', 'Sintha Dance & Fitness'],
  'Specialty': ['Corrective/Boutique', 'Ladies Boutique', 'Corporate Boutique', 'Upscale Boutique', 'Premium Boutique']
};

const getCoreCategory = (rawCategory) => {
  for (const [core, variants] of Object.entries(categoryMap)) {
    if (variants.includes(rawCategory)) return core;
  }
  return 'Other';
};

export default function SurveyForm({ initialCount: initialPropCount }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [listHeight, setListHeight] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const [lang, setLang] = useState('en');
  const [completedCentres, setCompletedCentres] = useState(new Set());
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [currentCount, setCurrentCount] = useState(initialPropCount);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const chunksRef = useRef([]);
  const fileNameRef = useRef(null);
  
  // Filtering State
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Refs for smooth resizing
  const listRef = useRef(null);
  const sidebarRef = useRef(null);
  const draggingRef = useRef(false);

  const t = uiText[lang];

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch('/api/responses');
        if (res.ok) {
          const data = await res.json();
          const names = new Set(data.map(r => r.centre_name));
          setCompletedCentres(names);
          setCurrentCount(data.length);
        }
      } catch (err) {
        console.error('Failed to fetch completion status:', err);
      }
    };
    fetchResponses();
  }, [isSuccess]);

  const handleOptionChange = (questionId, value) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCentreSelect = (centre) => {
    setSelectedCentre(centre);
    setFormData(prev => ({ ...prev, centre_name: centre.name }));
    setAudioURL(null); // Reset audio when changing centres
    if (isRecording) stopRecording();
  };

  const startRecordingAndCall = async (phone) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const safeCentreName = selectedCentre?.name ? selectedCentre.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'unknown_centre';
      const fileName = `${safeCentreName}_${Date.now()}.webm`;
      fileNameRef.current = fileName;
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
        
        // Upload to Supabase Storage
        if (fileNameRef.current) {
          try {
            const { error } = await supabase.storage
              .from('recordings')
              .upload(fileNameRef.current, blob, { 
                contentType: 'audio/webm',
                cacheControl: '3600',
                upsert: false 
              });
            if (error) console.error("Storage upload error:", error);
          } catch (storageErr) {
            console.error("Storage exception:", storageErr);
          }
        }
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Trigger the native phone dialer after starting recording
      window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access is needed to record calls. Please enable permissions.");
      // Fallback to just calling if denied
      window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const filteredCentres = centres.filter(centre => {
    const coreCat = getCoreCategory(centre.category);
    const matchesCategory = selectedCategory === 'All' || coreCat === selectedCategory;
    return matchesCategory;
  });

  const getCategoryStats = () => {
    const stats = {};
    Object.keys(categoryMap).forEach(cat => {
      stats[cat] = { done: 0, total: 0 };
    });

    centres.forEach(centre => {
      const core = getCoreCategory(centre.category);
      if (stats[core]) {
        stats[core].total++;
        if (completedCentres.has(centre.name)) stats[core].done++;
      }
    });

    return stats;
  };

  // Draggable Height Logic
  const startResizing = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current || !listRef.current || !sidebarRef.current) return;
      
      const sidebarTop = sidebarRef.current.getBoundingClientRect().top;
      const headerHeight = 84; 
      const bufferSpace = 250; 
      const newHeight = e.clientY - sidebarTop - headerHeight;
      
      const maxHeight = window.innerHeight - sidebarTop - headerHeight - bufferSpace;

      if (newHeight > 100 && newHeight < maxHeight) {
        listRef.current.style.height = `${newHeight}px`;
      }
    };

    const stopResizing = () => {
      if (draggingRef.current && listRef.current) {
        const finalHeight = parseInt(listRef.current.style.height);
        setListHeight(finalHeight);
      }
      draggingRef.current = false;
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none'; 
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  const categoryStats = getCategoryStats();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('An error occurred submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="survey-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '28px', color: '#1A1514', fontWeight: 600 }}>{t.title}</h1>
        <button 
          type="button" 
          onClick={toggleLanguage}
          style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
        >
          {t.switchLang}
        </button>
      </div>
      
      <div className="count-badge">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        {currentCount} {t.applicationsSubmitted}
      </div>
      
      <div className="survey-layout">
        <aside className="directory-sidebar" ref={sidebarRef}>
          <div className="directory-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{lang === 'en' ? 'Centres Directory' : 'সেন্টার ডিরেক্টরি'}</h2>
              <select 
                className="category-select-subtle"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">{lang === 'en' ? 'All Types' : 'সব টাইপ'}</option>
                {Object.keys(categoryMap).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div 
            className="directory-list"
            ref={listRef}
            style={{ 
              height: selectedCentre ? `${listHeight}px` : 'auto',
              flex: selectedCentre ? 'none' : '1'
            }}
          >
            {filteredCentres.map((centre) => {
              const isCompleted = completedCentres.has(centre.name);
              const isSelected = selectedCentre?.name === centre.name;
              
              return (
                <div 
                  key={centre.name}
                  className={`directory-item ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleCentreSelect(centre)}
                >
                  <div className="centre-info-main">
                    <span className="centre-name">{centre.name}</span>
                    <span className="centre-loc">{centre.location}</span>
                  </div>
                  <div className="status-indicator">
                    {isCompleted ? (
                      <span className="status-badge done">Done</span>
                    ) : (
                      <span className="status-badge pending">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {selectedCentre && (
            <>
              <div 
                className={`resizer-handle ${isResizing ? 'active' : ''}`}
                onMouseDown={startResizing}
                title="Drag to adjust list height"
              ></div>
              <div className="info-card" style={{ marginTop: '0', marginBottom: '0', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '16px', flexShrink: 0 }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="status-badge" style={{ fontSize: '10px', background: 'var(--primary)', color: 'white', letterSpacing: '0.5px', padding: '2px 6px' }}>{selectedCentre.category}</span>
                  </div>
                  <div className="centre-name-display" style={{ fontSize: '16px' }}>{selectedCentre.name}</div>
                  <div style={{ opacity: 0.8, fontSize: '12px', color: '#888' }}>{selectedCentre.location}</div>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ fontSize: '11px', marginBottom: '2px' }}>{lang === 'en' ? 'Phone Number' : 'ফোন নম্বর'}</h4>
                      <div className="phone-number" style={{ fontSize: '15px' }}>{selectedCentre.phone}</div>
                    </div>
                    
                    {!isRecording ? (
                      <button 
                        onClick={() => startRecordingAndCall(selectedCentre.phone)}
                        className="call-btn"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        title={`Call ${selectedCentre.phone}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        <span>{lang === 'en' ? 'Call' : 'কল করুন'}</span>
                      </button>
                    ) : (
                      <button 
                        onClick={stopRecording}
                        className="call-btn error"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        title="Stop Recording"
                      >
                        <span className="pulse-dot"></span>
                        <span>{lang === 'en' ? 'Stop' : 'বন্ধ করুন'}</span>
                      </button>
                    )}
                  </div>
                  
                  {audioURL && (
                    <div style={{ marginTop: '4px', animation: 'fadeIn 0.3s ease', width: '100%' }}>
                      <audio src={audioURL} controls style={{ height: '32px', width: '100%' }} />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </aside>

        <div className="form-wrapper" style={{ flex: 1, height: 'max-content' }}>

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '24px' }}>
              <h1 style={{ color: 'var(--primary)', marginBottom: '16px' }}>{t.thankYou}</h1>
              <p style={{ fontSize: '18px', marginBottom: '32px', color: 'var(--foreground)' }}>{t.thankYouMessage}</p>
              <button className="btn-primary" onClick={() => { setIsSuccess(false); setFormData({ centre_name: selectedCentre?.name || '' }); }}>{t.submitAnother}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
            <div className="question-block" style={{ marginBottom: '48px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
              <h3 style={{ marginBottom: '16px' }}>{t.centreNameLabel}</h3>
              <input 
                type="text" 
                placeholder={t.centreNamePlaceholder}
                className="text-input"
                value={formData.centre_name || ''}
                onChange={(e) => handleOptionChange('centre_name', e.target.value)}
                required
              />
            </div>

        {questions.map((q, index) => {
          const qLang = q[lang];
          
          return (
            <div key={q.id} className="question-block" style={{ animationDelay: `${index * 0.05}s` }}>
              <h3>
                <span className="question-number">{index + 1}.</span> {qLang.text}
                {qLang.isOptional && (
                  <span style={{ fontSize: '14px', fontWeight: 400, color: '#888', marginLeft: '8px' }}>
                    ({lang === 'en' ? 'Optional' : 'ঐচ্ছিক'})
                  </span>
                )}
              </h3>
              {qLang.isText ? (
                <textarea 
                  className="text-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  value={formData[q.id] || ''}
                  onChange={(e) => handleOptionChange(q.id, e.target.value)}
                  placeholder="..."
                />
              ) : (
                <div className="options-group">
                  {qLang.options.map((optionDisplayText, objIndex) => {
                    const englishValue = q.en.options[objIndex];
                    return (
                      <label 
                        key={englishValue} 
                        className={`radio-container ${formData[q.id] === englishValue ? 'selected' : ''}`}
                      >
                        <input 
                          type="radio" 
                          name={q.id} 
                          value={englishValue} 
                          checked={formData[q.id] === englishValue}
                          onChange={() => handleOptionChange(q.id, englishValue)}
                        />
                        <span>{optionDisplayText}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div className="question-block" style={{ marginTop: '32px', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '16px', lineHeight: '1.5' }}>
            {lang === 'en' 
              ? '"Thank you so much for your time today. Just before we hang up—as part of our launch campaign, we are offering a free trial of this software. There are no commitments. Would you like me to reserve a spot for you to try it out?"' 
              : '"আপনাকে অনেক ধন্যবাদ সময় দেওয়ার জন্য। শেষ করার আগে একটা কথা, আমাদের লঞ্চ ক্যাম্পেইনের অংশ হিসেবে আমরা এই সফটওয়্যারটার একটা ফ্রি ট্রায়াল দিচ্ছি। আমি কি আপনার জন্য একটা স্পট কনফার্ম করে রাখব?"'}
          </h3>
          <label className={`radio-container ${formData.interested_in_trial ? 'selected' : ''}`} style={{ marginBottom: 0 }}>
            <input 
              type="checkbox" 
              checked={!!formData.interested_in_trial}
              onChange={(e) => handleOptionChange('interested_in_trial', e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>{lang === 'en' ? 'Yes, reserve a spot for the free launch trial.' : 'হ্যাঁ, লঞ্চ উপলক্ষে ফ্রি ট্রায়ালের জন্য স্পট বুক করুন।'}</span>
          </label>
        </div>
        <div style={{ marginTop: '48px', textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submitSurvey}
          </button>
        </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
