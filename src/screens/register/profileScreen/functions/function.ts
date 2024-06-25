

interface Gender {
  label: string;
  value: string;
}


interface Countries {
    name: string;
    iso2: string;
    iso3: string;
    capital: string;

}

interface School {
    school_name: string;

}
interface Subject {
  title: string;

}
interface FormattedJson {
    value: string;
    label: string;
  }

export const handleGenderJson = (data: Gender[]): FormattedJson[] => {
    return data.map((data) => ({
        value: data.value,
        label: data.label
    }));
} 


export const handleCountriesJson = (data: { data: Countries[]}): FormattedJson[] => {
    const val = data.data;
    return val.map((val) => ({
        value: val.name,
        label: val.name
    }));
} 

export const handleSchoolJson = (data: School[]): FormattedJson[] => {
    return data.map((data) => ({
        value: data.school_name,
        label: data.school_name
    }));
} 
export const handleSubjectJson = (data: Subject[]): FormattedJson[] => {
  return data.map((data) => ({
      value: data.title,
      label: data.title
  }));
} 

export const validateUsername = (username: string): string | null => {
    if (!username) {
      return "Username is required";
    }
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain alphanumeric characters and underscores";
    }
    return null;
  };

  export const validateFirstName = (firstName: string): string | null => {
    if (!firstName) {
      return "First name is required";
    }
    if (firstName.length < 2) {
      return "First name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      return "First name can only contain letters";
    }
    return null;
  };
  
  export const validateLastName = (lastName: string): string | null => {
    if (!lastName) {
      return "Last name is required";
    }
    if (lastName.length < 2) {
      return "Last name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return "Last name can only contain letters";
    }
    return null;
  };

  export const validatePhoneNumber = (phoneNumber: string): string | null => {
    if (!phoneNumber) {
      return "Phone number is required";
    }
    if (!/^[89]\d{7}$/.test(phoneNumber)) {
      return "Phone number must start with 8 or 9 and be exactly 8 digits";
    }
    return null;
  };