'use client';

import { useState, useEffect } from 'react';
import { centres } from '@/lib/centres';

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
    subtitle: 'দয়া করে আপনার সদস্য রিটেনশন প্রক্রিয়াগুলো সম্পর্কে এই প্রশ্নগুলোর উত্তর দেওয়ার জন্য একটু সময় দিন।',
    applicationsSubmitted: 'টি আবেদন জমা দেওয়া হয়েছে',
    thankYou: 'আপনাকে ধন্যবাদ!',
    thankYouMessage: 'আপনার উত্তরসমূহ সফলভাবে সেভ করা হয়েছে।',
    submitAnother: 'আরেকটি উত্তর জমা দিন',
    submitting: 'জমা দেওয়া হচ্ছে...',
    submitSurvey: 'সার্ভে জমা দিন',
    switchLang: 'View in English',
    centreNameLabel: 'সেন্টারের নাম',
    centreNamePlaceholder: 'সেন্টারের নাম লিখুন',
  }
};

const questions = [
  {
    id: 'q_member_count',
    en: {
      text: 'How many active members do you currently have?',
      options: ['<100', '100-250', '250-500', '500']
    },
    bn: {
      text: 'বর্তমানে আপনার মোট কতজন সক্রিয় সদস্য আছেন?',
      options: ['১০০ এর কম', '১০০-২৫০', '২৫০-৫০০', '৫০০ এর বেশি']
    }
  },
  {
    id: 'q_identify_member',
    en: {
      text: 'How do you currently track or detect members who are at risk of dropping off?',
      options: ['Software', 'Guess work', 'None']
    },
    bn: {
      text: 'আপনি বর্তমানে ঠিক কীভাবে বোঝেন যে কোনো সদস্য সেন্টার ছেড়ে দিতে পারেন?',
      options: ['সফটওয়্যার', 'অনুমান করে', 'কোনওটিই নয়']
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
      text: 'আপনার সেই প্রচেষ্টাগুলো কি আশানুরূপ কাজে দেয়?',
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
      text: 'সদস্যরা যখন সেন্টারে আসেন, তখন তারা সাধারণত কীভাবে নিজেদের উপস্থিতি নথিভুক্ত করেন বা চেক-ইন করেন?',
      options: ['বায়োমেট্রিক/ফিঙ্গারপ্রিন্ট', 'মোবাইল অ্যাপ/কিউআর কোড', 'ম্যানুয়ালি', 'কোনওটিই নয়']
    }
  },
  {
    id: 'q_frustration_rating',
    en: {
      text: 'Roughly what percentage of your active members drop out or cancel their membership every month (churn)?',
      options: ['Less than 5%', '5-10%', 'More than 10%']
    },
    bn: {
      text: 'প্রতি মাসে আপনার মোট সদস্যদের মধ্যে আনুমানিক কত শতাংশ আসা বন্ধ করে দেন আর ফিরে আসেন না?',
      options: ['৫% এর কম', '৫-১০%', '১০% এর বেশি']
    }
  },
  {
    id: 'q_trainers_identify',
    en: {
      text: 'Currently, how do your trainers identify who needs attention during a shift?',
      options: ['Manual', 'Software', 'None']
    },
    bn: {
      text: 'বর্তমানে আপনার ট্রেইনাররা কীভাবে বোঝেন যে শিফ্ট চলাকালীন কার বাড়তি মনোযোগ বা সাহায্য প্রয়োজন?',
      options: ['ম্যানুয়াল', 'সফটওয়্যার', 'কিছুই না']
    }
  },
  {
    id: 'q_feature_help',
    en: {
      text: 'If an AI tool could automatically identify members who are likely to stop coming — and help you reach out to them before they leave — would that be useful, or is that something you already handle well enough?',
      options: ['Yes, very useful', 'Maybe', 'No, we handle it well enough']
    },
    bn: {
      text: 'যদি একটি AI টুল স্বয়ংক্রিয়ভাবে চিহ্নিত করতে পারে কোন সদস্যরা আসা বন্ধ করতে পারে — এবং তারা চলে যাওয়ার আগেই তাদের সাথে যোগাযোগ করতে সাহায্য করে — এটি কি আপনার কাজে আসবে, নাকি আপনি এখন যেভাবে সামলান তাতেই যথেষ্ট?',
      options: ['হ্যাঁ, খুবই কাজে আসবে', 'হয়তো', 'না, আমরা এখন যেভাবে করি তাতেই চলে']
    }
  },
  {
    id: 'q_software_manual_labor',
    en: {
      text: 'If you currently use a software, how much manual effort does it take to keep it updated?',
      options: ['High', 'Medium', 'Low']
    },
    bn: {
      text: 'আপনি যদি কোনো সফটওয়্যার ব্যবহার করেন, তবে সেটি আপডেট রাখতে আপনাকে প্রতিদিন কতটা কাজ বা পরিশ্রম করতে হয়?',
      options: ['বেশি', 'মাঝারি', 'কম']
    }
  },
  {
    id: 'q_software_wishlist',
    en: {
      text: 'What is one feature you wish your current software had?',
      isText: true,
      isOptional: true
    },
    bn: {
      text: 'আপনার বর্তমান সফটওয়্যারে এমন কোন ফিচার আছে যা আপনি থাকলে খুশি হতেন?',
      isText: true,
      isOptional: true
    }
  },
  {
    id: 'q_churn_drop_rating',
    en: {
      text: 'How important is reducing member drop-offs to your business right now?',
      options: ['Top priority', 'Important but not urgent', 'Not a focus right now']
    },
    bn: {
      text: 'সদস্যদের আসা বন্ধ হয়ে যাওয়া (ড্রপ-আউট) কমানো এই মুহূর্তে আপনার ব্যবসার জন্য কতটা গুরুত্বপূর্ণ?',
      options: ['সর্বোচ্চ অগ্রাধিকার', 'গুরুত্বপূর্ণ তবে জরুরি নয়', 'এখন ফোকাসে নেই']
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
  const [lang, setLang] = useState('en');
  const [completedCentres, setCompletedCentres] = useState(new Set());
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [currentCount, setCurrentCount] = useState(initialPropCount);
  
  // Filtering State
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '16px' }}>{t.thankYou}</h1>
        <p style={{ fontSize: '18px', marginBottom: '32px', color: 'var(--foreground)' }}>{t.thankYouMessage}</p>
        <button className="btn-primary" onClick={() => { setIsSuccess(false); setFormData({}); }}>{t.submitAnother}</button>
      </div>
    );
  }

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
        <aside className="directory-sidebar">
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
          <div className="directory-list">
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
        </aside>

        <div className="form-wrapper" style={{ flex: 1, height: 'max-content' }}>
          {selectedCentre && (
            <div className="info-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span className="status-badge" style={{ fontSize: '10px', background: 'var(--primary)', color: 'white', letterSpacing: '0.5px', padding: '2px 6px' }}>{selectedCentre.category}</span>
                </div>
                <div className="centre-name-display">{selectedCentre.name}</div>
                <div style={{ opacity: 0.8, fontSize: '13px', color: '#888' }}>{selectedCentre.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4>{lang === 'en' ? 'Phone Number' : 'ফোন নম্বর'}</h4>
                <div className="phone-number">{selectedCentre.phone}</div>
              </div>
            </div>
          )}

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
        <div style={{ marginTop: '48px', textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? t.submitting : t.submitSurvey}
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
}
