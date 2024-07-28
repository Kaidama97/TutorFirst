import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../initSupabase';
import { Session, AuthChangeEvent, User } from '@supabase/supabase-js';
import { Alert } from 'react-native';

type ContextProps = {
  user: null | boolean;
  session: Session | null;
  username: string | null;
  loading: boolean;
  isWelcomeCompleted: boolean;
  userData: UserProps | null;
  signOut: () => void;
  refreshUserData: () => void;
  editProfile: (editProfileProps: EditProfileProps) => Promise<void>;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleWelcomePressed: () => void;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

interface EditProfileProps {
  username: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  school: string;
  description: string;
  favourite_subjects: string[];
}

interface UserProps {
  username: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  dateofbirth: Date;
  gender: string;
  nationality: string;
  school: string;
  roleid: string;
  description: string;
  createdat: Date;
}

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<null | boolean>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isWelcomeCompleted, setIsWelcomeCompleted] = useState<boolean>(false);

  const getUserData = async (sessionUser: User | undefined) => {
    if (!sessionUser) {
      console.log('No session user');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log('Fetching user data for:', sessionUser.id);
      const { data, error } = await supabase
        .from('users')
        .select('username, firstname, lastname, phonenumber, dateofbirth, gender, nationality, school, description, createdat, roleid')
        .eq('userid', sessionUser.id)
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        console.log('User data fetched:', data);
        setUsername(data.username);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        console.log('Session fetched:', data.session);
        setSession(data.session);
        setUser(data.session ? true : false);
        await getUserData(data.session?.user);
      }
    } catch (error) {
      console.error('Error in fetchSession:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      console.log('Login successful:', data);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session ? true : false);
        await getUserData(session?.user);
        setLoading(false);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      console.log('Sign out successful');
      setUser(null);
      setSession(null);
      setUsername(null);
      setUserData(null);
    } catch (error) {
      console.log('Error during sign out:', error);
    } finally {
      setLoading(false);
    }
  };

  const editProfile = async ({
    username,
    firstname,
    lastname,
    phonenumber,
    dateOfBirth,
    gender,
    nationality,
    school,
    description,
    favourite_subjects
  }: EditProfileProps): Promise<void> => {
    if (!session?.user) {
      Alert.alert('No user session available');
      return;
    }
    try {
      setLoading(true);
      const updates = {
        userid: session?.user.id,
        username,
        firstname,
        lastname,
        phonenumber,
        dateofbirth: dateOfBirth,
        gender,
        nationality,
        school,
        description,
        favourite_subjects,
      };
      const { data, error } = await supabase.from('users').upsert(updates).select();
      if (error) {
        throw error;
      } else {
        console.log('Profile updated:', data);
        setUsername(username);
        await getUserData(session?.user); // Refresh user data
      }
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = useCallback(() => {
    if (session?.user) {
      getUserData(session.user);
    }
  }, [session?.user]);

  const handleWelcomePressed = () => {
    setIsWelcomeCompleted(true);
    console.log('welcome pressed', isWelcomeCompleted);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        username,
        loading,
        isWelcomeCompleted,
        userData,
        signOut,
        editProfile,
        refreshUserData,
        handleLogin,
        handleWelcomePressed,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
