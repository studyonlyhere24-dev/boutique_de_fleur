// src/styles/theme.js

export const theme = {
  colors: {
    // Les couleurs de ton "mix aesthetic"
    primary: '#6D9886',       // Vert Sauge doux (boutons, liens actifs)
    primaryHover: '#5F8475',  // Vert Sauge un peu plus soutenu
    secondary: '#F1A7A7',     // Rose Poudré (accents, badge panier)
    secondaryHover: '#E89696',// Rose un peu plus soutenu
    
    // Les bases neutres épurées
    background: '#FFFFFF',    // Fond pur pour un rendu épuré
    surface: '#FBFBFB',       // Très léger gris/blanc cassé pour les cartes
    text: '#393E46',          // Gris très foncé (plus doux que le noir pur)
    textMuted: '#929AAB',     // Gris moyen pour les textes secondaires
    border: '#EEEEEE',        // Bordures ultra-fines et discrètes
    danger: '#E57373',        // Rouge adouci
  },
  fonts: {
    // Polices Google Fonts à ajouter dans votre index.html pour le rendu pro :
    // <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    main: "'Poppins', sans-serif",         // Moderne, propre
    heading: "'Playfair Display', serif" // Élégant, floral pour les titres
  },
  borderRadius: {
    small: '6px',
    medium: '12px',      // Plus de rondeur pour la douceur
    large: '24px',       // Pour les grands blocs
    pill: '50px'         // Pour les badges et certains boutons
  },
  shadows: {
    subtle: '0 4px 20px rgba(0,0,0,0.02)', // Ombre à peine visible
    medium: '0 8px 30px rgba(109, 152, 134, 0.05)' // Ombre douce teintée de vert
  }
};