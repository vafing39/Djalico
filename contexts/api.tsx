import AsyncStorage from '@react-native-async-storage/async-storage';

export async function logIn(username:any, password:any) {
  try {
    const response = await fetch('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.token) {
      await AsyncStorage.setItem('@jwt_token', data.token);
      return data.token;
    } else {
      throw new Error(data.message || 'Échec de la connexion');
    }
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
}

export async function fetchUsers() {
  try {
    const token = await AsyncStorage.getItem('@jwt_token');
    if (!token) throw new Error('Token manquant');

    const res = await fetch('https://djalico.com/wp-json/wp/v2/Users', {
      headers: {
        Authorization: `Bearer ${token}`, // ajoute le token JWT dans l'en-tête
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erreur ${res.status}: ${text}`);
    }

    return res.json();
  } catch (error) {
    console.error('Erreur fetchUsers:', error);
    throw error;
  }
}

