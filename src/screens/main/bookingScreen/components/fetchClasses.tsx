import { supabase } from '../../../../initSupabase';

// Function to fetch data from Supabase
const fetchClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        classtutor (
          users (
            firstname,
            description,
            profilepicture,
            userid
          )
        ),
        classattendee (
          classid
        )
      `);

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
