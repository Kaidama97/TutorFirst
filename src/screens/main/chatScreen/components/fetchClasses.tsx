import { supabase } from '../../../../initSupabase';

// fetchClasses.js

export const fetchClasses = async (userId: string) => {
  // Fetch class IDs from classattendance
  const { data: attendanceData, error: attendanceError } = await supabase
    .from('classattendee')
    .select('classid')
    .eq('userid', userId);

  if (attendanceError) {
    console.error('Error fetching class IDs:', attendanceError.message);
    return [];
  }

  const classIds = attendanceData.map(item => item.classid);

  // Fetch classes using the class IDs
  const { data: classesData, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .in('classid', classIds);

  if (classesError) {
    console.error('Error fetching classes:', classesError.message);
    return [];
  }

  return classesData;
};
