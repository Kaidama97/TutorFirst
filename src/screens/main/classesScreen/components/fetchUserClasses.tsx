import { supabase } from '../../../../initSupabase';

// Function to fetch classes based on user's attendance
const fetchClasses = async (userId: string) => {
  try {
    const { data: attendedClasses, error: attendError } = await supabase
      .from('classattendee')
      .select('classid')
      .eq('userid', userId);

    if (attendError) {
      throw attendError;
    }

    const attendedClassIds = attendedClasses.map((entry: any) => entry.classid);

    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .in('classid', attendedClassIds)
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

const getRecurringDates = (startDate: string, weeks: number = 4) => {
  const dates = [];
  const start = new Date(startDate);

  for (let i = 0; i < weeks; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + i * 7);
    dates.push(nextDate.toISOString().split('T')[0]);
  }

  return dates;
};

// Function to delete a class for a specific user
const deleteClass = async (userId: string, classId: string) => {
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


export { fetchClasses, getRecurringDates, deleteClass};
