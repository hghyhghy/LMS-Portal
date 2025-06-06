
from   django.urls import path
from  .auth.auth_views import register_user,login_user,logout_user
from  .role.teacher.teacher_views   import create_teacher_profile
from  .role.student.student_views import create_student_profile
from  .student.student_views import get_teachers,search_teachers
from  .updateprofile.GET.get_profile_views import get_student_profile
from  .updateprofile.UPDATE.update_views import update_student_profile
from  .deleteprofile.student.delete_student_views  import delete_student_profile
from  .deleteprofile.teacher.delete_teacher_views import  delete_teacher_profile
from  .updateteacherprofile.GET.get_teacher_profile import  get_teacher_profile
from  .updateteacherprofile.UPDATE.update_teacher_views import  update_teacher_profile
from  .enrollment.ENTER.enter_views import  enroll_in_teacher
from  .enrollment.EXIT.exit_views  import  exit_from_teacher
from  .enrollment.LIST.list_views import  list_teacher_enrollments
from  .updateteacherprofile.GET.get_teacher_profile import verify_admin_passkey
from  .removeenrolledstudents.DELETE.remove_views import remove_student_from_enrollment
from  .assignmentfromteacher.POST.assignment_views import  assign_task
from  .assignmentfromteacher.REMOVE.delete_task import  delete_task
from  .studentanswer.POST.answer_views import submit_exam
from  .assignmarkstostudentanswer.GET_POST.assignmarks_views import grade_task_answers
from  .getallassignedtask.GET.alltask_views  import get_assigned_task
from  .showassignedtasktostudents.GET.show_views import student_assigned_task
from  .showassignedquestions.GET.show_questions import student_view_task

urlpatterns = [
    
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    
    # endpoints for the role selection
    path('profile/create-student-profile/', create_student_profile, name='create_student_profile'),
    path('profile/create-teacher-profile/', create_teacher_profile, name='create_teacher_profile'),
    
    #
    path('get-teachers/', get_teachers, name='get_teachers'),
    path('search-teachers/', search_teachers, name='search_teachers'),
    
    # getting the student and teacher profile
    path('get-student-profile/', get_student_profile, name='get_student_profile'),
    path('update-student-profile/',update_student_profile, name='update_student_profile'),
    
    # delete student profile 
    path('delete-student-profile/', delete_student_profile,name='delete_profile'),
    # delete teacher profile
    path('delete-teacher-profile/',delete_teacher_profile , name='delete_profile'),
    path('get-teacher-profile/',get_teacher_profile , name='get_profile'),
    path('update-teacher-profile/',update_teacher_profile , name='update_profile'),
    
    path('enroll/<int:teacher_id>/', enroll_in_teacher, name='enroll_teacher'), #method post
    path('exit/<int:teacher_id>/', exit_from_teacher, name='exit_teacher'), #method post
    path('my-students/', list_teacher_enrollments, name='list_enrollments'), #method get
    
    
    path('verify-passky/',verify_admin_passkey , name='verify-admin-passkey'),
    path('remove-student/<int:student_id>/', remove_student_from_enrollment, name='remove_student'),
    
    path('assign-task/<int:student_id>/', assign_task, name='assign_task'),
    path('delete-task/<int:task_id>/', delete_task, name='delete_task'),
    # submit exam for the students
    path('submit-exam/<int:task_id>/', submit_exam, name='submit_exam'),
    path('grade-task/<int:task_id>/<int:student_id>/', grade_task_answers, name='grade_task_answers'),
    path('my-tasks/', get_assigned_task, name='get_assigned_tasks'),
    
    path('student-tasks/', student_assigned_task, name='student_assigned_tasks'),
    path('student-questions/<int:task_id>/',student_view_task,name='student_view_task')


    

]
