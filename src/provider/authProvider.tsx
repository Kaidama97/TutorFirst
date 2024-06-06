import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../initSupabase';
import { Session, AuthChangeEvent, User } from '@supabase/supabase-js';
import {  Alert } from 'react-native';

type ContextProps = {
  user: null | boolean;
  session: Session | null;
  username: string | null;
  loading: boolean;
  signOut: () => void;
  initialRegister: (registerProps: RegisterProps) => Promise<void>;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

interface RegisterProps {
  username: string;
  firstname: string;
  lastname: string
  phonenumber: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  school: string;
  description: string;
}

const AuthProvider = (props: Props) => {
  // user null = loading
  const [user, setUser] = useState<null | boolean>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUsername = async (sessionUser: User | undefined) => {
    if (!sessionUser) return;
    try {

      console.log("is loading?", loading);
      const { data, error, status } = await supabase
        .from('users')
        .select('username')
        .eq('userid', sessionUser.id)
        .single();
      console.log("get username", data, status);
      if (error) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
    } else {
      setSession(data.session);
      setUser(data.session ? true : false);
      await getUsername(data.session?.user);
      console.log("fetch", data.session, user, username);
    }
  };

  useEffect(() => {


    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setUser(session ? true : false);
        await getUsername(session?.user);
        console.log("on auth change", session, user, username);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setSession(null);
      setUsername(null);
      
    } catch (error) {
      console.log(error);
    }


  }


  const initialRegister = async ({
    username,
    firstname,
    lastname,
    phonenumber,
    dateOfBirth,
    gender,
    nationality,
    school,
    description
  }: RegisterProps): Promise<void> => {
    if (!session?.user) {
      Alert.alert('No user session available');
      return;
    }
    try {
      const updates = {
        userid: session?.user.id,
        username: username,
        firstname: firstname,
        lastname: lastname,
        phonenumber: phonenumber,
        dateofbirth: dateOfBirth,
        gender: gender,
        nationality: nationality,
        school: school,
        description: description,
      }
      const { data, error } = await supabase.from('users').upsert(updates).select();
      if (error) {
        throw error
      } else {
        setUsername(username);
      }
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert(e.message)
      }

    }
  }

  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        username,
        loading,
        signOut,
        initialRegister,

      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
