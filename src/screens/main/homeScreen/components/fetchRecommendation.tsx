import { supabase } from '../../../../initSupabase';

// Define the types for the returned data
interface User {
  id: string;
  favourite_subjects: string[];
}

interface Class {
  classtutor: Array<{
    users: {
      firstname: string;
      lastname: string;
      description: string;
      profilepicture: string;
      userid: string;
      subjects_taught: string[];
      gender: string; // Added gender field
    };
  }>;
  id: string;
  title: string;
  subject: string | string[] | null;
  description: string;
  level: string;
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

  return data?.favourite_subjects || [];
};
export const getRecommendedClasses = async (
  favouriteSubjects: string[],
  sortOption: string,
  genderFilter: string | null
): Promise<Class[]> => {
  // Fetch all classes and related tutor data
  const { data: allClasses, error: classError } = await supabase
    .from('classes')
    .select(`
      *,
      classtutor (
        users (
          firstname,
          description,
          profilepicture,
          userid,
          lastname,
          subjects_taught,
          gender
        )
      ),
      classattendee (
        classid
      )
    `);

  if (classError) {
    console.error(classError);
    return [];
  }

  // Filter classes based on favourite subjects
  const filteredClasses = allClasses.filter(cls => {
    if (cls.subject === null) {
      return false; // Skip classes with null subjects
    } else if (Array.isArray(cls.subject)) {
      return cls.subject.some((sub: string) => favouriteSubjects.includes(sub));
    } else {
      return favouriteSubjects.includes(cls.subject as string);
    }
  });

  // Filter by gender if specified
  const genderFilteredClasses = genderFilter
    ? filteredClasses.filter(cls => cls.classtutor.some((tutor: { users: { gender: string; }; }) => tutor.users.gender === genderFilter))
    : filteredClasses;

  // Sort classes based on the selected option
  const sortedClasses = genderFilteredClasses.sort((a, b) => {
    if (sortOption === 'gender') {
      // Gender-based sorting is handled in filtering
      return 0;
    }

    // Default sorting by title if not 'gender'
    return a.title.localeCompare(b.title);
  });

  return sortedClasses;
};

