import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Andrea Morales',
      location: 'Miembro desde 2020',
      rating: 5,
      text: 'Scandinavia cambió mi vida. Los horarios amplios me permiten entrenar antes del trabajo, y las piscinas climatizadas son perfectas para mi rutina de aqua aeróbicos.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781174553_b56e62aa.webp'
    },
    {
      name: 'Roberto García',
      location: 'Miembro desde 2019',
      rating: 5,
      text: 'La variedad de clases es increíble. Desde CrossFit hasta Yoga, siempre encuentro algo nuevo. Los entrenadores son profesionales y muy motivadores.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781176264_6a28b641.webp'
    },
    {
      name: 'Carmen Rodríguez',
      location: 'Miembro desde 2021',
      rating: 5,
      text: 'Tener 14 sedes es una ventaja enorme. Puedo entrenar cerca de casa, del trabajo, o donde me encuentre. La app móvil hace todo muy fácil.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781178030_fff2a29f.webp'
    },
    {
      name: 'Diego Herrera',
      location: 'Miembro desde 2022',
      rating: 5,
      text: 'El plan Elite vale cada quetzal. El entrenamiento personalizado y la consulta nutricional me ayudaron a alcanzar mis objetivos más rápido.',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781179751_eeb39f32.webp'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Lo Que Dicen Nuestros Miembros
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Miles de guatemaltecos han transformado su vida con Scandinavia. Lee sus historias de éxito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-300">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-gray-400 absolute -top-2 -left-1" />
                <p className="text-gray-300 pl-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">25,000+</div>
            <div className="text-gray-300">Miembros Activos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">14</div>
            <div className="text-gray-300">Sedes en Guatemala</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">100+</div>
            <div className="text-gray-300">Clases Semanales</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">15</div>
            <div className="text-gray-300">Años de Experiencia</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;