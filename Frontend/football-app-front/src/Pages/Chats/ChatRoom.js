import { useEffect, useState, useRef } from 'react';
import { Box, Container, TextField, Button, Typography, List, ListItem } from '@mui/material';
import api from '../../api';

const ChatRoom = ({ roomName, sender, receiver }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("MESAJ PRIMIT:", data);
      const message = {
        sender: data.sender ,
        receiver: data.receiver,
        content: data.content || data.message,
        timestamp: new Date().toLocaleTimeString(),
        is_read: false,
      };
      setChat(prev => [...prev, message]);
    };

    return () => {
      ws.close();
    };
  }, [roomName, sender, receiver]);

  const sendMessage = () => {
    if (socket) {
      if (message === '') {

      }
      else 
      { socket.send(JSON.stringify({
          sender: sender,
          receiver: receiver,
          message: message
        }));
      }
      setMessage('');
    }
  };

  const [sentiment, setSentiment] = useState('');
  useEffect(() => {
      const fetchSentiment = async () => {
        try {
          const response = await api.get(`msg/get-messages/${sender}/${receiver}/`);
          if (response.status === 200) {
            const allData = response.data;
            const sentimentData = allData.pop();
            setChat(allData);
            setSentiment(sentimentData.sentiment['label']);
          }
          
        } catch (error) {
          console.error("Eroare la obținerea detaliilor utilizatorilor:", error);
        }
      };
    fetchSentiment();
  }, [sender, receiver]);
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [chat]);  


  return (
    <Box
  minHeight="85vh"
  maxHeight="85vh"
  display="flex"
  flexDirection="column"
  justifyContent="space-between"
  minWidth="79vw"
  maxWidth="79vw"
>
<List sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
{chat.map((msg, idx) => {
  const isOwnMessage = msg.sender === sender;
  return (
    <ListItem
      key={idx}
      alignItems="flex-start"
      sx={{
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        textAlign: isOwnMessage ? 'right' : 'left',
      }}
    >
      <Box
        sx={{
          backgroundColor: isOwnMessage ? '#DCF8C6' : '#F1F0F0',
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          maxWidth: '70%',
        }}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {msg.sender}
        </Typography>
        <Typography variant="body1">
          {msg.content || msg.message}
        </Typography>
      </Box>
    </ListItem>
  );
})}
<div ref={bottomRef} />
</List>

  <Container
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'end',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
    }}
  >
    <TextField
    value={message}
    onChange={e => setMessage(e.target.value)}
    fullWidth
    variant="outlined"
    placeholder="Scrie un mesaj..."
    sx={{ marginRight: 1 }}
  />
  <Button variant="contained" onClick={sendMessage} sx={{ marginRight: 1, padding: '1rem' }}>
    Send
  </Button>
  <Typography backgroundColor="lightblue" sx={{ padding: '1rem', borderRadius: 1}}>
    Sentiment=
    {sentiment} 
  </Typography>
  </Container>
</Box>

  );
};

export default ChatRoom;
