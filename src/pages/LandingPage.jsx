import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolution from '../components/landing/ProblemSolution';
import HowItWorks from '../components/landing/HowItWorks';
import Architecture from '../components/landing/Architecture';
import DashboardPreview from '../components/landing/DashboardPreview';
import SecuritySection from '../components/landing/SecuritySection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSolution />
        <HowItWorks />
        <Architecture />
        <DashboardPreview />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
