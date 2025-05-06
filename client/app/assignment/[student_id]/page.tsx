
'use client'
import { useState } from "react"
import { useParams } from "next/navigation"
import { assignTask } from "@/app/assignmentapi/POST/page"


export  default  function  AssignTaskPage(){

    const  {student_id}  =  useParams()
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState('')
    const [questions, setQuestions] = useState([
        { question_text: '', option1: '', option2: '', option3: '', option4: '', correct_answer: '' },
      ]);

    const [message, setMessage] = useState('')
    const handleQuestionChange =  (index:number,  field: 'question_text' | 'option1' | 'option2' | 'option3' | 'option4' | 'correct_answer',  value:string) =>  {

        const updated = [...questions]
        updated[index][field] = value
        setQuestions(updated)
         
    }
    const addQuestions  =  () =>  {
        setQuestions([...questions , {question_text:'',option1:'',option2:'',option3:'',option4:'',correct_answer:''}])
    }
    const  handleSubmit = async() => {
        try {
            const payload=  {title,deadline,questions}
            const response =  await  assignTask(Number(student_id),  payload)
            setMessage(response)
        } catch (error : any) {
            console.log(error)
            setMessage('Error  posting assignmen')
        }
    }

    return (

        <div className="  p-6">
                <h1> Assign  Task to  student of Roll  {student_id}</h1>
                <input type="text" />
        </div>
    )

}