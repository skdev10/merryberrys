import LuxuryNavbar from '@/components/LuxuryNavbar';
import Footer from '@/components/Footer';

export default function LegalPage({ title, children }) {
  return (
    <>
      <LuxuryNavbar />
      <main className="min-h-screen bg-luxury-white pt-32 pb-20">
        <div className="container-luxury max-w-3xl">
          <h1 className="font-serif mb-8 text-4xl text-luxury-black">{title}</h1>
          <div className="prose-luxury space-y-4 text-luxury-body text-luxury-taupe leading-relaxed">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
