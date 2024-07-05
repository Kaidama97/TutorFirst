import { useContext } from 'react';
import { supabase } from '../../../../initSupabase';


// Function to fetch classes and tutor names based on user's attendance
export const fetchClasses = async (userId: any, user: any) => {
  try {
    // Fetch classes that the user is attending
    const { data: classData, error: classError } =
      user?.roleid == "1" ?
        await supabase
          .from('classtutor')
          .select('classid')
          .eq('userid', userId)
        : await supabase
          .from('classattendee')
          .select('classid')
          .eq('userid', userId);

 
    if (classError) {
      throw classError;
    }
    if (!classData || classData.length === 0) {
      return [];
    }

    // Extract class IDs that the user is attending
    const classIds = classData.map((entry: any) => entry.classid);

    // if (classIds.length === 0) {
    //   return [];
    // }

    // Fetch classes and associated tutors
    const { data: classesData, error: classesError } = 
    user?.roleid == "1"
      ? await supabase
        .from('classes')
        .select('*')
        .in('classid', classIds)
        .order('classid', { ascending: true })
      : await supabase
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
        )
      `)
        .in('classid', classIds)
        .order('classid', { ascending: true });
    if (classesError) {
      throw classesError;
    }

    return classesData || [];
  } catch (error: any) {
    console.error('Error fetching classes:', error.message);
    return [];
  }
};

// Function to delete a class for a specific user
export const deleteClass = async (userId: string, classId: string) => {
  try {
    const { error } = await supabase
      .from('classattendee')
      .delete()
      .eq('userid', userId)
      .eq('classid', classId);

    if (error) {
      throw error;
    }

    console.log(`Class with ID ${classId} for user ${userId} deleted successfully.`);
  } catch (error: any) {
    console.error('Error deleting class:', error.message); // Log the error message
  }
};

export const getRecurringDates = (startDate: string, weeks: number = 4) => {
  const dates = [];
  const start = new Date(startDate);

  for (let i = 0; i < weeks; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + i * 7);
    dates.push(nextDate.toISOString().split('T')[0]);
  }

  return dates;
};

//export { fetchClasses, getRecurringDates, deleteClass };
