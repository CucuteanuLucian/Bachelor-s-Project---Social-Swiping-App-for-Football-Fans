import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

# clasa ChatConsumer conecteaza, deconecteaza, trimite si primeste mesaje printr-un websocket
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Accesăm room_name din kwargs
            self.room_name = self.scope['url_route']['kwargs'].get('room_name', None)

            # Verificăm dacă room_name există
            if self.room_name is None:
                print("Error: room_name not found!")
                await self.close()  # Închidem conexiunea dacă nu găsim room_name
                return

            self.room_group_name = f"chat_{self.room_name}"

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            print(f"Joined group {self.room_group_name}")

            await self.accept()

        except Exception as e:
            print(f"Error in connect: {e}")
            await self.close()  # Închidem conexiunea în caz de eroare

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"Left group {self.room_group_name}")

    # Primește mesaj de la WebSocket
    async def receive(self, text_data):
        from django.contrib.auth.models import User
        from chats.models import Message

        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_username = text_data_json['sender']
        receiver_username = text_data_json['receiver']

        try:
            sender = await sync_to_async(User.objects.get)(username=sender_username)
            receiver = await sync_to_async(User.objects.get)(username=receiver_username)
            await sync_to_async(Message.objects.create)(
                sender=sender,
                receiver=receiver,
                content=message
            )
        except Exception as e:
            print(f"Error saving message: {e}")

        # Trimite mesaj către grup
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_username,
                'receiver': receiver_username
            }
        )

    # Primește mesaj de la grup
    async def chat_message(self, event):
        message = event['message']
        # Trimite mesajul către WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': event['sender'],
            'receiver': event['receiver']
        }))
