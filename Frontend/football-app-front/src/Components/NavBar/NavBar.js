import { Avatar, Stack, Container, Button } from '@mui/material';
import ThemeButton from '../ThemeButton/ThemeButton';

function NavBar() {
  const username = localStorage.getItem('username');
  const profile_picture = localStorage.getItem('profile_picture');

  return (
      <Container maxWidth={false} sx={{bgcolor: '#1E1E2F', padding: 2}} minHeight='10vh' maxHeight='10vh'>
          <Stack direction="row" sx={{justifyContent: 'space-between'}}>
            <Button href='/dashboard'>MyAppLogo</Button>
            <Stack direction={"row"} spacing={2}>
              <ThemeButton />
              <Button href="/chats" sx={{minWidth: 0}}>ChatPhoto</Button>
              <Button>Notifications</Button>
              <Button href='/profile'><Avatar alt={username} src={profile_picture} /></Button>
            </Stack>
          </Stack>
      </Container>
  );
};

export default NavBar;
