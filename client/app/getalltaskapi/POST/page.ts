
import  Cookies from  "js-cookie"
import  axios from  "axios"
const BASE_URL = "http://127.0.0.1:8000";

export  async function postGradedMarks(

    task_id:number,
    student_id:number,
    grading:Record<number,string>,
    marks: { [key: string]: number }
){

    const token  =  Cookies.get('access')
    const response  =  await  axios.post(
        `${BASE_URL}/grade-task/${task_id}/${student_id}/`,
        {grading:marks},
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    return  response.data
}