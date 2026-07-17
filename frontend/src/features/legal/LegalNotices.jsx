import { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';

// INCLUSION DES IMAGES DE PÉTALES
import petalPink from "../../assets/petal-pink.png";
import petalLavender from "../../assets/petal-lavender.png";
import petalMint from "../../assets/petal-mint.png";

const sources = [petalPink, petalLavender, petalMint];

// ─── FONCTION DE GÉNÉRATION HORS RENDU ───
const generateStaticPetals = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    src: sources[i % sources.length],
    left: Math.random() * 100,
    size: 20 + Math.random() * 25,
    duration: 15 + Math.random() * 15,
    delay: -Math.random() * 20,
    dx: (Math.random() - 0.5) * 100,
    opacity: 0.2 + Math.random() * 0.3,
  }));
};

// ─── COMPOSANT PLUIE DE PÉTALES EN ARRIÈRE-PLAN ───
function PetalRain({ count = 10 }) {
  const [petals] = useState(() => generateStaticPetals(count));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      <style>{`
        @keyframes drift {
          0% { 
            transform: translateY(-10%) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: var(--petal-opacity, 0.4); }
          90% { opacity: var(--petal-opacity, 0.4); }
          100% { 
            transform: translateY(110vh) translateX(var(--dx, 100px)) rotate(360deg);
            opacity: 0;
          }
        }
        .custom-petal-animation {
          animation: drift linear infinite;
        }
      `}</style>

      {petals.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          className="absolute custom-petal-animation will-change-transform"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--dx": `${p.dx}px`,
            "--petal-opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ─── COMPOSANT MENTIONS LÉGALES ───
export default function LegalNotices() {

    useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="w-full min-h-screen relative bg-transparent pt-24 pb-32">
      
      {/* PLUIE DE PÉTALES EN ARRIÈRE-PLAN */}
      <PetalRain count={12} />

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* EN-TÊTE */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-sage-600 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-powder-500 animate-ping"></span> Transparence & Confiance
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-dark">
            Mentions <span className="italic font-normal text-powder-500 bg-gradient-to-r from-powder-500 to-sage-500 bg-clip-text text-transparent">Légales</span>
          </h1>
          <p className="text-sm font-light text-muted max-w-lg mx-auto">
            Veuillez lire attentivement les présentes mentions légales régissant l'utilisation de la plateforme Maison Florale.
          </p>
        </div>

        {/* CONTENEUR DES SECTIONS LÉGALES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-stone-100 shadow-sm p-8 sm:p-12 space-y-12"
        >
          
          {/* Section 1 : Éditeur */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              01. Éditeur du site
            </h2>
            <div className="text-sm font-light leading-relaxed text-muted space-y-2">
              <p>Le présent projet d'application est édité par la boutique physique :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Nom de l'entreprise :</strong> Maison Florale</li>
                <li><strong>Adresse de la boutique :</strong> Quartier Edimco, Béjaïa, Algérie</li>
                <li><strong>Email de contact :</strong> contact@MaisonFlorale.dz</li>
                <li><strong>Téléphone :</strong> +213 (0) 550 12 34 56</li>
              </ul>
            </div>
          </section>

          {/* Section 2 : Développeurs (NOUVEAU) */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              02. Conception & Développement
            </h2>
            <div className="text-sm font-light leading-relaxed text-muted space-y-2">
              <p>L'application Maison Florale a été pensée, conçue et développée par :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Développeur Frontend :</strong> Lyazidi Manel </li>
                <li><strong>Développeur Backend :</strong> Abid Khalida</li>
              </ul>
            </div>
          </section>

          {/* Section 3 : Hébergement (MODIFIÉ) */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              03. Hébergement
            </h2>
            <div className="text-sm font-light leading-relaxed text-muted space-y-2">
              <p>
                Le présent système d'information (site web et base de données) est actuellement en phase de développement/test et exploité en environnement local. L'application n'est pas encore hébergée sur un serveur public externe.
              </p>
            </div>
          </section>

          {/* Section 4 : Propriété intellectuelle */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-powder-600 border-b border-powder-100 pb-2">
              04. Propriété intellectuelle
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              L'ensemble de ce site relève de la législation en vigueur sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables, le code source, et les représentations iconographiques et photographiques (images de bouquets, compositions sur-mesure, design de l'interface).
              La reproduction de tout ou partie de ce site est formellement interdite sans autorisation expresse de l'équipe de développement et des propriétaires de la boutique.
            </p>
          </section>

          {/* Section 5 : Données personnelles */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              05. Données personnelles et Cookies
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              Conformément à la réglementation applicable en matière de protection des données, Maison Florale s'engage à préserver la confidentialité des informations fournies en ligne par l'utilisateur. Les données collectées (nom, téléphone, adresse) lors de la commande ne sont utilisées que dans le cadre du traitement interne et de la livraison par la boutique d'Edimco. 
            </p>
          </section>

          {/* Section 6 : Litiges */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              06. Droit applicable et litiges
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              Les présentes mentions légales sont soumises au droit algérien. En cas de litige, et à défaut d'accord amiable, les tribunaux de Béjaïa seront seuls compétents.
            </p>
          </section>

        </motion.div>

        {/* PIED DE PAGE OPTIONNEL */}
        <div className="text-center pt-8">
           <a href="/" className="inline-flex h-10 items-center justify-center rounded-full border border-sage-200 bg-white/60 px-6 text-sm font-medium text-sage-700 transition-all hover:bg-sage-50">
             Retour à la boutique
           </a>
        </div>

      </div>
    </div>
  );
}