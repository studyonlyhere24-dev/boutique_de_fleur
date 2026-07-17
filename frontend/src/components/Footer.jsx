
import { Globe, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-stone-50/60 text-stone-600 border-t border-stone-200/80 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Colonne 1 : Brand */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-dark">FloraConnect</h3>
            <p className="text-xs font-light leading-relaxed max-w-xs text-muted">
              Votre artisan fleuriste digital. Des compositions exclusives livrées avec le plus grand soin.
            </p>
          </div>

          {/* Colonne 2 : Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-dark uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-xs font-light text-muted">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-sage-600" />
                <span>+213 (0) 555 55 55 55</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-sage-600" />
                <span>contact@floraconnect.com</span>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Réseaux Sociaux */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-dark uppercase tracking-wider">Nous suivre</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-sage-600 hover:border-sage-300 hover:shadow-sm transition-all">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-sage-600 hover:border-sage-300 hover:shadow-sm transition-all">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a href="#" className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-sage-600 hover:border-sage-300 hover:shadow-sm transition-all">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Barre de copyright */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-light text-muted">
          <p>© {new Date().getFullYear()} FloraConnect. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#mentions" className="hover:text-sage-600 transition-colors">Mentions légales</a>
            <span className="text-stone-300">|</span>
            <a href="#cgv" className="hover:text-sage-600 transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}