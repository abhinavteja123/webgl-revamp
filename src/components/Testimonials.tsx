import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial, Statistic } from '../types';
import { useCarousel } from '../hooks/useCarousel';
import { useSceneEnabled } from '../three/SceneManager';
import { useInView } from '../hooks/useInView';
import { ErrorBoundary } from './shared/ErrorBoundary';

// WebGL starfield behind the carousel — lazy so it never blocks the DOM fallback.
const TestimonialsScene = React.lazy(() => import('../three/TestimonialsScene'));

const testimonialData: { content: Testimonial; stats: Statistic[] }[] = [
  {
    content: {
      id: 0,
      quote: "Anchored upon core principles of tech-stack, BetterSwitch payment infrastructure enabled us to run on a unified platform.",
      author: "Ayush Agarwal",
      role: "CPTO, Dodo Payments",
      image: "/ayush_dodo.jpeg"
    },
    stats: [
      { val: "Unified", lbl: "Platform" },
      { val: "Scalable", lbl: "Tech Stack" },
      { val: "Seamless", lbl: "Integration" }
    ]
  },
  {
    content: {
      id: 1,
      quote: "They delivered a production-ready connector implementation within days which boosted us with a surge in TPS and ensured 99.9% uptime.",
      author: "Chris Munyasya",
      role: "Founder, Pesaswap East Africa Limited",
      image: "/Chris_PS.jpg"
    },
    stats: [
      { val: "Days", lbl: "To Production" },
      { val: "High", lbl: "TPS Surge" },
      { val: "99.9%", lbl: "Uptime" }
    ]
  },
  {
    content: {
      id: 2,
      quote: "Quite excited with their customised payment solution. Our customers loved BetterSwitch's user-friendly payment experience.",
      author: "Steinar Atli Skarphéðinsson",
      role: "CoFounder, Vaultera",
      image: "/Steinar_vaultera.jpg"
    },
    stats: [
      { val: "Custom", lbl: "Solution" },
      { val: "Loved", lbl: "User Experience" },
      { val: "Easy", lbl: "Integration" }
    ]
  }
];

const Testimonials: React.FC = () => {
  const [animating, setAnimating] = useState(false);
  const carousel = useCarousel({
    itemCount: testimonialData.length,
    autoPlayInterval: 5000,
  });

  // Update animation state on carousel change
  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [carousel.current]);

  const handleNext = () => {
    carousel.pauseAutoPlay(10000);
    carousel.goToNext();
  };

  const handlePrev = () => {
    carousel.pauseAutoPlay(10000);
    carousel.goToPrev();
  };

  const activeStats = testimonialData[carousel.current].stats;
  const sceneEnabled = useSceneEnabled();
  const [sectionRef, inView] = useInView({ threshold: 0.05 });

  return (
    <>
      {/* Testimonials Carousel */}
      <section ref={sectionRef} id="customers" className="py-section bg-obsidian text-white relative overflow-hidden">
        {/* 3D starfield — sits behind the dot pattern + carousel; DOM fallback when disabled */}
        {sceneEnabled && inView && (
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <TestimonialsScene />
            </Suspense>
          </ErrorBoundary>
        )}
        {/* Abstract dot background pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
             <div className="md:col-span-8">
                <div className="relative w-full min-h-[300px] flex flex-col justify-center">
                   <AnimatePresence mode="wait">
                     <motion.div
                        key={carousel.current}
                        role="tabpanel"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                        className="w-full flex flex-col justify-center"
                     >
                       {/* High-end Quote Bubble visual */}
                       <div className="relative">
                         <span className="absolute -top-10 -left-6 text-[10rem] font-serif text-white/5 select-none leading-none">&ldquo;</span>
                         <blockquote className="text-2xl md:text-3xl font-semibold tracking-tighter mb-8 leading-tight text-white/90 relative z-10">
                           {testimonialData[carousel.current].content.quote}
                         </blockquote>
                       </div>
                       <div className="flex items-center gap-4 mt-2">
                           <img 
                             src={testimonialData[carousel.current].content.image} 
                             alt={testimonialData[carousel.current].content.author} 
                             className="w-12 h-12 rounded-full object-cover border-2 border-accent/20 shadow-md shrink-0" 
                             loading="lazy" 
                           />
                           <div>
                              <div className="font-bold text-base text-white">{testimonialData[carousel.current].content.author}</div>
                              <div className="text-xs text-white/50 font-semibold">{testimonialData[carousel.current].content.role}</div>
                           </div>
                       </div>
                     </motion.div>
                   </AnimatePresence>
                </div>

                <div className="flex items-center gap-3.5 mt-10">
                   <button 
                     onClick={handlePrev} 
                     aria-label="Previous testimonial"
                     className="focus-ring group w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all"
                   >
                      <ChevronLeft size={16} />
                   </button>
                   <button 
                     onClick={handleNext}
                     aria-label="Next testimonial"
                     className="focus-ring group w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all"
                   >
                      <ChevronRight size={16} />
                   </button>
                   {/* Progress dots */}
                   <div className="flex items-center gap-2.5 ml-4" role="tablist" aria-label="Testimonial pagination">
                     {testimonialData.map((_, idx) => (
                       <button
                         key={idx}
                         role="tab"
                         tabIndex={idx === carousel.current ? 0 : -1}
                         aria-label={`Go to testimonial ${idx + 1}`}
                         aria-selected={idx === carousel.current}
                         className={`focus-ring h-1.5 rounded-full transition-all duration-300 ${idx === carousel.current ? 'w-6 bg-accent' : 'w-1.5 bg-white/30'}`}
                         onClick={() => carousel.goTo(idx)}
                       />
                     ))}
                   </div>
                </div>
             </div>

             <div className="md:col-span-4 flex flex-row md:flex-col justify-between gap-6 md:gap-0 md:space-y-12 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-16">
                {activeStats.map((stat, i) => (
                  <div key={i}>
                     <motion.div
                       key={`${carousel.current}-${i}`}
                       initial={{ opacity: 0, y: 8 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.35, delay: i * 0.1, ease: 'easeOut' }}
                     >
                       <div className="text-3xl font-extrabold mb-1 text-accent font-sans">
                         {stat.val}
                       </div>
                       <div className="text-xs text-white/50 font-bold uppercase tracking-wider">
                         {stat.lbl}
                       </div>
                     </motion.div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
