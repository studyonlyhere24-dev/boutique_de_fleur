import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { theme } from '../styles/theme';

export default function FlowerCard({ flower }) {
  const dispatch = useDispatch();

  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.medium,
      border: `1px solid ${theme.colors.border}`,
      padding: '16px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <img src={flower.image || 'https://via.placeholder.com/150'} alt={flower.nom} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: theme.borderRadius.small }} />
      <h3 style={{ fontFamily: theme.fonts.heading, color: theme.colors.text, margin: '12px 0 4px 0' }}>{flower.nom}</h3>
      <p style={{ color: theme.colors.textMuted, fontSize: '14px', height: '40px', overflow: 'hidden' }}>{flower.description}</p>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 'bold', color: theme.colors.primary, fontSize: '18px' }}>{flower.prix} €</span>
        <button 
          onClick={() => dispatch(addItem(flower))}
          style={{
            backgroundColor: theme.colors.primary,
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: theme.borderRadius.small,
            cursor: 'pointer',
            fontWeight: '600',
            transition: '0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = theme.colors.primaryHover}
          onMouseOut={(e) => e.target.style.backgroundColor = theme.colors.primary}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}