import { useState } from 'react';
import { Sparkles, Lock, Mail, Eye, EyeOff, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // États de bascule pour l'API
  const [isAdmin, setIsAdmin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // 💡 Nouveau : Mode mot de passe oublié
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccessMessage('');
  setIsLoading(true);

  try {
    if (isForgotPassword) {
      // ─── API : MOT DE PASSE OUBLIÉ ───
      const response = await api.post('/api/client/forgotpassword', { email });
      setSuccessMessage(response.data.message || 'Un e-mail de récupération a été envoyé.');
      setIsLoading(false);
    } else {
      // ─── API : CONNEXION CLASSIQUE ───
      if (isAdmin && password.length < 6) {
        setError('Le mot de passe administrateur doit contenir au moins 6 caractères.');
        setIsLoading(false);
        return;
      }

      // On cible la bonne route selon l'onglet actif
      const targetRoute = isAdmin ? '/api/auth/login' : '/api/auth/login';
      
     await api.post(targetRoute, { email, password });
      
      // Si le serveur répond avec succès, le cookie est déjà enregistré par le navigateur !
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(isAdmin ? 'admin' : 'client');
      }
    }
  } catch (err) {
    setIsLoading(false);
    // On récupère le message d'erreur renvoyé par son modèle Node.js
    setError(err.response?.data?.message || 'Identifiants incorrects ou problème de serveur.');
  }
};
 

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-gradient-to-b from-sage-50/30 to-powder-50/20 p-8 rounded-[2rem] border border-sage-100 shadow-sm transition-all">
        
        {/* En-tête dynamique */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-powder-100 text-powder-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-3xl font-medium text-dark tracking-tight">Maison Florale</h2>
          <p className="text-xs font-light text-muted">
            {isForgotPassword 
              ? "Récupération de votre compte" 
              : "FloraConnect — Portail d'authentification"
            }
          </p>
        </div>

        {/* Onglets cachés en mode "Mot de passe oublié" car la réinitialisation cible le token Client */}
        {!isForgotPassword && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/60 rounded-xl border border-gray-100">
            <button
              type="button"
              onClick={() => { setIsAdmin(false); setError(''); setSuccessMessage(''); }}
              className={`h-9 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${!isAdmin ? 'bg-white shadow-sm text-sage-700 font-semibold' : 'text-muted hover:text-dark'}`}
            >
              <User className="h-3.5 w-3.5" /> Boutique Client
            </button>
            <button
              type="button"
              onClick={() => { setIsAdmin(true); setError(''); setSuccessMessage(''); }}
              className={`h-9 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${isAdmin ? 'bg-white shadow-sm text-sage-700 font-semibold' : 'text-muted hover:text-dark'}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Tableaux Admin
            </button>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-4 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Message de succès (très important pour rassurer le client qu'un mail est parti) */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs px-4 py-3 rounded-xl font-medium leading-relaxed">
            {successMessage}
          </div>
        )}

        {/* Formulaire Unique Dynamique */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Champ Email (Toujours requis) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-dark uppercase tracking-wider block">
              Identifiant Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl pl-11 pr-4 text-sm focus:border-sage-500 focus:outline-none bg-white shadow-sm transition-colors"
                placeholder={isAdmin ? "admin@floraconnect.com" : "votre.email@exemple.com"}
              />
            </div>
          </div>

          {/* Champ Mot de passe (Caché si mode mot de passe oublié) */}
          {!isForgotPassword && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-dark uppercase tracking-wider block">
                  Mot de passe
                </label>
                
                {/* 💡 LIEN MOT DE PASSE OUBLIÉ */}
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMessage(''); }}
                  className="text-[11px] font-medium text-sage-600 hover:text-sage-700 hover:underline transition-all"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 border border-gray-200 rounded-xl pl-11 pr-11 text-sm focus:border-sage-500 focus:outline-none bg-white shadow-sm transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Bouton d'action principal */}
          <div className="pt-2">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-sage-600 to-sage-700 text-white font-semibold text-sm shadow-md shadow-sage-600/10 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isForgotPassword ? (
                "Recevoir le lien de secours"
              ) : isAdmin ? (
                "Connexion Super-Admin"
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

        </form>

        {/* Pied de page avec bouton retour si on est en mode oubli */}
        <div className="text-center pt-1">
          {isForgotPassword ? (
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMessage(''); }}
              className="text-xs font-medium text-muted hover:text-dark inline-flex items-center gap-1.5 hover:underline transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Retour à la connexion
            </button>
          ) : (
            <p className="text-[11px] font-light text-muted">
              {isAdmin 
                ? "Accès réservé au personnel de gestion de la plateforme FloraConnect." 
                : "Pas encore de compte ? Passez commande pour enregistrer vos coordonnées automatiquement."
              }
            </p>
          )}
        </div>

      </div>
    </div>
  );
}