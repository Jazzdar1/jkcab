import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const GoogleReviews = () => {
  return (
    <section className="py-24 bg-white dark:bg-hotstar-bg border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-400/10 rounded-2xl mb-6">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700 dark:text-yellow-400">Trusted reviews</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
            Guest <span className="text-yellow-400">Feedback</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto">
            Directly from Google, see why travelers choose J&K CABS for their Kashmir journey.
          </p>
        </motion.div>

        {/* Elfsight Google Reviews Widget */}
        <div className="elfsight-app-47c136dc-916d-4c4c-b2dd-b56ff5479ffa" data-elfsight-app-lazy></div>
      </div>
    </section>
  );
};

export default GoogleReviews;
