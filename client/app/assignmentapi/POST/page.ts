
import axios from "axios";
import  Cookies from  "js-cookie"


const BASE_URL = "http://127.0.0.1:8000/"

type AssignTaskResponse = {
    message: string;
  };

  export async function assignTask(studentId: number, payload: any): Promise<string> {
    const token = Cookies.get("access");
  
    const response = await axios.post<AssignTaskResponse>(
      `${BASE_URL}/assign-task/${studentId}/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    return response.data.message; 
  }
  

