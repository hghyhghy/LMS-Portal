
import  axios from "axios"
import  Cookies from  "js-cookie"


export const removeStudent =  async(studentId:number) :  Promise<string> =>  {
    
    try {
        const token  =  Cookies.get('access')
        const response  =  await  axios.delete <{message:string}> (` http://127.0.0.1:8000/remove-student/${studentId}` , {
            headers:{
                Authorization:`Bearer ${token}`
            },
            withCredentials:true
        });
        
        return  response.data.message 
    } catch (error:any) {
        throw new Error(error.response?.data?.error || "Failed to remove student");

    }
}