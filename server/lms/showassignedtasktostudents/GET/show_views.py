
from  rest_framework.decorators  import  api_view , permission_classes
from  rest_framework.permissions  import  IsAuthenticated
from  rest_framework.response import  Response
from  rest_framework import  status
from  django.shortcuts  import  get_object_or_404
from  ...models  import  StudentProfile,Task
import  redis
import  json

r= redis.Redis(host='localhost',port=6379,db=0)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_assigned_task(request):
    
    student  =  get_object_or_404(StudentProfile, user=request.user)
    redis_key =  f"student:{student.id}:tasks"
    cached  =  r.get(redis_key)
    if cached:
        return  Response(json.loads(cached), status=status.HTTP_200_OK)

    tasks =  Task.objects.filter(student=student).select_related('teacher')
    data = [{
        'task_id':task.id,
        'title':task.title,
        'deadline':task.deadline.isoformat(),
        'teacher_name':task.teacher.name,
        'student':task.student.name
    } for task  in tasks]
    r.set(redis_key,json.dumps(data),ex=600)
    return  Response(data ,  status=status.HTTP_200_OK)