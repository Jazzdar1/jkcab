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
    <section className="py-20 bg-[var(--color-hotstar-bg)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-4">Happy Travellers</h2>
            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight font-display">Real Stories</h3>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="min-h-[350px] flex items-center justify-center relative">
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
                <div className="bg-[#101c2b] p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative group border border-white/5">
                  <div className="absolute top-8 right-8 opacity-5 text-yellow-400">
                    <Quote className="h-20 w-20 fill-current" />
                  </div>
                  
                  <div className="flex space-x-1 mb-6">
                    {[...Array(reviews[index].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl text-gray-300 italic mb-8 leading-relaxed font-medium">
                    "{reviews[index].text}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-black text-lg mr-4 shadow-xl shadow-yellow-400/10">
                      {reviews[index].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tight">{reviews[index].name}</h4>
                      <p className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.2em]">{reviews[index].location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="p-3 rounded-xl bg-white/5 text-white hover:bg-yellow-400 hover:text-black transition-all border border-white/5 active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-xl bg-white/5 text-white hover:bg-yellow-400 hover:text-black transition-all border border-white/5 active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
