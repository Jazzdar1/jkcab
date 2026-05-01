import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How do I book a cab in Srinagar?',
    a: 'You can book directly via our website by filling the inquiry form or by calling/messaging us on WhatsApp at +91 9149820828.'
  },
  {
    q: 'Are your rates fixed or negotiable?',
    a: 'Our rates are transparent and fixed as per the standard tourism department guidelines in Kashmir. No hidden charges.'
  },
  {
    q: 'Do you provide airport pickup and drop?',
    a: 'Yes, we provide 24/7 airport transfers to and from Srinagar International Airport to any hotel or houseboat.'
  },
  {
    q: 'Can I customize my tour package?',
    a: 'Absolutely! Our travel experts can design a completely custom itinerary based on your preferences and duration of stay.'
  },
  {
    q: 'Is it safe to travel in Kashmir?',
    a: 'Kashmir is a very safe tourist destination. Our drivers are local experts who ensure your safety and comfort at all times.'
  }
];

export default function TravelGuide() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HelpCircle className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-sm font-bold text-yellow-600 uppercase tracking-[0.2em] mb-4">Travel Guide</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-100 rounded-3xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-800">{faq.q}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
