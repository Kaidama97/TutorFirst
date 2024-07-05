import { supabase } from "@/src/initSupabase";

interface Subjects {
    subjecttitle: string;
    subjectid: string;
}

interface FormattedJson {
    value: string;
    label: string;
}

export const fetchSubject = async () => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*');
    if (error) {
        console.error(error);
        return;
    }
    return handlSubjectJson(data);
}

const handlSubjectJson = (data: Subjects[]): FormattedJson[] => {
    return data.map((data) => ({
        value: data.subjectid,
        label: data.subjecttitle
    }));
}

export const getDays = () => {
    const data = require('../../../../constants/days.json');
    return data.map((data: { id: any; name: any; }) => ({
        value: data.id,
        label: data.name
    }));
}

const convertToTime = (date: Date): any => {
    // Format the time parts to ensure two digits
    const padToTwoDigits = (num: number) => num.toString().padStart(2, '0');

    const hours = padToTwoDigits(date.getUTCHours());
    const minutes = padToTwoDigits(date.getUTCMinutes());
    const seconds = padToTwoDigits(date.getUTCSeconds());

    // Construct the time string in the required format
    return `${hours}:${minutes}:00`;
}

interface CreateClassProp {
    title: string;
    subject: string;
    level: string;
    price: number;
    classSize: number;
    type: string;
    startTime: Date;
    endTime: Date;
    day: string;
    location: string;
    description: string;
    isRecursive: boolean;
    dates: any;
}
export const createClass = async ({
    title,
    subject,
    level,
    price,
    classSize,
    type,
    startTime,
    endTime,
    day,
    location,
    description,
    isRecursive,
    dates
}: CreateClassProp, session: any): Promise<void> => {
    const start = convertToTime(startTime);
    const end =  convertToTime(endTime);
    const class_date = new Date(dates[0]).toISOString().substring(0, 10);
    const details = {
        subjectid: subject,
        class_size: classSize,
        description: description,
        start_time: start,
        end_time: end,
        location: location,
        class_day: day,
        isrecursing: isRecursive,
        title: title,
        level: level,
        price: price,
        lesson_type: type,
        class_date
    }
    const { data, error } = await supabase.from('classes').upsert(details).select();
    if (error) {
        throw error;
    } 
    
        
    const { data: classTutorData, error: classTutorError } = await supabase.from('classtutor').upsert({userid: session?.user.id, classid: data[0].classid}).select();
    if (classTutorError) {
        throw error;
    } 
}

export const validateTime = (classes: any[], day: string ,time: Date) => {
    const filteredClasses = classes.filter(cls => cls.class_day.includes(day));
    console.log(filteredClasses)
}