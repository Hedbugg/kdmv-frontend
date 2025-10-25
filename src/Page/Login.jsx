import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/KDMV/loggin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/sell"); // redirect if success
      } else {
        setMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      setMessage("Error connecting to server");
    }
  };

  return (

    
    <div className="Loginform">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label className="labelName">Username</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="labelPass">Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
}

export default Login;
