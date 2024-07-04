import { supabase } from '@/src/initSupabase';
import { AuthContext } from '@/src/provider/authProvider';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface UserDataProp {
  roleid: number;
}

const ClassesComponent: React.FC<{userData: any}> = ({ userData }) => {

    const [loading, setLoading] = useState(false);
    const [numberOfClasses, setNumberOfClasses] = useState(0); 
    const { session } = useContext(AuthContext);
    const fetchNumberOfClasses = async () => {
        try {
          setLoading(true);
          const { error, count } = userData.roleid == "1"
          ? await supabase
          .from('classtutor')
          .select('*', { count: 'exact', head: true })
          .eq('userid', session?.user?.id)
          : await supabase
          .from('classattendee')
          .select('*', { count: 'exact', head: true })
          .eq('userid', session?.user?.id);

          if (count) { 
            setNumberOfClasses(count);
          }
    
          if (error) throw error;
        } catch (e) {
          console.log("unable to fetch number of classes", e);
        } finally {
          setLoading(false);
        }
      }
      useEffect(() => {
        fetchNumberOfClasses();
      }, []);
    
    return (
        <View className='flex-1 w-full p-2 border-gray-300 border-b-2 border-t-2 justify-center items-center mb-2'>
        {loading ? <ActivityIndicator size="large" color="#0000ff"/> : <Text className='text-2xl font-bold p-3'>{ numberOfClasses }</Text>}
        {userData.roleid == "1" ? <Text className='text-lg text-gray-600'>Classes Created</Text> : <Text className='text-lg text-gray-600'>Classes joined</Text>}
      </View>
    )
}

export default ClassesComponent;