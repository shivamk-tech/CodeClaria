import Hero from '../components/Hero';
import FloatingLines from '../components/FloatingLines';
import BlurryCardsBg from '../components/BlurryCardsBg';
import HowItWorks from '../components/HowItWorks';
import ConnectGithub from '../components/ConnectGithub';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <div>
      <div id="home" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0 h-screen">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={10}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
          />
        </div>
        <div className="relative z-10 -mt-16">
          <Hero />
        </div>
        {/* fade out bottom of floating lines */}
        <div className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #07061a)" }} />
      </div>
      <div id="features"><BlurryCardsBg/></div>
      {/* fade between sections */}
      <div className="h-24" style={{ background: "linear-gradient(to bottom, #07061a, #0d0b1f)" }} />
      <div id="how-it-works"><HowItWorks /></div>
      <div className="h-24" style={{ background: "linear-gradient(to bottom, #0d0b1f, #07061a)" }} />
      <ConnectGithub />
      <div className="h-32" style={{ background: "linear-gradient(to bottom, #07061a, #0a0f1e)" }} />
      <Footer/>
    </div>
  );
}
