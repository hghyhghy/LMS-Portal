
from  rest_framework import  serializers
from  ...models import  Question

class  Questionserializers(serializers.ModelSerializer):
    class  Meta:
        model =  Question
        fields = ['id', 'question_text', 'option1', 'option2', 'option3', 'option4', 'correct_answer']
