import { supabase } from '../../../../initSupabase';

// Function to fetch classes based on user's attendance
const fetchClasses = async (userId: string) => {
  try {
    // Fetch classes where the user is attending
    const { data: attendedClasses, error: attendError } = await supabase
      .from('classattendee')
      .select('classid')
      .eq('userid', userId);

    if (attendError) {
      throw attendError;
    }

    // Extract the list of class IDs attended by the user
    const attendedClassIds = attendedClasses.map((entry: any) => entry.classid);

    // Fetch details of classes where the user is attending based on class IDs
    const { data: classesData, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .in('classid', attendedClassIds) // Filter classes based on attendedClassIds
      .order('classid', { ascending: true });

    if (classesError) {
      throw classesError;
    }

    console.log("Classes:", classesData); // Log the response data
    return classesData || [];
  } catch (error: any) {
    console.error('Error fetching classes:', error.message); // Log the error message
    return [];
  }
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

export { fetchClasses, deleteClass };
