import { supabase } from '../../../../initSupabase';

export const fetchClasses = async (userId: string) => {
  // Fetch class IDs from classattendee
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

export const fetchTutorClasses = async (userId: string) => {
  // Fetch class IDs from classtutor
  const { data: tutorData, error: tutorError } = await supabase
    .from('classtutor')
    .select('classid')
    .eq('userid', userId);

  if (tutorError) {
    console.error('Error fetching class IDs for tutor:', tutorError.message);
    return [];
  }

  const classIds = tutorData.map(item => item.classid);


  // Fetch class details based on class IDs
  const { data: classesData, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .in('classid', classIds);

  if (classesError) {
    console.error('Error fetching class details for tutor:', classesError.message);
    return [];
  }

  return classesData;
};

interface Message {
  id: number;
  class_id: number;
  user_id: string;
  content: string;
  created_at: string;
}

async function fetchLatestMessagesForClasses(classIds: number[]): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, class_id, user_id, content, created_at')
      .in('class_id', classIds)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    throw new Error(`Error fetching latest messages: ${error}`);
  }
}

export { fetchLatestMessagesForClasses };