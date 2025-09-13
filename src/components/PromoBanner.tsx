import React, { useState } from 'react';
import { X, Gift, CreditCard, Clock } from 'lucide-react';

const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-4 relative border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Gift className="w-5 h-5 flex-shrink-0" style={{color: '#b5fc00'}} />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-semibold">¡Promoción Especial!</span>
            <span className="text-sm">
              Membresía anual con 2 meses gratis + Visa Cuotas sin intereses
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Válido hasta fin de mes</span>
          </div>
          <button className="text-black px-4 py-1 rounded-full text-sm font-semibold transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
            Ver Oferta
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;