import { supabase } from "@/src/initSupabase";

// Function to fetch classes taught by a specific tutor (based on userid under classtutor)
const fetchTeacherClasses = async (userId: string) => {
  try {
    // Step 1: Fetch classid entries from classtutor where userid matches
    const { data: classTutorEntries, error: tutorError } = await supabase
      .from('classtutor')
      .select('classid')
      .eq('userid', userId);

    if (tutorError) {
      throw tutorError;
    }

    if (!classTutorEntries || classTutorEntries.length === 0) {
      return [];
    }

    // Extract classids from classTutorEntries
    const classIds = classTutorEntries.map((entry: any) => entry.classid);

    // Step 2: Fetch detailed class information from the classes table
    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .in('classid', classIds)
      .order('classid', { ascending: true });

    if (classesError) {
      throw classesError;
    }

    return classesData || [];
  } catch (error: any) {
    console.error('Error fetching teacher classes:', error.message);
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


export { fetchTeacherClasses, getRecurringDates, deleteClass};
