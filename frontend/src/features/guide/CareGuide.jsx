import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Scissors, ThermometerSun, Sparkles, Heart, ChevronDown } from 'lucide-react';

export default function CareGuide() {
  const [activeFaq, setActiveFaq] = useState(null);

  // Données des étapes de soin
  const steps = [
    {
      icon: <Scissors className="h-6 w-6 text-rose-500" />,
      title: "1. La Coupe Magique",
      description: "Recoupez les tiges en biseau (à un angle de 45°) sur environ 2 cm à l'aide d'un sécateur propre. Cela augmente la surface d'absorption de l'eau.",
      tip: "Évitez les ciseaux de cuisine qui écrasent les canaux conducteurs de la tige."
    },
    {
      icon: <Droplet className="h-6 w-6 text-blue-500" />,
      title: "2. L'Eau Pure",
      description: "Placez votre bouquet dans un vase propre rempli d'eau tiède. Retirez toutes les feuilles qui se trouvent sous le niveau de l'eau pour éviter la prolifération des bactéries.",
      tip: "Changez l'eau complètement tous les 2 jours."
    },
    {
      icon: <ThermometerSun className="h-6 w-6 text-amber-500" />,
      title: "3. L'Emplacement Idéal",
      description: "Exposez vos fleurs dans un endroit frais, à l'abri de la lumière directe du soleil, des courants d'air et loin de vos coupes de fruits.",
      tip: "Les fruits mûrs (comme les bananes) dégagent de l'éthylène, un gaz qui fait vieillir les fleurs prématurément !"
    }
  ];

  // Données de la FAQ
  const faqs = [
    { q: "Pourquoi mon hortensia baisse-t-il la tête ?", a: "Les hortensias boivent énormément par la fleur. Plongez la tête entière du bouquet dans un bain d'eau fraîche pendant 10 minutes pour le réhydrater par le haut !" },
    { q: "Faut-il utiliser les sachets de nourriture fournis ?", a: "Oui ! Ils contiennent du sucre pour nourrir la corolle et un antibactérien léger pour garder l'eau saine." },
    { q: "Que faire si mes roses fanent trop vite ?", a: "Recoupez la tige un peu plus haut et plongez le bas de la tige dans de l'eau très chaude pendant 30 secondes avant de la remettre dans son vase d'eau fraîche." }
  ];

  // Configurations d'animation réutilisables (Variantes)
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-stone-50 via-white to-rose-50/20 overflow-hidden">
      
      {/* ─── EN-TÊTE DE LA PAGE (ANIMÉ) ─── */}
      <header className="max-w-3xl mx-auto text-center px-4 mb-20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-rose-600 mb-4"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Le secret des fleurs</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight"
        >
          Prendre soin de votre <br />
          <span className="italic font-normal text-rose-600">Poésie Végétale</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-sm font-light text-muted max-w-md mx-auto"
        >
          Un bouquet de chez FloraConnect est vivant. Suivez ces gestes simples pour prolonger son éclat et murmurer son parfum pendant des semaines.
        </motion.p>
      </header>

      {/* ─── LES ÉTAPES EN GRILLE ANIMÉE ─── */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }} // Animation d'élévation au survol
            className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 shadow-inner">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl font-medium text-dark">{step.title}</h3>
              <p className="text-xs font-light text-muted leading-relaxed">{step.description}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-dashed border-stone-100 bg-rose-50/40 -mx-8 -mb-8 p-6 rounded-b-[2rem]">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide block mb-1">Astuce d'artisan</span>
              <p className="text-[11px] font-light text-rose-900/80 italic">{step.tip}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ─── SECTION INTERACTIVE DE FAQ (ACCORDÉON ANIMÉ) ─── */}
      <section className="max-w-3xl mx-auto px-4 mt-32">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-2 mb-12"
        >
          <Heart className="h-5 w-5 text-rose-500 mx-auto" />
          <h2 className="font-serif text-2xl font-medium text-dark">Au chevet de vos fleurs</h2>
          <p className="text-xs font-light text-muted">Des réponses à vos questions les plus fréquentes.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-stone-200/60 rounded-2xl bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-stone-50/50"
              >
                <span className="text-sm font-medium text-dark">{faq.q}</span>
                <motion.div
                  animate={{ rotate: activeFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted" />
                </motion.div>
              </button>

              {/* Animation fluide d'ouverture de la FAQ */}
              <AnimatePresence initial={false}>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs font-light text-muted leading-relaxed border-t border-stone-50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}