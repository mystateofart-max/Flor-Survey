'use client';

import { useState } from 'react';

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
  }
};

const questions = [
  {
    id: 'q_identify_member',
    en: {
      text: 'How do you currently identify a member who is losing interest or might leave soon?',
      options: ['Use software', 'Guesswork', 'None']
    },
    bn: {
      text: 'আপনি বর্তমানে কীভাবে এমন কোনো সদস্যকে চিহ্নিত করেন যিনি আগ্রহ হারাচ্ছেন বা শীঘ্রই চলে যেতে পারেন?',
      options: ['সফটওয়্যার ব্যবহার করি', 'অনুমান করে', 'কোনওটিই নয়']
    }
  },
  {
    id: 'q_try_to_save',
    en: {
      text: 'Do you try to save them?',
      options: ['Yes', 'No', 'Sometimes']
    },
    bn: {
      text: 'আপনি কি তাদের ধরে রাখার চেষ্টা করেন?',
      options: ['হ্যাঁ', 'না', 'মাঝে মাঝে']
    }
  },
  {
    id: 'q_does_it_work',
    en: {
      text: 'Does it work?',
      options: ['Yes', 'No', 'Sometimes']
    },
    bn: {
      text: 'এটা কি কাজ করে?',
      options: ['হ্যাঁ', 'না', 'মাঝে মাঝে']
    }
  },
  {
    id: 'q_track_attendance',
    en: {
      text: 'How do you currently track member attendance and workout consistency?',
      options: ['Use software', 'Manual', 'None']
    },
    bn: {
      text: 'বর্তমানে আপনি কীভাবে সদস্যদের উপস্থিতি এবং ওয়ার্কআউটের ধারাবাহিকতা তদারকি করেন?',
      options: ['সফটওয়্যার ব্যবহার করি', 'ম্যানুয়ালি', 'কোনওটিই নয়']
    }
  },
  {
    id: 'q_frustration_rating',
    en: {
      text: 'And do you feel any frustration trying to keep your members engaged? Out of 10 how would you rate it?',
      options: ['<5', '5', '>5']
    },
    bn: {
      text: 'সদস্যদের যুক্ত রাখতে গিয়ে আপনি কি কোনো হতাশা বা কষ্ট অনুভব করেন? ১০ এর মধ্যে এটিকে কত রেটিং দেবেন?',
      options: ['<৫', '৫', '>৫']
    }
  },
  {
    id: 'q_trainers_identify',
    en: {
      text: 'Currently, how do your trainers identify who needs attention during a shift?',
      options: ['Trainers intuition', 'Something else', "Don't know"]
    },
    bn: {
      text: 'বর্তমানে, আপনার ট্রেইনাররা কীভাবে বোঝেন যে শিফ্ট চলাকালীন কার মনোযোগ প্রয়োজন?',
      options: ['ট্রেইনারের অনুমান অনুযায়ী', 'অন্য কোনো উপায়ে', 'জানি না']
    }
  },
  {
    id: 'q_feature_help',
    en: {
      text: 'We are considering a feature that will identify members who need attention and alert available trainers on the floor. Do you think it will it help your trainers?',
      options: ['Yes', 'No', 'Maybe']
    },
    bn: {
      text: 'আমরা এমন একটি ফিচার তৈরি করার কথা ভাবছি যা মনোযোগের প্রয়োজন এমন সদস্যদের চিহ্নিত করবে এবং ফ্লোরের ট্রেইনারদের সতর্ক করবে। এটি কি আপনার ট্রেইনারদের সাহায্য করবে বলে মনে করেন?',
      options: ['হ্যাঁ', 'না', 'হতে পারে']
    }
  },
  {
    id: 'q_software_manual_labor',
    en: {
      text: 'If you currently use a software how much manual labor does it take to manage it?',
      options: ['High', 'Medium', 'Low']
    },
    bn: {
      text: 'আপনি যদি বর্তমানে কোনো সফটওয়্যার ব্যবহার করেন, তবে এটি পরিচালনা করতে আপনাকে কতটা ম্যানুয়াল কাজ বা পরিশ্রম করতে হয়?',
      options: ['বেশি', 'মাঝারি', 'কম']
    }
  },
  {
    id: 'q_churn_drop_rating',
    en: {
      text: 'If your churn rate could drop by 15% without requiring your staff to do any extra manual work, how would you rate that?',
      options: ['High', 'Medium', 'Low']
    },
    bn: {
      text: 'কর্মীদের দিয়ে কোনো অতিরিক্ত কাজ না করিয়ে যদি আপনার সদস্য চলে যাওয়ার হার (churn rate) ১৫% কমে যায়, তবে আপনি এই বিষয়টিকে কতটা গুরুত্ব দেবেন?',
      options: ['বেশি', 'মাঝারি', 'কম']
    }
  }
];

export default function SurveyForm({ initialCount }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lang, setLang] = useState('en');

  const t = uiText[lang];

  const handleOptionChange = (questionId, value) => {
    // We always save the english version of the option to keep the database consistent
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
        <h1 style={{ color: 'var(--primary)', marginBottom: '16px' }}>{t.thankYou}</h1>
        <p style={{ fontSize: '18px', marginBottom: '32px', color: 'var(--foreground)' }}>{t.thankYouMessage}</p>
        <button className="btn-primary" onClick={() => { setIsSuccess(false); setFormData({}); }}>{t.submitAnother}</button>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
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
        {lang === 'bn' ? `${initialCount} ${t.applicationsSubmitted}` : `${initialCount} ${t.applicationsSubmitted}`}
      </div>
      
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => {
          const qLang = q[lang];
          
          return (
            <div key={q.id} className="question-block" style={{ animationDelay: `${index * 0.05}s` }}>
              <h3><span className="question-number">{index + 1}.</span> {qLang.text}</h3>
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
                        required
                      />
                      <span>{optionDisplayText}</span>
                    </label>
                  );
                })}
              </div>
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
  );
}
