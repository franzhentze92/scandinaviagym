import React from 'react';
import LocationCard from './LocationCard';

const LocationsGrid: React.FC = () => {
  const locations = [
    {
      id: '1',
      name: 'Scandinavia Centro',
      address: 'Zona 1, Ciudad de Guatemala',
      phone: '2251-4000',
      hours: '4:30 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'medium' as const
    },
    {
      id: '2', 
      name: 'Scandinavia Zona 10',
      address: 'Zona 10, Ciudad de Guatemala',
      phone: '2251-4010',
      hours: '5:00 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'high' as const
    },
    {
      id: '3',
      name: 'Scandinavia Mixco',
      address: 'Mixco, Guatemala',
      phone: '2251-4020',
      hours: '4:30 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781161360_aba23a31.webp',
      amenities: ['Estacionamiento', 'Clases'],
      occupancy: 'low' as const
    },
    {
      id: '4',
      name: 'Scandinavia Villa Nueva',
      address: 'Villa Nueva, Guatemala',
      phone: '2251-4030',
      hours: '5:00 - 21:30',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781163198_40e498db.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'medium' as const
    },
    {
      id: '5',
      name: 'Scandinavia Zona 14',
      address: 'Zona 14, Ciudad de Guatemala',
      phone: '2251-4040',
      hours: '4:30 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781165004_2fdfdfae.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'high' as const
    },
    {
      id: '6',
      name: 'Scandinavia Petapa',
      address: 'Petapa, Guatemala',
      phone: '2251-4050',
      hours: '5:00 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781166772_09fd686a.webp',
      amenities: ['Estacionamiento', 'Clases'],
      occupancy: 'low' as const
    }
  ];

  return (
    <section id="sedes" className="py-12 sm:py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nuestras Sedes
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            14 ubicaciones estratégicas en Guatemala para que siempre tengas un Scandinavia cerca de ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {locations.map((location) => (
            <LocationCard key={location.id} {...location} />
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <button className="text-black px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
            Ver Todas las Sedes
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocationsGrid;