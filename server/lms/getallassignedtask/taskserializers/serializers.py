
from  ...models  import  Task
from  rest_framework  import  serializers

class  Taskserializers(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    class Meta:
        model =  Task
        fields = ['id', 'title', 'deadline', 'student_name','student_id']