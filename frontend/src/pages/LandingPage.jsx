import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorks from '../components/landing/HowItWorks'
import CTASection from '../components/landing/CTASection'

function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </div>
  )
}

export default LandingPage
