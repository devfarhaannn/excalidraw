import { Navbar } from "./components/landing/navbar";
import { Hero } from "./components/landing/hero";
import { Features } from "./components/landing/features";
import { Collaboration } from "./components/landing/collaboration";
import { HowItWorks } from "./components/landing/how-it-works";
import { About } from "./components/landing/about";
import { CTA } from "./components/landing/cta";
import { Footer } from "./components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#17171B]">
      <Navbar />
      <Hero/>
      <Features/>
      <Collaboration/>
      <HowItWorks/>
      <About/>
      <CTA/>
      <Footer/>
    </main>
  );
}