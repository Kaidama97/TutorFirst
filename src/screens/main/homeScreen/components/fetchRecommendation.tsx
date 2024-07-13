import { supabase } from '../../../../initSupabase';

// Define the types for the returned data
interface User {
  id: string;
  favourite_subjects: string[];
}

interface Class {
  id: string;
  title: string;
  subject: string | string[] | null; // Adjust based on your actual data structure
  description: string;
}

export const getUserFavouriteSubjects = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('users') // Specify the row type for users
    .select('favourite_subjects')
    .eq('userid', userId)
    .single();

  if (error) {
    console.error(error);
    return [];
  }

  console.log(data);
  return data?.favourite_subjects || [];
};

export const getRecommendedClasses = async (favouriteSubjects: string[]): Promise<Class[]> => {
  console.log(favouriteSubjects);
  
  // Fetch all classes and then filter based on the subject array
  const { data: allClasses, error: classError } = await supabase
    .from('classes')
    .select('*');

  if (classError) {
    console.error(classError);
    return [];
  }

  // Filter classes where at least one subject matches any favourite subject
  const recommendedClasses = allClasses.filter(cls => {
    if (cls.subject === null) {
      return false; // Skip classes with null subjects
    } else if (Array.isArray(cls.subject)) {
      return cls.subject.some((sub: string) => favouriteSubjects.includes(sub));
    } else {
      return favouriteSubjects.includes(cls.subject as string);
    }
  });

  console.log(recommendedClasses);
  return recommendedClasses;
};
