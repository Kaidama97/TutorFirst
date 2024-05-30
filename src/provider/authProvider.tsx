import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../initSupabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

type ContextProps = {
  user: null | boolean;
  session: Session | null;
  signOut: () => void;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props : Props) => {
  // user null = loading
  const [user, setUser] = useState<null | boolean>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(data.session);
        setUser(data.session ? true : false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setUser(session ? true : false);
        console.log('Current session:', session);
        console.log('Current user state:', session ? true : false);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(false);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
