'use client';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Upload, ShoppingCart, RefreshCw } from 'lucide-react';

export default function CustomPrint() {
  const [garment, setGarment] = useState('tshirt');
  const [color, setColor] = useState('black');
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock upload logic
  const handleFileUpload = (e) => {
    setIsUploading(true);
    setTimeout(() => {
      setUploadedDesign('https://wpecomus.com/fashion/wp-content/uploads/2023/10/fashion-product-1.jpg'); // dummy uploaded image logic
      setIsUploading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Design Your Own</h1>
            <p className="text-zinc-400 font-light">Custom Premium Prints using Merry Berry's high-quality fabrics. Upload your design, choose your fit, and we handle the rest.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Visualizer */}
            <div className="w-full lg:w-1/2 bg-zinc-900 rounded-2xl p-8 flex items-center justify-center relative min-h-[500px]">
              <div className={`transition-all duration-500 w-64 h-80 bg-zinc-800 rounded-md shadow-2xl relative ${color === 'white' ? 'bg-zinc-200' : color === 'black' ? 'bg-zinc-950' : 'bg-blue-900'}`}>
                {/* Mock Garment Shape */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-zinc-500 opacity-30 text-6xl font-serif">MB</span>
                </div>
                {/* Design Overlay */}
                {uploadedDesign && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-white/30 overflow-hidden bg-black/20 flex items-center justify-center">
                    <span className="text-xs text-white">Your Design</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customizer Settings */}
            <div className="w-full lg:w-1/2">
              <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/5 space-y-8">
                
                {/* 1. Garment */}
                <div>
                  <h3 className="font-serif text-xl mb-4 flex items-center"><span className="w-8 h-8 rounded-full bg-berry-600 text-white flex items-center justify-center text-sm mr-3">1</span> Select Garment</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button onClick={() => setGarment('tshirt')} className={`py-3 px-4 rounded border text-sm ${garment === 'tshirt' ? 'border-berry-500 bg-berry-500/10 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>T-Shirt</button>
                    <button onClick={() => setGarment('hoodie')} className={`py-3 px-4 rounded border text-sm ${garment === 'hoodie' ? 'border-berry-500 bg-berry-500/10 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>Hoodie</button>
                    <button onClick={() => setGarment('polo')} className={`py-3 px-4 rounded border text-sm ${garment === 'polo' ? 'border-berry-500 bg-berry-500/10 text-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}>Polo</button>
                  </div>
                </div>

                {/* 2. Color */}
                <div>
                  <h3 className="font-serif text-xl mb-4 flex items-center"><span className="w-8 h-8 rounded-full bg-berry-600 text-white flex items-center justify-center text-sm mr-3">2</span> Choose Color</h3>
                  <div className="flex gap-4">
                    <button onClick={() => setColor('black')} className={`w-12 h-12 rounded-full bg-zinc-950 border-2 ${color === 'black' ? 'border-berry-500 shadow-[0_0_15px_rgba(218,44,119,0.5)]' : 'border-zinc-700'}`}></button>
                    <button onClick={() => setColor('navy')} className={`w-12 h-12 rounded-full bg-blue-950 border-2 ${color === 'navy' ? 'border-berry-500 shadow-[0_0_15px_rgba(218,44,119,0.5)]' : 'border-zinc-700'}`}></button>
                    <button onClick={() => setColor('white')} className={`w-12 h-12 rounded-full bg-zinc-100 border-2 ${color === 'white' ? 'border-berry-500 shadow-[0_0_15px_rgba(218,44,119,0.5)]' : 'border-zinc-700'}`}></button>
                  </div>
                </div>

                {/* 3. Upload Design */}
                <div>
                  <h3 className="font-serif text-xl mb-4 flex items-center"><span className="w-8 h-8 rounded-full bg-berry-600 text-white flex items-center justify-center text-sm mr-3">3</span> Upload Design</h3>
                  <label className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-berry-500 hover:bg-berry-500/5 transition-all text-center">
                    {isUploading ? (
                      <RefreshCw className="animate-spin text-berry-500 mb-4" size={32} />
                    ) : (
                      <Upload className="text-zinc-500 mb-4" size={32} />
                    )}
                    <span className="text-zinc-300 font-medium">{uploadedDesign ? 'Design Uploaded. Click to replace.' : 'Click to Upload graphic (PNG/JPG)'}</span>
                    <span className="text-zinc-500 text-sm mt-2">Max file size: 10MB</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                  </label>
                </div>

                {/* Checkout Panel */}
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-zinc-400 text-sm">Total Custom Order</p>
                    <p className="text-gold-400 font-serif text-3xl font-semibold">$89.99</p>
                  </div>
                  <button className="bg-berry-600 hover:bg-berry-500 text-white px-8 py-4 rounded font-medium flex items-center transition-colors shadow-[0_0_15px_rgba(218,44,119,0.3)] disabled:opacity-50" disabled={!uploadedDesign}>
                    <ShoppingCart size={18} className="mr-2" /> Add to Cart
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
