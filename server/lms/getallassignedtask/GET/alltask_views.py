
import  redis
import  json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from  ...models  import  Task,TeacherProfile
from  ..taskserializers.serializers import  Taskserializers


r=redis.Redis(host='localhost',port=6379 , db=0)
@api_view(['GET'])
@permission_classes([IsAuthenticated])

def get_assigned_task(request):
    teacher =  get_object_or_404(TeacherProfile,  user=request.user)
    cache_key =  f"teacher_tasks:{teacher.id}"

    cached_task  =  r.get(cache_key)
    if cached_task:
        return  Response(json.loads(cached_task),status=status.HTTP_200_OK)

    tasks  =  Task.objects.filter(teacher=teacher).select_related('student')
    serializers= Taskserializers(tasks,many=True)

    r.setex(cache_key,300,json.dumps(serializers.data))
    return Response(serializers.data, status=status.HTTP_200_OK)
