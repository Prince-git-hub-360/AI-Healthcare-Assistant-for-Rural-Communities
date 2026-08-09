import React from 'react';
import { ShieldIcon, UserIcon, HospitalIcon, BrainIcon } from '../components/ui/Icons';

export const AboutPage = ({ setCurrentView, openAuthModal }) => {
  return (
    <div className="landing-section" style={{ paddingTop: '60px', minHeight: '80vh' }}>
      <div className="section-header">
        <span className="section-eyebrow">ABOUT SWASTHYA SANCHAR AI</span>
        <h1 className="section-title" style={{ fontSize: '44px' }}>
          Bridging the Healthcare Communication Gap for Rural India
        </h1>
        <p className="section-subtitle">
          Swasthya Sanchar AI was founded with a single mission: to ensure that every patient, regardless of literacy level or geographic location, can understand their medical instructions, take their medicines correctly, and live a healthier life.
        </p>
      </div>

      {/* Mission & Vision Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '60px' }}>
        <div className="card-surface">
          <div style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>
            <HospitalIcon size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
            The Rural Health Challenge
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            In many rural communities across India, healthcare delivery ends when a doctor writes a handwritten prescription. Patients face steep hurdles—unreadable handwriting, complex medical terminology, and language barriers. Misunderstood instructions lead to missed doses, treatment drop-offs, and avoidable health complications.
          </p>
        </div>

        <div className="card-surface">
          <div style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>
            <BrainIcon size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
            Our AI-Powered Solution
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            Swasthya Sanchar AI acts as a human-centric communication bridge. Using Optical Character Recognition (OCR), specialized Medical NLP, and Gemini LLM simplification, complex medical notes are converted into simple, regional-language explanations delivered as both clear text and spoken audio.
          </p>
        </div>
      </div>

      {/* Academic & Team Context */}
      <div className="card-surface" style={{ background: 'var(--color-primary-light)', borderColor: 'rgba(15, 118, 110, 0.25)', marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <span className="section-eyebrow">ACADEMIC & INNOVATION CREDITS</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '16px' }}>
            Built by Team Change_The_World
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            Swasthya Sanchar AI was conceptualized and engineered at <strong>PES University</strong> as a capstone healthcare technology initiative to empower frontline ASHA workers and underserved rural patients.
          </p>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: 'var(--shadow-level-1)' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>Nafees Hyder</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Lead AI Engineer & NLP Developer</div>
            </div>
            <div style={{ background: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: 'var(--shadow-level-1)' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>Prince Kumar</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Full-Stack Platform Architect</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-cta-coral" onClick={() => openAuthModal('register')}>
          Get Started Free →
        </button>
        <button className="btn-outline-teal" onClick={() => setCurrentView('landing')} style={{ marginLeft: '16px' }}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};
