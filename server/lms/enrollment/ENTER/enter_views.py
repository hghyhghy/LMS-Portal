

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from  ...models  import  StudentProfile,TeacherProfile
from  django.shortcuts import  get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import  redis
import  json
r=redis.Redis(host='localhost',port=6379,db=0)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_teacher(request, teacher_id):
    student = get_object_or_404(StudentProfile, user=request.user)
    teacher = get_object_or_404(TeacherProfile, id=teacher_id)
    #check  if the student is already enrolled 
    if teacher  in  student.enrolled_teachers.all():
        return  Response({'message':f"You are enrolled in the {teacher.name}'s course "},status = 400)
    if teacher.seats <= 0 :
        return  Response({'message':f"No seats are available for {teacher.name}'s course .. seats:{teacher.seats}"})

    # Add the teacher to the student's enrolled_teachers
    student.enrolled_teachers.add(teacher)
    teacher.seats -=1
    teacher.save()

    # Rebuild the student list and cache it
    cache_key = f"teacher:{teacher.id}:students"
    students = teacher.enrolled_students.all()
    student_data = [{'name': s.name, 'email': s.email , 'gender':s.gender, 'phone_number':s.phone_number,'id':s.id} for s in students]

    # Cache the updated data for 1 hour (3600 seconds)
    r.setex(cache_key, 3600, json.dumps(student_data))
    max_capacity = teacher.max_students if hasattr(teacher, 'max_students') else 10
    current_enrolled = teacher.enrolled_students.count()
    available_seats = max_capacity - current_enrolled
    cache_key_seats = f"teacher:{teacher.id}:students:available_seats"
    r.set(cache_key_seats, available_seats)

    return Response({"message": f"Enrolled in {teacher.name}'s course and  have Available seats: {available_seats}."})
