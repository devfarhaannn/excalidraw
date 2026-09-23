import { Navbar } from "@repo/ui/navbar";
import { Hero } from "./components/landing/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <Hero />
    </main>
  );
}