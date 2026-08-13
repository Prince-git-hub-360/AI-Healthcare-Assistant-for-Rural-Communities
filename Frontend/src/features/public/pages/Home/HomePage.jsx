import React from 'react';

// Import Modular Marketing Sections
import { HeroSection } from '../../../../components/marketing/HeroSection';
import { TrustSection } from '../../../../components/marketing/TrustSection';
import { ProblemSection } from '../../../../components/marketing/ProblemSection';
import { SolutionSection } from '../../../../components/marketing/SolutionSection';
import { HowItWorks } from '../../../../components/marketing/HowItWorks';
import { PrescriptionDemo } from '../../../../components/marketing/PrescriptionDemo';
import { DifferentiationSection } from '../../../../components/marketing/DifferentiationSection';
import { TechnologySection } from '../../../../components/marketing/TechnologySection';
import { PatientSection } from '../../../../components/marketing/PatientSection';
import { AshaSection } from '../../../../components/marketing/AshaSection';
import { DoctorSection } from '../../../../components/marketing/DoctorSection';
import { CaregiverSection } from '../../../../components/marketing/CaregiverSection';
import { MedicationSection } from '../../../../components/marketing/MedicationSection';
import { SafetySection } from '../../../../components/marketing/SafetySection';
import { ServicesSection } from '../../../../components/marketing/ServicesSection';
import { FAQSection } from '../../../../components/marketing/FAQSection';
import { AboutSection } from '../../../../components/marketing/AboutSection';
import { FinalCTA } from '../../../../components/marketing/FinalCTA';
import { PublicFooter } from '../../../../components/marketing/PublicFooter';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F17] text-stone-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {/* 2. Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* 3. Trust / Value Strip */}
      <TrustSection />

      {/* 4. Problem Section */}
      <ProblemSection />

      {/* 5. Solutions Section */}
      <SolutionSection />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Product Demonstration */}
      <PrescriptionDemo />

      {/* 8. Why Swasthya Sanchar */}
      <DifferentiationSection />

      {/* 9. AI Technology */}
      <TechnologySection />

      {/* 10. For Patients */}
      <PatientSection />

      {/* 11. For ASHA Workers */}
      <AshaSection />

      {/* 12. For Doctors */}
      <DoctorSection />

      {/* 13. For Caregivers */}
      <CaregiverSection />

      {/* 14. Medication Assistance */}
      <MedicationSection />

      {/* 15. Responsible AI / Safety */}
      <SafetySection />

      {/* 16. Healthcare Services */}
      <ServicesSection />

      {/* 17. FAQ */}
      <FAQSection />

      {/* 18. About */}
      <AboutSection />

      {/* 19. Final CTA */}
      <FinalCTA onNavigate={onNavigate} />

      {/* 20. Footer */}
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
