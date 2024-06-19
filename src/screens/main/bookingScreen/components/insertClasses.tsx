// import necessary modules and supabase initialization
import { supabase } from '../../../../initSupabase';

// Function to add an attendee to a class in Supabase
const addClassAttendee = async (userId: any, classId: any) => {
  try {
    const { data, error } = await supabase
      .from('classattendee')
      .insert([
        { userid: userId, classid: classId }
      ]);

    if (error) {
      throw error;
    }

    console.log('New attendee added:', data);
    return data; // return the inserted data if needed
  } catch (error: any) {
    console.error('Error adding attendee:', error.message);
    throw error; // re-throw the error to handle it in the calling function
  }
};

export { addClassAttendee }; // Export the addClassAttendee function
