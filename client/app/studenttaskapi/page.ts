
import axios from 'axios';
import  Cookies from  "js-cookie"
const BASE_URL = "http://127.0.0.1:8000";

export  const  getStudentTasks =  async() => {
    
    const token  =  Cookies.get('access')
    const response  =  await  axios.get(
        `${BASE_URL}/student-tasks/`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return  response.data
}