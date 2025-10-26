import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ▼▼▼ PASTE THE DEBUG VERSION HERE ▼▼▼
  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log("🔍 DEBUG: Sending login request...");
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const requestBody = JSON.stringify({ username, password });
      console.log("Request body:", requestBody);

      const response = await fetch("https://hedbugg.kesug.com/loggin.php", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        setMessage("Server returned invalid response");
        return;
      }

      console.log("Parsed data:", data);

      if (data.success) {
        navigate("/sell");
      } else {
        setMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Error connecting to server: " + error.message);
    }
  };
  // ▲▲▲ END OF DEBUG CODE ▲▲▲

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
