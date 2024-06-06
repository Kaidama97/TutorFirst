import { supabase } from '../../../../initSupabase';
import { PostgrestError } from '@supabase/supabase-js';

// Function to fetch data from Supabase
const fetchClasses = async () => {
  try {
    const { data: classes, error, status } = await supabase
      .from('classes')
      .select('*');

    console.log("Status:", status); // Log the status code
    
    if (error) {
      throw error;
    }

    console.log("Classes:", classes); // Log the response data
    return classes;
  } catch (error: any) { // Specify the type of error as 'any'
    console.error('Error fetching classes:', error.message); // Log the error message
    return [];
  }
};

// Other functions for inserting, updating, or deleting data can be defined similarly

export { fetchClasses };
