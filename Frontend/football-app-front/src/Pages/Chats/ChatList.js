import { useState, useEffect } from "react";
import { Container, Avatar, Stack, Typography, Box, Button } from "@mui/material";
import api from "../../api";

function ChatsList() {
  const [username, setUsername] = useState(null);
  const [matchesList, setMatchesList] = useState([]);
  const [matchedUsersDetails, setMatchedUsersDetails] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  
    if (storedUsername) {
      const fetchMatches = async () => {
        try {
          const response = await api.get(`api/get-matches/${storedUsername}/`);
          const matchedUsernames = response.data.map(user => ({
            username: user.username,
            room_id: user.room_id
          }));
          setMatchesList(matchedUsernames);
        } catch (error) {
          console.error("Eroare la obținerea match-urilor:", error);
        }
      };
  
      fetchMatches();
    }
  }, [username]);
  
  useEffect(() => {
    if (matchesList.length > 0) {
      const fetchUserDetails = async () => {
        try {
          const userDetailsPromises = matchesList.map(async (match) => {
            const userResponse = await api.get(`/api/user/${match.username}/`);
            return { ...userResponse.data, room_id: match.room_id };
          });
  
          const userDetails = await Promise.all(userDetailsPromises);
          setMatchedUsersDetails(userDetails);
        } catch (error) {
          console.error("Eroare la obținerea detaliilor utilizatorilor:", error);
        }
      };
  
      fetchUserDetails();
    }
  }, [matchesList]);
  
  

  return (
    <Box sx={{ minHeight: '90vh', maxHeight: '90vh', minWidth: '20vw', display: 'flex', flexDirection: 'column', bgcolor: '#d3d3d3', padding: 2}} >
      <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex' }}>
          <Stack spacing={2} sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{display: 'flex', justifyContent: 'center'}}>Matches-Chat</Typography>
            {matchedUsersDetails.map((user) => (
              <Stack key={user.username} sx={{display: 'flex', justifyContent: 'center'}}>
                <Button variant="contained" href={`/chats/${user.room_id}`} sx={{ minWidth: '15vw' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={`http://localhost:8000/api${user.profile_picture}`} alt={user.username} />
                    <Typography>{user.name}</Typography>
                  </Stack>
                </Button>
              </Stack>
            ))}
          </Stack>
      </Container>
    </Box>
  );
  
}

export default ChatsList;
