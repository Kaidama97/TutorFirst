import { supabase } from '../../../../initSupabase';

// Function to fetch data from Supabase
const fetchClasses = async (userId: string) => {
  try {
    // Fetch classes that the user is attending
    const { data: attendedClasses, error: attendError } = await supabase
      .from('classattendee')
      .select('classid')
      .eq('userid', userId);

    if (attendError) {
      throw attendError;
    }

    // Extract class IDs that the user is attending
    const attendedClassIds = attendedClasses.map((entry: any) => entry.classid);

    // Fetch classes that the user is not attending
    const { data, error } = await supabase
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
            subjects_taught
          )
        ),
        classattendee (
          classid
        )
      `)
      .not('classid', 'in', `(${attendedClassIds.join(',')})`);

    if (error) {
      throw error;
    }

    console.log("Classes:", data); // Log the response data
    return data || [];
  } catch (error: any) {
    console.error('Error fetching classes:', error.message); // Log the error message
    return [];
  }
};

export { fetchClasses };
