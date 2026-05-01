import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Anjali Sharma',
    location: 'New Delhi',
    text: 'JK CABS made our Gulmarg trip unforgettable. The driver was very professional and the Innova Crysta was spotless. Highly recommended!',
    rating: 5
  },
  {
    name: 'Rahul Verma',
    location: 'Mumbai',
    text: 'Prompt service and very transparent pricing. Best taxi service in Srinagar by far. We booked for 5 days and had zero issues.',
    rating: 5
  },
  {
    name: 'Sneha Patel',
    location: 'Ahmedabad',
    text: 'Clean cars and very safe driving in the mountains. Our driver Faisal knew all the best spots for photos in Pahalgam!',
    rating: 5
  },
  {
    name: 'Vikram Singh',
    location: 'Chandigarh',
    text: 'Excellent experience with JK CABS. We did a 7-day tour and everything was perfectly managed. The SUV was comfortable and well-maintained.',
    rating: 5
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-yellow-600 uppercase tracking-[0.2em] mb-4">Happy Travellers</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Real Stories, Real Experiences</h3>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full"
              >
                <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative group border border-gray-100">
                  <div className="absolute top-12 right-12 opacity-5 text-gray-900">
                    <Quote className="h-24 w-24 fill-current" />
                  </div>
                  
                  <div className="flex space-x-1 mb-8">
                    {[...Array(reviews[index].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl text-gray-700 italic mb-10 leading-relaxed font-medium">
                    "{reviews[index].text}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-xl mr-6 shadow-lg shadow-yellow-400/20">
                      {reviews[index].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{reviews[index].name}</h4>
                      <p className="text-sm font-bold text-yellow-600 uppercase tracking-[0.2em]">{reviews[index].location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-12 space-x-6">
            <button
              onClick={prevSlide}
              className="p-4 rounded-2xl bg-white text-black shadow-lg hover:bg-yellow-400 transition-all border border-gray-100 active:scale-90"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-yellow-400' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-4 rounded-2xl bg-white text-black shadow-lg hover:bg-yellow-400 transition-all border border-gray-100 active:scale-90"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
