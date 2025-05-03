
import  axios from  "axios"

export  async  function  verifyPasskey(passkey:number ) : Promise<string> {
    try {
        
        const response  =  await  axios.post<{message:string}> ('http://127.0.0.1:8000/verify-passky/',
            
            {admin_passkey:passkey}
            
            );
        return   response.data.message
    } catch (error) {
    console.log('Failed to validate the passkey');
    return 'Validation failed';
    }
}  