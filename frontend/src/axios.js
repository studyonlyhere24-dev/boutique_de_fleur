import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // 💡 L'adresse du serveur Node.js de ton amie
  withCredentials: true,             // 🔑 CRUCIAL : Permet l'envoi et la réception automatique des cookies/JWT
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;