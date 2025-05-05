
from  rest_framework.decorators import  api_view,permission_classes
from rest_framework.permissions import  IsAuthenticated
from  rest_framework.response  import  Response
from rest_framework  import status
from  django.shortcuts  import  get_object_or_404
import  datetime
from  ...models  import  Task,Question,StudentProfile,TeacherProfile

@api_view(['POST'])
@permission_classes([IsAuthenticated])

def assign_task(request,student_id):
    teacher  =  get_object_or_404(TeacherProfile,user=request.user)
    student  =  get_object_or_404(StudentProfile,id=student_id)
    data=  request.data
    title = data.get('title')
    deadline =  data.get('deadline')
    questions  = data.get('questions',[])

    if not title or not deadline or not  questions:
        return  Response({'error':'Missing title,deadline and questions'}, status=status.HTTP_400_BAD_REQUEST)


    try:
        deadline_dt = datetime.datetime.fromisoformat(deadline.replace('Z', '+00:00'))
    except ValueError:
        return Response({'error': 'Invalid deadline format'}, status=status.HTTP_400_BAD_REQUEST)
    
    # creating the task 
    task =  Task.objects.create(
        title=title,
        deadline=deadline_dt,
        teacher=teacher,
        student=student
    )
    # creating the associated questions 
    for q  in questions:
        Question.objects.create(
            task=task,
            question_text=q.get('question_text'),
            option1=q.get('option1'),
            option2=q.get('option2'),
            option3=q.get('option3'),
            option4=q.get('option4'),
            correct_answer =  q.get('correct_answer')

            
        )
        
    return  Response({'message':'Task assigned successfully'}, status=status.HTTP_201_CREATED)