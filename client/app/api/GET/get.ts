
import  axios from  "axios"
import Cookies from "js-cookie"

export  type  Profile = {
    name:string,
    fees:number | null,
    duration:string,
    subject:string
}
export const fetchProfile = async (): Promise<Profile> => {
    const token = Cookies.get('access');
    if (!token) {
      throw new Error('Token not found in cookies');
    }
  
    const response = await axios.get<{ teacher_profile?: Profile }>(
        'http://127.0.0.1:8000/get-teacher-profile/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = response.data.teacher_profile;
  
    if (!data) {
      // Safely return default profile if nothing is returned
      return {
        name: "",
        subject: "",
        fees: null,
        duration: "",
      };
    }
  
    // Return full profile, fallback for missing fields
    return {
      name: data.name ?? "",
      subject: data.subject ?? "",
      fees: data.fees ?? null,
      duration: data.duration ?? "",
    };
  };
  