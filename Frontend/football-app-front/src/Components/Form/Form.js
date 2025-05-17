import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import "./Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (loading) {
  }

  const name = method === "login" ? "Login" : "Signup";

  const fetchUserDetails = async (username) => {
    try {
      const response = await api.get(`api/user/${username}/`);
      const data = await response.data;
      const pf = `http://localhost:8000/api${data.profile_picture}`;
      localStorage.setItem("name", data.name);
      localStorage.setItem("date_of_birth", data.date_of_birth);
      localStorage.setItem("description", data.description);
      localStorage.setItem("gender", data.gender);
      localStorage.setItem("profile_picture", pf);
      localStorage.setItem("max_distance", data.max_distance);
      localStorage.setItem("latitude", data.latitude);
      localStorage.setItem("longitude", data.longitude);
      localStorage.setItem("theme", data.theme)
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        await fetchUserDetails(username);
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          localStorage.setItem("username", e.target.value);
        }}
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
