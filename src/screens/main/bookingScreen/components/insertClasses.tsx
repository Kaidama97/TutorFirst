import { supabase } from '../../../../initSupabase';

// Function to add an attendee to a class in Supabase
const addClassAttendee = async (userId: string, classId: string) => {
  try {
    // Check if the user is already an attendee of the class
    const { data: existingAttendee, error: checkError } = await supabase
      .from('classattendee')
      .select('*')
      .eq('userid', userId)
      .eq('classid', classId)
      .single(); // Assuming there's at most one record per user-class pair

    if (checkError && checkError.code !== 'PGRST116') {
      // Ignore "No rows found" error and handle other errors
      throw checkError;
    }

    if (existingAttendee) {
      console.log('User is already an attendee of this class');
      return { message: 'User is already an attendee of this class' };
    }

    // Insert new attendee
    const { data, error } = await supabase
      .from('classattendee')
      .insert([{ userid: userId, classid: classId }]);

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

const fetchUserBookedClasses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('classattendee')
      .select(`
        classid,
        classes (
          classid,
          title,
          description,
          level,
          location,
          lesson_type,
          class_date,
          start_time,
          end_time
        )
      `)
      .eq('userid', userId);

    if (error) {
      throw error;
    }

    // Extract classes data from the response
    const bookedClasses = data.map((attendee: any) => attendee.classes);

    console.log('Booked classes:', bookedClasses);
    return bookedClasses; // return the fetched classes
  } catch (error: any) {
    console.error('Error fetching booked classes:', error.message);
    throw error; // re-throw the error to handle it in the calling function
  }
};

export { addClassAttendee, fetchUserBookedClasses }; // Export the functions