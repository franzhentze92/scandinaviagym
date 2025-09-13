import React, { useState } from 'react';
import { Clock, Users, MapPin, Filter } from 'lucide-react';

const ClassSchedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [selectedLocation, setSelectedLocation] = useState('Todas');

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const locations = ['Todas', 'Centro', 'Zona 10', 'Mixco', 'Villa Nueva'];

  const classes = [
    {
      time: '06:00',
      name: 'Yoga Matutino',
      instructor: 'María González',
      location: 'Centro',
      capacity: 20,
      enrolled: 15,
      level: 'Principiante'
    },
    {
      time: '07:00',
      name: 'CrossFit',
      instructor: 'Carlos Méndez',
      location: 'Zona 10',
      capacity: 15,
      enrolled: 12,
      level: 'Intermedio'
    },
    {
      time: '08:00',
      name: 'Aqua Aeróbicos',
      instructor: 'Ana Rodríguez',
      location: 'Centro',
      capacity: 25,
      enrolled: 18,
      level: 'Todos'
    },
    {
      time: '18:00',
      name: 'Spinning',
      instructor: 'Luis Herrera',
      location: 'Mixco',
      capacity: 30,
      enrolled: 28,
      level: 'Intermedio'
    },
    {
      time: '19:00',
      name: 'Zumba',
      instructor: 'Patricia Lima',
      location: 'Villa Nueva',
      capacity: 35,
      enrolled: 22,
      level: 'Todos'
    },
    {
      time: '20:00',
      name: 'Pilates',
      instructor: 'Sandra Torres',
      location: 'Zona 10',
      capacity: 18,
      enrolled: 16,
      level: 'Principiante'
    }
  ];

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getCapacityText = (enrolled: number, capacity: number) => {
    const remaining = capacity - enrolled;
    if (remaining <= 2) return `${remaining} cupos`;
    if (remaining <= 5) return `${remaining} cupos`;
    return 'Disponible';
  };

  return (
    <section id="clases" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Clases y Horarios
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Más de 100 clases semanales con instructores certificados. Reserva tu cupo y entrena con nosotros.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Día</label>
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-800 text-white"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Sede</label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-800 text-white"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{classItem.name}</h3>
                  <p className="text-gray-300 text-sm">{classItem.instructor}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCapacityColor(classItem.enrolled, classItem.capacity)}`}>
                  {getCapacityText(classItem.enrolled, classItem.capacity)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4" />
                  {classItem.time}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4" />
                  {classItem.location}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Users className="w-4 h-4" />
                  {classItem.enrolled}/{classItem.capacity} inscritos
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{classItem.level}</span>
                <button className="text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassSchedule;