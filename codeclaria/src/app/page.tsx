import Hero from '../components/Hero';
import FloatingLines from '../components/FloatingLines';
import Features from '../components/Features';
import BlurryCardsBg from '../components/BlurryCardsBg';

export default function Home() {
  return (
    <div>
      <div className="relative h-screen flex items-center justify-center">
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
      <BlurryCardsBg/>
    </div>
  );
}
