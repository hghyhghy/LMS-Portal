
from django.db import models
from django.contrib.auth.models  import User

class StudentProfile(models.Model):
    
    GENDER_CHOICES= (
        
        ('male','Male'),
        ('female','Female'),
        ('other' , 'Other')
    )
    user  =  models.OneToOneField(User,on_delete=models.CASCADE)
    name =  models.CharField(max_length=100)
    phone_number  =models.CharField(max_length=20)
    email = models.EmailField()
    gender=models.CharField(max_length=10,choices=GENDER_CHOICES)
    enrolled_teachers=models.ManyToManyField('TeacherProfile',blank=True,related_name='enrolled_students')

    def __str__(self):
        return f"Student: {self.user.username}"


class  TeacherProfile(models.Model):
    SLOT_CHOICES = (
        ('morning', 'Morning'),
        ('evening', 'Evening'),
    )
    user =  models.OneToOneField(User,on_delete=models.CASCADE)
    name =  models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    fees = models.DecimalField(max_digits=10,decimal_places=2)
    duration = models.CharField(max_length=100)
    seats =  models.PositiveBigIntegerField(default=10)
    slot  =  models.CharField(max_length=10 ,  choices=SLOT_CHOICES,  default='morning')


    def __str__(self):
        return f"Teacher: {self.user.username}"
    
class  Task(models.Model):
    teacher  =  models.ForeignKey(TeacherProfile,on_delete=models.CASCADE)
    student  =  models.ForeignKey(StudentProfile,on_delete=models.CASCADE)
    title  =  models.CharField(max_length=255)
    deadline =  models.DateTimeField()
    created_at =  models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Task: {self.title} for {self.student.name}"
    
class  Question(models.Model):
    task  =  models.ForeignKey(Task,on_delete=models.CASCADE,related_name='questions')
    question_text =  models.TextField()
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255)
    correct_answer =  models.CharField(max_length=255)


    def __str__(self):
        return f"Q: {self.question_text[:50]}..."

class StudentAnswer(models.Model):
    student  =  models.ForeignKey(StudentProfile,on_delete=models.CASCADE)
    task=models.ForeignKey(Task,on_delete=models.CASCADE,default=2)
    question =  models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_time  =  models.CharField(max_length=100)
    submitted_at = models.DateTimeField(auto_now_add=True)
    selected_answer =  models.CharField(max_length=255,default='N/A')

    class Meta:
        unique_together = ('student', 'task', 'question')  # Prevent duplicates
    
    def __str__(self):
        return f"Answer by {self.student.name} to Q{self.question.id}"
    