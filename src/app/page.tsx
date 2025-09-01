import Footer from '@/components/footer';
import Hero from '@/components/hero';
import Navbar from '@/components/navbar';

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
