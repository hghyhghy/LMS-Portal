
from rest_framework.decorators  import  api_view,permission_classes
from  rest_framework.permissions import IsAuthenticated
from  rest_framework.response import  Response
from  rest_framework  import  status
from  ...models  import  StudentAnswer,Task,TeacherProfile,StudentProfile,Question
from  django.shortcuts  import  get_object_or_404
from  .serializers import  Questionserializers
from  django.db.models import Sum
import redis
import json

r=  redis.Redis(host='localhost',port=6379, db=0)

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def  grade_task_answers(request,task_id,student_id):
    teacher =  get_object_or_404(TeacherProfile, user= request.user)
    task =  get_object_or_404(Task, id=task_id,  teacher=teacher,student__id =  student_id)
    
    redis_key =  f"task;{task_id}:student:{student_id}:graded"
    
    if request.method == 'GET':
        # Try fetching from cache first
        cached_data = r.get(redis_key)
        if cached_data:
            return Response(json.loads(cached_data))

        # If not in cache, compute and store in Redis
        answers = StudentAnswer.objects.filter(task=task, student__id=student_id)
        data = [{
            'question_id': ans.question_id,
            'question': Questionserializers(ans.question).data,
            "selected_answer": ans.selected_answer,
            "submitted_at": ans.submitted_at.isoformat(),
            "marks": ans.marks
        } for ans in answers]
        total_marks = answers.aggregate(total_marks=Sum('marks'))['total_marks'] or 0

        response_data = {
            "data": data,
            "Grand Total": total_marks
        }

        # Store in Redis for 10 minutes
        r.set(redis_key, json.dumps(response_data), ex=600)
        return  Response(response_data)
    
    elif  request.method == 'POST':
        grading  =  request.data.get('grading',  {})
        if not isinstance(grading,dict):
            return Response({'error': 'Grading must be a dictionary of question_id: marks'}, status=status.HTTP_400_BAD_REQUEST)

        checked =0
        for qid,marks in grading.items():
            try:
                answers =  StudentAnswer.objects.get(task=task ,  student__id =  student_id , question__id = qid)
                answers.marks=marks
                answers.save()
                checked += 1
                
            except  StudentAnswer.DoesNotExist:
                continue
            

    return Response({
            'message': 'Marks submitted.',
            'graded_answers': checked
        }, status=status.HTTP_200_OK)

        
        

