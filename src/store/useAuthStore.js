import { create } from 'zustand';
import { createMMKV} from 'react-native-mmkv';

const storage = createMMKV();

export const useAuthStore = create((set) => ({
  user: JSON.parse(storage.getString('user') || 'null'),
  token: storage.getString('token') || null,

  setUser: (user) => {
    set({ user });
    if (user) storage.set('user', JSON.stringify(user));
    else storage.delete('user');
  },

  setToken: (token) => {
    set({ token });
    if (token) storage.set('token', token);
    else storage.delete('token');
  },

  logout: () => {
    storage.delete('user');
    storage.delete('token');
    set({ user: null, token: null });
  },
}));