
import axios from "axios";
import Cookies from 'js-cookie';

const baseURL = 'http://127.0.0.1:8000';
const token   =  Cookies.get('access')
const enrollInCourse =  async(teacherId:number) => {
    const res =  await  axios.post(`${baseURL}/enroll/${teacherId}/` ,  {} , {
        headers:{
            Authorization:`Bearer ${token}`
        },
        withCredentials:true
    });
    return  res.data
}

export default   enrollInCourse