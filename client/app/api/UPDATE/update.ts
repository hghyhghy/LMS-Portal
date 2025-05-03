

import  axios from  "axios"
import Cookies from "js-cookie"

export  type  Profile = {
    name:string,
    fees:number | null,
    duration:string,
    subject:string
}

export  const updateProfile =  async(profile:Profile):Promise<string> => {
    const token  = Cookies.get('access')
    if  (!token){
        throw  new Error('Token is not found')
    }
    const response  =  await axios.post<{message:string}>
    ('http://127.0.0.1:8000/update-teacher-profile/',
        profile,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )

    return  response.data.message

}
