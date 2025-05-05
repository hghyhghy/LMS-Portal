
from  rest_framework.decorators import  api_view,permission_classes
from rest_framework.permissions  import  IsAuthenticated
from  rest_framework.response  import  Response
from rest_framework import  status
from  django.shortcuts  import  get_object_or_404
from  ...models  import  Task,TeacherProfile

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])

def delete_task(request,task_id):
    
    teacher =   get_object_or_404(TeacherProfile,user=request.user)
    task =  get_object_or_404(Task, teacher=teacher, id=task_id)

    task.delete()
    return  Response({'message':'Task deleted successfully'}, status=status.HTTP_200_OK)

