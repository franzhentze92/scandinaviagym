import React from 'react';
import { MapPin, Clock, Phone, Waves, Car, Users } from 'lucide-react';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  amenities: string[];
  occupancy: 'low' | 'medium' | 'high';
}

const LocationCard: React.FC<LocationCardProps> = ({
  name, address, phone, hours, image, amenities, occupancy
}) => {
  const occupancyColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100', 
    high: 'text-red-600 bg-red-100'
  };

  const occupancyText = {
    low: 'Baja afluencia',
    medium: 'Afluencia media',
    high: 'Alta afluencia'
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Piscina': <Waves className="w-4 h-4" />,
    'Estacionamiento': <Car className="w-4 h-4" />,
    'Clases': <Users className="w-4 h-4" />
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-700">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-40 sm:h-48 object-cover"
        />
        <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-1 rounded-full text-xs font-medium ${occupancyColors[occupancy]}`}>
          {occupancyText[occupancy]}
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{name}</h3>
        
        <div className="space-y-2 mb-3 sm:mb-4">
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">{hours}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">{phone}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {amenities.map((amenity, index) => (
            <span key={index} className="flex items-center gap-1 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
              {amenityIcons[amenity]}
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 text-black py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
            Ver Horarios
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors">
            Llamar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;