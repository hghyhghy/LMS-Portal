
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from ...models import StudentProfile, Task, Question
import redis
import json

r=  redis.Redis(host='localhost', port=6379 ,  db=0)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_view_task(request,task_id):
    student  =  get_object_or_404(StudentProfile ,  user =  request.user)
    task   =  get_object_or_404(Task,id=task_id,student=student)

    redis_key  =  f"task:student:{student.id}:task:{task.id}"
    cached  =  r.get(redis_key)
    if cached:
        return  Response(json.loads(cached), status=status.HTTP_200_OK)

    questions  =  Question.objects.filter(task=task).values(
        'id','question_text','option1','option2','option3','option4'
    )
    response_data  = {
        'task_id':task.id,
        'title':task.title,
        'deadline':task.deadline.isoformat(),
        'questions':list(questions)
    }
    
    r.set(redis_key,json.dumps(response_data), ex=600)
    return  Response(response_data , status=status.HTTP_200_OK)