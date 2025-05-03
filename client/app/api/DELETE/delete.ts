

import  axios from  "axios"
import Cookies from "js-cookie"

export const  deleteProfile =  async():Promise<string> => {
    const confirmed =  confirm('Are you sure you want to delete this profile')
    const token = Cookies.get('access')

    if (!token){
        throw new Error('No token  found ')
    }
    const response  =  await  axios.delete<{message:string}> 
    ('http://127.0.0.1:8000/delete-teacher-profile/',{
        headers:{
            Authorization :  `Bearer ${token}`
        }
    });
    return response.data.message
}