
import  json
from  channels.generic.websocket  import  AsyncWebsocketConsumer
from  django.contrib.auth.models  import  User
from  ..models import  ChatMessage
from  datetime  import  datetime
from  channels.db import  database_sync_to_async
class  ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name=  self.scope['url_route']['kwargs']['room_name']
        self.room_group_name =  f"chat_{self.room_name}"

        #join the room 
        await  self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        # leaves the room
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        message =  data['message']
        sender_username  =  data['sender']
        receiver_username = data['receiver']

        sender =  await self.get_user(sender_username)
        receiver  = await self.get_user(receiver_username)
        
        # save it to the database 
        msg_content =  ChatMessage.objects.create(sender=sender,receiver=receiver,message=message)
        timestamp =  msg_content.timestamp.strftime("%Y-%m-%d %H:%M:%S")

        
        await  self.channel_layer.group_send(
            self.room_group_name,
            {
                type:'chat_message',
                'message':message,
                'sender':sender.username,
                'receiver':receiver.username,
                'timestamp':timestamp
            }
        )
        
    async  def chat_message(self,event):
        await self.send(text_data=json.dumps({
            'message':event['message'],
            'sender':event['sender'],
            'receiver':event['receiver'],
            'timestamp':event['timestamp']
        }))
        
    @staticmethod
    async def get_user(username):
        return  await  database_sync_to_async(User.objects.get)(username=username)