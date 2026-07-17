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

// ─── COMPOSANT CONDITIONS GÉNÉRALES DE VENTE ───
export default function CGV() {

  // Remonter en haut de la page au chargement
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
            <span className="h-1.5 w-1.5 rounded-full bg-powder-500 animate-ping"></span> Engagements & Services
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-dark">
            Conditions Générales de <span className="italic font-normal text-powder-500 bg-gradient-to-r from-powder-500 to-sage-500 bg-clip-text text-transparent">Vente</span>
          </h1>
          <p className="text-sm font-light text-muted max-w-lg mx-auto">
            Veuillez lire attentivement nos conditions avant de valider votre commande sur FloraConnect.
          </p>
        </div>

        {/* CONTENEUR DES SECTIONS LÉGALES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-stone-100 shadow-sm p-8 sm:p-12 space-y-12"
        >
          
          {/* Section 1 : Objet */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              01. Objet et Champ d'Application
            </h2>
            <div className="text-sm font-light leading-relaxed text-muted space-y-2">
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la boutique <strong>FloraConnect</strong> (située à Edimco, Béjaïa) et toute personne effectuant un achat via notre plateforme de vente en ligne. En validant votre commande, vous acceptez l'intégralité de ces conditions.
              </p>
            </div>
          </section>

          {/* Section 2 : Nos Créations */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-powder-600 border-b border-powder-100 pb-2">
              02. Nos Créations (Produits & Sur-mesure)
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              Les photographies de nos bouquets "Prêts-à-Emporter" sont fournies à titre indicatif. Les fleurs étant un produit naturel et vivant, de légères variations de couleur ou de taille peuvent survenir en fonction de la saisonnalité et des arrivages. Pour les créations "Sur-mesure", nos artisans s'engagent à respecter l'esprit, les teintes et la valeur globale des options choisies.
            </p>
          </section>

          {/* Section 3 : Tarifs et Paiement */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              03. Tarifs et Modalités de Paiement
            </h2>
            <div className="text-sm font-light leading-relaxed text-muted space-y-2">
              <p>
                Nos prix sont indiqués en Dinars Algériens (DA) et sont toutes taxes comprises (TTC). FloraConnect se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Le paiement s'effectue à la livraison ou au retrait en boutique (Edimco).</li>
                <li>D'autres modalités (ex: BaridiMob) peuvent être convenues en contactant notre service client.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 : Livraison et Retrait */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              04. Retrait en Boutique et Livraison
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              Les commandes peuvent être retirées directement dans notre boutique physique située à Edimco, Béjaïa. Si vous optez pour la livraison, celle-ci s'effectue dans le périmètre de Béjaïa et ses environs selon les créneaux horaires convenus lors de la commande. En cas d'absence du destinataire, nos livreurs tenteront de vous contacter pour trouver une solution.
            </p>
          </section>

          {/* Section 5 : Rétractation */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-powder-600 border-b border-powder-100 pb-2">
              05. Annulation et Droit de Rétractation
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              Conformément à la législation relative aux produits périssables, <strong>le droit de rétractation ne s'applique pas aux fleurs fraîches et compositions florales</strong>. Toute commande de créations florales validée est considérée comme ferme et définitive. Les annulations ne sont possibles que si elles sont demandées au moins 24 heures avant la date prévue de livraison ou de retrait.
            </p>
          </section>

          {/* Section 6 : Litiges et Service Client */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 border-b border-sage-100 pb-2">
              06. Service Clientèle et Litiges
            </h2>
            <p className="text-sm font-light leading-relaxed text-muted">
              Pour toute question, réclamation ou suivi de commande, notre service client est à votre disposition par e-mail (contact@floraconnect.dz) ou par téléphone. En cas de litige, nous privilégions toujours une solution amiable. À défaut, les tribunaux de Béjaïa seront seuls compétents.
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