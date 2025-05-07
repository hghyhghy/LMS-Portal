
import  axios from  "axios"
import  Cookies from "js-cookie"
type Task = {
    id: number
    title: string
    deadline: string
    student_name: string
  }
  

const BASE_URL = "http://127.0.0.1:8000";
export  async  function fetchMytasks():Promise<Task []> {
    const token  =  Cookies.get('access')
    const response  =  await  axios.get(
        `${BASE_URL}/my-tasks/`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )
    return  response.data as Task[];
}