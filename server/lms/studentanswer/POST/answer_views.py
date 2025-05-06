
from  rest_framework.decorators  import  api_view,permission_classes
from  rest_framework.permissions  import  IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from ...models import Task, StudentProfile, Question, StudentAnswer
import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam(request,task_id):
    
    student =  get_object_or_404(StudentProfile,user=request.user)
    task =  get_object_or_404(Task,id=task_id,student=student)

    #reject  if the deadline is missed 
    # if timezone.now() > task.deadline:
    #     return  Response({'message':'Could not submit answer as deadline is passed'}, status=status.HTTP_403_FORBIDDEN)

    answers =  request.data.get('answers',{})
    if not isinstance(answers, dict) or not answers:
        return Response({'error': 'Answers must be a dictionary of question_id: selected_option'}, status=status.HTTP_400_BAD_REQUEST)
    
    submitted_count = 0
    for question_id , selected_answer in  answers.items():
        try:
            question  =  Question.objects.get(id=question_id,task=task)

        except  Question.DoesNotExist:
            continue
        
            
        
        StudentAnswer.objects.update_or_create(
            student=student,
            task=task,
            question=question,
            defaults={
                'selected_answer': selected_answer,
                'selected_time': datetime.datetime.now().isoformat()
            }
        )
        submitted_count += 1
        
    return  Response( {
        'message':'Task completed successfully',
        'Question_answered':submitted_count,
        
    } ,  status= status.HTTP_201_CREATED)
