import Header from "./components/Header";
import Hero from "./components/Hero";
import CarCarousel from "./components/CarCarousel";
import CarGrid from "./components/CarGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CarCarousel />
      <CarGrid />
    </div>
  );
}
