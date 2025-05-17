import { InputLabel } from "@mui/material";
import Container from "@mui/material/Container";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const SettingsApp = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [date_of_birth, setDate_of_birth] = useState(null);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setDescription(localStorage.getItem("description"));
    setDate_of_birth(localStorage.getItem("date_of_birth"));
    setGender(localStorage.getItem("gender"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("name", name);
    localStorage.setItem("description", description);
    localStorage.setItem("date_of_birth", date_of_birth);
    localStorage.setItem("gender", gender);

    const payload = {
        name,
        description,
        date_of_birth: date_of_birth === "" ? null : date_of_birth,
        gender,
      };
    
      try {
        const response = await api.patch(`api/user/${username}/settings/`, payload);
        console.log('Profil actualizat:', response.data);
        navigate('/profile');
      } catch (error) {
        console.error('Eroare la trimiterea datelor:', error);
      }

  };

  return (
    <Container>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Editează Profilul</h1>
        <InputLabel>Name</InputLabel>
        <input
          className="form-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputLabel>Description</InputLabel>
        <textarea
          className="form-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <InputLabel>Date of Birth</InputLabel>
        <input
          className="form-input"
          type="date"
          value={date_of_birth}
          onChange={(e) => setDate_of_birth(e.target.value)}
        />

        <InputLabel>Gender</InputLabel>
        <select
          className="form-input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Selectează genul</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button className="form-button" type="submit" to="/profile">
          Save
        </button>
      </form>
    </Container>
  );
};

export default SettingsApp;
