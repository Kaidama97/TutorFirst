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
    setLoading(true);
    if (!sessionUser) return;
    try {

      const { data, error } = await supabase
        .from('users')
        .select('username, firstname, lastname, phonenumber, dateofbirth, gender, nationality, school, description, createdat, roleid')
        .eq('userid', sessionUser.id)
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
        setUserData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false); // Set loading to false when done
    }
  };

  const fetchSession = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      setLoading(false);
    } else {
      setSession(data.session);
      setUser(data.session ? true : false);
      await getUserData(data.session?.user);
      setLoading(false); // Set loading to false when done
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw error;

  }

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
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

      setUser(null);
      setSession(null);
      setUsername(null);
    } catch (error) {
      console.log(error);
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
        favourite_subjects: favourite_subjects,
      };
      const { data, error } = await supabase.from('users').upsert(updates).select();
      console.log(data);
      if (error) {
        throw error;
      } else {
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
  }, [userData]);

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
