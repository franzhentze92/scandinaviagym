import React from 'react';
import { Star, Award, Calendar } from 'lucide-react';

const TrainerGrid: React.FC = () => {
  const trainers = [
    {
      name: 'María González',
      specialty: 'Yoga & Pilates',
      experience: '8 años',
      rating: 4.9,
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781174553_b56e62aa.webp',
      certifications: ['RYT-500', 'Pilates Mat'],
      bio: 'Especialista en yoga terapéutico y pilates. Ayudo a mis alumnos a encontrar equilibrio y fuerza interior.'
    },
    {
      name: 'Carlos Méndez',
      specialty: 'CrossFit & Funcional',
      experience: '6 años',
      rating: 4.8,
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781176264_6a28b641.webp',
      certifications: ['CrossFit L2', 'NSCA-CPT'],
      bio: 'Entrenador de alto rendimiento especializado en acondicionamiento funcional y fuerza.'
    },
    {
      name: 'Ana Rodríguez',
      specialty: 'Aqua Fitness',
      experience: '10 años',
      rating: 5.0,
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781178030_fff2a29f.webp',
      certifications: ['AEA Certified', 'Water Safety'],
      bio: 'Pionera en aqua aeróbicos en Guatemala. Especialista en rehabilitación acuática.'
    },
    {
      name: 'Luis Herrera',
      specialty: 'Spinning & Cardio',
      experience: '5 años',
      rating: 4.7,
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781179751_eeb39f32.webp',
      certifications: ['Spinning Certified', 'ACSM'],
      bio: 'Instructor de spinning con energía contagiosa. Especialista en entrenamiento cardiovascular.'
    },
    {
      name: 'Patricia Lima',
      specialty: 'Zumba & Baile',
      experience: '7 años',
      rating: 4.9,
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781181536_77d37cd8.webp',
      certifications: ['Zumba B1', 'Strong Nation'],
      bio: 'Bailarina profesional convertida en instructora. Hace del ejercicio una celebración.'
    },
    {
      name: 'Sandra Torres',
      specialty: 'Entrenamiento Personal',
      experience: '12 años',
      rating: 5.0,
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781183384_42803248.webp',
      certifications: ['NASM-CPT', 'Corrective Exercise'],
      bio: 'Entrenadora personal con enfoque en corrección postural y prevención de lesiones.'
    }
  ];

  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nuestros Entrenadores
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Profesionales certificados comprometidos con tu transformación. Cada uno especialista en su área.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, index) => (
            <div key={index} className="bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-700">
              <div className="relative">
                <img 
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-gray-900 rounded-full px-2 py-1 flex items-center gap-1 border border-gray-700">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-white">{trainer.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
                <p className="font-semibold mb-2" style={{color: '#b5fc00'}}>{trainer.specialty}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {trainer.experience}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{trainer.bio}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Certificaciones:</h4>
                  <div className="flex flex-wrap gap-1">
                    {trainer.certifications.map((cert, certIndex) => (
                      <span key={certIndex} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 text-black py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Ver Perfil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainerGrid;