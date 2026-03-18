import CosmicBackground from './components/ui/CosmicBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoreModules from './components/CoreModules';
import ChatbotDemo from './components/ChatbotDemo';
import MarketplacePreview from './components/MarketplacePreview';
import PreFooter from './components/PreFooter';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative" data-name="app">
      {/* Global Background */}
      <CosmicBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <CoreModules />
          <ChatbotDemo />
          <MarketplacePreview />
          <PreFooter />
          <Footer />
        </main>
      </div>
    </div>
  );
}
