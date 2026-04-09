import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types/user';
import { onAuthChange, getSupabaseProfile, loginUser, registerUser, logoutUser } from '../services/auth';
import { isFirebaseConfigured } from '../services/firebase';

function friendlyAuthError(err: any): string {
  const code = err?.code || '';
  if (!isFirebaseConfigured || code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
    return 'Firebase no esta configurado. Crea un archivo .env con tus credenciales de Firebase.';
  }
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya esta registrado.';
    case 'auth/invalid-email':
      return 'El correo electronico no es valido.';
    case 'auth/weak-password':
      return 'La contrasena es muy debil. Usa al menos 6 caracteres.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contrasena incorrectos.';
    case 'auth/network-request-failed':
      return 'Error de red. Verifica tu conexion a internet.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta de nuevo mas tarde.';
    default:
      return err.message || 'Error desconocido. Intenta de nuevo.';
  }
}

interface AuthState {
  firebaseUser: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setProfile: (profile: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: () => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          const profile = await getSupabaseProfile(user.uid);
          set({
            firebaseUser: user,
            profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            firebaseUser: user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        set({
          firebaseUser: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await loginUser(email, password);
    } catch (err: any) {
      set({ error: friendlyAuthError(err), isLoading: false });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await registerUser(email, password, displayName);
      set({ profile });
    } catch (err: any) {
      set({ error: friendlyAuthError(err), isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await logoutUser();
    set({ isLoading: false });
  },

  clearError: () => set({ error: null }),
  setProfile: (profile) => set({ profile }),
}));
