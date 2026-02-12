import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ 
  phoneNumber = '50242366255', // Número de teléfono sin el +, solo números
  message = 'Hola, necesito ayuda con mi cuenta de Scandinavia' 
}) => {
  // Formatear el número para WhatsApp (debe incluir código de país sin +)
  const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  // Crear el enlace de WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25d366] hover:bg-[#20ba5a] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Contáctanos por WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};

export default WhatsAppWidget;

