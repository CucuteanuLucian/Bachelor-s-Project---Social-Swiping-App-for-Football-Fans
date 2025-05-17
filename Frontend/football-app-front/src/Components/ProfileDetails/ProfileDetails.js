import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stack, Container, Avatar, Button } from "@mui/material";

function ProfileDetails() {
  const [profile_picture, setProfile_picture] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [gender, setGender] = useState(null);
  const [date_of_birth, setDate_of_birth] = useState(null);
  const [description, setDescription] = useState(null);
  const [max_distance, setMax_distance] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    setProfile_picture(localStorage.getItem("profile_picture"));
    setUsername(localStorage.getItem("username"));
    setName(localStorage.getItem("name"));
    setDate_of_birth(localStorage.getItem("date_of_birth"));
    setDescription(localStorage.getItem("description"));
    setGender(localStorage.getItem("gender"));
    setMax_distance(localStorage.getItem("max_distance"));
    setLatitude(localStorage.getItem("latitude"));
    setLongitude(localStorage.getItem("longitude"));
  }, []);
  return (
    <Container>
      <Stack direction={"row"} spacing={3}>
        <Stack>
          <h1>Profilul lui {username}</h1>
          <Avatar alt={username} src={profile_picture} />
          <p>
            <strong>Nume complet:</strong> {name}
          </p>
          <p>
            <strong>Data nasterii:</strong> {date_of_birth}
          </p>
          <p>
            <strong>Despre:</strong> {description}
          </p>
          <p>
            <strong>Gender:</strong> {gender}
          </p>
          <p>
            <strong>Nr Max Distanta:</strong> {max_distance}{" "}
          </p>
          <Link to="/profile/settings">
            <Button variant="contained">Edit Profile</Button>
          </Link>
        </Stack>
        <p>
          <strong>Coordonate: </strong>({latitude}, {longitude})
        </p>
        <Link to="/logout">
          <Button variant="contained" sx={{ bgcolor: "red" }}>
            Logout
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}

export default ProfileDetails;
