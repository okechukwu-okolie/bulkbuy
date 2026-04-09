import React, { useState } from "react";
import api from "../axios/axios.js";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const user = { username, email, password };
    const signUp = async () => {
      try {
        const response = await api.post("/create-user", user);
        console.log(response.data);
      } catch (error) {
        console.error("Error signing up:", error);
      }
    };
    signUp();
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h1>sign up form</h1>
      <form action="/signup" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Username
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label htmlFor="email">
            Email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
