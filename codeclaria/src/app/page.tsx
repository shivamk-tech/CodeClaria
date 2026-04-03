import Hero from '../components/Hero';
import FloatingLines from '../components/FloatingLines';

export default function Home() {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0 h-screen">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>
      <div className="relative z-10 ">
        <Hero />
      </div>
    </div>
  );
}
