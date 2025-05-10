
import  axios from  "axios"
import  Cookies from  "js-cookie"

const BASE_URL = "http://127.0.0.1:8000";

export const submitExam =  async(task_Id:number ,  answers:Record<number,string>) =>  {
    
    const token   =  Cookies.get('access')
    const  response  =  await  axios.post(
        `${BASE_URL}/submit-exam/${task_Id}/`,
        {answers},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return  response.data
}