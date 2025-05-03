
from django.http  import  JsonResponse
from django.contrib.auth.decorators import login_required
from ...models  import  StudentProfile ,TeacherProfile
from  django.shortcuts  import  get_object_or_404
from  django.views.decorators.csrf  import  csrf_exempt
from rest_framework.decorators import permission_classes, api_view
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
import  redis
import  json

r=redis.Redis(host='localhost',port=6379,db=0)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])

def remove_student_from_enrollment(request,student_id):
    teacher =  get_object_or_404(TeacherProfile,user=request.user)
    student =  get_object_or_404(StudentProfile,id=student_id)
    
    if student in teacher.enrolled_students.all():
        teacher.enrolled_students.remove(student)
        
        cache_key =  f"teacher:{teacher.id}:students"
        r.delete(cache_key)

        return JsonResponse({'message': f"{student.name} has been removed from your class."})
    else:
        return JsonResponse({'error': 'Student is not enrolled in your class.'}, status=400)
        