
from  django.http  import  JsonResponse
from django.contrib.auth.decorators import login_required
from  ...models  import  StudentProfile,TeacherProfile
from  django.shortcuts  import  get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from  rest_framework.decorators  import  permission_classes,api_view
from rest_framework.authentication import TokenAuthentication
from  rest_framework.permissions  import  IsAuthenticated
import  redis
import  json

r=redis.Redis(host='localhost' , port=6379 ,  db=0)
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_teacher_enrollments(request):
    teacher = get_object_or_404(TeacherProfile, user=request.user)

    # Redis cache key for students only
    cache_key = f"teacher:{teacher.id}:students"

    # Try to get students from cache
    cached_data = r.get(cache_key)
    if cached_data:
        student_data = json.loads(cached_data)
    else:
        students = teacher.enrolled_students.all()
        student_data = [
            {
                'name': student.name,
                'email': student.email,
                'gender': student.gender,
                'phone_number': student.phone_number,
                'id': student.id
            }
            for student in students
        ]
        r.setex(cache_key, 3600, json.dumps(student_data))  # Cache student list for 1 hour

    # ✅ Always calculate available seats live from DB
    max_capacity = teacher.max_students if hasattr(teacher, 'max_students') else 10
    current_enrolled = teacher.enrolled_students.count()
    available_seats = max_capacity - current_enrolled

    return JsonResponse({
        "teacher": teacher.name,
        "students": student_data,
        "Available_Seats": available_seats
    })
