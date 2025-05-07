
'use client'
import { useState } from "react"
import { useParams } from "next/navigation"
import { assignTask } from "@/app/assignmentapi/POST/page"

type  Question = {

    question_text:string,
    option1  :string,
    option2:string,
    option3:string,
    option4:string,
    correct_answer:string

}

export  default  function  AssignTaskPage(){

    const  {student_id}  =  useParams()
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState('')
    const [questions, setQuestions] = useState<Question[]> ([])

    const [message, setMessage] = useState('')
    const handleQuestionChange =  (index:number, field:keyof Question,value:string) =>  {

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

        <div className="  p-6 min-h-screen bg-white">
                <h1> Assign  Task to  student of Roll  {student_id}</h1>
                <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border p-2 m-2 w-full  outline-none text-black"
                />
                <input 
                type="datetime-local" 
                value={deadline}
                onChange={(e) =>  setDeadline(e.target.value)}
                className=" border  p-2 m-2 w-full outline-none  text-black"
                />

                {questions.map((q,index) =>  (

                    <div 
                    key={index}
                    className=" mb-4 border p-4 rounded"
                    >
                            <input 
                            type="text"
                            placeholder="Question"
                            value={q.question_text}
                            onChange={(e) => handleQuestionChange(index,'question_text' ,e.target.value)}
                            className="border p-2 mb-2 w-full  text-black"
                            />
                        {(['option1', 'option2', 'option3', 'option4', 'correct_answer'] as (keyof Question)[]).map((field) => (
                        <input 
                            key={field}
                            type="text"
                            value={q[field]}
                            placeholder={field}
                            onChange={(e) => handleQuestionChange(index, field, e.target.value)}
                            className="border p-2 mb-2 w-full text-black"
                        />
                        ))}

                    </div>
                ))}

                <button
                onClick={addQuestions}
                 className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Add Another Question
                </button>
                <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
                    Submit Task
                </button>
                {message  && 
                <p  className="mt-4 text-green-600">
                    {message}
                </p>
                }
        </div>
    )

}