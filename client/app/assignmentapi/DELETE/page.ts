
import  axios from  "axios"
import  Cookies from 'js-cookie'

const BASE_URL = "http://127.0.0.1:8000";

export  async  function deleteTask(task_id:number):Promise<string> {

    const token  =  Cookies.get('access')
    interface DeleteTaskResponse {
        message: string;
    }

    const response =  await  axios.delete<DeleteTaskResponse>(
        `${BASE_URL}/delete-task/${task_id}/`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return  response.data.message as string
}
