import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { supabase } from './supabase';
import type { UserProfile } from '../types/user';

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  // Create Supabase profile
  const profile = await createSupabaseProfile(credential.user, displayName);
  return profile;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

async function createSupabaseProfile(
  firebaseUser: User,
  displayName: string
): Promise<UserProfile> {
  const profile: Partial<UserProfile> = {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName,
    nativeLanguage: 'es-MX',
    targetLanguage: 'en-US',
    currentLevel: 'beginner',
    dailyGoal: 10,
    soundEnabled: true,
    hapticsEnabled: true,
    notificationEnabled: true,
    timezone: 'America/Mexico_City',
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function getSupabaseProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as UserProfile;
}

export async function updateSupabaseProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}
