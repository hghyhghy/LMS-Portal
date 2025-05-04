
import  axios from "axios"
import Cookies from "js-cookie"

export   interface Student {
    id:number,
    name:string,
    email:string,
    gender:string,
    phone_number:string
}

export  interface  StudentResponse {
    teacher :  string,
    students:Student[],
    Available_Seats:number,

    
}

const token  = Cookies.get('access')
export const fetchStudents = async() : Promise<StudentResponse> => {
        try {
            
            const response = await  axios.get('http://127.0.0.1:8000/my-students/' ,  {
                headers:{
                    Authorization :  `Bearer ${token}` 
                }
            });
            return response.data as StudentResponse
        } catch (error:any) {
            throw new Error(error.response?.data?.message || "Failed to fetch students");
        }
}   