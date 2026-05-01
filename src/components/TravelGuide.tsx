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
    <section className="py-20 bg-[var(--color-hotstar-bg)]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HelpCircle className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-4">Travel Guide</h2>
            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Kashmir FAQs</h3>
          </motion.div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-white/5 bg-[#101c2b]/50 rounded-2xl overflow-hidden shadow-xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-black text-white uppercase tracking-tight">{faq.q}</span>
                {openIndex === index ? (
                  <Minus className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Plus className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-[11px] text-gray-400 leading-relaxed font-bold lowercase first-letter:uppercase">
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
